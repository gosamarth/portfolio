import { Text, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail, sfxPass } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  DIRECTOR RUSH: you ARE Samarth. A neon corridor, three lanes,
//  corporate obstacles inbound, golden SHIP-IT coins to grab.
//  His Monday, rendered at 60fps.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'rush')!

type Phase = 'ready' | 'run' | 'over'
type Wall = { z: number; lanes: number[]; label: string }
type Coin = { z: number; lane: number; taken: boolean }

const LANE_X = [-2.3, 0, 2.3]
// blockers escalate the way a real SDLC does: annoyances → drag →
// fires → the problems that need a real leader
const BLOCKER_TIERS: { at: number; labels: string[] }[] = [
  { at: 0, labels: ['DAILY STANDUP', 'EMAIL THREAD', 'MERGE CONFLICT', 'FLAKY TEST', 'SLACK STORM', 'JIRA GROOMING'] },
  { at: 420, labels: ['SCOPE CREEP', 'SYNC MEETING', 'TECH DEBT', 'LEGACY CODE', 'VENDOR CALL', 'EXCEL EXPORT', 'TIMELINE SLIP'] },
  { at: 950, labels: ['P0 INCIDENT', 'RE-ORG', 'BUDGET FREEZE', 'SECURITY AUDIT', 'ATTRITION', 'DEADLINE PULL-IN', 'PROCUREMENT'] },
  { at: 1650, labels: ['CONFLICT RESOLUTION', 'CULTURE DEBT', 'BOARD ESCALATION', 'BURNOUT WAVE', 'VISION PIVOT', 'ACQUISITION RUMOR', 'KEY-PERSON RISK'] },
]
let lastLabel = ''
function pickBlocker(meters: number): string {
  const tierIdx = BLOCKER_TIERS.reduce((acc, t, i) => (meters >= t.at ? i : acc), 0)
  // mostly current tier, sometimes one below for texture
  const useIdx = tierIdx > 0 && Math.random() < 0.28 ? tierIdx - 1 : tierIdx
  const pool = BLOCKER_TIERS[useIdx].labels.filter((l) => l !== lastLabel)
  lastLabel = pool[Math.floor(Math.random() * pool.length)]
  return lastLabel
}
const SPAWN_GAP = 17

const rush = {
  phase: 'ready' as Phase,
  meters: 0,
  coins: 0,
  speed: 16,
  lane: 1, // index into LANE_X
  px: 0,
  walls: [] as Wall[],
  coinArr: [] as Coin[],
  crashLabel: '',
  epoch: 0,
}

function spawnRow(z: number): { wall: Wall; coin: Coin | null } {
  // block 1 or 2 lanes, always leave an escape
  const blocked = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, Math.random() < 0.4 ? 2 : 1)
  const free = [0, 1, 2].filter((l) => !blocked.includes(l))
  const coinLane = free[Math.floor(Math.random() * free.length)]
  return {
    wall: { z, lanes: blocked, label: pickBlocker(rush.meters) },
    coin: Math.random() < 0.75 ? { z: z - SPAWN_GAP / 2, lane: coinLane, taken: false } : null,
  }
}

function resetRush() {
  rush.meters = 0
  rush.coins = 0
  rush.speed = 16
  rush.lane = 1
  rush.px = 0
  rush.walls = []
  rush.coinArr = []
  rush.crashLabel = ''
  for (let i = 0; i < 9; i++) {
    const { wall, coin } = spawnRow(-46 - i * SPAWN_GAP)
    rush.walls.push(wall)
    if (coin) rush.coinArr.push(coin)
  }
  rush.epoch++
}

export const rushScore = () => Math.floor(rush.meters + rush.coins * 25)

// ── the scene ────────────────────────────────────────────────
export function DirectorRushScene() {
  const { camera } = useThree()
  const portrait = useTexture('/me/portrait.jpg')
  const avatar = useRef<THREE.Group>(null)
  const head = useRef<THREE.Mesh>(null)
  const wallRefs = useRef<THREE.Group[]>([])
  const coinRefs = useRef<THREE.Mesh[]>([])
  const pillars = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef(new THREE.Object3D())

  useEffect(() => {
    camera.position.set(0, 2.6, 7)
    camera.lookAt(0, 1.2, -12)
  }, [camera])

  useFrame(({ clock }, delta) => {
    const d = Math.min(delta, 0.05)
    const t = clock.elapsedTime

    if (rush.phase === 'run') {
      rush.speed = Math.min(46, rush.speed + d * 1.1)
      rush.meters += rush.speed * d
    }

    // avatar glides to its lane, bobs like a run, leans into the switch
    const targetX = LANE_X[rush.lane]
    rush.px = THREE.MathUtils.lerp(rush.px, targetX, 1 - Math.pow(0.0002, d))
    if (avatar.current) {
      avatar.current.position.x = rush.px
      avatar.current.position.y = rush.phase === 'run' ? Math.abs(Math.sin(t * 9)) * 0.14 : 0
      avatar.current.rotation.z = THREE.MathUtils.lerp(avatar.current.rotation.z, (targetX - rush.px) * 0.18, 0.2)
    }
    if (head.current) head.current.rotation.y = Math.sin(t * 2.2) * 0.08

    // advance walls
    rush.walls.forEach((w, i) => {
      if (rush.phase === 'run') w.z += rush.speed * d
      if (w.z > 10) {
        const { wall, coin } = spawnRow(w.z - 9 * SPAWN_GAP)
        rush.walls[i] = wall
        if (coin) {
          const idle = rush.coinArr.find((c) => c.taken && c.z > 10)
          if (idle) Object.assign(idle, coin)
          else rush.coinArr.push(coin)
        }
      }
      const grp = wallRefs.current[i]
      if (grp) grp.position.z = rush.walls[i].z
      // collision
      const wNow = rush.walls[i]
      if (rush.phase === 'run' && wNow.z > -0.7 && wNow.z < 0.7 && wNow.lanes.some((l) => Math.abs(LANE_X[l] - rush.px) < 1.15)) {
        rush.phase = 'over'
        rush.crashLabel = wNow.label
        sfxFail()
      }
    })

    // advance + collect coins
    rush.coinArr.forEach((c, i) => {
      if (rush.phase === 'run' && !c.taken) c.z += rush.speed * d
      const mesh = coinRefs.current[i]
      if (mesh) {
        mesh.visible = !c.taken && c.z < 12
        mesh.position.set(LANE_X[c.lane], 1.15 + Math.sin(t * 3 + i) * 0.12, c.z)
        mesh.rotation.y = t * 3.4 + i
      }
      if (rush.phase === 'run' && !c.taken && c.z > -0.8 && c.z < 0.8 && Math.abs(LANE_X[c.lane] - rush.px) < 1.05) {
        c.taken = true
        rush.coins += 1
        sfxPass()
        beep(1200, 0.06, 'triangle', 0.04)
      }
    })

    // neon pillars streaming past
    if (pillars.current) {
      for (let i = 0; i < 40; i++) {
        const side = i % 2 === 0 ? -1 : 1
        const z = ((i * 9 + (rush.phase === 'run' ? rush.meters * 1 : t * 4)) % 180) - 170
        dummy.current.position.set(side * 5.4, 2.4, z)
        dummy.current.scale.set(0.14, 4.8, 0.14)
        dummy.current.updateMatrix()
        pillars.current.setMatrixAt(i, dummy.current.matrix)
      }
      pillars.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <color attach="background" args={['#0a0614']} />
      <fog attach="fog" args={['#0a0614', 28, 120]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 6]} intensity={1.1} color="#e9d5ff" />
      <pointLight position={[0, 3, 3]} intensity={26} color="#c084fc" />

      {/* corridor */}
      <gridHelper args={[400, 90, '#c084fc', '#231436']} position={[0, 0, -140]} />
      <instancedMesh ref={pillars} args={[undefined, undefined, 40]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#7c3aed" toneMapped={false} />
      </instancedMesh>

      {/* SAMARTH: suit, face, hustle */}
      <group ref={avatar}>
        {/* body */}
        <mesh position={[0, 0.78, 0]}>
          <capsuleGeometry args={[0.34, 0.75, 6, 14]} />
          <meshStandardMaterial color="#171923" roughness={0.35} metalness={0.5} emissive="#c084fc" emissiveIntensity={0.12} />
        </mesh>
        {/* tie */}
        <mesh position={[0, 1.05, 0.32]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.09, 0.5, 0.03]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
        {/* the face: the actual Samarth */}
        <mesh ref={head} position={[0, 1.78, 0.05]}>
          <circleGeometry args={[0.42, 40]} />
          <meshBasicMaterial map={portrait} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.78, 0.03]}>
          <ringGeometry args={[0.42, 0.47, 40]} />
          <meshBasicMaterial color="#c084fc" toneMapped={false} />
        </mesh>
        {/* hustle glow underfoot */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.4, 0.72, 32]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.5} toneMapped={false} />
        </mesh>
      </group>

      {/* walls of corporate doom */}
      {Array.from({ length: 9 }, (_, i) => (
        <group key={`${rush.epoch}-w${i}`} ref={(el) => { if (el) wallRefs.current[i] = el }}>
          <WallBlocks index={i} />
        </group>
      ))}

      {/* SHIP IT coins */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={`c${i}`} ref={(el) => { if (el) coinRefs.current[i] = el }} visible={false}>
          <cylinderGeometry args={[0.42, 0.42, 0.09, 24]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
    </>
  )
}

/** The red walls + their labels, synced to rush.walls each frame. */
function WallBlocks({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null)
  const labelRef = useRef<any>(null)
  useFrame(() => {
    const w = rush.walls[index]
    if (!w || !group.current) return
    group.current.children.forEach((child, ci) => {
      if (ci < 3) {
        // one mesh per possible lane
        child.visible = w.lanes.includes(ci)
        child.position.x = LANE_X[ci]
      }
    })
    if (labelRef.current) {
      labelRef.current.position.x = LANE_X[w.lanes[0]]
      if (labelRef.current.text !== w.label) labelRef.current.text = w.label
    }
  })
  return (
    <group ref={group}>
      {[0, 1, 2].map((l) => (
        <mesh key={l} position={[LANE_X[l], 1.15, 0]}>
          <boxGeometry args={[1.95, 2.3, 0.35]} />
          <meshBasicMaterial color="#ff2d5e" transparent opacity={0.34} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
      <Text
        ref={labelRef}
        position={[0, 1.2, 0.3]}
        fontSize={0.29}
        color="#ffd7e2"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        textAlign="center"
      >
        MEETING
      </Text>
    </group>
  )
}

// ── the HUD ──────────────────────────────────────────────────
export function DirectorRushHud({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [crash, setCrash] = useState('')
  const [isBest, setIsBest] = useState(false)

  useEffect(() => {
    resetRush()
    rush.phase = 'ready'
    ;(window as any).__rush = rush // debug/e2e probe
    const iv = setInterval(() => {
      setScore(rushScore())
      setCoins(rush.coins)
      setPhase((p) => {
        if (p !== 'over' && rush.phase === 'over') {
          setCrash(rush.crashLabel)
          setIsBest(saveBest('rush', rushScore()))
          return 'over'
        }
        return rush.phase
      })
    }, 100)
    return () => clearInterval(iv)
  }, [])

  // lane controls: arrows, A/D, tap left/right half
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (rush.phase !== 'run') return
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        rush.lane = Math.max(0, rush.lane - 1)
        beep(500, 0.04, 'square', 0.025)
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        rush.lane = Math.min(2, rush.lane + 1)
        beep(560, 0.04, 'square', 0.025)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const start = () => {
    resetRush()
    rush.phase = 'run'
    setPhase('run')
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div
        className="pointer-events-auto absolute inset-0"
        onPointerDown={(e) => {
          if (rush.phase !== 'run') return
          if (e.clientX < window.innerWidth / 2) rush.lane = Math.max(0, rush.lane - 1)
          else rush.lane = Math.min(2, rush.lane + 1)
        }}
      />
      <GameHeader meta={META} score={`${score}m · ${coins} ⛁`} onExit={onExit} />
      {phase === 'run' && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
          ship-it coins +25m each
        </p>
      )}
      {phase === 'ready' && (
        <div className="pointer-events-auto absolute inset-0">
          <StartOverlay
            meta={META}
            blurb="You are Samarth and the quarter is closing. It starts with standups and merge conflicts; survive long enough and you'll be dodging board escalations and culture debt. Grab every golden SHIP IT coin. Leaders don't jump; they change lanes."
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
            extra={
              crash
                ? score > 2200
                  ? `Taken down by ${crash} after a heroic sprint. Even Samarth loses one to that.`
                  : `${crash} got you. It gets everyone eventually.`
                : undefined
            }
          />
        </div>
      )}
    </div>
  )
}
