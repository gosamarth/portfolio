import { Image as DreiImage, MeshReflectorMaterial, Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scrollState } from '../scrollBridge'
import { TECH_PAGES, irl, techHero } from '../data/tech'

// ─────────────────────────────────────────────────────────────
//  THE COMMAND DECK world: flying low over a living circuit
//  city — chip towers, data pulses racing along traces, holo
//  panels at each stop. Emerald / cyan / amber palette.
// ─────────────────────────────────────────────────────────────

export const TECH_PAGE_DEPTH = 13
const CAM_START_Z = 8
const CAM_TRAVEL = (TECH_PAGES - 1) * TECH_PAGE_DEPTH
export const techZAtPage = (p: number) => CAM_START_Z - TECH_PAGE_DEPTH * p

const PALETTE = ['#34d399', '#22d3ee', '#fbbf24', '#a7f3d0']

/** Chip towers — an instanced skyline flanking the flight path. */
function ChipCity() {
  const count = 260
  const mesh = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(() => {
    const arr: { x: number; z: number; h: number; w: number }[] = []
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1
      const x = side * (7 + Math.pow(Math.random(), 1.4) * 16)
      const z = 14 - Math.random() * (CAM_TRAVEL + 40)
      arr.push({ x, z, h: 0.8 + Math.random() * 5.2, w: 0.7 + Math.random() * 1.6 })
    }
    return arr
  }, [])

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3)
    const col = new THREE.Color()
    for (let i = 0; i < count; i++) {
      col.set(Math.random() < 0.82 ? '#0a1f1c' : PALETTE[i % PALETTE.length])
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b
    }
    return c
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame(() => {
    if (!mesh.current) return
    // static — set once
    if ((mesh.current as any).__built) return
    ;(mesh.current as any).__built = true
    data.forEach((d, i) => {
      dummy.position.set(d.x, -2.2 + d.h / 2, d.z)
      dummy.scale.set(d.w, d.h, d.w)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshStandardMaterial vertexColors metalness={0.4} roughness={0.35} emissiveIntensity={0} />
    </instancedMesh>
  )
}

/** Data pulses — packets of light racing down the traces toward the horizon. */
function DataPulses() {
  const count = 240
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const pulses = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 30,
        y: -2.05,
        z: 14 - Math.random() * (CAM_TRAVEL + 40),
        speed: 8 + Math.random() * 22,
        len: 0.8 + Math.random() * 2.2,
      })),
    [],
  )
  const colors = useMemo(() => {
    const c = new Float32Array(count * 3)
    const col = new THREE.Color()
    for (let i = 0; i < count; i++) {
      col.set(PALETTE[Math.floor(Math.random() * PALETTE.length)])
      const dim = 0.4 + Math.random() * 0.6
      c[i * 3] = col.r * dim; c[i * 3 + 1] = col.g * dim; c[i * 3 + 2] = col.b * dim
    }
    return c
  }, [])

  useFrame(({ camera }, delta) => {
    if (!mesh.current) return
    for (let i = 0; i < count; i++) {
      const p = pulses[i]
      p.z -= p.speed * delta // pulses race AWAY down the traces
      if (p.z < camera.position.z - CAM_TRAVEL - 30) p.z = camera.position.z + 10
      if (p.z > camera.position.z + 12) p.z -= CAM_TRAVEL + 40
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.set(0.06, 0.02, p.len)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  )
}

/** Holo gate — hexagon ring marking each stop. */
function HoloGate({ z, color }: { z: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 2.4 + z) * 0.5
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + z) * 0.06
    }
  })
  return (
    <mesh ref={ref} position={[0, 1.4, z]}>
      <torusGeometry args={[7.2, 0.05, 6, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  )
}

/** Floating holo photo panel with distance fade. */
function HoloPanel({
  url, z, x = 0, y = 1.6, w = 4.4, tilt = 0,
}: { url: string; z: number; x?: number; y?: number; w?: number; tilt?: number }) {
  const ref = useRef<any>(null)
  useFrame(({ camera }) => {
    const dist = Math.abs(camera.position.z - z)
    if (ref.current?.material) {
      ref.current.material.transparent = true
      ref.current.material.opacity = dist > 17 ? 0 : dist < 2 ? 0 : Math.min(1, (17 - dist) / 5)
    }
  })
  return (
    <Float speed={1.3} rotationIntensity={0.06} floatIntensity={0.5}>
      <DreiImage ref={ref} url={url} scale={[w, w * 1.25]} position={[x, y, z]} rotation={[0, tilt, 0]} radius={0.08} toneMapped={false} />
    </Float>
  )
}

function TechFloor() {
  const length = CAM_TRAVEL + 40
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, CAM_START_Z - length / 2 + 10]}>
      <planeGeometry args={[46, length]} />
      <MeshReflectorMaterial
        blur={[280, 90]} resolution={1024} mixBlur={1} mixStrength={30}
        roughness={1} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4}
        color="#04110d" metalness={0.5} mirror={0.65}
      />
    </mesh>
  )
}

export function TechWorld() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())

  // snap to the start of the journey on world entry
  useEffect(() => {
    camera.position.set(0, 0.4, 8)
  }, [camera])

  useFrame((state, delta) => {
    const o = scrollState.offset
    const desiredZ = CAM_START_Z - o * CAM_TRAVEL
    const px = state.pointer.x * 1.1
    const py = state.pointer.y * 0.7
    const ease = 1 - Math.pow(0.0015, delta)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, ease)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, px, ease)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, py * 0.6 + 0.5, ease)
    target.current.set(px * 0.3, py * 0.3 + 0.5, camera.position.z - 10)
    camera.lookAt(target.current)
  })

  return (
    <>
      <color attach="background" args={['#020806']} />
      <fog attach="fog" args={['#020806', 6, 32]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 9, 4]} intensity={0.8} color="#d1fae5" />

      <TechFloor />
      <ChipCity />
      <DataPulses />

      {/* stops: hero portrait, pillar gates, console, IRL photo wall */}
      <HoloGate z={techZAtPage(0) - 9} color="#34d399" />
      <HoloPanel url={techHero.portrait} z={techZAtPage(0) - 8.5} x={4.1} y={1.0} w={3.3} tilt={-0.28} />

      <HoloGate z={techZAtPage(1) - 9} color="#34d399" />
      <HoloGate z={techZAtPage(2) - 9} color="#38bdf8" />
      <HoloGate z={techZAtPage(3) - 9} color="#c084fc" />
      <HoloGate z={techZAtPage(4) - 9} color="#fbbf24" />

      {/* IRL wall — his travels floating as holo cards */}
      <HoloGate z={techZAtPage(5) - 9} color="#22d3ee" />
      {irl.photos.slice(0, 5).map((p, i) => {
        const spread = [-5.6, -2.8, 0, 2.8, 5.6][i]
        return (
          <HoloPanel
            key={p.src}
            url={p.src}
            z={techZAtPage(5) - 9 + Math.abs(spread) * 0.18}
            x={spread}
            y={1.7}
            w={2.6}
            tilt={-spread * 0.05}
          />
        )
      })}

      <HoloGate z={techZAtPage(6) - 9} color="#34d399" />

      {/* stop lights */}
      <pointLight position={[-6, 4, techZAtPage(2) - 6]} intensity={30} color="#34d399" />
      <pointLight position={[6, 3, techZAtPage(4) - 6]} intensity={30} color="#fbbf24" />

      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.28} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </>
  )
}
