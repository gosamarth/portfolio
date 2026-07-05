import { motion } from 'framer-motion'
import { profile } from '../data/content'
import {
  techHero, storyOpen, chapters, journey, receipts, console_, offerings, reach, irl, techContact,
} from '../data/tech'
import { ExperienceTicker } from './ExperienceTicker'

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.4 },
}

const INK = '#121317'

/** HTML overlay for the porcelain Command Deck. Order matches src/data/tech.ts. */
export function TechSections() {
  return (
    <div className="w-screen" style={{ color: INK }}>
      {/* 0 — HERO: massive type + live ticker */}
      <section className="flex h-screen overflow-hidden flex-col justify-center px-6 md:px-16">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-5 !text-black/50">
          {techHero.subtitle}
        </motion.p>
        <motion.h1
          {...fade}
          transition={{ duration: 0.7, delay: 0.06 }}
          className="max-w-5xl font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-[9rem]"
        >
          Samarth
          <br />
          <span className="text-black/30">builds.</span>
        </motion.h1>
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.18 }} className="mt-8">
          <ExperienceTicker />
        </motion.div>
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.28 }} className="mt-8 flex items-center gap-3 text-sm text-black/45">
          <span className="h-px w-8 bg-black/30" />
          Scroll — the story begins
        </motion.div>
      </section>

      {/* 1 — STORY OPEN: giant editorial statement */}
      <section className="flex h-screen overflow-hidden flex-col items-center justify-center px-6 text-center">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-6 !text-black/45">
          {storyOpen.eyebrow}
        </motion.p>
        <motion.h2
          {...fade}
          transition={{ duration: 0.7, delay: 0.06 }}
          className="max-w-5xl font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-7xl"
        >
          {storyOpen.title}
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.16 }} className="mt-7 max-w-xl text-black/55 md:text-lg">
          {storyOpen.line}
        </motion.p>
      </section>

      {/* 2–6 — CHAPTERS: big numbers, airy cards */}
      {chapters.map((c, i) => (
        <section
          key={c.key}
          className={`flex h-screen overflow-hidden items-center px-6 md:px-16 ${i % 2 === 1 ? 'justify-end' : ''}`}
        >
          <motion.div {...fade} transition={{ duration: 0.55 }} className="max-w-2xl">
            <div className="font-display text-7xl font-bold md:text-[7rem]" style={{ color: `${c.accent}2e` }}>
              {c.chapter}
            </div>
            <h2 className="-mt-6 font-display text-4xl font-bold tracking-tight md:-mt-10 md:text-6xl">
              {c.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/60 md:text-xl">{c.narrative}</p>
            <div className="glass-light mt-6 max-w-xl rounded-2xl p-5 md:p-6">
              <ul className="space-y-2.5">
                {c.points.map((pt, j) => (
                  <motion.li
                    key={pt}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.4 }}
                    transition={{ duration: 0.4, delay: 0.12 + j * 0.06 }}
                    className="flex items-center gap-3 text-sm text-black/75 md:text-base"
                  >
                    <span className="font-mono text-xs" style={{ color: c.accent }}>▸</span>
                    {pt}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>
      ))}

      {/* 7 — THE CLIMB: career arc, no dates, all trajectory */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-4xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-amber-700/80">
            {journey.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.6, delay: 0.05 }} className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            {journey.title}
          </motion.h2>
          <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-3 max-w-xl text-black/55">
            {journey.line}
          </motion.p>
          <div className="mt-8 md:mt-10">
            {journey.steps.map((s, i) => {
              const last = i === journey.steps.length - 1
              return (
                <motion.div
                  key={s.role}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-baseline gap-4 border-b border-black/[0.07] py-3 md:gap-6 md:py-4"
                  style={{ paddingLeft: `${i * 4}%` }}
                >
                  <span className="font-mono text-xs text-black/30">0{i + 1}</span>
                  <span
                    className={`font-display font-bold tracking-tight ${
                      last ? 'text-3xl text-amber-700 md:text-5xl' : 'text-xl text-black/75 md:text-3xl'
                    }`}
                  >
                    {s.role}
                  </span>
                  <span className="hidden text-sm text-black/40 md:inline">{s.note}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 8 — RECEIPTS */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-4xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-sky-700/80">
            {receipts.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-4xl font-bold tracking-tight md:text-6xl">
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
                className="glass-light rounded-2xl p-5 md:p-6"
              >
                <div className="font-display text-4xl font-bold text-sky-700 md:text-5xl">{r.metric}</div>
                <div className="mt-2 font-display text-sm font-semibold uppercase tracking-wide">{r.headline}</div>
                <p className="mt-2 text-sm leading-relaxed text-black/55">{r.story}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 — DIRECTOR'S CONSOLE */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-4xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-amber-700/80">
            {console_.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            {console_.title}
          </motion.h2>
          <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-3 max-w-xl text-black/55">
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
                className="glass-light rounded-xl p-4 md:p-5"
              >
                <div className="font-display text-3xl font-bold text-amber-700 md:text-4xl">{m.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-black/70">{m.label}</div>
                <div className="mt-1 text-[11px] text-black/45">{m.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — WORK WITH ME */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-4xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-emerald-700/80">
            {offerings.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            {offerings.title}
          </motion.h2>
          <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-3 max-w-xl text-black/55">
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
                className="pointer-events-auto glass-light group flex flex-col rounded-2xl p-5 transition hover:-translate-y-1 md:p-6"
              >
                <span className="w-fit rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: `${o.accent}55`, color: o.accent }}>
                  {o.duration}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{o.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60">{o.desc}</p>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-black/40">Deliverable</div>
                <div className="text-sm text-black/75">{o.deliverable}</div>
                <div className="mt-4 text-sm font-medium transition group-hover:translate-x-1" style={{ color: o.accent }}>
                  Book an intro call →
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — IRL photo gallery (3D prints behind) */}
      <section className="flex h-screen overflow-hidden flex-col items-center justify-end px-6 pb-16 text-center">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-black/45">
          {irl.eyebrow}
        </motion.p>
        <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          {irl.title}
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-3 max-w-md text-black/55">
          {irl.blurb}
        </motion.p>
      </section>

      {/* 12 — CONTACT / FINAL CTA */}
      <section className="flex h-screen overflow-hidden flex-col justify-center px-6 md:px-16">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-4 !text-black/45">
          {techContact.eyebrow}
        </motion.p>
        <motion.h2
          {...fade}
          transition={{ duration: 0.7, delay: 0.06 }}
          className="max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-8xl"
        >
          {techContact.title}
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.12 }} className="mt-6 max-w-md text-lg text-black/60">
          {techContact.blurb}
        </motion.p>
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.18 }} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${reach.email}`}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-7 py-3 font-medium text-white transition hover:opacity-85"
            style={{ background: INK }}
          >
            {reach.email} →
          </a>
          <a
            href={reach.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-3 font-medium text-black/75 transition hover:bg-black/5"
          >
            WhatsApp {reach.phone}
          </a>
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-3 font-medium text-black/75 transition hover:bg-black/5"
            >
              {s.label}
            </a>
          ))}
        </motion.div>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.26 }} className="mt-6 text-xs uppercase tracking-[0.25em] text-black/35">
          {reach.meets}
        </motion.p>
      </section>
    </div>
  )
}
