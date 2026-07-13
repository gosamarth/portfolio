import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  TUNNEL RUN: the warp tunnel from the garage intro, weaponised.
//  Neon gates rush at you; steer the ship through the openings.
//  Scene (three) + Hud (dom) share a module-level run state.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'tunnel')!

// every gate run is a career run: distance = promotions
export const MILESTONES: [number, string][] = [
  [400, 'Software Engineer'],
  [900, 'Senior Engineer'],
  [1500, 'Team Lead'],
  [2200, 'Engineering Manager'],
  [3000, 'Director of Engineering'],
]
export const rankFor = (m: number) => {
  let r = 'Intern'
  for (const [at, title] of MILESTONES) if (m >= at) r = title
  return r
}

type Phase = 'ready' | 'run' | 'over'
type Gate = { z: number; kind: 0 | 1 | 2 | 3; offset: number; passed: boolean }

const X_BOUND = 3.2
const Y_BOUND = 1.9
const GATE_SPACING = 26

const run = {
  phase: 'ready' as Phase,
  score: 0,
  speed: 18,
  px: 0,
  py: 0,
  // input: mouse/touch target (normalised -1..1) OR held keys — last used wins
  tx: 0,
  ty: 0,
  keys: { L: false, R: false, U: false, D: false },
  useMouse: true,
  gates: [] as Gate[],
  epoch: 0,
}

function resetRun() {
  run.score = 0
  run.speed = 18
  run.px = 0
  run.py = 0
  run.tx = 0
  run.ty = 0
  run.keys = { L: false, R: false, U: false, D: false }
  run.useMouse = true
  run.gates = Array.from({ length: 8 }, (_, i) => spawnGate(-40 - i * GATE_SPACING))
  run.epoch++
}

function spawnGate(z: number): Gate {
  return { z, kind: (Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3), offset: (Math.random() - 0.5) * 2.4, passed: false }
}

/** Bars blocking part of the tunnel; kind picks which half is deadly. */
function gateBlocks(g: Gate): { x: number; y: number; w: number; h: number }[] {
  switch (g.kind) {
    case 0: // horizontal bar, dodge above/below
      return [{ x: 0, y: g.offset, w: X_BOUND * 2 + 2, h: 1.1 }]
    case 1: // vertical bar
      return [{ x: g.offset * 1.4, y: 0, w: 1.4, h: Y_BOUND * 2 + 2 }]
    case 2: // left wall
      return [{ x: -X_BOUND + 1.6 + g.offset * 0.5, y: 0, w: X_BOUND + 1, h: Y_BOUND * 2 + 2 }]
    case 3: // right wall
      return [{ x: X_BOUND - 1.6 + g.offset * 0.5, y: 0, w: X_BOUND + 1, h: Y_BOUND * 2 + 2 }]
  }
}

// ── the 3D scene (rendered inside the persistent Canvas) ─────
export function TunnelRunScene() {
  const { camera } = useThree()
  const portrait = useTexture('/me/portrait.jpg')
  const ship = useRef<THREE.Group>(null)
  const gateRefs = useRef<THREE.Group[]>([])
  const streaks = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const streakSeeds = useMemo(
    () =>
      Array.from({ length: 220 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 5.5 + Math.random() * 5,
        z: -Math.random() * 220,
        len: 2 + Math.random() * 5,
      })),
    [],
  )

  useEffect(() => {
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, -30)
  }, [camera])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    // ship follows the last-used input: mouse/touch target or held keys
    const KEY_SPEED = 7.5
    const kx = (run.keys.R ? 1 : 0) - (run.keys.L ? 1 : 0)
    const ky = (run.keys.U ? 1 : 0) - (run.keys.D ? 1 : 0)
    if (run.phase === 'run') {
      if (run.useMouse) {
        run.px = THREE.MathUtils.lerp(run.px, run.tx * X_BOUND, 1 - Math.pow(0.0001, d))
        run.py = THREE.MathUtils.lerp(run.py, run.ty * Y_BOUND, 1 - Math.pow(0.0001, d))
      } else {
        run.px = THREE.MathUtils.clamp(run.px + kx * KEY_SPEED * d, -X_BOUND, X_BOUND)
        run.py = THREE.MathUtils.clamp(run.py + ky * KEY_SPEED * d, -Y_BOUND, Y_BOUND)
      }
      run.speed = Math.min(72, run.speed + d * 1.6)
      run.score += run.speed * d
    }
    if (ship.current) {
      const steer = run.useMouse ? run.tx - run.px / X_BOUND : kx
      const pitch = run.useMouse ? run.ty - run.py / Y_BOUND : ky
      ship.current.position.set(run.px, run.py, 0)
      ship.current.rotation.z = THREE.MathUtils.lerp(ship.current.rotation.z, -steer * 0.8, 0.12)
      ship.current.rotation.x = THREE.MathUtils.lerp(ship.current.rotation.x, pitch * 0.45, 0.12)
    }

    // gates advance
    run.gates.forEach((g, i) => {
      if (run.phase === 'run') g.z += run.speed * d
      if (g.z > 8) {
        Object.assign(g, spawnGate(g.z - 8 * GATE_SPACING))
      }
      const grp = gateRefs.current[i]
      if (grp) {
        grp.position.z = g.z
        grp.visible = true
      }
      // collision + pass scoring
      if (run.phase === 'run' && !g.passed && g.z > -0.6 && g.z < 0.6) {
        const hit = gateBlocks(g).some(
          (b) => Math.abs(run.px - b.x) < b.w / 2 + 0.28 && Math.abs(run.py - b.y) < b.h / 2 + 0.28,
        )
        if (hit) {
          run.phase = 'over'
          sfxFail()
        } else {
          g.passed = true
          beep(660 + Math.min(run.speed * 6, 500), 0.05, 'sine', 0.03)
        }
      }
    })

    // warp streaks
    if (streaks.current) {
      streakSeeds.forEach((s, i) => {
        s.z += (run.phase === 'run' ? run.speed : 6) * d
        if (s.z > 12) s.z -= 220
        dummy.position.set(Math.cos(s.angle) * s.radius, Math.sin(s.angle) * s.radius, s.z)
        dummy.scale.set(0.05, 0.05, s.len)
        dummy.updateMatrix()
        streaks.current!.setMatrixAt(i, dummy.matrix)
      })
      streaks.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 30, 160]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 6]} intensity={30} color="#6ee7ff" />

      {/* warp streaks */}
      <instancedMesh ref={streaks} args={[undefined, undefined, 220]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#39485e" toneMapped={false} />
      </instancedMesh>

      {/* the ship: a neon wedge with a glow trail */}
      <group ref={ship}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 0.8, 4]} />
          <meshStandardMaterial color="#0ff" emissive="#6ee7ff" emissiveIntensity={2.4} metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.7]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#f0abfc" toneMapped={false} />
        </mesh>
        {/* the pilot: Samarth, holographic */}
        <mesh position={[0, 0.62, 0.2]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial map={portrait} toneMapped={false} transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, 0.62, 0.18]}>
          <ringGeometry args={[0.3, 0.345, 32]} />
          <meshBasicMaterial color="#6ee7ff" toneMapped={false} transparent opacity={0.9} />
        </mesh>
      </group>

      {/* gates */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`${run.epoch}-${i}`} ref={(el) => { if (el) gateRefs.current[i] = el }}>
          <mesh>
            <torusGeometry args={[4.6, 0.07, 8, 64]} />
            <meshBasicMaterial color="#6ee7ff" toneMapped={false} />
          </mesh>
          <GateBars index={i} />
        </group>
      ))}
    </>
  )
}

/** Renders the deadly bars for gate i, kept in sync each frame. */
function GateBars({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    const g = run.gates[index]
    if (!g || !group.current) return
    const blocks = gateBlocks(g)
    group.current.children.forEach((child, ci) => {
      const b = blocks[ci]
      if (!b) {
        child.visible = false
        return
      }
      child.visible = true
      child.position.set(b.x, b.y, 0)
      child.scale.set(b.w, b.h, 0.3)
    })
  })
  return (
    <group ref={group}>
      {[0, 1].map((i) => (
        <mesh key={i}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff2d5e" transparent opacity={0.42} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

// ── the DOM HUD ──────────────────────────────────────────────
export function TunnelRunHud({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [score, setScore] = useState(0)
  const [isBest, setIsBest] = useState(false)
  const [promo, setPromo] = useState('')
  const lastRank = useRef('Intern')

  useEffect(() => {
    resetRun()
    run.phase = 'ready'
    ;(window as any).__tunnelRun = run // debug/e2e probe
    const iv = setInterval(() => {
      const m = Math.floor(run.score)
      setScore(m)
      const rank = rankFor(m)
      if (run.phase === 'run' && rank !== lastRank.current) {
        lastRank.current = rank
        setPromo(rank)
        setTimeout(() => setPromo(''), 2100)
      }
      setPhase((p) => {
        if (p !== 'over' && run.phase === 'over') {
          setIsBest(saveBest('tunnel', Math.floor(run.score)))
          return 'over'
        }
        return run.phase
      })
    }, 100)
    return () => clearInterval(iv)
  }, [])

  // window-level steering: mouse, touch, arrows and WASD all welcome
  useEffect(() => {
    const KEYMAP: Record<string, keyof typeof run.keys> = {
      ArrowLeft: 'L', KeyA: 'L',
      ArrowRight: 'R', KeyD: 'R',
      ArrowUp: 'U', KeyW: 'U',
      ArrowDown: 'D', KeyS: 'D',
    }
    const onMove = (x: number, y: number) => {
      run.tx = THREE.MathUtils.clamp((x / window.innerWidth) * 2 - 1, -1, 1)
      run.ty = THREE.MathUtils.clamp(-((y / window.innerHeight) * 2 - 1), -1, 1)
      run.useMouse = true
    }
    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onDown = (e: KeyboardEvent) => {
      const k = KEYMAP[e.code]
      if (!k) return
      e.preventDefault()
      run.keys[k] = true
      run.useMouse = false
    }
    const onUp = (e: KeyboardEvent) => {
      const k = KEYMAP[e.code]
      if (k) run.keys[k] = false
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  const start = () => {
    resetRun()
    run.phase = 'run'
    setPhase('run')
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="pointer-events-auto absolute inset-0" />
      <GameHeader meta={META} score={`${score}m`} onExit={onExit} />
      {promo && (
        <div className="absolute inset-x-0 top-[22%] flex justify-center">
          <div className="animate-pulse rounded-full border-2 border-accent bg-[#04050a]/80 px-7 py-2.5 text-center backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">Promotion</p>
            <p className="font-display text-xl font-bold uppercase text-white md:text-2xl">{promo}</p>
          </div>
        </div>
      )}
      {phase === 'ready' && (
        <div className="pointer-events-auto absolute inset-0">
          <StartOverlay
            meta={META}
            blurb="Samarth rides shotgun as your holographic pilot. Every metre is career progress: survive to 400m and you\u2019re a Software Engineer, 3000m makes Director. Steer with mouse, finger, arrows or WASD."
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
            extra={`Career reached: ${rankFor(score)}. Samarth ran this tunnel all the way to Director.`}
          />
        </div>
      )}
    </div>
  )
}
