import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { sfxFail, sfxPass } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  REGEX RANGER: one pattern, four strings, one match. The
//  purest geek flex on the internet.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'regex')!
const ROUNDS = 8
const ROUND_SECS = 14

type Puzzle = { pattern: string; match: string; decoys: string[] }

const PUZZLES: Puzzle[] = [
  { pattern: '^[a-z]+\\d{2}$', match: 'deploy42', decoys: ['Deploy42', '42deploy', 'deploy4'] },
  { pattern: '^\\d{3}-\\d{4}$', match: '555-0199', decoys: ['5550199', '55-01999', 'abc-1234'] },
  { pattern: 'foo(bar)?baz', match: 'foobaz', decoys: ['fooba', 'barbaz', 'foobarbz'] },
  { pattern: '^#[0-9a-f]{6}$/i', match: '#C0FFEE', decoys: ['#C0FFE', '#GGGGGG', 'C0FFEE'] },
  { pattern: '\\bship\\b', match: 'we ship friday', decoys: ['shipment lost', 'flagship down', 'shipping soon'] },
  { pattern: '^v\\d+\\.\\d+\\.\\d+$', match: 'v2.10.3', decoys: ['v2.10', '2.10.3', 'v2.x.3'] },
  { pattern: '(ha)+!', match: 'hahaha!', decoys: ['ha ha!', 'hah!', 'haha?'] },
  { pattern: 'colou?r', match: 'color', decoys: ['colur', 'coler', 'clr'] },
  { pattern: '^(dev|prod)-\\w+$', match: 'prod-api', decoys: ['stage-api', 'prod api', '-prod-api'] },
  { pattern: '\\.tsx?$', match: 'App.ts', decoys: ['App.ts.bak', 'tsconfig.json', 'App.jsx'] },
]

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)

export function RegexRanger({ onExit }: { onExit: () => void }) {
  const rounds = useMemo(() => shuffle(PUZZLES).slice(0, ROUNDS).map((p) => ({ ...p, options: shuffle([p.match, ...p.decoys]) })), [])
  const [phase, setPhase] = useState<'ready' | 'guess' | 'reveal' | 'over'>('ready')
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECS)
  const [isBest, setIsBest] = useState(false)
  const timer = useRef(0)

  const round = rounds[Math.min(idx, ROUNDS - 1)]
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
    }, 100)
  }

  const pick = (opt: string) => {
    if (phase !== 'guess') return
    stopTimer()
    setPicked(opt)
    if (opt === round.match) {
      setScore((s) => s + 1)
      sfxPass()
    } else sfxFail()
    setPhase('reveal')
  }

  useEffect(() => {
    if (phase !== 'reveal') return
    const t = setTimeout(() => {
      if (idx + 1 >= ROUNDS) {
        setIsBest(saveBest('regex', score))
        setPhase('over')
      } else beginRound(idx + 1)
    }, 1600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const start = () => {
    setScore(0)
    beginRound(0)
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#050a0e] px-4">
      <div aria-hidden className="pointer-events-none fixed inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 25%, ${META.accent}0e, transparent 60%)` }} />
      <GameHeader meta={META} score={`${score}/${ROUNDS}`} onExit={onExit} />

      {(phase === 'guess' || phase === 'reveal') && (
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">
            <span>pattern {idx + 1} / {ROUNDS}</span>
            <span className={timeLeft < 4 ? 'text-rose-400' : ''}>{Math.ceil(timeLeft)}s</span>
          </div>

          {/* the pattern, terminal style */}
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-2xl border border-white/12 bg-[#07111a] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] md:p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">$ grep -E</p>
            <p className="mt-2 break-all font-mono text-xl font-bold md:text-2xl" style={{ color: META.accent, textShadow: `0 0 22px ${META.accent}44` }}>
              /{round.pattern}/
            </p>
            <p className="mt-2 font-mono text-[11px] text-white/40">exactly one of these strings matches. pick it.</p>
          </motion.div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {round.options.map((opt) => {
              const state = phase === 'reveal' ? (opt === round.match ? 'right' : opt === picked ? 'wrong' : 'idle') : 'idle'
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  disabled={phase !== 'guess'}
                  className={`rounded-xl border px-4 py-3.5 text-left font-mono text-sm transition-all duration-200 ${
                    state === 'right'
                      ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200'
                      : state === 'wrong'
                        ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                        : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/40 hover:text-white'
                  }`}
                >
                  "{opt}"
                </button>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'ready' && (
        <StartOverlay
          meta={META}
          blurb={`Eight patterns, ${ROUND_SECS} seconds each. Four candidate strings, exactly one matches. No console, no regex101, just you and the muscle memory.`}
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
          extra={
            score === ROUNDS ? 'Regex Ranger. The logs fear you.'
            : score >= 6 ? 'grep wizard, second class.'
            : score >= 4 ? 'Stack Overflow cavalry rides again.'
            : 'Still escaping the dot, huh.'
          }
        />
      )}
    </div>
  )
}
