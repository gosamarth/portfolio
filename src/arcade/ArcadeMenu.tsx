import { motion } from 'framer-motion'
import { GAMES, bestScore, formatBest, type GameKey, type GameMeta } from './arcade'

// ─────────────────────────────────────────────────────────────
//  THE ARCADE, rebuilt as a gaming house: a flickering neon
//  sign, the Samarth game up on the marquee, and three clearly
//  signed wings of cabinets below.
// ─────────────────────────────────────────────────────────────

const WINGS: { key: GameMeta['wing']; sign: string; sub: string; accent: string }[] = [
  { key: 'garage', sign: 'GARAGE WING', sub: "Powered by Samarth's real machines", accent: '#fb923c' },
  { key: 'geek', sign: 'GEEK WING', sub: 'For the ones who read the logs', accent: '#4ade80' },
  { key: 'skill', sign: 'SKILL WING', sub: 'Pure nerve, pure reflex', accent: '#6ee7ff' },
]

function Cabinet({ g, onPlay, i }: { g: GameMeta; onPlay: (k: GameKey) => void; i: number }) {
  const best = bestScore(g.key)
  return (
    <motion.button
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.06, duration: 0.45 }}
      whileHover={{ y: -6 }}
      onClick={() => onPlay(g.key)}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors duration-300 hover:border-white/30 md:p-6"
      style={{ borderLeft: `3px solid ${g.accent}55` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-[0.1] blur-2xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ background: g.accent }}
      />
      <div className="flex items-start justify-between">
        <span className="font-display text-3xl md:text-4xl" style={{ color: g.accent }}>{g.icon}</span>
        {best != null && (
          <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
            best {formatBest(g, best)}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-white md:text-2xl">{g.name}</h3>
      <p className="mt-1.5 text-sm leading-snug text-white/50">{g.tagline}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">{g.controls}</span>
        <span
          className="whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.25em] transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: g.accent }}
        >
          play →
        </span>
      </div>
    </motion.button>
  )
}

export function ArcadeMenu({ onPlay, onExit }: { onPlay: (g: GameKey) => void; onExit: () => void }) {
  const featured = GAMES.find((g) => g.featured)!
  const featBest = bestScore(featured.key)

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-[#05060a]">
      {/* house lighting */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-72 opacity-40"
        style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(240,171,252,0.2), rgba(110,231,255,0.07) 55%, transparent 75%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(110,231,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,255,0.5) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 100%, black 20%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-6 md:pt-16">
        {/* ── THE NEON SIGN ─────────────────────────────────── */}
        <div className="text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] uppercase tracking-[0.55em] text-white/40">
            est. 2026 · free play · no quarters
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="neon-sign mt-2 font-display text-6xl font-bold uppercase tracking-tight text-white md:text-8xl"
          >
            The Arcade
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mx-auto mt-3 max-w-xl text-sm text-white/50 md:text-base">
            Twelve machines, hand-built in WebGL and stubbornness. One of them IS the owner.
          </motion.p>
        </div>

        {/* ── THE MARQUEE: the Samarth game ─────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.6 }}
          whileHover={{ scale: 1.008 }}
          onClick={() => onPlay(featured.key)}
          className="group relative mt-9 block w-full overflow-hidden rounded-3xl border-2 text-left"
          style={{ borderColor: `${featured.accent}66`, boxShadow: `0 0 70px ${featured.accent}1f, inset 0 0 90px ${featured.accent}0d` }}
        >
          {/* animated marquee grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-45"
            style={{
              backgroundImage:
                `linear-gradient(${featured.accent}66 1px, transparent 1px), linear-gradient(90deg, ${featured.accent}66 1px, transparent 1px)`,
              backgroundSize: '34px 34px',
              maskImage: 'radial-gradient(ellipse 90% 90% at 50% 100%, black 10%, transparent 75%)',
            }}
          />
          <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-7 md:p-9">
            {/* the star of the house */}
            <div className="relative shrink-0 self-start sm:self-center">
              <img src="/me/portrait.jpg" alt="Samarth" className="h-20 w-20 rounded-full border-2 object-cover md:h-28 md:w-28" style={{ borderColor: featured.accent }} />
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-ink md:text-[9px]"
                style={{ background: featured.accent }}
              >
                playable
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: featured.accent }}>
                ★ tonight on the marquee · the Samarth game
              </p>
              <h2 className="mt-1.5 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl" style={{ textShadow: `0 0 44px ${featured.accent}55` }}>
                {featured.name}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/60 md:text-base">{featured.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                <span>{featured.controls}</span>
                {featBest != null && <span style={{ color: featured.accent }}>best {formatBest(featured, featBest)}</span>}
              </div>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 px-7 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] transition-all duration-300 group-hover:text-ink sm:self-center"
              style={{ borderColor: featured.accent, color: featured.accent }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = featured.accent)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              🕹 Insert coin →
            </span>
          </div>
        </motion.button>

        {/* ── THE WINGS ─────────────────────────────────────── */}
        {WINGS.map((w) => {
          const games = GAMES.filter((g) => g.wing === w.key)
          return (
            <section key={w.key} className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2
                    className="neon-sign font-display text-2xl font-bold uppercase tracking-[0.12em] md:text-4xl"
                    style={{ color: w.accent, textShadow: `0 0 26px ${w.accent}77` }}
                  >
                    {w.sign}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:text-[11px]">{w.sub}</p>
                </div>
                <span className="mb-1 shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ borderColor: `${w.accent}55`, color: w.accent }}>
                  {games.length} machines
                </span>
              </div>
              <div className="mt-1.5 h-px w-full" style={{ background: `linear-gradient(90deg, ${w.accent}88, transparent 70%)` }} />
              <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {games.map((g, i) => (
                  <Cabinet key={g.key} g={g} onPlay={onPlay} i={i} />
                ))}
              </div>
            </section>
          )
        })}

        <button
          onClick={onExit}
          className="pointer-events-auto mt-12 rounded-full border border-white/20 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
        >
          ← back to the doors
        </button>
      </div>
    </div>
  )
}
