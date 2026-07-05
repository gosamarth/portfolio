import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────
//  SECRET: unlocked after visiting BOTH worlds.
//  The one that isn't parked yet.
// ─────────────────────────────────────────────────────────────

export function DreamGarage({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-amber-300/30"
        style={{ boxShadow: '0 0 80px rgba(251,191,36,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src="/cars/dream-911.jpg" alt="Porsche 911 GT3 RS — the dream" className="w-full" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 md:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-amber-300">
            🔓 Secret unlocked · Dream garage
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
            Porsche 911 GT3 RS
          </h3>
          <p className="mt-1 text-sm text-white/65">
            Slot 09 — reserved. Manifested, not yet parked. You found this because you explored
            both worlds — that's exactly the kind of curiosity I hire for.
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-white/25 px-3 py-1 text-xs uppercase tracking-widest text-white/70 transition hover:bg-white/10"
        >
          Esc
        </button>
      </motion.div>
    </motion.div>
  )
}
