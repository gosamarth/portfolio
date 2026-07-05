import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../scrollBridge'

// ─────────────────────────────────────────────────────────────
//  Night-drive warp: hundreds of neon light streaks racing past
//  like highway lights at speed. Streak velocity reacts to how
//  hard you scroll — idle cruise, scroll = full send.
// ─────────────────────────────────────────────────────────────

const COUNT = 340
const TUNNEL_LEN = 200
const PALETTE = ['#6ee7ff', '#6ee7ff', '#a78bfa', '#f0abfc', '#ffffff']

type Streak = {
  x: number
  y: number
  z: number
  len: number
  drift: number
}

export function SpeedTunnel() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const lastOffset = useRef(0)
  const speed = useRef(6)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const streaks = useMemo<Streak[]>(() => {
    const arr: Streak[] = []
    for (let i = 0; i < COUNT; i++) {
      // ring distribution around the camera path — clear of the center content
      const a = Math.random() * Math.PI * 2
      const r = 4.5 + Math.pow(Math.random(), 1.6) * 13
      arr.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r * 0.62 + 0.8,
        z: 12 - Math.random() * TUNNEL_LEN,
        len: 1.6 + Math.random() * 4.5,
        drift: 0.75 + Math.random() * 0.6, // parallax: some lanes faster
      })
    }
    return arr
  }, [])

  const colors = useMemo(() => {
    const c = new Float32Array(COUNT * 3)
    const col = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      col.set(PALETTE[Math.floor(Math.random() * PALETTE.length)])
      // dim the far/slow ones for depth
      const dim = 0.35 + Math.random() * 0.65
      c[i * 3] = col.r * dim
      c[i * 3 + 1] = col.g * dim
      c[i * 3 + 2] = col.b * dim
    }
    return c
  }, [])

  useFrame(({ camera }, delta) => {
    if (!mesh.current) return

    // scroll velocity → warp boost (smoothed)
    const dOff = Math.abs(scrollState.offset - lastOffset.current)
    lastOffset.current = scrollState.offset
    const targetSpeed = 6 + Math.min(dOff * 4200, 90)
    speed.current = THREE.MathUtils.damp(speed.current, targetSpeed, 3, delta)

    const stretch = 1 + (speed.current - 6) * 0.055 // streaks elongate at speed
    const camZ = camera.position.z

    for (let i = 0; i < COUNT; i++) {
      const s = streaks[i]
      s.z += speed.current * s.drift * delta
      // wrap: once a streak passes behind the camera, respawn far ahead
      if (s.z > camZ + 6) s.z -= TUNNEL_LEN
      if (s.z < camZ + 6 - TUNNEL_LEN) s.z += TUNNEL_LEN

      dummy.position.set(s.x, s.y, s.z)
      dummy.scale.set(1, 1, s.len * stretch)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.035, 0.035, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshBasicMaterial
        vertexColors
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
