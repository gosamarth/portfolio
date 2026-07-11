import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────
//  Conversational toasts: the site talking back, quietly.
//  toast('...') from anywhere; each id fires once per session.
// ─────────────────────────────────────────────────────────────

type ToastMsg = { id: number; text: string; light: boolean }

let seq = 0
const fired = new Set<string>()
let push: ((t: ToastMsg) => void) | null = null

/** Show a one-liner. `once` dedupes by id for the whole session. */
export function toast(text: string, opts?: { once?: string; light?: boolean; delay?: number }) {
  const fire = () => {
    if (opts?.once) {
      if (fired.has(opts.once)) return
      fired.add(opts.once)
    }
    push?.({ id: ++seq, text, light: opts?.light ?? false })
  }
  if (opts?.delay) setTimeout(fire, opts.delay)
  else fire()
}

export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([])

  useEffect(() => {
    push = (t) => {
      setItems((cur) => [...cur.slice(-1), t])
      setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== t.id)), 4600)
    }
    return () => {
      push = null
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-6">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={`max-w-md rounded-full border px-5 py-2.5 text-center text-sm shadow-lg backdrop-blur-md ${
              t.light
                ? 'border-black/10 bg-white/85 text-black/75'
                : 'border-accent/25 bg-[#0b0e17]/85 text-white/85'
            }`}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
