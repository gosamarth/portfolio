import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { profile } from '../data/content'
import { techHero } from '../data/tech'
import { bestScore, GAMES } from '../arcade/arcade'
import { ExperienceTicker } from './ExperienceTicker'
import type { WorldMode } from '../world'

// ─────────────────────────────────────────────────────────────
//  THE SPLIT v5: two hero doors + a side column of two living
//  side-doors (Lobby, Arcade). Hover still swells a hero door;
//  the garage door still plays the turntable.
// ─────────────────────────────────────────────────────────────

type Side = 'garage' | 'tech' | null

const easeOut = [0.22, 1, 0.36, 1] as const

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

  const anyBest = GAMES.some((g) => bestScore(g.key) != null)

  return (
    <div className="fixed inset-0 z-30 flex flex-col gap-1.5 overflow-y-auto bg-[#0a0b0f] p-1.5 md:flex-row md:gap-2 md:overflow-hidden md:p-2">
      {/* ── THE TWO HERO DOORS ─────────────────────────────── */}
      <div className="relative flex h-[66vh] min-h-[460px] flex-none flex-col gap-1.5 md:h-auto md:min-h-0 md:flex-1 md:flex-row md:gap-2">
        {/* DARK DOOR · THE GARAGE */}
        <motion.button
          initial={{ opacity: 0, x: -46 }}
          animate={{ flexGrow: grow('garage'), opacity: 1, x: 0 }}
          transition={{ flexGrow: { type: 'spring', stiffness: 160, damping: 26 }, opacity: { duration: 0.7 }, x: { duration: 0.8, ease: easeOut } }}
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

          <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent md:left-7 md:top-6">
            Door 01 · The passion
          </span>

          <div className="relative flex h-full flex-col items-start justify-end p-5 md:p-9">
            <h2 className="font-display text-4xl font-bold text-white md:text-6xl">The Garage</h2>
            <p className="mt-2 max-w-sm text-sm text-white/70 md:text-base">
              The machines I've owned, rendered like a game, and the story behind every set of keys.
            </p>
            <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
              {['8 machines', 'Spinning turntables', 'Neon showroom'].map((c) => (
                <span key={c} className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/65">
                  {c}
                </span>
              ))}
            </div>
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

        {/* LIGHT DOOR · SAMARTH BUILDS */}
        <motion.button
          initial={{ opacity: 0, x: 46 }}
          animate={{ flexGrow: grow('tech'), opacity: 1, x: 0 }}
          transition={{ flexGrow: { type: 'spring', stiffness: 160, damping: 26 }, opacity: { duration: 0.7 }, x: { duration: 0.8, ease: easeOut } }}
          style={{ flexBasis: 0, flexGrow: 1 }}
          className={`group relative min-h-0 overflow-hidden rounded-2xl border-2 text-left transition-colors duration-300 ${
            hover === 'tech' ? 'border-emerald-500' : 'border-white/15'
          }`}
          onMouseEnter={() => setHover('tech')}
          onMouseLeave={() => setHover(null)}
          onClick={() => enter('tech')}
          aria-label="Enter the portfolio. Samarth Builds"
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
            Door 02 · The portfolio
          </span>

          <div className="relative flex h-full flex-col items-start justify-end p-5 md:p-9">
            <h2 className="font-display text-4xl font-bold text-[#121317] md:text-6xl">
              Samarth <span className="text-black/40">Builds.</span>
            </h2>
            <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.25em] text-emerald-800/80">
              {profile.role} · AI Solutions Architect
            </p>
            <p className="mt-2 max-w-md text-sm text-black/60 md:text-base">
              The pitch, in person, a decade of engineering leadership, AI systems that survive
              production, and the business results to prove it.
            </p>
            <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
              {['⚔ Guarded by The Trials', 'The AI story', 'The climb: SDE → Director', 'Work with me'].map((c) => (
                <span key={c} className="rounded-full border border-black/15 px-3 py-1 text-[11px] text-black/60">
                  {c}
                </span>
              ))}
            </div>
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
              Face the trials →
              <kbd className="rounded border border-current px-1.5 py-0.5 font-mono text-[10px]">T</kbd>
            </span>
          </div>
        </motion.button>

        {/* ── SEAM BADGE, centred on the two hero doors ────── */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 md:block"
          style={{ opacity: hover || leaving ? 0 : 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/70 bg-[#0a0b0f]/85 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <span className="bg-gradient-to-br from-accent via-glow to-emerald-300 bg-clip-text font-display text-3xl font-bold text-transparent">
                SS
              </span>
            </div>
            <span className="mt-2 rounded-full bg-[#0a0b0f]/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/75 backdrop-blur-sm">
              One builder · two worlds
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── SIDE DOORS: THE LOBBY + THE ARCADE ─────────────── */}
      <aside className="flex flex-none flex-col gap-1.5 md:w-[280px] md:gap-2 lg:w-[320px]">
        {/* THE LOBBY */}
        <motion.button
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: easeOut }}
          whileHover={{ scale: 1.015 }}
          onClick={() => !leaving && onSelect('hub')}
          className="group relative min-h-[190px] flex-1 overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0b120e] text-left transition-colors duration-300 hover:border-emerald-400/80"
          aria-label="Enter The Lobby"
        >
          {/* drifting mission chips */}
          {[
            ['Build', '10%', '56%', '9s'], ['AI', '28%', '78%', '7s'], ['Cloud', '44%', '60%', '10s'],
            ['Teams', '20%', '34%', '8s'], ['HIPAA', '6%', '18%', '11s'], ['Talk', '36%', '12%', '9.5s'],
          ].map(([word, top, left, dur], i) => (
            <span
              key={word}
              aria-hidden
              className="pointer-events-none absolute hidden rounded-full border border-emerald-300/25 md:inline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200/45 transition-opacity duration-500 group-hover:text-emerald-200/80"
              style={{ top, left, animation: `floaty ${dur} ease-in-out infinite`, animationDelay: `${i * 0.8}s` }}
            >
              {word}
            </span>
          ))}
          <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-emerald-400 opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.22]" />

          <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/80">
              Door 03 · The shortcut
            </span>
            <h3 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">The Lobby</h3>
            <p className="mt-1.5 max-w-[240px] text-sm leading-snug text-white/55">
              Six missions, one line each. The fastest route to a real reply.
            </p>
            <span className="mt-3.5 inline-flex w-fit items-center gap-2 rounded-full border-2 border-emerald-500/70 px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 transition-all duration-300 group-hover:border-emerald-400 group-hover:bg-emerald-400 group-hover:text-ink">
              Choose a mission →
              <kbd className="rounded border border-current px-1.5 py-0.5 font-mono text-[10px]">L</kbd>
            </span>
          </div>
        </motion.button>

        {/* THE ARCADE */}
        <motion.button
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.7, ease: easeOut }}
          whileHover={{ scale: 1.015 }}
          onClick={() => !leaving && onSelect('arcade')}
          className="group relative min-h-[190px] flex-1 overflow-hidden rounded-2xl border-2 border-white/15 bg-[#120b14] text-left transition-colors duration-300 hover:border-glow/80"
          aria-label="Enter The Arcade"
        >
          {/* neon grid floor */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16] transition-opacity duration-500 group-hover:opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(rgba(240,171,252,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(240,171,252,0.6) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              maskImage: 'radial-gradient(ellipse 90% 80% at 50% 100%, black 15%, transparent 70%)',
            }}
          />
          {/* drifting game glyphs */}
          {GAMES.map((g, i) => (
            <span
              key={g.key}
              aria-hidden
              className="pointer-events-none absolute hidden font-display transition-opacity duration-500 md:inline md:text-3xl"
              style={{
                color: g.accent,
                opacity: 0.4,
                top: ['14%', '26%', '48%', '18%'][i],
                left: ['16%', '66%', '38%', '84%'][i],
                animation: `floaty ${8 + i * 1.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.9}s`,
                textShadow: `0 0 18px ${g.accent}88`,
              }}
            >
              {g.icon}
            </span>
          ))}
          <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-glow opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.22]" />

          <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-glow/80">
              Door 04 · The fun
            </span>
            <h3 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">The Arcade</h3>
            <p className="mt-1.5 max-w-[240px] text-sm leading-snug text-white/55">
              {anyBest
                ? 'Four machines. Your high scores are waiting to fall.'
                : 'Four hand-built machines. Free play, bring your ego.'}
            </p>
            <span className="mt-3.5 inline-flex w-fit items-center gap-2 rounded-full border-2 border-glow/70 px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-glow transition-all duration-300 group-hover:border-glow group-hover:bg-glow group-hover:text-ink">
              🕹 Insert coin →
              <kbd className="rounded border border-current px-1.5 py-0.5 font-mono text-[10px]">A</kbd>
            </span>
          </div>
        </motion.button>
      </aside>
    </div>
  )
}
