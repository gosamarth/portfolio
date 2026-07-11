import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { beep, sfxVictory } from './trials'

// ─────────────────────────────────────────────────────────────
//  KNOCKKNOCK — the champion's re-entry. Three knocks, a glitch,
//  a flash of light, and the door simply opens.
// ─────────────────────────────────────────────────────────────

const LINES = ['KNOCK KNOCK.', "WHO'S THERE.", 'A CHAMPION.']

export function CheatSplash({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    // two heavy knocks, then the reveal
    beep(82, 0.14, 'sine', 0.12)
    const t1 = setTimeout(() => beep(82, 0.14, 'sine', 0.12), 260)
    const t2 = setTimeout(() => setLine(1), 750)
    const t3 = setTimeout(() => setLine(2), 1450)
    const t4 = setTimeout(() => {
      setFlash(true)
      sfxVictory()
    }, 2150)
    const t5 = setTimeout(onDone, 2750)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050609]">
      {/* scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }}
      />
      {/* expanding ring per knock */}
      <motion.div
        key={line}
        initial={{ scale: 0.3, opacity: 0.6 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="pointer-events-none absolute h-72 w-72 rounded-full border-2 border-accent"
      />
      <motion.p
        key={`l${line}`}
        initial={{ opacity: 0, scale: 1.15, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.28 }}
        className="relative font-display text-4xl font-bold uppercase tracking-[0.15em] text-white md:text-7xl"
        style={{ textShadow: '0 0 50px rgba(110,231,255,0.6), 3px 0 0 rgba(240,171,252,0.35), -3px 0 0 rgba(110,231,255,0.35)' }}
      >
        {LINES[line]}
      </motion.p>
      {/* white-out exit */}
      {flash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.9] }}
          transition={{ duration: 0.55 }}
          className="pointer-events-none absolute inset-0 bg-white"
        />
      )}
    </div>
  )
}
