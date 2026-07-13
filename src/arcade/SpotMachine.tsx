import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { sfxFail, sfxPass } from '../trials/trials'
import { cars } from '../data/cars'

// ─────────────────────────────────────────────────────────────
//  SPOT THE MACHINE: extreme crops of Samarth's renders. A
//  grille slat, an alloy spoke. Eight rounds; car people flex.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'spot')!
const ROUNDS = 8
const ROUND_SECS = 7

type Phase = 'ready' | 'guess' | 'reveal' | 'over'
type Round = { car: (typeof cars)[number]; options: string[]; origin: string; zoom: number }

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)

function makeRounds(): Round[] {
  return shuffle(cars).slice(0, ROUNDS).map((car) => {
    const others = shuffle(cars.filter((c) => c.slug !== car.slug)).slice(0, 3).map((c) => `${c.year} ${c.name}`)
    return {
      car,
      options: shuffle([`${car.year} ${car.name}`, ...others]),
      // bias crops toward the car body (center-ish band of the render)
      origin: `${25 + Math.random() * 50}% ${38 + Math.random() * 34}%`,
      zoom: 3 + Math.random() * 1.6,
    }
  })
}

export function SpotMachine({ onExit }: { onExit: () => void }) {
  const rounds = useMemo(makeRounds, [])
  const [phase, setPhase] = useState<Phase>('ready')
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECS)
  const [isBest, setIsBest] = useState(false)
  const timer = useRef<number>(0)

  const round = rounds[Math.min(idx, ROUNDS - 1)]
  const answer = `${round.car.year} ${round.car.name}`

  const stopTimer = () => window.clearInterval(timer.current)
  useEffect(() => stopTimer, [])

  const beginRound = (i: number) => {
    setIdx(i)
    setPicked(null)
    setTimeLeft(ROUND_SECS)
    setPhase('guess')
    stopTimer()
    const t0 = performance.now()
    timer.current = window.setInterval(() => {
      const left = ROUND_SECS - (performance.now() - t0) / 1000
      setTimeLeft(Math.max(0, left))
      if (left <= 0) {
        stopTimer()
        setPicked('⏱')
        sfxFail()
        setPhase('reveal')
      }
    }, 90)
  }

  const pick = (opt: string) => {
    if (phase !== 'guess') return
    stopTimer()
    setPicked(opt)
    if (opt === answer) {
      setScore((s) => s + 1)
      sfxPass()
    } else {
      sfxFail()
    }
    setPhase('reveal')
  }

  const next = () => {
    if (idx + 1 >= ROUNDS) {
      const final = score
      setIsBest(saveBest('spot', final))
      setPhase('over')
    } else {
      beginRound(idx + 1)
    }
  }

  // auto-advance from reveal
  useEffect(() => {
    if (phase !== 'reveal') return
    const t = setTimeout(next, 1900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const start = () => {
    setScore(0)
    beginRound(0)
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0d07] px-6">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% 20%, ${META.accent}10, transparent 60%)` }}
      />
      <GameHeader meta={META} score={`${score}/${ROUNDS}`} onExit={onExit} />

      {(phase === 'guess' || phase === 'reveal') && (
        <div className="flex w-full max-w-xl flex-col items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/35">
            machine {idx + 1} / {ROUNDS}
          </p>

          {/* the crop viewer */}
          <div className="relative mt-4 aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border-2 border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <motion.img
              key={`${idx}-${phase === 'reveal' ? 'r' : 'g'}`}
              src={round.car.image}
              alt="mystery machine"
              className="h-full w-full object-cover"
              style={{ transformOrigin: round.origin }}
              initial={{ scale: phase === 'guess' ? round.zoom * 1.18 : round.zoom }}
              animate={{ scale: phase === 'guess' ? round.zoom : 1 }}
              transition={phase === 'guess' ? { duration: ROUND_SECS, ease: 'linear' } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* scanline sheen */}
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)' }} />
            {/* round timer ring */}
            {phase === 'guess' && (
              <svg className="absolute right-3 top-3 h-11 w-11 -rotate-90">
                <circle cx="22" cy="22" r="18" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke={timeLeft < 2.5 ? '#f43f5e' : META.accent}
                  strokeWidth="3"
                  strokeDasharray={`${(timeLeft / ROUND_SECS) * 113} 113`}
                  strokeLinecap="round"
                />
                <text x="22" y="-16" transform="rotate(90)" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="monospace">
                  {Math.ceil(timeLeft)}
                </text>
              </svg>
            )}
            {phase === 'reveal' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-3 pt-8"
              >
                <p className={`font-display text-lg font-bold ${picked === answer ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {picked === answer ? '✓ ' : picked === '⏱' ? '⏱ ' : '✗ '}
                  {answer}
                </p>
              </motion.div>
            )}
          </div>

          {/* options */}
          <div className="mt-4 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
            {round.options.map((opt) => {
              const state =
                phase === 'reveal'
                  ? opt === answer ? 'right' : opt === picked ? 'wrong' : 'idle'
                  : 'idle'
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  disabled={phase !== 'guess'}
                  className={`rounded-xl border px-4 py-3 text-left font-mono text-sm transition-all duration-200 ${
                    state === 'right'
                      ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200'
                      : state === 'wrong'
                        ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                        : 'border-white/15 bg-white/[0.04] text-white/75 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {phase === 'ready' && (
          <StartOverlay
            meta={META}
            blurb={`Eight extreme close-ups from Samarth's garage renders. ${ROUND_SECS} seconds each while the crop slowly zooms out. Real ones need one alloy spoke.`}
            onStart={start}
          />
        )}
      </AnimatePresence>
      {phase === 'over' && (
        <GameOverPanel
          meta={META}
          score={score}
          isBest={isBest}
          onRetry={start}
          onExit={onExit}
          extra={
            score === ROUNDS ? 'Concours judge. Samarth would hand you the keys.'
            : score >= 6 ? 'Paddock regular. Almost family.'
            : score >= 4 ? 'You know cars. You just met these eight.'
            : 'Respectfully: an Uber passenger.'
          }
        />
      )}
    </div>
  )
}
