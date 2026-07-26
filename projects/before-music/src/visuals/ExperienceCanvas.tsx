import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { analyzeFrequencyWindow, createFrequencyKernels } from '../audio/analysisCore'
import type { AnalysisData, AudioSourceData, ViewingMode, VisualSettings } from '../types'

interface Props {
  source: AudioSourceData
  analysis: AnalysisData
  settings: VisualSettings
  getTime: () => number
  guided?: boolean
  viewingMode: ViewingMode
}

const vertexShader = /* glsl */`
  uniform sampler2D uWave;
  uniform float uAmplitude;
  uniform float uTime;
  uniform float uListener;
  attribute float aPhase;
  varying float vPressure;
  varying float vGlow;

  void main() {
    vec3 p = position;
    float progress = p.x * 0.085 + 0.5;
    float leftPressure = texture2D(uWave, vec2(fract(progress + aPhase * 0.012), 0.25)).r * 2.0 - 1.0;
    float rightPressure = texture2D(uWave, vec2(fract(progress - aPhase * 0.009), 0.75)).r * 2.0 - 1.0;
    float stereoBlend = smoothstep(-3.5, 3.5, p.y + uListener * 1.7);
    float pressure = mix(leftPressure, rightPressure, stereoBlend);
    float envelope = smoothstep(0.0, 0.18, progress) * (1.0 - smoothstep(0.82, 1.0, progress));
    p.x += pressure * uAmplitude * 0.72 * envelope;
    p.y += sin(p.x * 0.62 + aPhase * 6.283 + uTime * 0.12) * pressure * 0.05;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (2.1 + abs(pressure) * 4.6) * (11.0 / -mvPosition.z);
    vPressure = pressure;
    vGlow = envelope;
  }
`

const fragmentShader = /* glsl */`
  varying float vPressure;
  varying float vGlow;
  uniform float uDaylight;
  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float alpha = smoothstep(0.5, 0.06, length(point));
    vec3 cool = mix(vec3(0.22, 0.68, 0.63), vec3(0.025, 0.30, 0.27), uDaylight);
    vec3 warm = mix(vec3(0.93, 0.66, 0.32), vec3(0.52, 0.27, 0.025), uDaylight);
    vec3 color = mix(cool, warm, smoothstep(-0.35, 0.45, vPressure));
    float pressureAlpha = mix(0.16 + abs(vPressure) * 0.62, 0.30 + abs(vPressure) * 0.68, uDaylight);
    gl_FragColor = vec4(color, alpha * pressureAlpha * vGlow);
  }
`

function useWaveTexture(source: AudioSourceData, settings: VisualSettings, getTime: () => number) {
  const data = useMemo(() => new Uint8Array(512 * 2), [])
  const texture = useMemo(() => {
    const result = new THREE.DataTexture(data, 512, 2, THREE.RedFormat, THREE.UnsignedByteType)
    result.minFilter = THREE.LinearFilter
    result.magFilter = THREE.LinearFilter
    result.wrapS = THREE.RepeatWrapping
    result.needsUpdate = true
    return result
  }, [data])

  useFrame(() => {
    const center = Math.floor(getTime() * source.sampleRate)
    const windowSamples = Math.max(96, Math.floor(source.sampleRate * 0.09 / settings.temporalZoom))
    for (let channel = 0; channel < 2; channel += 1) {
      const samples = source.channels[Math.min(channel, source.channels.length - 1)]
      for (let x = 0; x < 512; x += 1) {
        const offset = Math.floor((x / 511 - 0.5) * windowSamples)
        const index = Math.max(0, Math.min(samples.length - 1, center + offset))
        data[channel * 512 + x] = Math.round((samples[index] * 0.5 + 0.5) * 255)
      }
    }
    texture.needsUpdate = true
  })
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function AirField({ source, settings, getTime, viewingMode }: Omit<Props, 'analysis'>) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  const count = Math.round((mobile ? 3200 : 7600) * settings.density)
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      phases[i] = Math.random()
    }
    const result = new THREE.BufferGeometry()
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    result.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return result
  }, [count])
  const texture = useWaveTexture(source, settings, getTime)
  useFrame((state) => {
    if (!material.current) return
    material.current.uniforms.uTime.value = state.clock.elapsedTime
    material.current.uniforms.uAmplitude.value = settings.amplitude
    material.current.uniforms.uListener.value = settings.listenerPosition
    material.current.uniforms.uDaylight.value = viewingMode === 'daylight' ? 1 : 0
  })
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={viewingMode === 'daylight' ? THREE.NormalBlending : THREE.AdditiveBlending}
          uniforms={{
            uWave: { value: texture }, uAmplitude: { value: settings.amplitude },
            uTime: { value: 0 }, uListener: { value: settings.listenerPosition }, uDaylight: { value: viewingMode === 'daylight' ? 1 : 0 },
          }}
        />
      </points>
      <mesh position={[-4.9, 1.75, 0]}><ringGeometry args={[0.28, 0.3, 48]} /><meshBasicMaterial color={viewingMode === 'daylight' ? '#075f57' : '#5cc9bd'} transparent opacity={viewingMode === 'daylight' ? 0.82 : 0.45} /></mesh>
      <mesh position={[-4.9, -1.75, 0]}><ringGeometry args={[0.28, 0.3, 48]} /><meshBasicMaterial color={viewingMode === 'daylight' ? '#8a4c05' : '#e4a852'} transparent opacity={viewingMode === 'daylight' ? 0.82 : 0.45} /></mesh>
      <mesh position={[3.3, settings.listenerPosition * 1.7, 0]}><sphereGeometry args={[0.08, 20, 20]} /><meshBasicMaterial color={viewingMode === 'daylight' ? '#17231f' : '#f4e8cf'} /></mesh>
    </>
  )
}

function SignalView({ source, settings, getTime, viewingMode }: Omit<Props, 'analysis'>) {
  const lineRef = useRef<THREE.Line>(null)
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
  useEffect(() => () => {
    geometry.dispose()
    ;(line.material as THREE.Material).dispose()
  }, [geometry, line])
  return (
    <>
      <primitive ref={lineRef} object={line} />
      <gridHelper args={[12, 24, viewingMode === 'daylight' ? '#78918a' : '#263d38', viewingMode === 'daylight' ? '#c1cbc5' : '#15231f']} rotation={[Math.PI / 2, 0, 0]} />
    </>
  )
}

function PerceptionView({ analysis, source, getTime, viewingMode }: Pick<Props, 'analysis' | 'source' | 'getTime' | 'viewingMode'>) {
  const bars = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const kernels = useMemo(() => createFrequencyKernels(source.sampleRate, analysis.frequencyBands), [analysis.frequencyBands, source.sampleRate])
  const targets = useMemo(() => new Float32Array(analysis.frequencyBands), [analysis.frequencyBands])
  const displayed = useMemo(() => new Float32Array(analysis.frequencyBands), [analysis.frequencyBands])
  const lastAnalysisTime = useRef(-1)
  useFrame(() => {
    if (!bars.current) return
    const time = getTime()
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
    const interval = mobile ? 1 / 12 : 1 / 20
    if (lastAnalysisTime.current < 0 || Math.abs(time - lastAnalysisTime.current) >= interval) {
      analyzeFrequencyWindow(source.channels, Math.floor(time * source.sampleRate), kernels, targets)
      lastAnalysisTime.current = time
    }
    for (let band = 0; band < analysis.frequencyBands; band += 1) {
      displayed[band] += (targets[band] - displayed[band]) * 0.38
      const raw = displayed[band]
      const height = 0.08 + Math.pow(raw, 0.58) * 4.6
      dummy.position.set((band / (analysis.frequencyBands - 1) - 0.5) * 10.5, height * 0.5 - 2.1, 0)
      dummy.scale.set(0.12, height, 0.12)
      dummy.updateMatrix()
      bars.current.setMatrixAt(band, dummy.matrix)
    }
    bars.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={bars} args={[undefined, undefined, analysis.frequencyBands]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={viewingMode === 'daylight' ? '#08685f' : '#79c7b8'} transparent opacity={viewingMode === 'daylight' ? 0.92 : 0.82} />
    </instancedMesh>
  )
}

function Scene(props: Props) {
  useFrame((state) => {
    const targetZ = props.settings.mode === 'air' ? 8.7 : 9.4
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.025
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.08) * (props.guided ? 0.24 : 0.08)
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
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[props.viewingMode === 'daylight' ? '#e9ede6' : '#050807']} />
      <fog attach="fog" args={[props.viewingMode === 'daylight' ? '#e9ede6' : '#050807', 8, 18]} />
      <Scene {...props} />
    </Canvas>
  )
}
