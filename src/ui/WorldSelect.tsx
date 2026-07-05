import { motion } from 'framer-motion'
import { profile } from '../data/content'
import type { WorldMode } from '../world'

// ─────────────────────────────────────────────────────────────
//  CHOOSE YOUR WORLD — game-style entry screen. Two portals:
//  THE GARAGE (neon NFS) and THE COMMAND DECK (circuit city).
// ─────────────────────────────────────────────────────────────

function PortalCard({
  title, tag, desc, img, accent, keycap, onEnter, delay,
}: {
  title: string
  tag: string
  desc: string
  img: string
  accent: string
  keycap: string
  onEnter: () => void
  delay: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onEnter}
      className="group relative h-[34vh] md:h-[52vh] w-full max-w-md overflow-hidden rounded-2xl border text-left"
      style={{ borderColor: `${accent}44`, boxShadow: `0 0 50px ${accent}18` }}
    >
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div
        className="absolute inset-x-0 bottom-0 h-1 opacity-70 transition group-hover:opacity-100"
        style={{ background: accent, boxShadow: `0 0 18px ${accent}` }}
      />
      <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
        <span className="mb-2 w-fit rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ borderColor: `${accent}66`, color: accent }}>
          {tag}
        </span>
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{title}</h2>
        <p className="mt-2 max-w-xs text-sm text-white/65">{desc}</p>
        <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50 transition group-hover:text-white">
          <span className="rounded border border-white/25 px-1.5 py-0.5 font-mono text-[10px]">{keycap}</span>
          Press to enter →
        </div>
      </div>
    </motion.button>
  )
}

export function WorldSelect({
  onSelect, unlocked, onDream,
}: { onSelect: (m: WorldMode) => void; unlocked?: boolean; onDream?: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-ink px-5">
      {/* ambient grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(110,231,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,255,0.35) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="eyebrow mb-3"
      >
        {profile.name} · {profile.role}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="mb-8 text-center font-display text-4xl font-bold uppercase tracking-tight md:mb-12 md:text-6xl"
      >
        Choose your{' '}
        <span className="bg-gradient-to-r from-accent via-glow to-emerald-300 bg-clip-text text-transparent">world</span>
      </motion.h1>

      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-5 md:flex-row md:gap-8">
        <PortalCard
          title="The Garage"
          tag="Gearhead Mode"
          desc="Eight machines, one neon showroom. Turntables, spec sheets, and the story of every set of keys."
          img="/cars/2026-mercedes-c300.jpg"
          accent="#6ee7ff"
          keycap="G"
          delay={0.15}
          onEnter={() => onSelect('garage')}
        />
        <PortalCard
          title="The Command Deck"
          tag="Director Mode"
          desc="Azure at scale, .NET end-to-end, governed AI — and the P&L numbers leadership actually reads."
          img="/tech/circuit-city.jpg"
          accent="#34d399"
          keycap="T"
          delay={0.28}
          onEnter={() => onSelect('tech')}
        />
      </div>

      {unlocked ? (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onDream}
          className="mt-8 rounded-full border border-amber-300/50 px-5 py-2 text-xs uppercase tracking-[0.3em] text-amber-300 transition hover:bg-amber-300/10"
          style={{ boxShadow: '0 0 24px rgba(251,191,36,0.15)' }}
        >
          🔓 Secret unlocked — open the dream garage
        </motion.button>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-xs uppercase tracking-[0.3em] text-white/30"
        >
          Explore both worlds… something unlocks
        </motion.p>
      )}
    </div>
  )
}
