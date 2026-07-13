import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { GAMES, saveBest } from './arcade'
import { GameHeader, GameOverPanel, StartOverlay } from './shared'
import { beep, sfxFail, sfxPass, sfxVictory } from '../trials/trials'

// ─────────────────────────────────────────────────────────────
//  DEPLOY FRIDAY: 4:53pm. Every deploy pays more than the last;
//  every deploy is more likely to page you at dinner. Push your
//  luck, or log off like an adult.
// ─────────────────────────────────────────────────────────────

const META = GAMES.find((g) => g.key === 'friday')!

const SERVICES = [
  'auth-svc', 'billing-v2', 'search-index', 'email-worker', 'feature-flags',
  'payments-gw', 'user-profile', 'notif-hub', 'rate-limiter', 'analytics-etl',
  'img-resizer', 'k8s-operator', 'session-cache', 'webhook-relay', 'ml-scorer',
  'pdf-renderer', 'geo-lookup', 'audit-log', 'cron-master', 'edge-router',
]

type Phase = 'ready' | 'run' | 'paged' | 'safe'
type Deploy = { name: string; points: number }

export function DeployFriday({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [deploys, setDeploys] = useState<Deploy[]>([])
  const [banked, setBanked] = useState(0)
  const [risk, setRisk] = useState(4)
  const [rolling, setRolling] = useState(false)
  const [isBest, setIsBest] = useState(false)
  const pool = useRef<string[]>([])

  const unbanked = deploys.reduce((a, d) => a + d.points, 0)
  const clock = (n: number) => {
    const mins = 53 + Math.floor(n * 0.9)
    return mins >= 60 ? `5:${String(mins - 60).padStart(2, '0')}pm` : `4:${mins}pm`
  }

  const start = () => {
    pool.current = [...SERVICES].sort(() => Math.random() - 0.5)
    setDeploys([])
    setBanked(0)
    setRisk(4)
    setPhase('run')
  }

  const deploy = () => {
    if (rolling || phase !== 'run') return
    setRolling(true)
    beep(420, 0.06, 'square', 0.03)
    setTimeout(() => {
      const failed = Math.random() * 100 < risk
      if (failed) {
        sfxFail()
        setTimeout(sfxFail, 180)
        setIsBest(false) // a page banks nothing
        setPhase('paged')
      } else {
        const name = pool.current[deploys.length % pool.current.length]
        const points = 10 + deploys.length * 5
        setDeploys((cur) => [...cur, { name, points }])
        setRisk((r) => Math.min(92, r + 3 + deploys.length * 0.8))
        sfxPass()
      }
      setRolling(false)
    }, 620)
  }

  const logOff = () => {
    if (phase !== 'run' || deploys.length === 0) return
    const total = unbanked
    setBanked(total)
    setIsBest(saveBest('friday', total))
    sfxVictory()
    setPhase('safe')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        deploy()
      }
      if (e.code === 'Enter') logOff()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, rolling, deploys.length, risk])

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#0c0709] px-4">
      <div aria-hidden className="pointer-events-none fixed inset-0" style={{ background: `radial-gradient(ellipse 70% 55% at 50% 80%, ${META.accent}10, transparent 60%)` }} />
      <GameHeader meta={META} score={phase === 'safe' ? `${banked}` : `${unbanked}`} onExit={onExit} />

      {(phase === 'run' || phase === 'paged' || phase === 'safe') && (
        <div className="w-full max-w-xl">
          {/* status strip */}
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
            <span>friday · {clock(deploys.length)}</span>
            <span className={risk > 40 ? 'font-bold text-rose-400' : risk > 20 ? 'text-amber-300' : 'text-emerald-300'}>
              page risk {Math.round(risk)}%
            </span>
          </div>
          {/* risk bar */}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${risk}%`,
                background: risk > 40 ? 'linear-gradient(90deg,#f43f5e88,#f43f5e)' : 'linear-gradient(90deg,#34d39966,#fbbf24)',
              }}
            />
          </div>

          {/* deploy log */}
          <div className="mt-4 h-56 overflow-hidden rounded-2xl border border-white/12 bg-[#0a0f0c] p-4 font-mono text-[13px]">
            <p className="text-white/30"># ci/cd · prod · {deploys.length} deploy{deploys.length === 1 ? '' : 's'} this evening</p>
            <div className="mt-2 flex flex-col-reverse gap-1">
              <AnimatePresence>
                {deploys.slice(-7).map((d, i) => (
                  <motion.p key={`${d.name}-${i}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-300/90">
                    <span className="text-white/35">✓</span> {d.name} <span className="text-white/30">deployed</span>{' '}
                    <span className="text-amber-300">+{d.points}</span>
                  </motion.p>
                ))}
              </AnimatePresence>
              {rolling && <p className="animate-pulse text-white/50">⟳ rolling out…</p>}
              {phase === 'paged' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-rose-400">
                  ✗ PAGERDUTY: prod is down. Everyone saw it. Points lost: {unbanked}.
                </motion.p>
              )}
              {phase === 'safe' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-emerald-300">
                  ✓ logged off at {clock(deploys.length)}. {banked} points banked. Weekend intact.
                </motion.p>
              )}
            </div>
          </div>

          {/* actions */}
          {phase === 'run' && (
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={deploy}
                disabled={rolling}
                className="rounded-full px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.25em] text-ink transition hover:opacity-90 disabled:opacity-50"
                style={{ background: META.accent }}
              >
                Deploy another → <span className="font-mono">+{10 + deploys.length * 5}</span>
              </button>
              <button
                onClick={logOff}
                disabled={deploys.length === 0}
                className="rounded-full border-2 border-emerald-400/70 px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300 transition hover:bg-emerald-400 hover:text-ink disabled:opacity-40"
              >
                Log off · bank {unbanked}
              </button>
            </div>
          )}
          {phase === 'run' && (
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              space = deploy · enter = log off
            </p>
          )}
        </div>
      )}

      {phase === 'ready' && (
        <StartOverlay
          meta={META}
          blurb="It's Friday, 4:53pm, and the queue is full. Every deploy pays more than the last; every deploy raises the odds PagerDuty ruins your dinner. Cash out with LOG OFF, or find out what greed costs. One page loses everything unbanked."
          onStart={start}
        />
      )}
      {(phase === 'paged' || phase === 'safe') && (
        <div className="mt-6">
          <GameOverPanel
            meta={META}
            score={phase === 'safe' ? banked : 0}
            isBest={isBest}
            onRetry={start}
            onExit={onExit}
            extra={
              phase === 'safe'
                ? banked >= 120
                  ? 'Calculated greed. Samarth respects it.'
                  : 'Modest, employed, and home for dinner.'
                : 'The incident review is Monday 9am. Bring donuts.'
            }
          />
        </div>
      )}
    </div>
  )
}
