import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { reach } from '../data/tech'
import { loadPlayer, savePlayer, submitLead, type Player } from '../trials/trials'
import { toast } from './Toaster'
import type { WorldMode } from '../world'

// ─────────────────────────────────────────────────────────────
//  THE LOBBY: big tiles, one question each. Visitors pick a
//  mission, leave a line, and land exactly where they should.
// ─────────────────────────────────────────────────────────────

type Mission = {
  key: string
  icon: string
  title: string
  line: string
  prompt: string
  chips: string[]
  accent: string
  subject: string
}

const MISSIONS: Mission[] = [
  {
    key: 'build',
    icon: '⚡',
    title: 'Build me a product',
    line: 'Vision, no engine. Napkin to production in 30 to 90 days.',
    prompt: 'One line: what should exist that does not yet?',
    chips: ['MVP', 'AI-native', 'Azure', 'Mobile/Web'],
    accent: '#34d399',
    subject: 'Build me a product',
  },
  {
    key: 'ai',
    icon: '◎',
    title: 'Bring AI into my company',
    line: 'From slideware to systems. Agents, RAG, autonomous SDLC.',
    prompt: 'Where does your team lose the most hours today?',
    chips: ['Strategy sprint', 'Agent pilot', 'RAG assistant', 'SDLC'],
    accent: '#a78bfa',
    subject: 'Bring AI into my company',
  },
  {
    key: 'cloud',
    icon: '▲',
    title: 'Tame my cloud bill',
    line: 'Architecture reviews, FinOps, 99.95% uptime while the bill drops.',
    prompt: 'Roughly, what is the monthly bill and what runs on it?',
    chips: ['Azure', 'Cost audit', 'Reliability', 'DR'],
    accent: '#38bdf8',
    subject: 'Tame my cloud bill',
  },
  {
    key: 'team',
    icon: '⌘',
    title: 'Scale my engineering team',
    line: 'Org design, hiring bars, delivery cadence. Ten moving like thirty.',
    prompt: 'Team size today, and what is breaking first?',
    chips: ['Org design', 'Hiring', 'Fractional director'],
    accent: '#fbbf24',
    subject: 'Scale my engineering team',
  },
  {
    key: 'compliance',
    icon: '🛡',
    title: 'Ship in a regulated space',
    line: 'HIPAA, GDPR, SOC 2, PCI DSS. Pass the audit, keep the speed.',
    prompt: 'Which regulation is in your way right now?',
    chips: ['HIPAA', 'GDPR', 'SOC 2', 'PCI DSS'],
    accent: '#fb7185',
    subject: 'Ship in a regulated space',
  },
  {
    key: 'talk',
    icon: '✦',
    title: 'Just want to talk',
    line: 'Advice, second opinions, or a good conversation about engineering.',
    prompt: 'What is on your mind?',
    chips: ['Advice', 'Mentorship', 'Speaking', 'Coffee'],
    accent: '#e8eaf0',
    subject: 'Open conversation',
  },
]

function IntentPanel({ mission, onClose }: { mission: Mission; onClose: () => void }) {
  const saved = loadPlayer()
  const [note, setNote] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [name, setName] = useState(saved?.name ?? '')
  const [email, setEmail] = useState(saved?.email ?? '')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const mailHref = `mailto:${reach.email}?subject=${encodeURIComponent(`[${mission.subject}]`)}&body=${encodeURIComponent(
    `${note}\n\n— ${name || 'sent from gosamarth.com'}`,
  )}`

  const send = () => {
    if (name.trim().length < 2) return setErr('A name, at least. This is a lobby, not a confession booth.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setErr('A real email so Samarth can actually reply.')
    if (note.trim().length < 5 && picked.length === 0) return setErr('Give the mission one line or one chip.')
    const p: Player = { name: name.trim(), email: email.trim(), phone: saved?.phone ?? '' }
    savePlayer(p)
    submitLead(p, 'mission', {
      building: `[${mission.key}] ${picked.join(', ')}${picked.length && note ? ' · ' : ''}${note.trim()}`.slice(0, 400),
    })
    setSent(true)
    toast('Mission logged. Samarth reads these personally.', { light: false })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-lg rounded-3xl border border-white/12 bg-[#0d1017] p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `3px solid ${mission.accent}` }}
      >
        {!sent ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl">{mission.icon}</span>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">{mission.title}</h3>
                <p className="mt-1 text-sm text-white/55">{mission.line}</p>
              </div>
              <button onClick={onClose} className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-white/50 transition hover:text-white">
                esc
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {mission.chips.map((c) => {
                const on = picked.includes(c)
                return (
                  <button
                    key={c}
                    onClick={() => setPicked((cur) => (on ? cur.filter((x) => x !== c) : [...cur, c]))}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all ${
                      on ? 'text-ink' : 'text-white/60 hover:text-white'
                    }`}
                    style={on ? { background: mission.accent, borderColor: mission.accent } : { borderColor: 'rgba(255,255,255,0.18)' }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={mission.prompt}
              className="mt-4 w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 font-mono text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 font-mono text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              />
            </div>
            {err && <p className="mt-3 font-mono text-xs uppercase tracking-widest text-rose-400">{err}</p>}
            <button
              onClick={send}
              className="mt-5 w-full rounded-full py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-ink transition hover:opacity-90"
              style={{ background: mission.accent }}
            >
              Send the mission →
            </button>
          </>
        ) : (
          <div className="py-4 text-center">
            <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-4xl">
              {mission.icon}
            </motion.p>
            <h3 className="mt-3 font-display text-2xl font-bold text-white">Mission received.</h3>
            <p className="mt-2 text-sm text-white/55">
              Samarth replies within a day, usually faster. Want to jump the queue?
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={mailHref} className="pointer-events-auto rounded-full bg-white px-6 py-2.5 font-medium text-ink transition hover:opacity-85">
                Email now →
              </a>
              <a
                href={reach.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto rounded-full border border-white/25 px-6 py-2.5 font-medium text-white/85 transition hover:bg-white/10"
              >
                WhatsApp
              </a>
            </div>
            <button onClick={onClose} className="mt-5 font-mono text-xs uppercase tracking-[0.3em] text-white/35 transition hover:text-white/70">
              back to the lobby
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function Lobby({ onExit, onGo }: { onExit: () => void; onGo: (m: WorldMode) => void }) {
  const [open, setOpen] = useState<Mission | null>(null)

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-[#0a0b0f]">
      {/* dotted grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 40%, black 30%, transparent 78%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-20">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-[11px] uppercase tracking-[0.5em] text-accent">
          The Lobby
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-6xl"
        >
          What did you come for?
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mt-3 max-w-xl text-white/55">
          Pick a mission. One line from you, one reply from Samarth. No forms with eleven fields, no
          "someone from our team".
        </motion.p>

        <div className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((m, i) => (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
              whileHover={{ y: -6 }}
              onClick={() => setOpen(m)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-colors duration-300 hover:border-white/25"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-25"
                style={{ background: m.accent }}
              />
              <span className="text-2xl">{m.icon}</span>
              <h3 className="mt-3 font-display text-xl font-bold text-white">{m.title}</h3>
              <p className="mt-1.5 text-sm leading-snug text-white/50">{m.line}</p>
              <span
                className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.3em] transition-all duration-300 group-hover:translate-x-1"
                style={{ color: m.accent }}
              >
                dive in →
              </span>
            </motion.button>
          ))}
        </div>

        {/* crossroads */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onGo('arcade')}
            className="pointer-events-auto rounded-full border-2 border-glow/60 px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-glow transition hover:bg-glow hover:text-ink"
          >
            🕹 or hit The Arcade
          </button>
          <button
            onClick={onExit}
            className="pointer-events-auto rounded-full border border-white/20 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
          >
            ← back to the doors
          </button>
        </div>
      </div>

      <AnimatePresence>{open && <IntentPanel mission={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  )
}
