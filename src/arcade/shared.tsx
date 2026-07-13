import { motion } from 'framer-motion'
import { useState } from 'react'
import { shareScore, type GameMeta } from './arcade'

// Shared chrome for the cabinets: header strip + game-over panel.

export function GameHeader({ meta, score, onExit }: { meta: GameMeta; score: string; onExit: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 md:px-8">
      <span className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: meta.accent }}>
        {meta.icon} {meta.name}
      </span>
      <span className="font-display text-2xl font-bold tabular-nums text-white md:text-3xl">{score}</span>
      <button
        onClick={onExit}
        className="pointer-events-auto rounded-full border border-white/20 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
      >
        exit
      </button>
    </div>
  )
}

export function StartOverlay({ meta, blurb, onStart }: { meta: GameMeta; blurb: string; onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 px-6 text-center backdrop-blur-[2px]"
    >
      <span className="font-display text-6xl" style={{ color: meta.accent }}>{meta.icon}</span>
      <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">{meta.name}</h2>
      <p className="mt-3 max-w-sm text-sm text-white/60 md:text-base">{blurb}</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">{meta.controls}</p>
      <button
        onClick={onStart}
        className="mt-7 rounded-full border-2 px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] transition-all hover:text-ink"
        style={{ borderColor: meta.accent, color: meta.accent }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.background = meta.accent)}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
      >
        Start →
      </button>
    </motion.div>
  )
}

export function GameOverPanel({
  meta, score, isBest, onRetry, onExit, extra,
}: { meta: GameMeta; score: number; isBest: boolean; onRetry: () => void; onExit: () => void; extra?: string }) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const r = await shareScore(
      `${meta.icon} ${meta.name}: ${score} ${meta.scoreLabel} on Samarth's arcade. Beat that.`,
    )
    if (r === 'copied') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/55 px-6 text-center backdrop-blur-sm"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/45">Game over</p>
      <p className="mt-4 font-display text-7xl font-bold tabular-nums text-white md:text-8xl" style={{ textShadow: `0 0 44px ${meta.accent}66` }}>
        {score}
        <span className="ml-2 text-2xl text-white/40">{meta.scoreLabel}</span>
      </p>
      {isBest && (
        <motion.p
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.3em]"
          style={{ color: meta.accent }}
        >
          ★ new personal best
        </motion.p>
      )}
      {extra && <p className="mt-2 text-sm text-white/55">{extra}</p>}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          onClick={onRetry}
          className="rounded-full px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-ink transition hover:opacity-90"
          style={{ background: meta.accent }}
        >
          Again →
        </button>
        <button
          onClick={share}
          className="rounded-full border-2 border-white/25 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:text-white"
        >
          {copied ? 'Copied. go brag' : 'Share score'}
        </button>
        <button
          onClick={onExit}
          className="rounded-full border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45 transition hover:text-white"
        >
          cabinets
        </button>
      </div>
    </motion.div>
  )
}
