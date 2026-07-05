import { motion } from 'framer-motion'
import { profile } from '../data/content'
import {
  techHero, storyMoment, storyArrival, chapters, journey, receipts, console_,
  offerings, reach, irl, techContact,
} from '../data/tech'
import { ExperienceTicker } from './ExperienceTicker'

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.4 },
}

const INK = '#121317'

/** Film-title style line reveals: each line lands on its own beat. */
function Poem({
  lines, className = '', lineClass = '', delay = 0, amount = 0.35,
}: {
  lines: string[]
  className?: string
  lineClass?: string
  delay?: number
  amount?: number
}) {
  let beat = 0
  return (
    <div className={className}>
      {lines.map((ln, i) => {
        if (ln === '') return <div key={i} className="h-3 md:h-4" />
        beat += 1
        return (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount }}
            transition={{ duration: 0.5, delay: delay + beat * 0.09 }}
            className={lineClass}
          >
            {ln}
          </motion.p>
        )
      })}
    </div>
  )
}

/** HTML overlay for the porcelain Command Deck. Order matches src/data/tech.ts. */
export function TechSections() {
  return (
    <div className="w-screen" style={{ color: INK }}>
      {/* 0 — HERO */}
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
          <ExperienceTicker suffix={techHero.tickerSuffix} />
        </motion.div>
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 flex items-center gap-3 text-sm text-black/45">
          <span className="h-px w-8 bg-black/30" />
          {techHero.scrollHint}
        </motion.div>
      </section>

      {/* 1 — THE MOMENT */}
      <section className="flex h-screen overflow-hidden flex-col justify-center px-6 md:px-16">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-6 !text-black/45">
          {storyMoment.eyebrow}
        </motion.p>
        <motion.h2
          {...fade}
          transition={{ duration: 0.7, delay: 0.06 }}
          className="max-w-5xl font-display text-4xl font-bold leading-[1.03] tracking-tight md:text-7xl"
        >
          {storyMoment.title}
        </motion.h2>
        <Poem
          lines={storyMoment.lines}
          delay={0.25}
          className="mt-9"
          lineClass="font-display text-xl font-medium text-black/60 md:text-3xl md:leading-snug"
        />
      </section>

      {/* 2 — THE ARRIVAL */}
      <section className="flex h-screen overflow-hidden flex-col justify-center px-6 md:px-16">
        <Poem
          lines={storyArrival.lines}
          className="max-w-4xl"
          lineClass="font-display text-xl font-medium text-black/65 md:text-3xl md:leading-snug"
        />
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-10 font-display text-4xl font-bold tracking-tight md:text-6xl"
        >
          {storyArrival.closer}
        </motion.p>
      </section>

      {/* 3–7 — CHAPTERS: poem left, receipts of change right */}
      {chapters.map((c) => (
        <section key={c.key} className="flex h-screen overflow-hidden items-center px-6 md:px-16">
          <div className="grid w-full max-w-6xl items-center gap-8 md:grid-cols-[1.25fr,1fr] md:gap-14">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-6xl font-bold md:text-8xl" style={{ color: `${c.accent}30` }}>
                  {c.chapter}
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{c.title}</h2>
              </div>
              <Poem
                lines={c.lines}
                delay={0.15}
                amount={0.25}
                className="mt-6"
                lineClass="text-base font-medium text-black/65 md:text-xl md:leading-snug"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-light hidden rounded-2xl p-6 md:block"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: c.accent }}>
                {c.pointsTitle}
              </div>
              <ul className="mt-4 space-y-3">
                {c.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm leading-snug text-black/70">
                    <span className="mt-0.5 font-mono text-xs" style={{ color: c.accent }}>▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      ))}

      {/* 8 — THE CLIMB */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-5xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-amber-700/80">
            {journey.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.6, delay: 0.05 }} className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            {journey.title}
          </motion.h2>
          <motion.p {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="mt-2 text-black/50 md:text-lg">
            {journey.line}
          </motion.p>
          <div className="mt-6 md:mt-8">
            {journey.steps.map((s, i) => {
              const last = i === journey.steps.length - 1
              return (
                <motion.div
                  key={s.role}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.25 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border-b border-black/[0.07] py-2.5 md:py-3.5"
                  style={{ paddingLeft: `${i * 4}%` }}
                >
                  <div className="flex items-baseline gap-3 md:gap-5">
                    <span className="font-mono text-xs text-black/30">0{i + 1}</span>
                    <span
                      className={`font-display font-bold tracking-tight ${
                        last ? 'text-2xl text-amber-700 md:text-4xl' : 'text-xl text-black/80 md:text-3xl'
                      }`}
                    >
                      {s.role}
                    </span>
                  </div>
                  <p className="mt-1 hidden max-w-2xl text-sm leading-snug text-black/45 md:block">
                    {s.lines.join(' ')}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 9 — RECEIPTS */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-5xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-sky-700/80">
            {receipts.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            {receipts.title}
          </motion.h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {receipts.items.map((r, i) => (
              <motion.div
                key={r.headline}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass-light flex flex-col rounded-2xl p-5 md:p-6"
              >
                <div className="font-display text-4xl font-bold text-sky-700 md:text-5xl">{r.metric}</div>
                <div className="mt-2 font-display text-sm font-semibold uppercase tracking-wide">{r.headline}</div>
                <div className="mt-3 flex-1 space-y-1.5">
                  {r.lines.map((ln) => (
                    <p key={ln} className="text-sm leading-snug text-black/55">{ln}</p>
                  ))}
                </div>
                <div className="mt-4 border-t border-black/[0.07] pt-3">
                  {r.result.map((ln) => (
                    <p key={ln} className="text-sm font-semibold text-black/80">{ln}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — DIRECTOR'S CONSOLE */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="grid w-full max-w-6xl items-center gap-8 md:grid-cols-[1fr,1.3fr] md:gap-14">
          <div>
            <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-amber-700/80">
              {console_.eyebrow}
            </motion.p>
            <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold tracking-tight md:text-5xl">
              {console_.title}
            </motion.h2>
            <Poem
              lines={console_.lines}
              delay={0.2}
              className="mt-6"
              lineClass="text-base font-medium text-black/65 md:text-xl md:leading-snug"
            />
          </div>
          <div>
            <motion.p {...fade} transition={{ duration: 0.5, delay: 0.4 }} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/40">
              {console_.metricsTitle}
            </motion.p>
            <div className="grid grid-cols-2 gap-3">
              {console_.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ duration: 0.45, delay: 0.4 + i * 0.07 }}
                  className="glass-light rounded-xl p-4"
                >
                  <div className="font-display text-2xl font-bold text-amber-700 md:text-3xl">{m.value}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-black/70">{m.label}</div>
                  <div className="mt-1 text-[11px] text-black/45">{m.note}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11 — WORK WITH ME */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-6xl">
          <div className="md:flex md:items-end md:justify-between md:gap-10">
            <div>
              <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-emerald-700/80">
                {offerings.eyebrow}
              </motion.p>
              <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold tracking-tight md:text-5xl">
                {offerings.title}
              </motion.h2>
            </div>
            <Poem
              lines={offerings.lines}
              delay={0.15}
              className="mt-4 md:mt-0 md:max-w-xs md:text-right"
              lineClass="text-sm font-medium text-black/55 md:text-base"
            />
          </div>
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
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold" style={{ color: `${o.accent}45` }}>{o.num}</span>
                  <span className="rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ borderColor: `${o.accent}55`, color: o.accent }}>
                    {o.duration}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">{o.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide" style={{ color: o.accent }}>
                  {o.audience}
                </p>
                <p className="mt-2 flex-1 text-sm leading-snug text-black/60">{o.desc}</p>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-black/40">Deliverable</div>
                <div className="text-sm text-black/75">{o.deliverable}</div>
                <div className="mt-3 text-sm font-medium transition group-hover:translate-x-1" style={{ color: o.accent }}>
                  Book an intro call →
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 12 — OFF DUTY */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-16">
        <div className="w-full max-w-5xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-2 !text-black/45">
            {irl.eyebrow}
          </motion.p>
          <motion.h2 {...fade} transition={{ duration: 0.55, delay: 0.05 }} className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            {irl.title}
          </motion.h2>
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 md:gap-14">
            <Poem
              lines={irl.colA}
              amount={0.25}
              lineClass="text-base font-medium text-black/65 md:text-xl md:leading-snug"
            />
            <Poem
              lines={irl.colB}
              delay={0.3}
              amount={0.25}
              lineClass="text-base font-medium text-black/65 md:text-xl md:leading-snug"
            />
          </div>
        </div>
      </section>

      {/* 13 — OPEN CHANNEL */}
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
        <Poem
          lines={techContact.lines}
          delay={0.3}
          className="mt-7 max-w-2xl"
          lineClass="text-lg font-medium text-black/60 md:text-2xl md:leading-snug"
        />
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.8 }} className="mt-9 flex flex-wrap items-center gap-3">
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
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.9 }} className="mt-6 text-xs uppercase tracking-[0.25em] text-black/35">
          {reach.meets}
        </motion.p>
      </section>
    </div>
  )
}
