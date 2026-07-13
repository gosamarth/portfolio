import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  BUG SQUASH: whack-a-mole for people with prod access. Bugs
//  pop on a 4×4 server grid; squash them before they despawn.
//  Do NOT squash the thing that is actually a feature.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'squash')!
const DURATION = 30
const GRID = 16

const BUG_NAMES = [
  'NullPointerException', 'OffByOneError', 'RaceCondition', 'MemoryLeak',
  'HeisenBug', 'CVE-2026-1337', 'StackOverflow', 'DeadLock', 'InfiniteLoop',
  'UnhandledRejection', 'CacheInvalidation', 'TimezoneBug', 'FloatDrift',
]
const FEATURE_NAMES = ['ACTUALLY A FEATURE', 'INTENDED BEHAVIOUR', 'WONTFIX', 'AS DESIGNED']

type Cell = { kind: 'bug' | 'feature'; name: string; born: number; ttl: number } | null
type Phase = 'ready' | 'run' | 'over'

export function BugSquash({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [cells, setCells] = useState<Cell[]>(Array(GRID).fill(null))
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [isBest, setIsBest] = useState(false)
  const [splat, setSplat] = useState<{ i: number; good: boolean } | null>(null)
  const S = useRef({ t0: 0, timers: [] as number[], score: 0 })

  const clearTimers = () => {
    S.current.timers.forEach(clearTimeout)
    S.current.timers = []
  }
  useEffect(() => clearTimers, [])

  // spawner: rate accelerates over the 30s
  useEffect(() => {
    if (phase !== 'run') return
    let alive = true
    const loop = () => {
      if (!alive) return
      const elapsed = (performance.now() - S.current.t0) / 1000
      if (elapsed >= DURATION) {
        setIsBest(saveBest('squash', S.current.score))
        setPhase('over')
        return
      }
      setTimeLeft(Math.max(0, Math.ceil(DURATION - elapsed)))
      setCells((cur) => {
        const now = performance.now()
        const next = cur.map((c) => (c && now - c.born > c.ttl ? null : c))
        const empties = next.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
        if (empties.length > 0) {
          const i = empties[Math.floor(Math.random() * empties.length)]
          const isFeature = Math.random() < 0.18
          next[i] = {
            kind: isFeature ? 'feature' : 'bug',
            name: isFeature
              ? FEATURE_NAMES[Math.floor(Math.random() * FEATURE_NAMES.length)]
              : BUG_NAMES[Math.floor(Math.random() * BUG_NAMES.length)],
            born: now,
            ttl: Math.max(900, 2100 - elapsed * 40),
          }
        }
        return next
      })
      const gap = Math.max(260, 780 - elapsed * 17)
      S.current.timers.push(window.setTimeout(loop, gap))
    }
    loop()
    return () => {
      alive = false
      clearTimers()
    }
  }, [phase])

  const whack = useCallback((i: number) => {
    setCells((cur) => {
      const c = cur[i]
      if (!c) return cur
      const next = [...cur]
      next[i] = null
      if (c.kind === 'bug') {
        S.current.score += 1
        setScore(S.current.score)
        setSplat({ i, good: true })
        beep(300 + Math.random() * 400, 0.05, 'square', 0.04)
      } else {
        S.current.score = Math.max(0, S.current.score - 3)
        setScore(S.current.score)
        setSplat({ i, good: false })
        sfxFail()
      }
      setTimeout(() => setSplat(null), 320)
      return next
    })
  }, [])

  const start = () => {
    clearTimers()
    S.current.score = 0
    S.current.t0 = performance.now()
    setScore(0)
    setTimeLeft(DURATION)
    setCells(Array(GRID).fill(null))
    setPhase('run')
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#060a07] px-4">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${META.accent}0d, transparent 60%)` }}
      />
      <GameHeader meta={META} score={`${score}`} onExit={onExit} />

      {(phase === 'run' || phase === 'over') && (
        <>
          <p className="mb-4 font-mono text-3xl font-bold tabular-nums text-white/85">{timeLeft}<span className="ml-1 text-sm text-white/35">s</span></p>
          <div className="grid w-full max-w-lg grid-cols-4 gap-2 md:gap-2.5">
            {cells.map((c, i) => (
              <button
                key={i}
                onPointerDown={() => phase === 'run' && whack(i)}
                className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border font-mono transition-colors duration-150 ${
                  c
                    ? c.kind === 'bug'
                      ? 'border-emerald-400/60 bg-emerald-400/10'
                      : 'border-amber-400/70 bg-amber-400/10'
                    : 'border-white/8 bg-white/[0.025]'
                }`}
              >
                {c && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="flex flex-col items-center px-1"
                  >
                    <span className="text-2xl md:text-3xl">{c.kind === 'bug' ? '🐛' : '✨'}</span>
                    <span className={`mt-0.5 hidden text-center text-[8px] leading-tight sm:block md:text-[9px] ${c.kind === 'bug' ? 'text-emerald-300/80' : 'text-amber-300/90'}`}>
                      {c.name}
                    </span>
                  </motion.div>
                )}
                <AnimatePresence>
                  {splat?.i === i && (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 1 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.32 }}
                      className={`absolute font-display text-xl font-bold ${splat.good ? 'text-emerald-300' : 'text-rose-400'}`}
                    >
                      {splat.good ? '+1' : '−3'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
            🐛 squash · ✨ leave alone (−3)
          </p>
        </>
      )}

      {phase === 'ready' && (
        <StartOverlay
          meta={META}
          blurb="Thirty seconds on the prod cluster. Bugs spawn faster and die younger as the timer runs; squash every 🐛 you can. The ✨ ones are features — squash one of those and the PM takes 3 points."
          onStart={start}
        />
      )}
      {phase === 'over' && (
        <GameOverPanel
          meta={META}
          score={score}
          isBest={isBest}
          onRetry={start}
          onExit={onExit}
          extra={score >= 30 ? 'Prod is stable. You are the pager now.' : score >= 18 ? 'Solid on-call energy.' : 'The bugs have unionised.'}
        />
      )}
    </div>
  )
}
