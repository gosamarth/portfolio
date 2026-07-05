import { motion } from 'framer-motion'
import { profile } from '../data/content'
import { techHero, pillars, console_, irl, techContact } from '../data/tech'

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.4 },
}

/** HTML overlay for the Command Deck world. Order matches src/data/tech.ts. */
export function TechSections() {
  return (
    <div className="w-screen">
      {/* 0 — TECH HERO + holo ID card */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-20">
        <div className="max-w-xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-4 !text-emerald-300/80">
            {techHero.subtitle}
          </motion.p>
          <motion.h1
            {...fade}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            The{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              {techHero.title}
            </span>
          </motion.h1>
          <motion.p {...fade} transition={{ duration: 0.6, delay: 0.12 }} className="mt-6 text-lg text-white/70 md:text-xl">
            {techHero.line}
          </motion.p>
          {/* holo ID card */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-4 rounded-xl border border-emerald-300/25 bg-emerald-400/[0.06] p-4 backdrop-blur-md"
            style={{ boxShadow: '0 0 34px rgba(52,211,153,0.15)' }}
          >
            <img src={techHero.portrait} alt={profile.name} className="h-16 w-16 rounded-lg object-cover" />
            <div>
              <div className="font-display text-sm font-semibold text-white">{profile.name}</div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-emerald-300/80">Access Level: Director</div>
              <div className="mt-1 font-mono text-[10px] text-white/40">ID · ENG-SLT-04YRS · {profile.location}</div>
            </div>
            <span className="ml-2 h-2 w-2 animate-pulse rounded-full bg-emerald-400" title="online" />
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 flex items-center gap-3 text-sm text-white/50">
            <span className="h-px w-8 bg-emerald-300/40" />
            Scroll — systems online
          </motion.div>
        </div>
      </section>

      {/* 1–3 — PILLARS */}
      {pillars.map((p, i) => (
        <section
          key={p.key}
          className={`flex h-screen overflow-hidden items-center px-6 md:px-20 ${i % 2 === 1 ? 'justify-end' : ''}`}
        >
          <motion.div
            {...fade}
            transition={{ duration: 0.55 }}
            className="glass max-w-xl rounded-2xl p-7 md:p-9"
            style={{ borderColor: `${p.accent}33`, boxShadow: `0 0 40px ${p.accent}14` }}
          >
            <p className="eyebrow mb-2" style={{ color: p.accent }}>
              {p.eyebrow}
            </p>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{p.title}</h2>
            <p className="mt-3 text-white/70">{p.blurb}</p>
            <ul className="mt-5 space-y-2.5">
              {p.points.map((pt, j) => (
                <motion.li
                  key={pt}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 0.15 + j * 0.07 }}
                  className="flex items-center gap-3 text-sm text-white/80 md:text-base"
                >
                  <span className="font-mono text-xs" style={{ color: p.accent }}>
                    ▸
                  </span>
                  {pt}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>
      ))}

      {/* 4 — DIRECTOR'S CONSOLE */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-20">
        <div className="w-full max-w-4xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-amber-300/90">
            {console_.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold md:text-5xl">
            {console_.title}
          </motion.h2>
          <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-3 max-w-xl text-white/60">
            {console_.blurb}
          </motion.p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {console_.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="glass rounded-xl border-amber-300/10 p-4 md:p-5"
              >
                <div className="font-display text-3xl font-bold text-amber-300 md:text-4xl">{m.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">{m.label}</div>
                <div className="mt-1 text-[11px] text-white/45">{m.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — IRL photo wall (3D panels behind; keep HTML light) */}
      <section className="flex h-screen overflow-hidden flex-col items-center justify-end px-6 pb-16 text-center">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-cyan-300/80">
          {irl.eyebrow}
        </motion.p>
        <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold md:text-4xl">
          {irl.title}
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-3 max-w-md text-white/60">
          {irl.blurb}
        </motion.p>
      </section>

      {/* 6 — CONTACT */}
      <section className="flex h-screen overflow-hidden flex-col justify-center px-6 md:px-20">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-4 !text-emerald-300/80">
          {techContact.eyebrow}
        </motion.p>
        <motion.h2 {...fade} transition={{ duration: 0.6, delay: 0.06 }} className="max-w-2xl font-display text-4xl font-bold leading-tight md:text-6xl">
          {techContact.title}
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.12 }} className="mt-5 max-w-md text-lg text-white/70">
          {techContact.blurb}
        </motion.p>
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.18 }} className="mt-8 flex flex-wrap items-center gap-4">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-emerald-300 px-7 py-3 font-medium text-ink transition hover:bg-white"
            >
              {s.label} →
            </a>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
