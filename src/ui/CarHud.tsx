import { motion } from 'framer-motion'
import type { Car } from '../data/cars'

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.12 },
}

function Stat({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="min-w-[110px]">
      <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
        {label}
      </div>
      <div className="mt-0.5 font-display text-sm font-semibold text-white md:text-base">
        {value}
      </div>
    </div>
  )
}

export function CarHud({ car, index }: { car: Car; index: number }) {
  const owned = car.status === 'owned'
  return (
    <section className="relative flex h-screen overflow-hidden flex-col justify-end px-5 pb-10 md:px-16 md:pb-14">
      {/* top row — index + status stamp */}
      <div className="pointer-events-none absolute inset-x-5 top-20 flex items-start justify-between md:inset-x-16 md:top-24">
        <motion.div {...fade} transition={{ duration: 0.5 }}>
          <span className="font-display text-5xl font-bold text-white/15 md:text-7xl">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="ml-2 text-xs uppercase tracking-[0.3em] text-white/30">
            / {car.year}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
          viewport={{ amount: 0.15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className={`select-none border-[3px] px-4 py-1.5 font-display text-sm font-bold uppercase tracking-[0.35em] md:text-base ${
            owned
              ? 'border-accent text-accent shadow-[0_0_24px_rgba(110,231,255,0.35)]'
              : 'border-glow/90 text-glow/90 shadow-[0_0_24px_rgba(240,171,252,0.3)]'
          }`}
        >
          {owned ? 'In Garage' : 'Sold'}
        </motion.div>
      </div>

      {/* bottom HUD card */}
      <motion.div
        {...fade}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="glass max-w-2xl rounded-2xl p-5 md:p-7"
      >
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 shrink-0 rounded-full border border-white/30"
            style={{ background: car.colorHex }}
            title={car.color}
          />
          <h3 className="font-display text-2xl font-bold leading-none text-white md:text-3xl">
            {car.name}
          </h3>
        </div>
        <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-white/45">
          {car.fullName} · {car.color}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
          {car.story}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-4">
          <Stat label="Power" value={car.power} />
          <Stat label="Torque" value={car.torque} />
          <Stat label="0–100" value={car.zeroToHundred} />
          <Stat label="Top Speed" value={car.topSpeed} />
          <Stat label="Range" value={car.range} />
          <Stat label="Drive" value={car.drivetrain} />
        </div>

        <p className="mt-4 text-xs italic leading-relaxed text-white/40">
          {car.fact}
        </p>
      </motion.div>
    </section>
  )
}
