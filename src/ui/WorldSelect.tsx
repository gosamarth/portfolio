import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { profile } from '../data/content'
import { techHero } from '../data/tech'
import { ExperienceTicker } from './ExperienceTicker'
import type { WorldMode } from '../world'

// ─────────────────────────────────────────────────────────────
//  THE SPLIT — half dark, half light. Two worlds leaking their
//  atmosphere through one seam. Hover swells a side; choosing
//  sweeps it across the screen.
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
    return hover === side ? 1.7 : 1
  }

  const enter = (side: Exclude<Side, null>) => {
    if (leaving) return
    setLeaving(side)
    setTimeout(() => onSelect(side), 620)
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-hidden md:flex-row">
      {/* ── DARK HALF · THE GARAGE ─────────────────────────── */}
      <motion.button
        animate={{ flexGrow: grow('garage') }}
        transition={{ type: 'spring', stiffness: 160, damping: 26 }}
        style={{ flexBasis: 0, flexGrow: 1 }}
        className="group relative min-h-0 overflow-hidden text-left"
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
        {/* still render → video leak on hover */}
        <img
          src="/cars/2026-mercedes-c300.jpg"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            hover === 'garage' ? 'opacity-80 scale-105' : 'opacity-55'
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
        {/* neon leak on the seam edge */}
        <div
          className={`absolute bottom-0 right-0 top-0 hidden w-1 transition-opacity duration-500 md:block ${
            hover === 'garage' ? 'opacity-100' : 'opacity-50'
          }`}
          style={{ background: 'linear-gradient(180deg, #6ee7ff, #f0abfc)', boxShadow: '0 0 24px rgba(110,231,255,0.6)' }}
        />
        <div className="relative flex h-full flex-col justify-end p-6 md:p-10">
          <span className="mb-2 w-fit rounded border border-accent/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Gearhead mode
          </span>
          <h2 className="font-display text-4xl font-bold text-white md:text-6xl">The Garage</h2>
          <p className={`mt-2 max-w-xs text-sm text-white/65 transition-all duration-500 md:text-base ${
            hover === 'garage' ? 'translate-y-0 opacity-100' : 'md:translate-y-2 md:opacity-0'
          }`}>
            Eight machines. Neon, turntables, and the story of every set of keys.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50">
            <span className="rounded border border-white/25 px-1.5 py-0.5 font-mono text-[10px]">G</span>
            Enter →
          </div>
        </div>
      </motion.button>

      {/* ── LIGHT HALF · THE COMMAND DECK ──────────────────── */}
      <motion.button
        animate={{ flexGrow: grow('tech') }}
        transition={{ type: 'spring', stiffness: 160, damping: 26 }}
        style={{ flexBasis: 0, flexGrow: 1 }}
        className="group relative min-h-0 overflow-hidden text-left"
        onMouseEnter={() => setHover('tech')}
        onMouseLeave={() => setHover(null)}
        onClick={() => enter('tech')}
        aria-label="Enter The Command Deck"
      >
        <div className="absolute inset-0 bg-[#f3f1ec]" />
        {/* ghost type — the deck's atmosphere */}
        <div
          aria-hidden
          className={`pointer-events-none absolute left-6 top-14 font-display font-bold leading-[0.9] tracking-tight text-black transition-all duration-700 md:left-10 md:top-20 ${
            hover === 'tech' ? 'opacity-[0.10] scale-[1.03]' : 'opacity-[0.06]'
          }`}
          style={{ fontSize: 'clamp(4rem, 11vw, 11rem)' }}
        >
          Samarth
          <br />
          builds.
        </div>
        {/* drifting glass slabs */}
        {[
          ['14%', '58%', '90px', '8s'], ['52%', '70%', '130px', '11s'], ['70%', '30%', '70px', '9s'],
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
        <div className="relative flex h-full flex-col justify-end p-6 md:items-end md:p-10 md:text-right">
          <span className="mb-2 w-fit rounded border border-emerald-700/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-700">
            Director mode
          </span>
          <h2 className="font-display text-4xl font-bold text-[#121317] md:text-6xl">The Command Deck</h2>
          <p className={`mt-2 max-w-xs text-sm text-black/55 transition-all duration-500 md:text-base ${
            hover === 'tech' ? 'translate-y-0 opacity-100' : 'md:translate-y-2 md:opacity-0'
          }`}>
            A decade of building, told big — autonomous AI delivery, the climb, the numbers.
          </p>
          <div className="mt-3 hidden md:block">
            <ExperienceTicker suffix={techHero.tickerSuffix} />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-black/45">
            <span className="rounded border border-black/25 px-1.5 py-0.5 font-mono text-[10px]">T</span>
            Enter →
          </div>
        </div>
      </motion.button>

      {/* ── THE SEAM — copy that inverts across both worlds ── */}
      {!leaving && (
        <div className="pointer-events-none absolute inset-x-0 top-[8%] z-10 flex flex-col items-center text-center mix-blend-difference md:top-[10%]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.4em] text-white/70"
          >
            {profile.name} · {profile.role}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl"
          >
            Two worlds. One builder.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 text-sm text-white/70 md:text-base"
          >
            Which one do you need?
          </motion.p>
        </div>
      )}
      {!leaving && (
        <p className="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-[10px] uppercase tracking-[0.35em] text-white/55 mix-blend-difference">
          You can cross over anytime
        </p>
      )}
    </div>
  )
}
