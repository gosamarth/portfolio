import { Image as DreiImage, MeshReflectorMaterial, Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scrollState } from '../scrollBridge'
import { TECH_PAGES, IRL_PAGE, irl, techHero } from '../data/tech'

// ─────────────────────────────────────────────────────────────
//  THE COMMAND DECK, reimagined: a porcelain gallery. Light,
//  airy, museum-grade — floating glass slabs, ink rings, soft
//  reflections, and small photo prints drifting past.
// ─────────────────────────────────────────────────────────────

export const TECH_PAGE_DEPTH = 13
const CAM_START_Z = 8
const CAM_TRAVEL = (TECH_PAGES - 1) * TECH_PAGE_DEPTH
export const techZAtPage = (p: number) => CAM_START_Z - TECH_PAGE_DEPTH * p

const BG = '#f3f1ec'

/** Floating white glass slabs — the gallery's sculpture field. */
function GlassSlabs({ mobile }: { mobile: boolean }) {
  const count = 64
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const slabs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1
        return {
          x: side * (5.5 + Math.pow(Math.random(), 1.5) * 11),
          y: -0.5 + Math.random() * 5,
          z: 12 - Math.random() * (CAM_TRAVEL + 34),
          w: 1.2 + Math.random() * 2.6,
          h: 1.8 + Math.random() * 3.6,
          rot: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2,
        }
      }),
    [],
  )

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    slabs.forEach((s, i) => {
      dummy.position.set(s.x, s.y + Math.sin(t * 0.4 + s.phase) * 0.25, s.z)
      dummy.rotation.set(0, s.rot + Math.sin(t * 0.15 + s.phase) * 0.05, 0)
      dummy.scale.set(s.w, s.h, 0.08)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.05} transparent opacity={mobile ? 0.28 : 0.55} />
    </instancedMesh>
  )
}

/** Fine dust motes drifting — gives the light air a bit of life. */
function Dust() {
  const count = 380
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 34
      arr[i * 3 + 1] = -2 + Math.random() * 9
      arr[i * 3 + 2] = 12 - Math.random() * (CAM_TRAVEL + 34)
    }
    return arr
  }, [])
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.004
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} sizeAttenuation color="#9a958a" transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}

/** Thin ink ring marking each story stop — quiet, architectural. */
function InkRing({ z, accent }: { z: number; accent?: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.2 + z) * 0.04
  })
  return (
    <mesh ref={ref} position={[0, 1.5, z]}>
      <torusGeometry args={[6.9, 0.022, 8, 120]} />
      <meshStandardMaterial color={accent ?? '#15161a'} roughness={0.4} metalness={0.3} />
    </mesh>
  )
}

/** Small floating photo print with soft distance fade.
 *  fadeFar/fadeSpan control when it materialises — narrow phone frustums use a
 *  short window so prints only appear once they sit low on screen, never over text. */
function PhotoPrint({
  url, z, x = 0, y = 1.4, w = 2.6, tilt = 0, fadeFar = 21, fadeSpan = 5,
}: { url: string; z: number; x?: number; y?: number; w?: number; tilt?: number; fadeFar?: number; fadeSpan?: number }) {
  const ref = useRef<any>(null)
  useFrame(({ camera }) => {
    const dist = Math.abs(camera.position.z - z)
    if (ref.current?.material) {
      ref.current.material.transparent = true
      ref.current.material.opacity = dist > fadeFar ? 0 : dist < 1.2 ? 0 : Math.min(1, (fadeFar - dist) / fadeSpan)
    }
  })
  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.5}>
      <DreiImage ref={ref} url={url} scale={[w, w * 1.25]} position={[x, y, z]} rotation={[0, tilt, 0]} radius={0.06} toneMapped={false} />
    </Float>
  )
}

function PorcelainFloor() {
  const length = CAM_TRAVEL + 40
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, CAM_START_Z - length / 2 + 10]}>
      <planeGeometry args={[46, length]} />
      <MeshReflectorMaterial
        blur={[420, 140]} resolution={1024} mixBlur={1} mixStrength={4}
        roughness={0.85} depthScale={0.6} minDepthThreshold={0.4} maxDepthThreshold={1.4}
        color="#eae7e0" metalness={0.05} mirror={0.3}
      />
    </mesh>
  )
}

// scattered small prints along the journey (page, x, tilt, photo index)
const PRINT_STOPS: [number, number, number, number][] = [
  [3, 4.9, -0.3, 0],
  [5, -5.1, 0.3, 1],
  [7, 5.0, -0.28, 3],
  [10, -4.9, 0.3, 4],
]

export function TechWorld() {
  const { camera, size } = useThree()
  const target = useRef(new THREE.Vector3())
  // Phones have a much narrower frustum — side prints at |x|≈5 never enter it.
  // On mobile the photos live in the empty bottom band beneath the text instead.
  const mobile = size.width / size.height < 0.8

  // snap to the start of the journey on world entry
  useEffect(() => {
    camera.position.set(0, 0.4, 8)
  }, [camera])

  useFrame((state, delta) => {
    const o = scrollState.offset
    const desiredZ = CAM_START_Z - o * CAM_TRAVEL
    const px = state.pointer.x * 1.0
    const py = state.pointer.y * 0.6
    const ease = 1 - Math.pow(0.0015, delta)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, ease)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, px, ease)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, py * 0.5 + 0.5, ease)
    target.current.set(px * 0.3, py * 0.3 + 0.5, camera.position.z - 10)
    camera.lookAt(target.current)
  })

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 7, 34]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[6, 10, 4]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-6, 4, -8]} intensity={0.4} color="#ffe8c7" />

      <PorcelainFloor />
      <GlassSlabs mobile={mobile} />
      <Dust />

      {/* one quiet ring per story beat — accent rings on key stops */}
      {Array.from({ length: TECH_PAGES }, (_, page) => (
        <InkRing
          key={page}
          z={techZAtPage(page) - 9}
          accent={page === 8 ? '#d97706' : page === 11 ? '#059669' : undefined}
        />
      ))}

      {/* hero portrait — a modest print, not a billboard */}
      <PhotoPrint
        url={techHero.portrait}
        z={techZAtPage(0) - 8.2}
        x={mobile ? 1.55 : 4.4}
        y={mobile ? -1.5 : 1.2}
        w={mobile ? 1.1 : 3.2}
        tilt={mobile ? -0.15 : -0.3}
      />

      {/* small prints drifting past through the story */}
      {PRINT_STOPS.map(([page, x, tilt, idx]) => (
        <PhotoPrint
          key={`${page}-${idx}`}
          url={irl.photos[idx].src}
          z={techZAtPage(page) - 8.6}
          x={mobile ? Math.sign(x) * 1.1 : x}
          y={mobile ? -1.15 : 1.2 + (idx % 2) * 0.5}
          w={mobile ? 1.45 : 2.6}
          tilt={mobile ? tilt * 0.5 : tilt}
          fadeFar={mobile ? 9 : 21}
          fadeSpan={mobile ? 2.5 : 5}
        />
      ))}

      {/* IRL wall — desktop only; mobile shows a polaroid strip inside the HTML section */}
      {!mobile &&
        irl.photos.slice(0, 5).map((p, i) => {
          const pos = [
            [6.4, 4.3], [8.4, 1.4], [10.0, 3.7], [11.6, 1.5], [7.3, -0.5],
          ][i] as [number, number]
          return (
            <PhotoPrint
              key={p.src}
              url={p.src}
              z={techZAtPage(IRL_PAGE) - 14.5}
              x={pos[0]}
              y={pos[1]}
              w={3.1}
              tilt={-pos[0] * 0.04}
            />
          )
        })}
    </>
  )
}
