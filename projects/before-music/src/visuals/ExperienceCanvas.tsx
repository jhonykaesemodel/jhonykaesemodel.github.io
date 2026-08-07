import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { analyzeFrequencyWindow, createFrequencyKernels, summarizeAuditoryActivity } from '../audio/analysisCore'
import type { AnalysisData, AudioSourceData, ViewingMode, VisualSettings } from '../types'

interface Props {
  source: AudioSourceData
  analysis: AnalysisData
  settings: VisualSettings
  getTime: () => number
  guided?: boolean
  viewingMode: ViewingMode
}

const pressureVertexShader = /* glsl */`
  uniform sampler2D uWave;
  uniform float uAmplitude;
  uniform float uListener;
  varying float vPressure;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    float leftPressure = texture2D(uWave, vec2(uv.x, 0.25)).r * 2.0 - 1.0;
    float rightPressure = texture2D(uWave, vec2(uv.x, 0.75)).r * 2.0 - 1.0;
    float stereoBlend = smoothstep(0.12, 0.88, uv.y + uListener * 0.16);
    float pressure = mix(leftPressure, rightPressure, stereoBlend);
    vec3 p = position;
    p.x += pressure * uAmplitude * 0.28;
    p.z += pressure * uAmplitude * 0.22;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vPressure = pressure;
  }
`

const pressureFragmentShader = /* glsl */`
  uniform float uDaylight;
  varying float vPressure;
  varying vec2 vUv;

  void main() {
    vec3 neutral = mix(vec3(0.025, 0.055, 0.047), vec3(0.82, 0.86, 0.82), uDaylight);
    vec3 rarefaction = mix(vec3(0.08, 0.63, 0.59), vec3(0.02, 0.34, 0.31), uDaylight);
    vec3 compression = mix(vec3(0.96, 0.55, 0.17), vec3(0.58, 0.25, 0.015), uDaylight);
    float magnitude = smoothstep(0.012, 0.44, abs(vPressure));
    vec3 signedColor = mix(rarefaction, compression, smoothstep(-0.045, 0.045, vPressure));
    float edgeFade = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
    float verticalFade = smoothstep(0.0, 0.14, vUv.y) * (1.0 - smoothstep(0.86, 1.0, vUv.y));
    float alpha = mix(0.025, mix(0.67, 0.78, uDaylight), magnitude) * edgeFade * verticalFade;
    gl_FragColor = vec4(mix(neutral, signedColor, 0.32 + magnitude * 0.68), alpha);
  }
`

const cochleaVertexShader = /* glsl */`
  uniform sampler2D uBands;
  uniform float uAmplitude;
  varying float vEnergy;
  varying float vPlace;

  void main() {
    float place = 1.0 - uv.x;
    float energy = texture2D(uBands, vec2(place, 0.5)).r;
    vec3 p = position;
    p.z += energy * (0.32 + uAmplitude * 0.72);
    p.xy *= 1.0 + energy * 0.035;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vEnergy = energy;
    vPlace = place;
  }
`

const cochleaFragmentShader = /* glsl */`
  uniform float uDaylight;
  varying float vEnergy;
  varying float vPlace;

  void main() {
    vec3 low = mix(vec3(0.14, 0.70, 0.68), vec3(0.02, 0.35, 0.33), uDaylight);
    vec3 high = mix(vec3(0.98, 0.58, 0.20), vec3(0.60, 0.26, 0.02), uDaylight);
    vec3 color = mix(low, high, vPlace);
    float alpha = mix(0.2, 0.96, smoothstep(0.015, 0.62, vEnergy));
    gl_FragColor = vec4(color, alpha);
  }
`

// Acoustic pressure is microscopic at human listening levels. This signed curve
// preserves zero crossings and relative motion while making quiet oscillations legible.
const magnifyPressure = (value: number) => Math.sign(value) * Math.pow(Math.abs(value), 0.46)

function useWaveTexture(source: AudioSourceData, settings: VisualSettings, getTime: () => number) {
  const data = useMemo(() => new Uint8Array(512 * 2), [])
  const texture = useMemo(() => {
    const result = new THREE.DataTexture(data, 512, 2, THREE.RedFormat, THREE.UnsignedByteType)
    result.minFilter = THREE.LinearFilter
    result.magFilter = THREE.LinearFilter
    result.needsUpdate = true
    return result
  }, [data])

  useFrame(() => {
    const center = Math.floor(getTime() * source.sampleRate)
    const windowSamples = Math.max(96, Math.floor(source.sampleRate * 0.032 / settings.temporalZoom))
    for (let channel = 0; channel < 2; channel += 1) {
      const samples = source.channels[Math.min(channel, source.channels.length - 1)]
      for (let x = 0; x < 512; x += 1) {
        const offset = Math.floor((x / 511 - 0.5) * windowSamples)
        const index = Math.max(0, Math.min(samples.length - 1, center + offset))
        data[channel * 512 + x] = Math.round((magnifyPressure(samples[index]) * 0.5 + 0.5) * 255)
      }
    }
    texture.needsUpdate = true
  })
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function AirRibs({ source, settings, getTime, viewingMode }: Omit<Props, 'analysis' | 'viewingMode'> & { viewingMode: ViewingMode }) {
  const count = Math.round(30 + settings.density * 44)
  const positions = useMemo(() => new Float32Array(count * 2 * 3), [count])
  const colors = useMemo(() => new Float32Array(count * 2 * 3), [count])
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry()
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    result.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return result
  }, [colors, positions])
  const material = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: viewingMode === 'daylight' ? 0.42 : 0.33 }), [viewingMode])

  useFrame(() => {
    const left = source.channels[0]
    const right = source.channels[Math.min(1, source.channels.length - 1)] ?? left
    const center = Math.floor(getTime() * source.sampleRate)
    const windowSamples = Math.max(96, Math.floor(source.sampleRate * 0.032 / settings.temporalZoom))
    for (let rib = 0; rib < count; rib += 1) {
      const progress = rib / Math.max(1, count - 1)
      const sampleIndex = Math.max(0, Math.min(left.length - 1, center + Math.floor((progress - 0.5) * windowSamples)))
      const pressure = magnifyPressure(((left[sampleIndex] ?? 0) + (right[sampleIndex] ?? 0)) * 0.5)
      // Each rib is an enlarged slice of air. Quiet slices recede so the eye reads
      // coherent compression/rarefaction fronts instead of an undifferentiated grid.
      const x = (progress - 0.5) * 11.7 + pressure * settings.amplitude * 0.62
      const visibility = 0.13 + Math.min(1, Math.abs(pressure) * 4.4) * 0.87
      const warm = pressure >= 0
      const color = viewingMode === 'daylight'
        ? warm ? [0.48, 0.19, 0.01] : [0.01, 0.30, 0.27]
        : warm ? [0.94, 0.56, 0.22] : [0.16, 0.69, 0.64]
      for (let end = 0; end < 2; end += 1) {
        const offset = (rib * 2 + end) * 3
        positions[offset] = x
        positions[offset + 1] = end === 0 ? -3.0 : 3.0
        positions[offset + 2] = 0.18
        colors[offset] = color[0] * visibility
        colors[offset + 1] = color[1] * visibility
        colors[offset + 2] = color[2] * visibility
      }
    }
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  })

  useEffect(() => () => { geometry.dispose(); material.dispose() }, [geometry, material])
  return <lineSegments geometry={geometry} material={material} />
}

function AirField({ source, settings, getTime, viewingMode }: Omit<Props, 'analysis'>) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const membrane = useRef<THREE.Mesh>(null)
  const texture = useWaveTexture(source, settings, getTime)
  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uAmplitude.value = settings.amplitude
      material.current.uniforms.uListener.value = settings.listenerPosition
      material.current.uniforms.uDaylight.value = viewingMode === 'daylight' ? 1 : 0
    }
    if (membrane.current) membrane.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.018
  })
  return (
    <>
      <mesh ref={membrane}>
        <planeGeometry args={[12, 7, 256, 8]} />
        <shaderMaterial
          ref={material}
          vertexShader={pressureVertexShader}
          fragmentShader={pressureFragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={viewingMode === 'daylight' ? THREE.NormalBlending : THREE.AdditiveBlending}
          uniforms={{
            uWave: { value: texture },
            uAmplitude: { value: settings.amplitude },
            uListener: { value: settings.listenerPosition },
            uDaylight: { value: viewingMode === 'daylight' ? 1 : 0 },
          }}
        />
      </mesh>
      <AirRibs source={source} settings={settings} getTime={getTime} viewingMode={viewingMode} guided={false} />
      <mesh position={[-5.35, 1.65, 0.35]}><ringGeometry args={[0.34, 0.37, 64]} /><meshBasicMaterial color={viewingMode === 'daylight' ? '#075f57' : '#5cc9bd'} transparent opacity={0.8} /></mesh>
      <mesh position={[-5.35, -1.65, 0.35]}><ringGeometry args={[0.34, 0.37, 64]} /><meshBasicMaterial color={viewingMode === 'daylight' ? '#8a4c05' : '#e4a852'} transparent opacity={0.8} /></mesh>
      <mesh position={[4.65, settings.listenerPosition * 1.7, 0.45]}>
        <ringGeometry args={[0.13, 0.19, 64]} />
        <meshBasicMaterial color={viewingMode === 'daylight' ? '#17231f' : '#fff0d2'} transparent opacity={0.96} />
      </mesh>
      <mesh position={[4.65, settings.listenerPosition * 1.7, 0.25]}>
        <ringGeometry args={[0.34, 0.36, 64]} />
        <meshBasicMaterial color={viewingMode === 'daylight' ? '#315148' : '#8eaa9f'} transparent opacity={0.42} />
      </mesh>
    </>
  )
}

function SignalView({ source, settings, getTime, viewingMode }: Omit<Props, 'analysis'>) {
  const base = useMemo(() => new Float32Array(700 * 3), [])
  const geometry = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(base, 3)), [base])
  const line = useMemo(() => new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: viewingMode === 'daylight' ? '#754708' : '#ddc38b', transparent: true, opacity: 0.94 })), [geometry, viewingMode])
  useFrame(() => {
    const left = source.channels[0]
    const right = source.channels[Math.min(1, source.channels.length - 1)]
    const center = Math.floor(getTime() * source.sampleRate)
    const windowSamples = Math.max(80, Math.floor(source.sampleRate * 0.12 / settings.temporalZoom))
    for (let i = 0; i < 700; i += 1) {
      const index = Math.max(0, Math.min(left.length - 1, center + Math.floor((i / 699 - 0.5) * windowSamples)))
      base[i * 3] = (i / 699 - 0.5) * 11
      base[i * 3 + 1] = ((left[index] + right[index]) * 0.5) * settings.amplitude * 2.2
      base[i * 3 + 2] = 0
    }
    geometry.attributes.position.needsUpdate = true
  })
  useEffect(() => () => { geometry.dispose(); (line.material as THREE.Material).dispose() }, [geometry, line])
  return (
    <>
      <primitive object={line} />
      <gridHelper args={[12, 24, viewingMode === 'daylight' ? '#78918a' : '#263d38', viewingMode === 'daylight' ? '#c1cbc5' : '#15231f']} rotation={[Math.PI / 2, 0, 0]} />
    </>
  )
}

function createCochlearCurve() {
  const points: THREE.Vector3[] = []
  const rotations = 2.35
  for (let index = 0; index < 220; index += 1) {
    const progress = index / 219
    const angle = -0.22 + progress * Math.PI * 2 * rotations
    const radius = THREE.MathUtils.lerp(2.05, 0.24, progress)
    points.push(new THREE.Vector3(-0.75 + Math.cos(angle) * radius, Math.sin(angle) * radius, 0))
  }
  return new THREE.CatmullRomCurve3(points)
}

function PerceptionView({ analysis, source, getTime, viewingMode }: Pick<Props, 'analysis' | 'source' | 'getTime' | 'viewingMode'>) {
  const bandData = useMemo(() => new Uint8Array(analysis.frequencyBands), [analysis.frequencyBands])
  const bandTexture = useMemo(() => {
    const texture = new THREE.DataTexture(bandData, analysis.frequencyBands, 1, THREE.RedFormat, THREE.UnsignedByteType)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true
    return texture
  }, [analysis.frequencyBands, bandData])
  const curve = useMemo(createCochlearCurve, [])
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 220, 0.055, 8, false), [curve])
  const cochleaMaterial = useRef<THREE.ShaderMaterial>(null)
  const kernels = useMemo(() => createFrequencyKernels(source.sampleRate, analysis.frequencyBands), [analysis.frequencyBands, source.sampleRate])
  const targets = useMemo(() => new Float32Array(analysis.frequencyBands), [analysis.frequencyBands])
  const displayed = useMemo(() => new Float32Array(analysis.frequencyBands), [analysis.frequencyBands])
  const previous = useMemo(() => new Float32Array(analysis.frequencyBands), [analysis.frequencyBands])
  const lastAnalysisTime = useRef(-1)
  const level = useRef(0)
  const onset = useRef(0)
  const centroid = useRef(0)
  const eardrum = useRef<THREE.Mesh>(null)
  const pulseRings = useRef<THREE.Mesh[]>([])

  const waveformData = useMemo(() => new Float32Array(170 * 3), [])
  const waveformGeometry = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(waveformData, 3)), [waveformData])
  const waveformLine = useMemo(() => new THREE.Line(waveformGeometry, new THREE.LineBasicMaterial({ color: viewingMode === 'daylight' ? '#74470b' : '#e8b963', transparent: true, opacity: 0.86 })), [viewingMode, waveformGeometry])

  const fiberCount = 16
  const fiberSegments = 22
  const nervePositions = useMemo(() => new Float32Array(fiberCount * fiberSegments * 2 * 3), [])
  const nerveColors = useMemo(() => new Float32Array(fiberCount * fiberSegments * 2 * 3), [])
  const fiberBands = useMemo(() => new Uint16Array(fiberCount), [])
  const nerveGeometry = useMemo(() => {
    for (let fiber = 0; fiber < fiberCount; fiber += 1) {
      const place = (fiber + 0.5) / fiberCount
      const start = curve.getPoint(place)
      const end = new THREE.Vector3(4.25, (place - 0.5) * 4.4, -0.08)
      const controlA = new THREE.Vector3(start.x + 1.2, start.y * 0.75, 0.55)
      const controlB = new THREE.Vector3(2.9, end.y * 0.72, 0.28)
      const bezier = new THREE.CubicBezierCurve3(start, controlA, controlB, end)
      fiberBands[fiber] = Math.round((1 - place) * (analysis.frequencyBands - 1))
      for (let segment = 0; segment < fiberSegments; segment += 1) {
        const from = bezier.getPoint(segment / fiberSegments)
        const to = bezier.getPoint((segment + 1) / fiberSegments)
        const base = (fiber * fiberSegments + segment) * 6
        nervePositions.set([from.x, from.y, from.z, to.x, to.y, to.z], base)
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(nervePositions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(nerveColors, 3))
    return geometry
  }, [analysis.frequencyBands, curve, fiberBands, nerveColors, nervePositions])
  const nerveMaterial = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: viewingMode === 'daylight' ? 0.68 : 0.72, blending: viewingMode === 'daylight' ? THREE.NormalBlending : THREE.AdditiveBlending }), [viewingMode])

  useFrame((state) => {
    const time = getTime()
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
    const interval = mobile ? 1 / 16 : 1 / 24
    if (lastAnalysisTime.current < 0 || Math.abs(time - lastAnalysisTime.current) >= interval) {
      if (lastAnalysisTime.current >= 0 && Math.abs(time - lastAnalysisTime.current) > 0.5) previous.fill(0)
      analyzeFrequencyWindow(source.channels, Math.floor(time * source.sampleRate), kernels, targets)
      const features = summarizeAuditoryActivity(targets, previous)
      level.current += (features.level - level.current) * 0.45
      onset.current = Math.max(features.onset, onset.current * 0.52)
      centroid.current += (features.centroid - centroid.current) * 0.32
      previous.set(targets)
      lastAnalysisTime.current = time
    } else {
      onset.current *= 0.94
    }

    for (let band = 0; band < analysis.frequencyBands; band += 1) {
      displayed[band] += (targets[band] - displayed[band]) * 0.34
      bandData[band] = Math.round(Math.min(1, Math.pow(displayed[band], 0.62)) * 255)
    }
    bandTexture.needsUpdate = true
    if (cochleaMaterial.current) {
      cochleaMaterial.current.uniforms.uDaylight.value = viewingMode === 'daylight' ? 1 : 0
      cochleaMaterial.current.uniforms.uAmplitude.value = 0.7 + level.current * 1.6
    }

    const left = source.channels[0]
    const right = source.channels[Math.min(1, source.channels.length - 1)] ?? left
    const center = Math.floor(time * source.sampleRate)
    const windowSamples = Math.max(160, Math.floor(source.sampleRate * 0.018))
    for (let index = 0; index < 170; index += 1) {
      const sampleIndex = Math.max(0, Math.min(left.length - 1, center + Math.floor((index / 169 - 0.5) * windowSamples)))
      waveformData[index * 3] = -5.8 + (index / 169) * 2.2
      waveformData[index * 3 + 1] = ((left[sampleIndex] ?? 0) + (right[sampleIndex] ?? 0)) * 0.32
      waveformData[index * 3 + 2] = 0.1
    }
    waveformGeometry.attributes.position.needsUpdate = true

    for (let fiber = 0; fiber < fiberCount; fiber += 1) {
      const activity = Math.pow(displayed[fiberBands[fiber]] ?? 0, 0.58)
      const highPlace = fiberBands[fiber] / Math.max(1, analysis.frequencyBands - 1)
      const cool = viewingMode === 'daylight' ? [0.01, 0.27, 0.25] : [0.12, 0.67, 0.64]
      const warm = viewingMode === 'daylight' ? [0.54, 0.22, 0.01] : [0.95, 0.53, 0.18]
      const color = cool.map((value, channel) => value + (warm[channel] - value) * highPlace)
      for (let segment = 0; segment < fiberSegments; segment += 1) {
        const pulse = 0.22 + activity * (0.72 + 0.28 * Math.sin(state.clock.elapsedTime * 4.0 - segment * 0.35))
        const base = (fiber * fiberSegments + segment) * 6
        for (let vertex = 0; vertex < 2; vertex += 1) {
          const offset = base + vertex * 3
          nerveColors[offset] = color[0] * pulse
          nerveColors[offset + 1] = color[1] * pulse
          nerveColors[offset + 2] = color[2] * pulse
        }
      }
    }
    nerveGeometry.attributes.color.needsUpdate = true

    if (eardrum.current) {
      const scale = 1 + level.current * 0.32
      eardrum.current.scale.set(scale, scale, 1)
      eardrum.current.rotation.z = Math.sin(state.clock.elapsedTime * 5.0) * onset.current * 0.08
    }
    pulseRings.current.forEach((mesh, index) => {
      const phase = (state.clock.elapsedTime * 0.38 + index / pulseRings.current.length) % 1
      const scale = 0.5 + phase * (1.35 + level.current * 0.8)
      mesh.scale.set(scale * (1 + centroid.current * 0.12), scale, 1)
      const material = mesh.material as THREE.MeshBasicMaterial
      material.opacity = (0.06 + onset.current * 0.48 + level.current * 0.12) * (1 - phase)
    })
  })

  useEffect(() => () => {
    bandTexture.dispose()
    tubeGeometry.dispose()
    waveformGeometry.dispose()
    ;(waveformLine.material as THREE.Material).dispose()
    nerveGeometry.dispose()
    nerveMaterial.dispose()
  }, [bandTexture, nerveGeometry, nerveMaterial, tubeGeometry, waveformGeometry, waveformLine])

  return (
    <>
      <primitive object={waveformLine} />
      <mesh ref={eardrum} position={[-3.45, 0, 0.15]}>
        <ringGeometry args={[0.46, 0.5, 72]} />
        <meshBasicMaterial color={viewingMode === 'daylight' ? '#7b4b0a' : '#eab95f'} transparent opacity={0.82} />
      </mesh>
      <mesh geometry={tubeGeometry}>
        <shaderMaterial
          ref={cochleaMaterial}
          vertexShader={cochleaVertexShader}
          fragmentShader={cochleaFragmentShader}
          transparent
          depthWrite={false}
          blending={viewingMode === 'daylight' ? THREE.NormalBlending : THREE.AdditiveBlending}
          uniforms={{ uBands: { value: bandTexture }, uAmplitude: { value: 1 }, uDaylight: { value: viewingMode === 'daylight' ? 1 : 0 } }}
        />
      </mesh>
      <lineSegments geometry={nerveGeometry} material={nerveMaterial} />
      <group position={[4.25, 0, 0]}>
        {[0, 1, 2, 3, 4].map((ring) => (
          <mesh key={ring} ref={(mesh) => { if (mesh) pulseRings.current[ring] = mesh }}>
            <ringGeometry args={[0.48, 0.5, 72]} />
            <meshBasicMaterial color={viewingMode === 'daylight' ? '#075f57' : '#76d2c0'} transparent opacity={0.12} depthWrite={false} />
          </mesh>
        ))}
        <mesh><ringGeometry args={[0.16, 0.22, 64]} /><meshBasicMaterial color={viewingMode === 'daylight' ? '#17231f' : '#fff0d2'} transparent opacity={0.9} /></mesh>
      </group>
    </>
  )
}

function Scene(props: Props) {
  useFrame((state) => {
    const targetZ = props.settings.mode === 'air' ? 8.7 : props.settings.mode === 'perception' ? 9.2 : 9.4
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.025
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.08) * (props.guided ? 0.18 : 0.05)
  })
  if (props.settings.mode === 'signal') return <SignalView {...props} />
  if (props.settings.mode === 'perception') return <PerceptionView {...props} />
  return <AirField {...props} />
}

export default function ExperienceCanvas(props: Props) {
  return (
    <Canvas
      className="experience-canvas"
      camera={{ position: [0, 0, 8.7], fov: 52 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[props.viewingMode === 'daylight' ? '#e9ede6' : '#050807']} />
      <fog attach="fog" args={[props.viewingMode === 'daylight' ? '#e9ede6' : '#050807', 8, 18]} />
      <Scene {...props} />
    </Canvas>
  )
}
