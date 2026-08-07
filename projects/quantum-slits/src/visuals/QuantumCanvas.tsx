import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { intensityAt } from '../physics/model'
import type { Detection, ExperimentSettings, InterpretationId } from '../types'

interface Props {
  settings: ExperimentSettings
  detections: Detection[]
  showAmplitude: boolean
  sceneMode?: 'quantum' | 'wave'
  interpretation?: InterpretationId
}

const waveVertexShader = /* glsl */`
  uniform float uTime;
  uniform float uWavelength;
  uniform float uSeparation;
  uniform float uDouble;
  uniform float uIncoming;
  varying float vAmplitude;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    float forward = p.x + 3.1;
    float separation = uSeparation * 0.22;
    float k = 6.28318530718 / max(0.16, uWavelength);
    float amplitude;
    if (uIncoming > 0.5) {
      float edgeFade = smoothstep(0.0, 0.28, uv.x) * smoothstep(1.0, 0.72, uv.x);
      amplitude = sin(k * p.x - uTime) * 0.52 * edgeFade;
    } else {
      float fadeIn = smoothstep(0.0, 0.42, forward);
      float r1 = length(vec2(max(0.02, forward), p.y - (uDouble > 0.5 ? separation * 0.5 : 0.0)));
      amplitude = sin(k * r1 - uTime) / sqrt(max(0.42, r1));
      if (uDouble > 0.5) {
        float r2 = length(vec2(max(0.02, forward), p.y + separation * 0.5));
        amplitude = (amplitude + sin(k * r2 - uTime) / sqrt(max(0.42, r2))) / 1.41421356;
      }
      amplitude *= fadeIn;
    }
    p.z += amplitude * 0.55;
    vAmplitude = amplitude;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const waveFragmentShader = /* glsl */`
  uniform float uAnalogy;
  varying float vAmplitude;
  varying vec2 vUv;

  void main() {
    vec3 trough = mix(vec3(0.10, 0.62, 0.76), vec3(0.08, 0.66, 0.80), uAnalogy);
    vec3 crest = mix(vec3(1.0, 0.68, 0.25), vec3(0.46, 1.0, 0.87), uAnalogy);
    vec3 color = mix(trough, crest, smoothstep(-0.18, 0.18, vAmplitude));
    float magnitude = smoothstep(0.02, 0.74, abs(vAmplitude));
    float gridX = 1.0 - smoothstep(0.94, 1.0, abs(sin(vUv.x * 3.14159 * 46.0)));
    float gridY = 1.0 - smoothstep(0.95, 1.0, abs(sin(vUv.y * 3.14159 * 34.0)));
    float grid = max(gridX, gridY);
    gl_FragColor = vec4(color, 0.15 + magnitude * 0.54 + grid * 0.08);
  }
`

function barrierSegments(settings: ExperimentSettings) {
  const edge = 3.45
  const halfOpening = Math.max(0.13, 0.27 - settings.slitWidth * 0.045)
  const centers = settings.slitMode === 'single'
    ? [0]
    : [-settings.slitSeparation * 0.11, settings.slitSeparation * 0.11]
  const cuts = centers.flatMap((center) => [center - halfOpening, center + halfOpening])
  const bounds = [-edge, ...cuts, edge]
  const segments: Array<{ center: number; height: number }> = []
  for (let index = 0; index < bounds.length - 1; index += 2) {
    const from = bounds[index]
    const to = bounds[index + 1]
    segments.push({ center: (from + to) / 2, height: to - from })
  }
  return segments
}

function Barrier({ settings }: { settings: ExperimentSettings }) {
  const segments = useMemo(() => barrierSegments(settings), [settings])
  const openings = settings.slitMode === 'single' ? [0] : [-settings.slitSeparation * 0.11, settings.slitSeparation * 0.11]
  return (
    <group position={[-1.1, 0, 0]}>
      {segments.map((segment, index) => (
        <mesh key={`${settings.slitMode}-${index}`} position={[0, segment.center, 0]}>
          <boxGeometry args={[0.14, segment.height, 4.8]} />
          <meshStandardMaterial color="#52625b" emissive="#14231f" emissiveIntensity={0.8} roughness={0.64} metalness={0.25} />
        </mesh>
      ))}
      <mesh position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.025, 6.9, 4.86]} />
        <meshBasicMaterial color="#a6c9bc" transparent opacity={0.26} wireframe toneMapped={false} />
      </mesh>
      {openings.map((opening) => (
        <mesh key={opening} position={[0.09, opening, 2.44]}>
          <boxGeometry args={[0.06, 0.42, 0.035]} />
          <meshBasicMaterial color="#8ff5df" transparent opacity={0.58} wireframe toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function WaveSurface({ settings, analogy, incoming = false }: { settings: ExperimentSettings; analogy: boolean; incoming?: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const compact = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches, [])
  useFrame((state) => {
    if (!material.current) return
    material.current.uniforms.uTime.value = state.clock.elapsedTime * 4.2
    material.current.uniforms.uWavelength.value = settings.wavelength
    material.current.uniforms.uSeparation.value = settings.slitSeparation
    material.current.uniforms.uDouble.value = settings.slitMode === 'double' ? 1 : 0
    material.current.uniforms.uAnalogy.value = analogy ? 1 : 0
    material.current.uniforms.uIncoming.value = incoming ? 1 : 0
  })
  return (
    <mesh position={[incoming ? -3.1 : 2, 0, -0.22]} renderOrder={1}>
      <planeGeometry args={[incoming ? 3.85 : 6.2, 6.5, compact ? (incoming ? 34 : 68) : (incoming ? 80 : 150), compact ? 50 : 110]} />
      <shaderMaterial
        ref={material}
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        uniforms={{
          uTime: { value: 0 },
          uWavelength: { value: settings.wavelength },
          uSeparation: { value: settings.slitSeparation },
          uDouble: { value: settings.slitMode === 'double' ? 1 : 0 },
          uAnalogy: { value: analogy ? 1 : 0 },
          uIncoming: { value: incoming ? 1 : 0 },
        }}
      />
    </mesh>
  )
}

function detectorTexture(settings: ExperimentSettings) {
  const height = 256
  const data = new Uint8Array(height * 4)
  let peak = 0
  for (let row = 0; row < height; row += 1) peak = Math.max(peak, intensityAt((row / (height - 1) - 0.5) * 2, settings))
  for (let row = 0; row < height; row += 1) {
    const normalizedY = (row / (height - 1) - 0.5) * 2
    const intensity = intensityAt(normalizedY, settings) / Math.max(peak, 0.001)
    const offset = row * 4
    data[offset] = 82 + Math.round(intensity * 88)
    data[offset + 1] = 128 + Math.round(intensity * 100)
    data[offset + 2] = 118 + Math.round(intensity * 86)
    data[offset + 3] = Math.round(18 + intensity * 92)
  }
  const texture = new THREE.DataTexture(data, 1, height, THREE.RGBAFormat)
  texture.needsUpdate = true
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  return texture
}

function Detector({ settings, detections }: { settings: ExperimentSettings; detections: Detection[] }) {
  const texture = useMemo(() => detectorTexture(settings), [settings])
  const mesh = useRef<THREE.InstancedMesh>(null)
  const matrix = useMemo(() => new THREE.Matrix4(), [])
  useEffect(() => () => texture.dispose(), [texture])
  useEffect(() => {
    if (!mesh.current) return
    detections.slice(-1800).forEach((detection, index) => {
      const depthRandom = (((detection.id * 16807) % 997) / 996 - 0.5) * 4.15
      matrix.makeTranslation(5.29, detection.y * 3.02, depthRandom)
      mesh.current!.setMatrixAt(index, matrix)
    })
    mesh.current.count = Math.min(1800, detections.length)
    mesh.current.instanceMatrix.needsUpdate = true
  }, [detections, matrix])
  return (
    <group>
      <mesh position={[5.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.1, 6.15]} />
        <meshBasicMaterial map={texture} transparent opacity={0.42} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh position={[5.24, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.15, 6.2]} />
        <meshBasicMaterial color="#8eb3a5" transparent opacity={0.22} wireframe toneMapped={false} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, 1800]} frustumCulled={false}>
        <sphereGeometry args={[0.044, 8, 8]} />
        <meshBasicMaterial color="#b6fff0" transparent opacity={0.96} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

function Apparatus(props: Props) {
  const compact = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches, [])
  useFrame((state) => {
    const target = compact ? new THREE.Vector3(0.6, 0, 0) : new THREE.Vector3(0.45, 0, 0)
    state.camera.lookAt(target)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      state.camera.position.y += (Math.sin(state.clock.elapsedTime * 0.12) * 0.16 + (compact ? 8.2 : 6.2) - state.camera.position.y) * 0.02
    }
  })
  return (
    <>
      <ambientLight intensity={1.35} />
      <directionalLight position={[1, 8, 10]} intensity={2.4} color="#e5fff6" />
      <pointLight position={[-4.8, 0, 1.5]} intensity={18} distance={7} color="#e8b660" />
      <mesh position={[-5.05, 0, 0]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial color="#ffe2a4" toneMapped={false} />
      </mesh>
      <pointLight position={[-5.05, 0, 0]} intensity={12} distance={3.5} color="#ffd789" />
      <Barrier settings={props.settings} />
      {props.showAmplitude && <>
        <WaveSurface settings={props.settings} analogy={props.sceneMode === 'wave'} incoming />
        <WaveSurface settings={props.settings} analogy={props.sceneMode === 'wave'} />
      </>}
      <Detector settings={props.settings} detections={props.detections} />
      <gridHelper args={[13, 26, '#376158', '#1a2e29']} position={[0, -3.55, 0]} />
    </>
  )
}

export default function QuantumCanvas(props: Props) {
  const compact = typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  return (
    <Canvas
      className="quantum-canvas"
      camera={{ position: compact ? [9.6, 9.4, 18.4] : [8.4, 7.6, 18.2], fov: compact ? 45 : 40 }}
      dpr={compact ? [1, 1.25] : [1, 1.7]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-label="Three-dimensional slit experiment showing a source, barrier, amplitude field, and individual detector events"
    >
      <color attach="background" args={['#050706']} />
      <fog attach="fog" args={['#050706', 19, 34]} />
      <Apparatus {...props} />
    </Canvas>
  )
}
