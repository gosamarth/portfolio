import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GAMES, saveBest } from './arcade'
import { GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail, sfxPass } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  SLAB STACK: the porcelain gallery, stacked. A slab glides,
//  you drop it, the overhang shears off. Perfect drops chime.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'stack')!
// what Samarth actually stacks in production, looped forever
const STACK_TECH = [
  '.NET', 'Azure', 'AKS', 'React', 'Angular', 'SQL Server', 'Service Bus',
  'Redis', 'RAG', 'AI Agents', 'CI/CD', 'Copilots', 'SLOs', 'FinOps',
  'SOC 2', 'GDPR', 'HIPAA', 'Observability', 'Feature Flags', 'DR Drills',
]
export const techAt = (layer: number) => STACK_TECH[layer % STACK_TECH.length]

type Phase = 'ready' | 'run' | 'over'
type Layer = { x: number; z: number; w: number; d: number; y: number; hue: number }

const START_W = 3.2
const START_D = 3.2
const H = 0.42
const SPEED0 = 3.2

const st = {
  phase: 'ready' as Phase,
  layers: [] as Layer[],
  moving: { x: 0, z: 0, w: START_W, d: START_D, axis: 'x' as 'x' | 'z', dir: 1, hue: 32 },
  score: 0,
  speed: SPEED0,
  epoch: 0,
  dropQueued: false,
}

function resetStack() {
  st.layers = [{ x: 0, z: 0, w: START_W, d: START_D, y: 0, hue: 28 }]
  st.moving = { x: -5, z: 0, w: START_W, d: START_D, axis: 'x', dir: 1, hue: 44 }
  st.score = 0
  st.speed = SPEED0
  st.epoch++
  st.dropQueued = false
}

function pastel(hue: number) {
  return new THREE.Color(`hsl(${hue % 360}, 42%, 78%)`)
}

export function SlabStackScene() {
  const { camera } = useThree()
  const movingRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    camera.position.set(7.5, 7.5, 7.5)
    camera.lookAt(0, 1, 0)
  }, [camera])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    const topY = (st.layers.length - 1) * H

    if (st.phase === 'run') {
      // glide the live slab
      const m = st.moving
      const pos = m.axis === 'x' ? m.x : m.z
      const next = pos + m.dir * st.speed * d
      if (next > 5) m.dir = -1
      if (next < -5) m.dir = 1
      if (m.axis === 'x') m.x = next
      else m.z = next

      // handle a queued drop at frame boundary for determinism
      if (st.dropQueued) {
        st.dropQueued = false
        const top = st.layers[st.layers.length - 1]
        const overlapW = m.axis === 'x' ? Math.max(0, Math.min(m.x + m.w / 2, top.x + top.w / 2) - Math.max(m.x - m.w / 2, top.x - top.w / 2)) : Math.min(m.w, top.w)
        const overlapD = m.axis === 'z' ? Math.max(0, Math.min(m.z + m.d / 2, top.z + top.d / 2) - Math.max(m.z - m.d / 2, top.z - top.d / 2)) : Math.min(m.d, top.d)
        if (overlapW <= 0.05 || overlapD <= 0.05) {
          st.phase = 'over'
          sfxFail()
        } else {
          const nx = m.axis === 'x' ? (Math.min(m.x + m.w / 2, top.x + top.w / 2) + Math.max(m.x - m.w / 2, top.x - top.w / 2)) / 2 : top.x
          const nz = m.axis === 'z' ? (Math.min(m.z + m.d / 2, top.z + top.d / 2) + Math.max(m.z - m.d / 2, top.z - top.d / 2)) / 2 : top.z
          const perfect = m.axis === 'x' ? overlapW > m.w * 0.97 : overlapD > m.d * 0.97
          const layer: Layer = {
            x: perfect ? top.x : nx,
            z: perfect ? top.z : nz,
            w: perfect ? m.w : overlapW,
            d: perfect ? m.d : overlapD,
            y: st.layers.length * H,
            hue: m.hue,
          }
          st.layers.push(layer)
          st.score = st.layers.length - 1
          st.speed = Math.min(9, st.speed + 0.12)
          if (perfect) {
            sfxPass()
          } else {
            beep(300 + st.score * 14, 0.06, 'sine', 0.035)
          }
          // next slab starts on the other axis
          const axis = m.axis === 'x' ? 'z' : 'x'
          st.moving = {
            x: axis === 'x' ? -5 : layer.x,
            z: axis === 'z' ? -5 : layer.z,
            w: layer.w,
            d: layer.d,
            axis,
            dir: 1,
            hue: m.hue + 16,
          }
        }
      }
    }

    if (movingRef.current) {
      const m = st.moving
      movingRef.current.visible = st.phase === 'run'
      movingRef.current.position.set(m.x, st.layers.length * H, m.z)
      movingRef.current.scale.set(m.w, H, m.d)
      ;(movingRef.current.material as THREE.MeshStandardMaterial).color = pastel(m.hue)
    }

    // camera rises with the tower
    const targetY = 6.2 + topY
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 1 - Math.pow(0.02, d))
    camera.lookAt(0, topY * 0.82, 0)
  })

  return (
    <>
      <color attach="background" args={['#f3f1ec']} />
      <fog attach="fog" args={['#f3f1ec', 24, 60]} />
      <ambientLight intensity={1.05} />
      <directionalLight position={[8, 14, 6]} intensity={1.4} />
      <directionalLight position={[-6, 6, -6]} intensity={0.45} color="#ffe8c7" />

      <group ref={groupRef}>
        {/* settled layers (keyed by epoch so retry rebuilds) */}
        <StackedLayers key={st.epoch} />
        {/* the gliding slab */}
        <mesh ref={movingRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.5} metalness={0.05} />
        </mesh>
      </group>

      {/* ground shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -H / 2 - 0.01, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color="#e6e2d9" roughness={0.9} />
      </mesh>
    </>
  )
}

/** Imperative mirror of st.layers: meshes pool up to 200 slabs. */
function StackedLayers() {
  const pool = useRef<THREE.Mesh[]>([])
  useFrame(() => {
    pool.current.forEach((mesh, i) => {
      const l = st.layers[i]
      if (!l) {
        mesh.visible = false
        return
      }
      mesh.visible = true
      mesh.position.set(l.x, l.y, l.z)
      mesh.scale.set(l.w, H, l.d)
      ;(mesh.material as THREE.MeshStandardMaterial).color = pastel(l.hue)
    })
  })
  return (
    <>
      {Array.from({ length: 200 }, (_, i) => (
        <mesh key={i} ref={(el) => { if (el) pool.current[i] = el }} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.55} metalness={0.04} />
        </mesh>
      ))}
    </>
  )
}

// ── DOM HUD ──────────────────────────────────────────────────
export function SlabStackHud({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [score, setScore] = useState(0)
  const [isBest, setIsBest] = useState(false)

  useEffect(() => {
    resetStack()
    st.phase = 'ready'
    const iv = setInterval(() => {
      setScore(st.score)
      setPhase((p) => {
        if (p !== 'over' && st.phase === 'over') {
          setIsBest(saveBest('stack', st.score))
          return 'over'
        }
        return st.phase
      })
    }, 100)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && st.phase === 'run') {
        e.preventDefault()
        st.dropQueued = true
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const start = () => {
    resetStack()
    st.phase = 'run'
    setPhase('run')
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30" style={{ color: '#121317' }}>
      <div
        className="pointer-events-auto absolute inset-0"
        onPointerDown={() => {
          if (st.phase === 'run') st.dropQueued = true
        }}
      />
      {/* light-world header variant */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 md:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-emerald-700">
          {META.icon} {META.name}
        </span>
        <div className="text-center">
          <span className="font-display text-2xl font-bold tabular-nums md:text-3xl">{score}</span>
          {phase === 'run' && (
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/45">
              now stacking: <span className="font-bold text-emerald-700">{techAt(score)}</span>
            </p>
          )}
        </div>
        <button
          onClick={onExit}
          className="pointer-events-auto rounded-full border border-black/20 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 transition hover:text-black"
        >
          exit
        </button>
      </div>
      {phase === 'ready' && (
        <div className="pointer-events-auto absolute inset-0">
          <StartOverlay
            meta={META}
            blurb="Samarth's production stack, one slab at a time: .NET on Azure on AKS on RAG. Whatever hangs over the edge is tech debt, and it gets sliced. Near-perfect drops keep the full slab."
            onStart={start}
          />
        </div>
      )}
      {phase === 'over' && (
        <div className="pointer-events-auto absolute inset-0">
          <GameOverPanel
            meta={META}
            score={score}
            isBest={isBest}
            onRetry={start}
            onExit={onExit}
            extra={`${score} layers of Samarth's stack${score > 0 ? `, toppled at ${techAt(score)}` : ''}. His real one has held for a decade.`}
          />
        </div>
      )}
    </div>
  )
}
