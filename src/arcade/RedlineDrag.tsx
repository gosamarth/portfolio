import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GAMES, saveBest, shareScore } from './arcade'
import { GameHeader } from './shared'
import { sfxFail, sfxGo, sfxLight, sfxPass, sfxVictory } from '../trials/trials'
import { cars } from '../data/cars'

// ─────────────────────────────────────────────────────────────
//  REDLINE DRAG v2: one AMG-style cluster owns the whole race.
//  Rev into the green band for launch, then catch the needle in
//  the glowing shift window through four gears. Real cars, real
//  0-100 numbers, and Samarth's ghost in the other lane.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'drag')!

const et100 = (s?: string) => {
  const v = parseFloat((s ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(v) && v > 0 ? v : 12.5
}
const topSpeed = (s?: string) => {
  const v = parseFloat((s ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(v) && v > 60 ? v : 190
}
/** rough quarter-mile from 0-100 time — arcade physics, honest ordering */
const baseQuarter = (car: (typeof cars)[number]) => 8.2 + et100(car.zeroToHundred) * 0.82

type Phase = 'garage' | 'staging' | 'racing' | 'result'
type Car = (typeof cars)[number]

// rpm model
const REDLINE = 8000
const LIMITER = 7400
const IDLE = 1400
const GEAR_START = 2300
const SHIFT_ZONE: [number, number] = [6100, 6900]
const PERFECT_ZONE: [number, number] = [6350, 6750]
const LAUNCH_ZONE: [number, number] = [4900, 6500]
const GHOST_SKILL = 0.22
const GEARS = 4

// dial geometry: -210° (0 rpm) → +30° (8000 rpm)
const rpmToDeg = (rpm: number) => -210 + (rpm / REDLINE) * 240
const degToRad = (d: number) => (d * Math.PI) / 180
const pt = (deg: number, r: number, c = 190) => ({ x: c + r * Math.cos(degToRad(deg)), y: c + r * Math.sin(degToRad(deg)) })
const arc = (fromRpm: number, toRpm: number, r: number) => {
  const a = pt(rpmToDeg(fromRpm), r)
  const b = pt(rpmToDeg(toRpm), r)
  const large = rpmToDeg(toRpm) - rpmToDeg(fromRpm) > 180 ? 1 : 0
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`
}

export function RedlineDrag({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('garage')
  const [car, setCar] = useState<Car>(cars[0])
  const [lights, setLights] = useState(0)
  const [gear, setGear] = useState(0)
  const [speedKmh, setSpeedKmh] = useState(0)
  const [flash, setFlash] = useState<{ kind: 'perfect' | 'good' | 'early' | 'limiter' | 'launch-ok' | 'launch-bad'; text: string } | null>(null)
  const [delta, setDelta] = useState(0) // accumulated penalties (negative = time gained)
  const [result, setResult] = useState<{ you: number; ghost: number; best: boolean } | null>(null)
  const [copied, setCopied] = useState(false)
  const needle = useRef<SVGGElement>(null)

  const S = useRef({
    phase: 'garage' as Phase,
    holding: false,
    rpm: IDLE,
    penalties: 0,
    gear: 0,
    raf: 0,
    timers: [] as number[],
    base: 14,
    top: 190,
    finished: false,
  })
  S.current.phase = phase

  const clearAll = useCallback(() => {
    S.current.timers.forEach(clearTimeout)
    S.current.timers = []
    cancelAnimationFrame(S.current.raf)
  }, [])
  useEffect(() => clearAll, [clearAll])

  const setNeedle = (rpm: number) => {
    needle.current?.setAttribute('transform', `rotate(${rpmToDeg(rpm) + 90} 190 190)`)
  }
  const popFlash = (kind: NonNullable<typeof flash>['kind'], text: string) => {
    setFlash({ kind, text })
    window.setTimeout(() => setFlash(null), 950)
  }

  // ── STAGING: lights count down while you hold the revs ────
  const stage = (chosen: Car) => {
    clearAll()
    setCar(chosen)
    setPhase('staging')
    setLights(0)
    setGear(0)
    setDelta(0)
    setSpeedKmh(0)
    setResult(null)
    const s = S.current
    s.rpm = IDLE
    s.penalties = 0
    s.gear = 0
    s.finished = false
    s.base = baseQuarter(chosen)
    s.top = topSpeed(chosen.topSpeed)

    for (let i = 1; i <= 5; i++) {
      s.timers.push(window.setTimeout(() => { setLights(i); sfxLight() }, i * 600))
    }
    s.timers.push(
      window.setTimeout(() => {
        setLights(0)
        sfxGo()
        beginRace()
      }, 5 * 600 + 400 + Math.random() * 900),
    )

    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      if (S.current.phase === 'staging') {
        s.rpm = Math.max(IDLE, Math.min(REDLINE, s.rpm + (s.holding ? 5200 : -4300) * dt))
        setNeedle(s.rpm)
        s.raf = requestAnimationFrame(tick)
      }
    }
    s.raf = requestAnimationFrame(tick)
  }

  // ── LAUNCH JUDGEMENT + RACE ────────────────────────────────
  const beginRace = () => {
    const s = S.current
    cancelAnimationFrame(s.raf)
    if (s.rpm >= LAUNCH_ZONE[0] && s.rpm <= LAUNCH_ZONE[1]) {
      popFlash('launch-ok', 'PERFECT LAUNCH')
      sfxPass()
    } else if (s.rpm > LAUNCH_ZONE[1]) {
      s.penalties += 0.45
      popFlash('launch-bad', 'WHEELSPIN +0.45s')
      sfxFail()
    } else {
      s.penalties += 0.6
      popFlash('launch-bad', 'BOGGED +0.60s')
      sfxFail()
    }
    setDelta(s.penalties)
    setPhase('racing')
    s.gear = 1
    s.rpm = GEAR_START
    setGear(1)

    // needle sweep rate: the whole race takes about the car's real time
    const sweepSecs = s.base / (GEARS + 0.8)
    const rate = (LIMITER - GEAR_START) / sweepSecs

    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      if (S.current.phase !== 'racing' || s.finished) return
      s.rpm += rate * dt
      if (s.gear === GEARS && s.rpm >= 7050) {
        crossLine()
        return
      }
      if (s.rpm >= LIMITER) {
        // limiter: bounce, auto-shift, pay for it
        s.penalties += 0.3
        setDelta(s.penalties)
        popFlash('limiter', 'LIMITER +0.30s')
        sfxFail()
        s.gear += 1
        setGear(s.gear)
        s.rpm = GEAR_START
      }
      setNeedle(s.rpm)
      const frac = (s.gear - 1 + (s.rpm - GEAR_START) / (LIMITER - GEAR_START)) / GEARS
      setSpeedKmh(Math.round(Math.max(0, frac) * s.top * 0.92))
      s.raf = requestAnimationFrame(tick)
    }
    s.raf = requestAnimationFrame(tick)
  }

  const crossLine = () => {
    const s = S.current
    if (s.finished) return
    s.finished = true
    clearAll()
    const you = s.base + s.penalties
    const ghost = s.base - GHOST_SKILL
    const best = saveBest('drag', Math.round(you * 1000), true)
    setResult({ you, ghost, best })
    setPhase('result')
    if (you <= ghost) sfxVictory()
  }

  // ── INPUT: hold = revs · tap = shift ───────────────────────
  const press = useCallback(() => {
    const s = S.current
    if (s.phase === 'staging') {
      s.holding = true
      return
    }
    if (s.phase === 'racing' && !s.finished) {
      if (s.gear >= GEARS) return // top gear: ride it to the line
      const r = s.rpm
      if (r >= PERFECT_ZONE[0] && r <= PERFECT_ZONE[1]) {
        s.penalties -= 0.15
        popFlash('perfect', '★ PERFECT SHIFT −0.15s')
        sfxPass()
      } else if (r >= SHIFT_ZONE[0] && r <= SHIFT_ZONE[1]) {
        s.penalties -= 0.05
        popFlash('good', 'GOOD SHIFT −0.05s')
      } else {
        s.penalties += 0.25
        popFlash('early', 'SHORT SHIFT +0.25s')
        sfxFail()
      }
      setDelta(s.penalties)
      s.gear += 1
      setGear(s.gear)
      s.rpm = GEAR_START
      setNeedle(s.rpm)
    }
  }, [])
  const release = useCallback(() => {
    S.current.holding = false
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!e.repeat) press()
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') release()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [press, release])

  const share = async () => {
    if (!result) return
    const won = result.you <= result.ghost
    const r = await shareScore(
      `⟫ Redline Drag: ${result.you.toFixed(2)}s in Samarth's ${car.year} ${car.name}. ${
        won ? "Took the owner's ghost." : `His ghost ran ${result.ghost.toFixed(2)}s. Rematch pending.`
      }`,
    )
    if (r === 'copied') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  const vsGhost = delta + GHOST_SKILL // projected gap to the ghost right now

  return (
    <div
      className="fixed inset-0 z-30 overflow-y-auto bg-[#0b0709]"
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 110%, ${META.accent}12, transparent 60%)` }}
      />
      <GameHeader meta={META} score={phase === 'racing' ? `G${Math.min(gear, GEARS)}` : ''} onExit={onExit} />

      {/* ── GARAGE PICK ───────────────────────────────────── */}
      {phase === 'garage' && (
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-20">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: META.accent }}>
            Choose your machine
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-2 font-display text-4xl font-bold uppercase text-white md:text-6xl">
            Redline Drag
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-2 max-w-lg text-sm text-white/55">
            One cluster, one lane, Samarth's ghost. Hold to stage your revs in the green band, then
            catch the needle in the glowing window on every shift. Real cars, real numbers: faster
            metal is simply faster.
          </motion.p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {cars.map((c, i) => (
              <motion.button
                key={c.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06 }}
                whileHover={{ y: -5 }}
                onClick={(e) => { e.stopPropagation(); stage(c) }}
                className="group overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] text-left transition-colors hover:border-white/35"
              >
                <div className="h-20 overflow-hidden md:h-24">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-3">
                  <p className="font-display text-sm font-bold leading-tight text-white">{c.year} {c.name}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                    0-100 {c.zeroToHundred ?? 'classified'} · {c.power ?? '—'}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: META.accent }}>
                    stage it →
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── THE CLUSTER ───────────────────────────────────── */}
      {(phase === 'staging' || phase === 'racing') && (
        <div className="relative flex min-h-full select-none flex-col items-center justify-center px-4 py-20">
          {/* car plate */}
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-2 pr-5">
            <img src={car.image} alt="" className="h-8 w-14 rounded-full object-cover" />
            <span className="font-display text-sm font-semibold text-white">{car.year} {car.name}</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-white/40 sm:inline">ghost {(S.current.base - GHOST_SKILL).toFixed(2)}s</span>
          </div>

          {/* christmas tree */}
          <div className="mt-5 flex gap-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-7 w-7 rounded-full border-2 transition-all duration-150 md:h-9 md:w-9 ${
                  phase === 'staging' && lights >= i
                    ? 'border-amber-300 bg-amber-400 shadow-[0_0_26px_rgba(251,191,36,0.85)]'
                    : 'border-white/15 bg-white/[0.04]'
                }`}
              />
            ))}
          </div>

          {/* AMG cluster */}
          <div className="relative mt-5">
            <svg width="380" height="380" viewBox="0 0 380 380" className="max-w-[92vw]">
              <circle cx="190" cy="190" r="176" fill="#0d0e12" stroke="#23242c" strokeWidth="8" />
              <circle cx="190" cy="190" r="168" fill="none" stroke="#000" strokeWidth="2" />
              <circle cx="190" cy="190" r="164" fill="url(#face)" />
              <defs>
                <radialGradient id="face" cx="50%" cy="42%" r="70%">
                  <stop offset="0%" stopColor="#17181f" />
                  <stop offset="100%" stopColor="#0a0b0f" />
                </radialGradient>
              </defs>

              {/* redline */}
              <path d={arc(6900, REDLINE, 148)} fill="none" stroke="#e11d48" strokeWidth="12" strokeLinecap="round" opacity="0.85" />
              {/* staging launch band / racing shift window */}
              {phase === 'staging' ? (
                <path d={arc(LAUNCH_ZONE[0], LAUNCH_ZONE[1], 148)} fill="none" stroke="#34d399" strokeWidth="12" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 10px rgba(52,211,153,0.9))' }} />
              ) : (
                <>
                  <path d={arc(SHIFT_ZONE[0], SHIFT_ZONE[1], 148)} fill="none" stroke="#6ee7ff" strokeWidth="12" strokeLinecap="round" opacity="0.5" />
                  <path d={arc(PERFECT_ZONE[0], PERFECT_ZONE[1], 148)} fill="none" stroke="#6ee7ff" strokeWidth="12" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 12px rgba(110,231,255,0.95))' }} />
                </>
              )}

              {/* ticks + numerals */}
              {Array.from({ length: 17 }, (_, i) => {
                const rpm = i * 500
                const major = i % 2 === 0
                const a = pt(rpmToDeg(rpm), major ? 132 : 138)
                const b = pt(rpmToDeg(rpm), 152)
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={rpm >= 6900 ? '#e11d48' : '#8b8fa0'} strokeWidth={major ? 3 : 1.5} />
              })}
              {Array.from({ length: 9 }, (_, i) => {
                const o = pt(rpmToDeg(i * 1000), 112)
                return (
                  <text key={i} x={o.x} y={o.y} textAnchor="middle" dominantBaseline="middle" fill={i >= 7 ? '#e11d48' : '#c8cad4'} fontSize="19" fontFamily="'Space Grotesk', sans-serif" fontWeight="700">
                    {i}
                  </text>
                )
              })}
              <text x="190" y="118" textAnchor="middle" fill="#6b6e7c" fontSize="10" fontFamily="monospace" letterSpacing="3">
                ×1000 RPM
              </text>

              {/* needle */}
              <g ref={needle} transform={`rotate(${rpmToDeg(IDLE) + 90} 190 190)`}>
                <line x1="190" y1="212" x2="190" y2="62" stroke="#f8fafc" strokeWidth="4.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(248,250,252,0.7))' }} />
                <line x1="190" y1="92" x2="190" y2="62" stroke="#e11d48" strokeWidth="4.5" strokeLinecap="round" />
              </g>
              <circle cx="190" cy="190" r="16" fill="#15161c" stroke="#3f4150" strokeWidth="3" />

              {/* digital panel */}
              <rect x="130" y="238" width="120" height="66" rx="10" fill="#07080c" stroke="#23242c" strokeWidth="2" />
              <text x="190" y="268" textAnchor="middle" fill="#f8fafc" fontSize="30" fontFamily="monospace" fontWeight="700">
                {phase === 'racing' ? speedKmh : 0}
              </text>
              <text x="190" y="288" textAnchor="middle" fill="#6b6e7c" fontSize="10" fontFamily="monospace" letterSpacing="2">
                KM/H · {phase === 'racing' ? `GEAR ${Math.min(gear, GEARS)}` : 'STAGED'}
              </text>
            </svg>

            <AnimatePresence>
              {flash && (
                <motion.p
                  key={flash.text}
                  initial={{ opacity: 0, y: 14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute left-1/2 top-[27%] -translate-x-1/2 whitespace-nowrap font-display text-xl font-bold uppercase md:text-2xl ${
                    flash.kind === 'perfect' || flash.kind === 'launch-ok'
                      ? 'text-emerald-300'
                      : flash.kind === 'good' ? 'text-cyan-300' : 'text-rose-400'
                  }`}
                  style={{ textShadow: '0 0 24px currentColor' }}
                >
                  {flash.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* hint + live gap */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.3em]">
            <span className="text-white/40">{phase === 'staging' ? 'hold to rev · release to drop' : 'tap / space inside the glow to shift'}</span>
            {phase === 'racing' && (
              <span className={vsGhost <= 0 ? 'font-bold text-emerald-300' : 'text-rose-400'}>
                vs ghost {vsGhost <= 0 ? '−' : '+'}{Math.abs(vsGhost).toFixed(2)}s
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── RESULT SLIP ───────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'result' && result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/60 px-6 text-center backdrop-blur-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/45">
              {car.year} {car.name} · quarter mile
            </p>
            <p className="mt-4 font-display text-7xl font-bold tabular-nums text-white md:text-8xl" style={{ textShadow: `0 0 44px ${META.accent}66` }}>
              {result.you.toFixed(2)}<span className="text-3xl text-white/40">s</span>
            </p>
            <p className={`mt-3 font-display text-xl font-bold uppercase md:text-2xl ${result.you <= result.ghost ? 'text-emerald-300' : 'text-rose-400'}`}>
              {result.you <= result.ghost
                ? `You took Samarth's ghost by ${(result.ghost - result.you).toFixed(2)}s`
                : `Samarth's ghost wins by ${(result.you - result.ghost).toFixed(2)}s`}
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-white/40">ghost: {result.ghost.toFixed(2)}s</p>
            {result.best && (
              <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.3em]" style={{ color: META.accent }}>
                ★ new personal best
              </motion.p>
            )}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); stage(car) }} className="rounded-full px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-ink" style={{ background: META.accent }}>
                Rematch →
              </button>
              <button onClick={(e) => { e.stopPropagation(); setPhase('garage') }} className="rounded-full border-2 border-white/25 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-white/70 hover:text-white">
                Change car
              </button>
              <button onClick={(e) => { e.stopPropagation(); void share() }} className="rounded-full border-2 border-white/25 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-white/70 hover:text-white">
                {copied ? 'Copied. go brag' : 'Share slip'}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onExit() }} className="rounded-full border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45 hover:text-white">
                cabinets
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
