import { Trail } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  NEON DRIFT: sixty seconds in a glowing arena. Angle is money,
//  walls are bankruptcy. Two tire trails paint your line.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'drift')!

type Phase = 'ready' | 'run' | 'over'

const ARENA = 26 // half-size
const DURATION = 60

const dr = {
  phase: 'ready' as Phase,
  x: 0,
  z: 0,
  heading: 0,
  vx: 0,
  vz: 0,
  speed: 0,
  steer: 0,
  points: 0,
  combo: 1,
  drifting: false,
  danger: 0.2,
  timeLeft: DURATION,
  bump: 0,
  epoch: 0,
}

function resetDrift() {
  Object.assign(dr, { x: 0, z: 6, heading: 0, vx: 0, vz: 0, speed: 0, steer: 0, points: 0, combo: 1, drifting: false, danger: 0.2, timeLeft: DURATION, bump: 0 })
  dr.epoch++
}

const PILLARS: [number, number][] = [
  [-11, -9], [12, -12], [-13, 11], [10, 10], [0, -16],
]

export function NeonDriftScene() {
  const { camera } = useThree()
  const carRef = useRef<THREE.Group>(null)
  const wheelL = useRef<THREE.Mesh>(null)
  const wheelR = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Mesh>(null)

  useEffect(() => {
    camera.position.set(0, 26, 20)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    if (dr.phase === 'run') {
      dr.timeLeft = Math.max(0, dr.timeLeft - d)
      if (dr.timeLeft <= 0) dr.phase = 'over'

      // arcade drift physics
      const MAX = 26
      dr.speed = Math.min(MAX, dr.speed + 18 * d)
      dr.heading += dr.steer * (1.9 + dr.speed * 0.045) * d
      const hx = Math.sin(dr.heading)
      const hz = -Math.cos(dr.heading)
      const grip = dr.steer !== 0 && dr.speed > 14 ? 1.7 : 5.2
      dr.vx = THREE.MathUtils.lerp(dr.vx, hx * dr.speed, Math.min(1, grip * d))
      dr.vz = THREE.MathUtils.lerp(dr.vz, hz * dr.speed, Math.min(1, grip * d))
      dr.x += dr.vx * d
      dr.z += dr.vz * d

      // drift angle → points
      const vlen = Math.hypot(dr.vx, dr.vz)
      const dot = vlen > 0.1 ? (dr.vx * hx + dr.vz * hz) / vlen : 1
      const angle = Math.acos(THREE.MathUtils.clamp(dot, -1, 1))
      dr.drifting = angle > 0.32 && vlen > 12
      // the floor pays by proximity: lazy circles in the middle earn pennies
      const wallDist = ARENA - Math.max(Math.abs(dr.x), Math.abs(dr.z))
      const pillarDist = Math.min(...PILLARS.map(([px, pz]) => Math.hypot(dr.x - px, dr.z - pz) - 1.5))
      dr.danger = THREE.MathUtils.clamp(1.9 - Math.min(wallDist, pillarDist) / 6.5, 0.2, 1.9)
      if (dr.drifting) {
        dr.combo = Math.min(5, dr.combo + d * 0.55)
        dr.points += angle * vlen * dr.combo * dr.danger * d * 3.2
        if (Math.random() < d * 8) beep(180 + angle * 300, 0.03, 'sawtooth', 0.02)
      } else {
        dr.combo = Math.max(1, dr.combo - d * 1.6)
      }

      // walls + pillars: bounce, lose combo
      const hitWall = Math.abs(dr.x) > ARENA - 1 || Math.abs(dr.z) > ARENA - 1
      const hitPillar = PILLARS.some(([px, pz]) => Math.hypot(dr.x - px, dr.z - pz) < 2.1)
      if (hitWall || hitPillar) {
        dr.x = THREE.MathUtils.clamp(dr.x, -(ARENA - 1.2), ARENA - 1.2)
        dr.z = THREE.MathUtils.clamp(dr.z, -(ARENA - 1.2), ARENA - 1.2)
        if (hitPillar) {
          const p = PILLARS.find(([px, pz]) => Math.hypot(dr.x - px, dr.z - pz) < 2.6)!
          const away = Math.atan2(dr.x - p[0], dr.z - p[1])
          dr.x = p[0] + Math.sin(away) * 2.7
          dr.z = p[1] + Math.cos(away) * 2.7
        }
        dr.vx *= -0.45
        dr.vz *= -0.45
        dr.speed *= 0.4
        if (dr.combo > 1.2) sfxFail()
        dr.combo = 1
        dr.bump = 1
      }
      dr.bump = Math.max(0, dr.bump - d * 4)
    }

    if (carRef.current) {
      carRef.current.position.set(dr.x, 0.32, dr.z)
      carRef.current.rotation.y = -dr.heading + Math.PI
    }
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial
      m.color.set(dr.drifting ? '#22d3ee' : '#155e75')
      m.opacity = dr.drifting ? 0.75 : 0.35
    }

    // camera follows loosely, shakes on bump
    const cx = dr.x * 0.55 + (Math.random() - 0.5) * dr.bump * 0.8
    const cz = dr.z * 0.55 + 21 + (Math.random() - 0.5) * dr.bump * 0.8
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cx, 1 - Math.pow(0.005, d))
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cz, 1 - Math.pow(0.005, d))
    camera.lookAt(dr.x * 0.75, 0, dr.z * 0.75)
  })

  return (
    <>
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 44, 110]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[10, 18, 6]} intensity={0.9} color="#bae6fd" />

      {/* arena floor */}
      <gridHelper args={[ARENA * 2, 26, '#164e63', '#0b2530']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[ARENA * 2, ARENA * 2]} />
        <meshStandardMaterial color="#071019" roughness={0.85} />
      </mesh>

      {/* neon boundary */}
      {[
        [0, -ARENA, 0], [0, ARENA, 0], [-ARENA, 0, Math.PI / 2], [ARENA, 0, Math.PI / 2],
      ].map(([x, z, rot], i) => (
        <mesh key={i} position={[x as number, 0.9, z as number]} rotation={[0, rot as number, 0]}>
          <boxGeometry args={[ARENA * 2, 1.8, 0.3]} />
          <meshBasicMaterial color="#0e7490" toneMapped={false} transparent opacity={0.55} />
        </mesh>
      ))}

      {/* pillars */}
      {PILLARS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 3.2, 20]} />
            <meshStandardMaterial color="#0b1622" roughness={0.4} metalness={0.5} emissive="#22d3ee" emissiveIntensity={0.12} />
          </mesh>
          <mesh position={[0, 3.3, 0]}>
            <torusGeometry args={[1.5, 0.06, 8, 40]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* the car + two painting trails */}
      <group ref={carRef}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.1, 0.42, 2.2]} />
          <meshStandardMaterial color="#0b0c10" roughness={0.3} metalness={0.7} emissive="#22d3ee" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.52, -0.15]}>
          <boxGeometry args={[0.92, 0.34, 1.05]} />
          <meshStandardMaterial color="#101318" roughness={0.2} metalness={0.6} />
        </mesh>
        {/* taillights */}
        <mesh position={[0, 0.3, 1.11]}>
          <boxGeometry args={[0.95, 0.09, 0.03]} />
          <meshBasicMaterial color="#f43f5e" toneMapped={false} />
        </mesh>
        {/* underglow */}
        <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
          <planeGeometry args={[1.9, 3]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} toneMapped={false} />
        </mesh>
        <Trail width={1.4} length={7} color="#22d3ee" attenuation={(w) => w * w}>
          <mesh ref={wheelL} position={[-0.5, 0.05, 0.95]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </Trail>
        <Trail width={1.4} length={7} color="#f0abfc" attenuation={(w) => w * w}>
          <mesh ref={wheelR} position={[0.5, 0.05, 0.95]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </Trail>
      </group>
    </>
  )
}

// ── HUD ──────────────────────────────────────────────────────
export function NeonDriftHud({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [points, setPoints] = useState(0)
  const [combo, setCombo] = useState(1)
  const [danger, setDanger] = useState(0.2)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [isBest, setIsBest] = useState(false)

  useEffect(() => {
    resetDrift()
    dr.phase = 'ready'
    ;(window as any).__drift = dr
    const iv = setInterval(() => {
      setPoints(Math.floor(dr.points))
      setCombo(Math.round(dr.combo * 10) / 10)
      setDanger(dr.danger)
      setTimeLeft(Math.ceil(dr.timeLeft))
      setPhase((p) => {
        if (p !== 'over' && dr.phase === 'over') {
          setIsBest(saveBest('drift', Math.floor(dr.points)))
          return 'over'
        }
        return dr.phase
      })
    }, 100)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); dr.steer = -1 }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); dr.steer = 1 }
    }
    const up = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code) && dr.steer === -1) dr.steer = 0
      if (['ArrowRight', 'KeyD'].includes(e.code) && dr.steer === 1) dr.steer = 0
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const start = () => {
    resetDrift()
    dr.phase = 'run'
    setPhase('run')
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* touch steer: hold halves */}
      <div
        className="pointer-events-auto absolute inset-0"
        onPointerDown={(e) => { dr.steer = e.clientX < window.innerWidth / 2 ? -1 : 1 }}
        onPointerUp={() => { dr.steer = 0 }}
        onPointerCancel={() => { dr.steer = 0 }}
      />
      <GameHeader meta={META} score={`${points}`} onExit={onExit} />
      {phase === 'run' && (
        <>
          <div className="absolute left-1/2 top-16 -translate-x-1/2 text-center md:top-20">
            <p className="font-mono text-4xl font-bold tabular-nums text-white/85">{timeLeft}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/35">seconds</p>
          </div>
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border px-5 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.25em] transition-colors"
            style={{
              borderColor: combo > 2.5 ? META.accent : 'rgba(255,255,255,0.15)',
              color: combo > 2.5 ? META.accent : 'rgba(255,255,255,0.4)',
              textShadow: combo > 2.5 ? `0 0 16px ${META.accent}` : undefined,
            }}
          >
            ×{combo.toFixed(1)} combo · {danger > 1.4 ? 'DANGER PAY' : danger > 0.8 ? 'fair rate' : 'tourist rate'}
          </div>
        </>
      )}
      {phase === 'ready' && (
        <div className="pointer-events-auto absolute inset-0">
          <StartOverlay
            meta={META}
            blurb="Throttle is automatic; you own the steering. Sideways is where the points live, and the floor pays by proximity: skim walls and pillars for full rate, because safe little circles in the middle pay pennies. Touching anything resets the combo. Sixty seconds."
            onStart={start}
          />
        </div>
      )}
      {phase === 'over' && (
        <div className="pointer-events-auto absolute inset-0">
          <GameOverPanel
            meta={META}
            score={points}
            isBest={isBest}
            onRetry={start}
            onExit={onExit}
            extra={points > 4200 ? 'Tandem-worthy. The Vento is proud.' : points > 1800 ? 'Respectable angle. More commitment.' : 'That was parking, not drifting.'}
          />
        </div>
      )}
    </div>
  )
}
