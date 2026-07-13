import { useCallback, useEffect, useRef, useState } from 'react'
import { GAMES, HOUSE_REACTION_AVG, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { sfxFail, sfxGo, sfxLight, sfxPass } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  LIGHTS OUT GP: five race starts, average reaction wins.
//  Jump starts cost a 400ms penalty. Podium is earned.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'gp')!
const ROUNDS = 5
const PENALTY = 400

export function LightsGP({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'arming' | 'armed' | 'between' | 'over'>('ready')
  const [lights, setLights] = useState(0)
  const [round, setRound] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [last, setLast] = useState<number | null>(null)
  const [isBest, setIsBest] = useState(false)
  const goRef = useRef(0)
  const timers = useRef<number[]>([])
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const finishRound = useCallback((ms: number, jumped: boolean) => {
    clearTimers()
    setLast(jumped ? -1 : ms)
    setLights(0)
    setTimes((cur) => {
      const next = [...cur, ms]
      if (next.length >= ROUNDS) {
        const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length)
        setIsBest(saveBest('gp', avg, true))
        setPhase('over')
      } else {
        setPhase('between')
      }
      return next
    })
    if (jumped) sfxFail()
    else if (ms < 300) sfxPass()
  }, [])

  const arm = useCallback(() => {
    clearTimers()
    setLast(null)
    setLights(0)
    setPhase('arming')
    for (let i = 1; i <= 5; i++) {
      timers.current.push(window.setTimeout(() => { setLights(i); sfxLight() }, i * 520))
    }
    const hold = 5 * 520 + 400 + Math.random() * 1500
    timers.current.push(
      window.setTimeout(() => {
        setLights(0)
        goRef.current = performance.now()
        setPhase('armed')
        sfxGo()
      }, hold),
    )
  }, [])

  const react = useCallback(() => {
    if (phaseRef.current === 'arming') {
      // jump start: penalty round
      setRound((r) => r + 1)
      finishRound(PENALTY, true)
      return
    }
    if (phaseRef.current === 'armed') {
      const ms = Math.round(performance.now() - goRef.current)
      setRound((r) => r + 1)
      finishRound(ms, false)
    }
  }, [finishRound])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        react()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimers()
    }
  }, [react])

  const start = () => {
    setTimes([])
    setRound(0)
    setLast(null)
    arm()
  }

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#07080d]" onPointerDown={react}>
      <GameHeader meta={META} score={`${Math.min(round, ROUNDS)}/${ROUNDS}`} onExit={onExit} />

      <div className="flex gap-3 md:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-14 w-14 rounded-full border-2 transition-all duration-150 md:h-20 md:w-20 ${
              lights >= i
                ? 'border-rose-400 bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.85)]'
                : 'border-white/15 bg-white/[0.04]'
            }`}
          />
        ))}
      </div>

      <div className="mt-9 flex h-20 flex-col items-center justify-center">
        {phase === 'arming' && <p className="font-mono text-sm uppercase tracking-[0.4em] text-white/45">hold…</p>}
        {phase === 'armed' && (
          <p className="animate-pulse font-display text-4xl font-bold uppercase text-emerald-300" style={{ textShadow: '0 0 30px rgba(52,211,153,0.8)' }}>
            GO
          </p>
        )}
        {phase === 'between' && (
          <div className="text-center">
            <p className={`font-display text-4xl font-bold tabular-nums ${last === -1 ? 'text-rose-400' : 'text-white'}`}>
              {last === -1 ? `JUMP +${PENALTY}ms` : `${times[times.length - 1]}ms`}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); arm() }}
              className="mt-3 rounded-full border-2 border-amber-400/70 px-6 py-2 font-display text-xs font-semibold uppercase tracking-[0.25em] text-amber-300 transition hover:bg-amber-400 hover:text-ink"
            >
              Round {round + 1} →
            </button>
          </div>
        )}
      </div>

      {/* round strip */}
      <div className="mt-2 flex gap-2">
        {Array.from({ length: ROUNDS }, (_, i) => (
          <span
            key={i}
            className={`rounded px-2.5 py-1 font-mono text-[11px] tabular-nums ${
              times[i] != null
                ? times[i] >= PENALTY ? 'bg-rose-500/20 text-rose-300' : 'bg-white/[0.06] text-white/70'
                : 'bg-white/[0.03] text-white/25'
            }`}
          >
            {times[i] != null ? `${times[i]}` : '···'}
          </span>
        ))}
      </div>

      {phase === 'ready' && (
        <StartOverlay
          meta={META}
          blurb={`Five race starts against the owner. Samarth's house average is ${HOUSE_REACTION_AVG}ms; react when the lights go OUT and beat it. Jump the start and eat +${PENALTY}ms.`}
          onStart={start}
        />
      )}
      {phase === 'over' && (
        <GameOverPanel
          meta={META}
          score={avg}
          isBest={isBest}
          onRetry={start}
          onExit={onExit}
          extra={
            avg <= HOUSE_REACTION_AVG
              ? `You beat Samarth's ${HOUSE_REACTION_AVG}ms house average. He has been notified. He is not happy.`
              : `Samarth's ${HOUSE_REACTION_AVG}ms house average survives by ${avg - HOUSE_REACTION_AVG}ms. The owner keeps the crown.`
          }
        />
      )}
    </div>
  )
}
