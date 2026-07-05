import { motion } from 'framer-motion'
import { profile, about, projects, skills, contact } from '../data/content'
import { cars } from '../data/cars'
import { CarHud } from './CarHud'

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.4 },
}

/**
 * All DOM content laid over the 3D, inside drei's <Scroll html>.
 * Order and count MUST match src/journey.ts pages.
 */
export function Sections() {
  return (
    <div className="w-screen">
      {/* HERO */}
      <section className="flex h-screen overflow-hidden flex-col justify-center px-6 md:px-20">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-4">
          {profile.role} · {profile.location}
        </motion.p>
        <motion.h1
          {...fade}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-4xl font-display text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl"
        >
          Hi, I’m{' '}
          <span className="bg-gradient-to-r from-accent via-glow to-accent2 bg-clip-text text-transparent">
            {profile.name}
          </span>
        </motion.h1>
        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-xl text-lg text-white/70 md:text-xl"
        >
          {profile.tagline}
        </motion.p>
        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex items-center gap-3 text-sm text-white/50"
        >
          <span className="h-px w-8 bg-white/30" />
          Hit the throttle — scroll to launch
        </motion.div>
      </section>

      {/* ABOUT */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-20">
        <motion.div {...fade} transition={{ duration: 0.55 }} className="glass max-w-xl rounded-2xl p-8 md:p-10">
          <p className="eyebrow mb-3">{about.heading}</p>
          {about.body.map((p, i) => (
            <p key={i} className="mb-4 text-lg leading-relaxed text-white/80 last:mb-0">
              {p}
            </p>
          ))}
        </motion.div>
      </section>

      {/* GARAGE INTRO */}
      <section className="flex h-screen overflow-hidden flex-col items-center justify-center px-6 text-center">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-5">
          Now entering
        </motion.p>
        <motion.h2
          {...fade}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="font-display text-6xl font-bold uppercase tracking-tight md:text-8xl"
        >
          The{' '}
          <span className="bg-gradient-to-r from-accent to-glow bg-clip-text text-transparent">
            Garage
          </span>
        </motion.h2>
        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="mt-6 max-w-md text-white/60"
        >
          {cars.length} machines, {cars[0].year} counting back to{' '}
          {cars[cars.length - 1].year}. Newest first — the origin story parks at the end. Some
          still here. Some passed on. All loved.
        </motion.p>
        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex gap-6 text-xs uppercase tracking-[0.3em]"
        >
          <span className="text-accent">■ In garage</span>
          <span className="text-glow">■ Sold</span>
        </motion.div>
      </section>

      {/* THE CARS */}
      {cars.map((car, i) => (
        <CarHud key={car.slug} car={car} index={i} />
      ))}

      {/* WORK */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-20">
        <div className="w-full max-w-2xl">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-6">
            Built to prove it
          </motion.p>
          <div className="grid gap-4">
            {projects.map((proj, i) => (
              <motion.a
                key={proj.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                href={proj.href ?? '#'}
                className="pointer-events-auto glass group rounded-2xl p-6 transition hover:border-accent/40 hover:bg-white/[0.04]"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-semibold text-white">{proj.title}</h3>
                  <span className="text-accent opacity-0 transition group-hover:opacity-100">↗</span>
                </div>
                <p className="mt-2 text-white/70">{proj.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {proj.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="flex h-screen overflow-hidden items-center px-6 md:px-20">
        <div className="w-full">
          <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-6">
            {skills.heading}
          </motion.p>
          <div className="grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.groups.map((g, i) => (
              <motion.div
                key={g.label}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass rounded-2xl p-5"
              >
                <h3 className="mb-3 font-display font-semibold text-accent2">{g.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span key={item} className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-sm text-white/80">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="flex h-screen overflow-hidden flex-col justify-center px-6 md:px-20">
        <motion.p {...fade} transition={{ duration: 0.5 }} className="eyebrow mb-4">
          Contact
        </motion.p>
        <motion.h2
          {...fade}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="max-w-2xl font-display text-4xl font-bold leading-tight md:text-6xl"
        >
          {contact.heading}
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.12 }} className="mt-5 max-w-md text-lg text-white/70">
          {contact.body}
        </motion.p>
        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.18 }} className="mt-8 flex flex-wrap items-center gap-4">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-medium text-ink transition hover:bg-white"
            >
              {s.label} →
            </a>
          ))}
        </motion.div>
        <motion.p {...fade} transition={{ duration: 0.6, delay: 0.26 }} className="mt-12 text-xs text-white/30">
          Designed & engineered by {profile.name}. Rendered live in WebGL — react-three-fiber,
          AI-generated garage, zero templates.
        </motion.p>
      </section>
    </div>
  )
}
