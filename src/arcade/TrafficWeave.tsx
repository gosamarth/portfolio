import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  TRAFFIC WEAVE: Samarth's C300 through midnight traffic.
//  Four lanes, sodium lights, and a near-miss economy: the
//  closer the pass, the fatter the bonus.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'weave')!

type Phase = 'ready' | 'run' | 'over'
type Traffic = { z: number; lane: number; speed: number; hue: number; missed: boolean }

const LANE_X = [-3.4, -1.15, 1.15, 3.4]

const tw = {
  phase: 'ready' as Phase,
  meters: 0,
  speed: 22,
  lane: 1,
  px: LANE_X[1],
  nearMisses: 0,
  combo: 0,
  flash: 0,
  traffic: [] as Traffic[],
  epoch: 0,
}

function spawnCar(z: number): Traffic {
  return {
    z,
    lane: Math.floor(Math.random() * 4),
    speed: 9 + Math.random() * 6,
    hue: [0, 210, 45, 280, 160][Math.floor(Math.random() * 5)],
    missed: false,
  }
}

function resetWeave() {
  tw.meters = 0
  tw.speed = 22
  tw.lane = 1
  tw.px = LANE_X[1]
  tw.nearMisses = 0
  tw.combo = 0
  tw.flash = 0
  tw.traffic = Array.from({ length: 10 }, (_, i) => spawnCar(-50 - i * 16 - Math.random() * 8))
  tw.epoch++
}

export const weaveScore = () => Math.floor(tw.meters + tw.nearMisses * 50)

/** A simple midnight sedan; the player one wears C300 colours + underglow. */
function Sedan({ body, player = false }: { body: string; player?: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[1.32, 0.5, 2.9]} />
        <meshStandardMaterial color={body} roughness={0.25} metalness={0.75} />
      </mesh>
      <mesh position={[0, 0.72, -0.1]}>
        <boxGeometry args={[1.1, 0.4, 1.5]} />
        <meshStandardMaterial color={body} roughness={0.2} metalness={0.6} />
      </mesh>
      {/* taillights / headlights */}
      <mesh position={[0, 0.42, 1.47]}>
        <boxGeometry args={[1.15, 0.1, 0.03]} />
        <meshBasicMaterial color={player ? '#f43f5e' : '#ef4444'} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.4, -1.47]}>
        <boxGeometry args={[1.15, 0.09, 0.03]} />
        <meshBasicMaterial color="#fef3c7" toneMapped={false} />
      </mesh>
      {player && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[2, 3.6]} />
            <meshBasicMaterial color="#6ee7ff" transparent opacity={0.5} toneMapped={false} />
          </mesh>
          {/* beltline accents so the silhouette reads at night */}
          {[-0.67, 0.67].map((x) => (
            <mesh key={x} position={[x, 0.45, 0]}>
              <boxGeometry args={[0.02, 0.05, 2.7]} />
              <meshBasicMaterial color="#6ee7ff" toneMapped={false} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

export function TrafficWeaveScene() {
  const { camera } = useThree()
  const player = useRef<THREE.Group>(null)
  const trafficRefs = useRef<THREE.Group[]>([])
  const dashes = useRef<THREE.InstancedMesh>(null)
  const lamps = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef(new THREE.Object3D())

  useEffect(() => {
    camera.position.set(0, 3.4, 7.5)
    camera.lookAt(0, 0.8, -14)
  }, [camera])

  useFrame(({ clock }, delta) => {
    const d = Math.min(delta, 0.05)
    const t = clock.elapsedTime

    if (tw.phase === 'run') {
      tw.speed = Math.min(58, tw.speed + d * 1.3)
      tw.meters += tw.speed * d
      tw.combo = Math.max(0, tw.combo - d * 0.35)
    }
    tw.flash = Math.max(0, tw.flash - d * 3)

    // player glides to lane
    tw.px = THREE.MathUtils.lerp(tw.px, LANE_X[tw.lane], 1 - Math.pow(0.0002, d))
    if (player.current) {
      player.current.position.set(tw.px, 0, 0)
      player.current.rotation.z = THREE.MathUtils.lerp(player.current.rotation.z, (LANE_X[tw.lane] - tw.px) * 0.1, 0.2)
      player.current.rotation.y = Math.PI // tail toward camera
    }

    // traffic flows toward player (they're slower, so they approach)
    tw.traffic.forEach((c, i) => {
      if (tw.phase === 'run') c.z += (tw.speed - c.speed) * d
      if (c.z > 12) Object.assign(c, spawnCar(c.z - 170 - Math.random() * 20))
      const grp = trafficRefs.current[i]
      if (grp) {
        grp.position.set(LANE_X[c.lane], 0, c.z)
        grp.rotation.y = Math.PI
      }
      if (tw.phase === 'run' && c.z > -1.9 && c.z < 1.9) {
        const dx = Math.abs(LANE_X[c.lane] - tw.px)
        if (dx < 1.5) {
          tw.phase = 'over'
          sfxFail()
        } else if (!c.missed && dx < 2.75) {
          // a proper close pass
          c.missed = true
          tw.nearMisses += 1
          tw.combo = Math.min(5, tw.combo + 1)
          tw.flash = 1
          beep(880 + tw.combo * 60, 0.07, 'triangle', 0.045)
        }
      }
    })

    // lane dashes + sodium lamps scroll
    if (dashes.current) {
      for (let i = 0; i < 45; i++) {
        const lane = i % 3
        const z = ((i * 8 + tw.meters * 1.0) % 160) - 150
        dummy.current.position.set([-2.28, 0, 2.28][lane], 0.02, z)
        dummy.current.scale.set(0.09, 0.02, 2.2)
        dummy.current.updateMatrix()
        dashes.current.setMatrixAt(i, dummy.current.matrix)
      }
      dashes.current.instanceMatrix.needsUpdate = true
    }
    if (lamps.current) {
      for (let i = 0; i < 24; i++) {
        const side = i % 2 === 0 ? -1 : 1
        const z = ((i * 14 + tw.meters * 1.0) % 170) - 160
        dummy.current.position.set(side * 6.2, 3.4, z)
        dummy.current.scale.set(0.12, 6.8, 0.12)
        dummy.current.updateMatrix()
        lamps.current.setMatrixAt(i, dummy.current.matrix)
      }
      lamps.current.instanceMatrix.needsUpdate = true
    }

    // camera hugs the action; flash pulls it closer for a beat
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tw.px * 0.55, 1 - Math.pow(0.004, d))
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.5 - tw.flash * 0.7, 0.1)
    camera.lookAt(tw.px * 0.7, 0.8, -14 + Math.sin(t * 0.7) * 0.4)
  })

  return (
    <>
      <color attach="background" args={['#07070c']} />
      <fog attach="fog" args={['#07070c', 30, 130]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 12, 4]} intensity={0.55} color="#ffd9a0" />
      <pointLight position={[0, 5, 2]} intensity={18} color="#ffb35c" />

      {/* asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -70]}>
        <planeGeometry args={[11.4, 260]} />
        <meshStandardMaterial color="#101014" roughness={0.9} />
      </mesh>
      {/* shoulders */}
      {[-5.9, 5.9].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.03, -70]}>
          <planeGeometry args={[0.4, 260]} />
          <meshBasicMaterial color="#f59e0b" toneMapped={false} transparent opacity={0.5} />
        </mesh>
      ))}
      <instancedMesh ref={dashes} args={[undefined, undefined, 45]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#d4d4d8" toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={lamps} args={[undefined, undefined, 24]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#3a2c16" toneMapped={false} />
      </instancedMesh>

      {/* Samarth's C300, lit like the hero it is */}
      <spotLight position={[0, 7, 3]} angle={0.5} penumbra={0.6} intensity={90} color="#dbeafe" target-position={[0, 0, 0]} />
      <group ref={player}>
        <Sedan body="#39414f" player />
      </group>

      {/* traffic pool */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={`${tw.epoch}-${i}`} ref={(el) => { if (el) trafficRefs.current[i] = el }}>
          <TrafficSedan index={i} />
        </group>
      ))}
    </>
  )
}

function TrafficSedan({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    const c = tw.traffic[index]
    if (ref.current && c) {
      ;(ref.current.material as THREE.MeshStandardMaterial).color.set(`hsl(${c.hue}, 38%, 42%)`)
    }
  })
  return (
    <group>
      <mesh ref={ref} position={[0, 0.34, 0]}>
        <boxGeometry args={[1.32, 0.5, 2.9]} />
        <meshStandardMaterial color="#2a2f3a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.72, -0.1]}>
        <boxGeometry args={[1.1, 0.4, 1.5]} />
        <meshStandardMaterial color="#20242e" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.42, 1.47]}>
        <boxGeometry args={[1.15, 0.1, 0.03]} />
        <meshBasicMaterial color="#ef4444" toneMapped={false} />
      </mesh>
    </group>
  )
}

// ── HUD ──────────────────────────────────────────────────────
export function TrafficWeaveHud({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [flash, setFlash] = useState(false)
  const [isBest, setIsBest] = useState(false)

  useEffect(() => {
    resetWeave()
    tw.phase = 'ready'
    ;(window as any).__weave = tw
    const iv = setInterval(() => {
      setScore(weaveScore())
      setMisses(tw.nearMisses)
      setFlash(tw.flash > 0.4)
      setPhase((p) => {
        if (p !== 'over' && tw.phase === 'over') {
          setIsBest(saveBest('weave', weaveScore()))
          return 'over'
        }
        return tw.phase
      })
    }, 90)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (tw.phase !== 'run') return
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        tw.lane = Math.max(0, tw.lane - 1)
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        tw.lane = Math.min(3, tw.lane + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const start = () => {
    resetWeave()
    tw.phase = 'run'
    setPhase('run')
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div
        className="pointer-events-auto absolute inset-0"
        onPointerDown={(e) => {
          if (tw.phase !== 'run') return
          if (e.clientX < window.innerWidth / 2) tw.lane = Math.max(0, tw.lane - 1)
          else tw.lane = Math.min(3, tw.lane + 1)
        }}
      />
      <GameHeader meta={META} score={`${score}m`} onExit={onExit} />
      {phase === 'run' && (
        <>
          {flash && (
            <p
              className="absolute left-1/2 top-1/3 -translate-x-1/2 font-display text-3xl font-bold uppercase italic md:text-5xl"
              style={{ color: META.accent, textShadow: `0 0 30px ${META.accent}` }}
            >
              CLOSE!
            </p>
          )}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
            near misses {misses} · +50m each
          </p>
        </>
      )}
      {phase === 'ready' && (
        <div className="pointer-events-auto absolute inset-0">
          <StartOverlay
            meta={META}
            blurb="Midnight, four lanes, Samarth's C300. Traffic is slower than you and it does not care. Slice past a bumper for +50m near-miss money; touch one and the run is a police report."
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
            extra={misses >= 12 ? `${misses} near misses. The insurance premium is a rounding error.` : misses >= 5 ? `${misses} near misses. Getting brave.` : 'Safe driving. Wrong game.'}
          />
        </div>
      )}
    </div>
  )
}
