import { motion } from 'framer-motion'
import { profile } from '../data/content'
import {
  techHero, storyOpen, chapters, receipts, console_, offerings, reach, irl, techContact,
} from '../data/tech'

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.4 },
}

/** HTML overlay for the Command Deck story. Order matches src/data/tech.ts. */
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
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            The{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              {techHero.title}
            </span>
          </motion.h1>
          <motion.p {...fade} transition={{ duration: 0.6, delay: 0.12 }} className="mt-6 text-lg text-white/70 md:text-xl">
            {techHero.line}
          </motion.p>
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
            Scroll — the story begins
          </motion.div>
        </div>
      </section>

      {/* 1 — STORY OPEN */}
      <section className="flex h-screen overflow-hidden flex-col items-center justify-center px-6 text-center">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-5 !text-emerald-300/80">
          {storyOpen.eyebrow}
        </motion.p>
        <motion.h2
          {...fade}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="max-w-3xl font-display text-3xl font-bold leading-tight md:text-6xl"
        >
          {storyOpen.title}
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.14 }} className="mt-6 max-w-xl text-white/60 md:text-lg">
          {storyOpen.line}
        </motion.p>
      </section>

      {/* 2–6 — CHAPTERS */}
      {chapters.map((c, i) => (
        <section
          key={c.key}
          className={`flex h-screen overflow-hidden items-center px-6 md:px-20 ${i % 2 === 1 ? 'justify-end' : ''}`}
        >
          <motion.div
            {...fade}
            transition={{ duration: 0.55 }}
            className="glass max-w-xl rounded-2xl p-6 md:p-9"
            style={{ borderColor: `${c.accent}33`, boxShadow: `0 0 40px ${c.accent}14` }}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold md:text-5xl" style={{ color: `${c.accent}55` }}>
                {c.chapter}
              </span>
              <h2 className="font-display text-2xl font-bold text-white md:text-4xl">{c.title}</h2>
            </div>
            <p className="mt-4 text-white/75 md:text-lg">{c.narrative}</p>
            <ul className="mt-5 space-y-2.5">
              {c.points.map((pt, j) => (
                <motion.li
                  key={pt}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 0.15 + j * 0.07 }}
                  className="flex items-center gap-3 text-sm text-white/80 md:text-base"
                >
                  <span className="font-mono text-xs" style={{ color: c.accent }}>▸</span>
                  {pt}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>
      ))}

      {/* 7 — RECEIPTS */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-20">
        <div className="w-full max-w-4xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-cyan-300/90">
            {receipts.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold md:text-5xl">
            {receipts.title}
          </motion.h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {receipts.items.map((r, i) => (
              <motion.div
                key={r.headline}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-5 md:p-6"
              >
                <div className="font-display text-4xl font-bold text-cyan-300 md:text-5xl">{r.metric}</div>
                <div className="mt-2 font-display text-sm font-semibold uppercase tracking-wide text-white">
                  {r.headline}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{r.story}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — DIRECTOR'S CONSOLE */}
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

      {/* 9 — WORK WITH ME */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-20">
        <div className="w-full max-w-4xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-emerald-300/90">
            {offerings.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold md:text-5xl">
            {offerings.title}
          </motion.h2>
          <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-3 max-w-xl text-white/60">
            {offerings.blurb}
          </motion.p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {offerings.items.map((o, i) => (
              <motion.a
                key={o.name}
                href={`mailto:${reach.email}?subject=${encodeURIComponent(`[${o.name}] Intro call`)}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="pointer-events-auto glass group flex flex-col rounded-2xl p-5 transition hover:bg-white/[0.05] md:p-6"
                style={{ borderColor: `${o.accent}30` }}
              >
                <span className="w-fit rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: `${o.accent}66`, color: o.accent }}>
                  {o.duration}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{o.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{o.desc}</p>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-white/40">Deliverable</div>
                <div className="text-sm text-white/80">{o.deliverable}</div>
                <div className="mt-4 text-sm font-medium transition group-hover:translate-x-1" style={{ color: o.accent }}>
                  Book an intro call →
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — IRL photo wall (3D panels behind) */}
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

      {/* 11 — CONTACT / FINAL CTA */}
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
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.18 }} className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${reach.email}`}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-emerald-300 px-7 py-3 font-medium text-ink transition hover:bg-white"
          >
            {reach.email} →
          </a>
          <a
            href={reach.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-emerald-300/40 px-6 py-3 font-medium text-emerald-300 transition hover:bg-emerald-300/10"
          >
            WhatsApp {reach.phone}
          </a>
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:bg-white/10"
            >
              {s.label}
            </a>
          ))}
        </motion.div>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.26 }} className="mt-6 text-xs uppercase tracking-[0.25em] text-white/35">
          {reach.meets}
        </motion.p>
      </section>
    </div>
  )
}
