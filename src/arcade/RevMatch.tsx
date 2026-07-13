import { useCallback, useEffect, useRef, useState } from 'react'
import { GAMES, saveBest } from './arcade'
import { cars } from '../data/cars'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail, sfxPass } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  REV MATCH: the needle sweeps, the powerband shrinks. Shift
//  inside the band or stall. Pure DOM/SVG, pure adrenaline.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'rev')!
// oldest first: your career in cars. 3 clean shifts per upgrade.
const LADDER = [...cars].sort((a, b) => a.year - b.year)
const SHIFTS_PER_CAR = 3
const carAt = (shifts: number) => LADDER[Math.min(Math.floor(shifts / SHIFTS_PER_CAR), LADDER.length - 1)]
const R = 130
const ARC_START = -220 // degrees
const ARC_END = 40

const degToRad = (d: number) => (d * Math.PI) / 180
const arcPoint = (deg: number, r = R) => ({
  x: 160 + r * Math.cos(degToRad(deg)),
  y: 160 + r * Math.sin(degToRad(deg)),
})
function arcPath(from: number, to: number, r = R) {
  const a = arcPoint(from, r)
  const b = arcPoint(to, r)
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x} ${b.y}`
}

export function RevMatch({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'run' | 'over'>('ready')
  const [shifts, setShifts] = useState(0)
  const [lives, setLives] = useState(3)
  const [zone, setZone] = useState({ from: -80, to: -30 })
  const [isBest, setIsBest] = useState(false)
  const [flash, setFlash] = useState<'hit' | 'miss' | null>(null)
  const needleRef = useRef<SVGLineElement>(null)
  const state = useRef({ angle: ARC_START, dir: 1, speed: 130, raf: 0, zone: { from: -80, to: -30 }, lives: 3, shifts: 0 })

  const newZone = (round: number) => {
    const width = Math.max(14, 50 - round * 3.2)
    const from = ARC_START + 40 + Math.random() * (ARC_END - ARC_START - 80)
    return { from, to: from + width }
  }

  // rAF needle loop lives outside React state for smoothness
  useEffect(() => {
    if (phase !== 'run') return
    let last = performance.now()
    const tick = (t: number) => {
      const dt = (t - last) / 1000
      last = t
      const s = state.current
      s.angle += s.dir * s.speed * dt
      if (s.angle >= ARC_END) {
        s.angle = ARC_END
        s.dir = -1
      }
      if (s.angle <= ARC_START) {
        s.angle = ARC_START
        s.dir = 1
      }
      if (needleRef.current) {
        needleRef.current.setAttribute('transform', `rotate(${s.angle + 90} 160 160)`)
      }
      s.raf = requestAnimationFrame(tick)
    }
    state.current.raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(state.current.raf)
  }, [phase])

  const shift = useCallback(() => {
    const s = state.current
    if (s.angle >= s.zone.from && s.angle <= s.zone.to) {
      s.shifts += 1
      s.speed = Math.min(420, s.speed * 1.09)
      s.zone = newZone(s.shifts)
      setShifts(s.shifts)
      setZone(s.zone)
      setFlash('hit')
      sfxPass()
      beep(200 + s.shifts * 40, 0.05, 'square', 0.03)
    } else {
      s.lives -= 1
      setLives(s.lives)
      setFlash('miss')
      sfxFail()
      if (s.lives <= 0) {
        cancelAnimationFrame(s.raf)
        setIsBest(saveBest('rev', s.shifts))
        setPhase('over')
      }
    }
    setTimeout(() => setFlash(null), 180)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (phase === 'run') shift()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, shift])

  const start = () => {
    state.current = { angle: ARC_START, dir: 1, speed: 130, raf: 0, zone: newZone(0), lives: 3, shifts: 0 }
    setZone(state.current.zone)
    setShifts(0)
    setLives(3)
    setPhase('run')
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[#07080d]"
      onPointerDown={() => phase === 'run' && shift()}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-150"
        style={{
          background:
            flash === 'hit'
              ? 'radial-gradient(circle at 50% 55%, rgba(52,211,153,0.16), transparent 55%)'
              : flash === 'miss'
                ? 'radial-gradient(circle at 50% 55%, rgba(244,63,94,0.2), transparent 55%)'
                : 'radial-gradient(circle at 50% 55%, rgba(240,171,252,0.08), transparent 55%)',
        }}
      />
      <GameHeader meta={META} score={`${shifts}`} onExit={onExit} />

      {/* current machine from Samarth's garage */}
      <div className="absolute left-1/2 top-16 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-2 pr-5 backdrop-blur-sm md:top-20">
        <img
          src={carAt(shifts).image}
          alt={carAt(shifts).name}
          className="h-9 w-14 rounded-full object-cover md:h-10 md:w-16"
        />
        <div className="text-left">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">now driving</p>
          <p className="font-display text-sm font-semibold text-white md:text-base">
            {carAt(shifts).year} {carAt(shifts).name}
          </p>
        </div>
      </div>

      <div className="relative select-none">
        <svg width="320" height="320" viewBox="0 0 320 320" className="max-w-[86vw]">
          {/* dial track */}
          <path d={arcPath(ARC_START, ARC_END)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" strokeLinecap="round" />
          {/* redline segment */}
          <path d={arcPath(10, ARC_END)} fill="none" stroke="rgba(244,63,94,0.5)" strokeWidth="14" strokeLinecap="round" />
          {/* powerband target */}
          <path
            d={arcPath(zone.from, zone.to)}
            fill="none"
            stroke="#f0abfc"
            strokeWidth="18"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 12px rgba(240,171,252,0.8))' }}
          />
          {/* ticks */}
          {Array.from({ length: 9 }, (_, i) => {
            const deg = ARC_START + ((ARC_END - ARC_START) / 8) * i
            const o = arcPoint(deg, R + 22)
            return (
              <text key={i} x={o.x} y={o.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.35)" fontSize="13" fontFamily="monospace">
                {i}
              </text>
            )
          })}
          {/* needle */}
          <line
            ref={needleRef}
            x1="160" y1="160" x2="160" y2="44"
            stroke="#6ee7ff" strokeWidth="4" strokeLinecap="round"
            transform={`rotate(${ARC_START + 90} 160 160)`}
            style={{ filter: 'drop-shadow(0 0 8px rgba(110,231,255,0.9))' }}
          />
          <circle cx="160" cy="160" r="10" fill="#0d1017" stroke="#6ee7ff" strokeWidth="3" />
        </svg>
        <p className="mt-1 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
          {'♥'.repeat(Math.max(0, lives))}
          <span className="text-white/15">{'♥'.repeat(Math.max(0, 3 - lives))}</span>
          <span className="ml-4">×1000 rpm</span>
        </p>
      </div>

      {phase === 'ready' && (
        <StartOverlay meta={META} blurb={`You start in Samarth's first car, the ${LADDER[0].year} ${LADDER[0].name}. Every ${SHIFTS_PER_CAR} clean shifts upgrades you to his next machine. Miss three and you stall wherever you are.`} onStart={start} />
      )}
      {phase === 'over' && (
        <GameOverPanel
          meta={META}
          score={shifts}
          isBest={isBest}
          onRetry={start}
          onExit={onExit}
          extra={`You made it to the ${carAt(Math.max(0, shifts - 1)).year} ${carAt(Math.max(0, shifts - 1)).name}. Samarth's keys go all the way to the ${LADDER[LADDER.length - 1].year} ${LADDER[LADDER.length - 1].name}.`}
        />
      )}
    </div>
  )
}
