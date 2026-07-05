import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { profile } from '../data/content'
import { techHero } from '../data/tech'
import { ExperienceTicker } from './ExperienceTicker'
import type { WorldMode } from '../world'

// ─────────────────────────────────────────────────────────────
//  THE SPLIT v2 — two unmistakable doors. A title strip on top,
//  then two giant framed panels with a real gutter between them
//  and a big ENTER button in each. Hover still swells a side;
//  the garage door still plays the turntable.
// ─────────────────────────────────────────────────────────────

type Side = 'garage' | 'tech' | null

export function WorldSelect({ onSelect }: { onSelect: (m: WorldMode) => void }) {
  const [hover, setHover] = useState<Side>(null)
  const [leaving, setLeaving] = useState<Side>(null)
  const [videoOn, setVideoOn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const grow = (side: Exclude<Side, null>) => {
    if (leaving) return leaving === side ? 30 : 0.0001
    if (!hover) return 1
    return hover === side ? 1.55 : 1
  }

  const enter = (side: Exclude<Side, null>) => {
    if (leaving) return
    setLeaving(side)
    setTimeout(() => onSelect(side), 620)
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[#0a0b0f]">
      {/* ── TITLE STRIP ────────────────────────────────────── */}
      {!leaving && (
        <div className="flex shrink-0 flex-col items-center px-4 pb-3 pt-4 text-center md:pb-4 md:pt-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-white/45"
          >
            {profile.name} · {profile.role}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-white md:text-4xl"
          >
            Two worlds.{' '}
            <span className="bg-gradient-to-r from-accent via-glow to-emerald-300 bg-clip-text text-transparent">
              One builder.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-1 text-xs text-white/50 md:text-sm"
          >
            Pick a door — you can cross over anytime.
          </motion.p>
        </div>
      )}

      {/* ── THE TWO DOORS ──────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-2.5 pt-0 md:flex-row md:gap-3 md:p-3 md:pt-0">
        {/* DARK DOOR · THE GARAGE */}
        <motion.button
          animate={{ flexGrow: grow('garage') }}
          transition={{ type: 'spring', stiffness: 160, damping: 26 }}
          style={{ flexBasis: 0, flexGrow: 1 }}
          className={`group relative min-h-0 overflow-hidden rounded-2xl border-2 text-left transition-colors duration-300 ${
            hover === 'garage' ? 'border-accent' : 'border-white/15'
          }`}
          onMouseEnter={() => {
            setHover('garage')
            setVideoOn(true)
            videoRef.current?.play().catch(() => {})
          }}
          onMouseLeave={() => setHover(null)}
          onClick={() => enter('garage')}
          aria-label="Enter The Garage"
        >
          <div className="absolute inset-0 bg-[#05060a]" />
          <img
            src="/cars/2026-mercedes-c300.jpg"
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
              hover === 'garage' ? 'opacity-85 scale-105' : 'opacity-60'
            }`}
          />
          {videoOn && (
            <video
              ref={videoRef}
              src="/cars/2026-mercedes-c300.mp4"
              muted
              loop
              playsInline
              autoPlay
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                hover === 'garage' || leaving === 'garage' ? 'opacity-90' : 'opacity-0'
              }`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

          {/* door number */}
          <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent md:left-7 md:top-6">
            Door 01 · Gearhead mode
          </span>

          <div className="relative flex h-full flex-col items-start justify-end p-5 md:p-9">
            <h2 className="font-display text-4xl font-bold text-white md:text-6xl">The Garage</h2>
            <p className="mt-2 max-w-sm text-sm text-white/70 md:text-base">
              Eight machines in a neon showroom — turntables, spec sheets, and the story of every
              set of keys.
            </p>
            <span
              className={`mt-4 inline-flex items-center gap-2 rounded-full border-2 px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-300 md:px-8 md:py-3 ${
                hover === 'garage'
                  ? 'border-accent bg-accent text-ink'
                  : 'border-accent/70 text-accent'
              }`}
            >
              Enter the garage →
              <kbd className="rounded border border-current px-1.5 py-0.5 font-mono text-[10px]">G</kbd>
            </span>
          </div>
        </motion.button>

        {/* LIGHT DOOR · THE COMMAND DECK */}
        <motion.button
          animate={{ flexGrow: grow('tech') }}
          transition={{ type: 'spring', stiffness: 160, damping: 26 }}
          style={{ flexBasis: 0, flexGrow: 1 }}
          className={`group relative min-h-0 overflow-hidden rounded-2xl border-2 text-left transition-colors duration-300 ${
            hover === 'tech' ? 'border-emerald-500' : 'border-white/15'
          }`}
          onMouseEnter={() => setHover('tech')}
          onMouseLeave={() => setHover(null)}
          onClick={() => enter('tech')}
          aria-label="Enter The Command Deck"
        >
          <div className="absolute inset-0 bg-[#f3f1ec]" />
          <div
            aria-hidden
            className={`pointer-events-none absolute left-5 top-10 font-display font-bold leading-[0.9] tracking-tight text-black transition-all duration-700 md:left-8 md:top-16 ${
              hover === 'tech' ? 'opacity-[0.10] scale-[1.03]' : 'opacity-[0.06]'
            }`}
            style={{ fontSize: 'clamp(3.4rem, 9vw, 9rem)' }}
          >
            Samarth
            <br />
            builds.
          </div>
          {[
            ['16%', '60%', '80px', '8s'], ['50%', '72%', '110px', '11s'], ['66%', '34%', '64px', '9s'],
          ].map(([top, left, size, dur], i) => (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute rounded-lg border border-black/[0.05] bg-white/60 backdrop-blur-[2px]"
              style={{
                top, left, width: size, height: `calc(${size} * 1.4)`,
                animation: `floaty ${dur} ease-in-out infinite`,
                animationDelay: `${i * 1.3}s`,
                boxShadow: '0 14px 34px rgba(15,18,25,0.07)',
              }}
            />
          ))}

          <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-700 md:left-7 md:top-6">
            Door 02 · Director mode
          </span>

          <div className="relative flex h-full flex-col items-start justify-end p-5 md:p-9">
            <h2 className="font-display text-4xl font-bold text-[#121317] md:text-6xl">
              The Command Deck
            </h2>
            <p className="mt-2 max-w-sm text-sm text-black/60 md:text-base">
              A decade of building, told big — autonomous AI delivery, the climb to Director, and
              the numbers behind it.
            </p>
            <div className="mt-2 hidden md:block">
              <ExperienceTicker suffix={techHero.tickerSuffix} />
            </div>
            <span
              className={`mt-4 inline-flex items-center gap-2 rounded-full border-2 px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-300 md:px-8 md:py-3 ${
                hover === 'tech'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-emerald-700/70 text-emerald-700'
              }`}
            >
              Enter the deck →
              <kbd className="rounded border border-current px-1.5 py-0.5 font-mono text-[10px]">T</kbd>
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
