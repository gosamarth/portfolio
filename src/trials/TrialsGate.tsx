import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  MAGIC_WORD, type Player, type TrialStats, isMuted, loadPlayer, markTrialsCleared,
  rankTitle, savePlayer, setMuted, sfxFail, sfxGo, sfxLight, sfxPass, sfxTap,
  sfxVictory, submitLead,
} from './trials'

// ─────────────────────────────────────────────────────────────
//  THE TRIALS — a five-stage arcade gauntlet guarding the
//  portfolio. Full-screen, neon-on-carbon, 2026 pro-gamer.
// ─────────────────────────────────────────────────────────────

type Stage = 'intro' | 'register' | 'overdrive' | 'typing' | 'inspect' | 'reaction' | 'victory'

const STAGE_ORDER: Stage[] = ['intro', 'register', 'overdrive', 'typing', 'inspect', 'reaction', 'victory']
const TRIAL_LABELS = ['REG', 'OVR', 'WPM', 'DOM', 'RXN']

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

// shared shell chrome ------------------------------------------------------
function Brackets() {
  return (
    <>
      {(['left-3 top-3 border-l-2 border-t-2', 'right-3 top-3 border-r-2 border-t-2',
        'left-3 bottom-3 border-l-2 border-b-2', 'right-3 bottom-3 border-r-2 border-b-2'] as const).map((c) => (
        <span key={c} className={`pointer-events-none absolute h-8 w-8 border-accent/60 ${c}`} />
      ))}
    </>
  )
}

function StageHeader({ stage, skips }: { stage: Stage; skips: number }) {
  const idx = STAGE_ORDER.indexOf(stage) - 1 // register = 0
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-2 px-4 py-4 md:flex-row md:justify-between md:px-10 md:py-5">
      <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
        The Trials <span className="hidden text-white/35 md:inline">// gosamarth.com</span>
      </span>
      <div className="flex items-center gap-2">
        {TRIAL_LABELS.map((l, i) => (
          <span
            key={l}
            className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] transition-colors duration-500 ${
              i < idx ? 'border-emerald-400/70 text-emerald-300'
              : i === idx ? 'border-accent text-accent shadow-[0_0_12px_rgba(110,231,255,0.45)]'
              : 'border-white/15 text-white/30'
            }`}
          >
            {l}
          </span>
        ))}
        {skips > 0 && (
          <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
            skips {skips}
          </span>
        )}
      </div>
    </div>
  )
}

const stepAnim = {
  initial: { opacity: 0, y: 34, scale: 0.985, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -30, scale: 0.99, filter: 'blur(6px)' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
}

function TrialTitle({ index, title, sub }: { index: string; title: string; sub: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-accent">{index}</p>
      <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/55 md:text-base">{sub}</p>
    </div>
  )
}

function NeonButton({
  children, onClick, tone = 'cyan', className = '',
}: { children: React.ReactNode; onClick: () => void; tone?: 'cyan' | 'ghost' | 'amber'; className?: string }) {
  const tones = {
    cyan: 'border-accent bg-accent/10 text-accent hover:bg-accent hover:text-ink shadow-[0_0_24px_rgba(110,231,255,0.25)]',
    ghost: 'border-white/20 text-white/60 hover:border-white/45 hover:text-white',
    amber: 'border-amber-400/70 text-amber-300 hover:bg-amber-400 hover:text-ink',
  }
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

function FailBar({ onRetry, onSkip, showSkip, note }: { onRetry: () => void; onSkip: () => void; showSkip: boolean; note: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col items-center gap-4">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-rose-400">{note}</p>
      <div className="flex gap-3">
        <NeonButton onClick={onRetry}>Retry</NeonButton>
        {showSkip && (
          <NeonButton onClick={onSkip} tone="amber">
            Surrender this trial →
          </NeonButton>
        )}
      </div>
    </motion.div>
  )
}

// 1 ── REGISTER ------------------------------------------------------------
function RegisterStep({ onDone }: { onDone: (p: Player) => void }) {
  const saved = loadPlayer()
  const [name, setName] = useState(saved?.name ?? '')
  const [email, setEmail] = useState(saved?.email ?? '')
  const [phone, setPhone] = useState(saved?.phone ?? '')
  const [err, setErr] = useState('')

  const submit = () => {
    if (name.trim().length < 2) return setErr('A player tag needs at least 2 characters.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setErr('That email would bounce. Try the real one.')
    if (phone.replace(/\D/g, '').length < 8) return setErr('That phone number is missing digits.')
    const p = { name: name.trim(), email: email.trim(), phone: phone.trim() }
    savePlayer(p)
    submitLead(p, 'register')
    sfxPass()
    onDone(p)
  }

  const field =
    'w-full rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 font-mono text-sm text-white placeholder-white/25 outline-none transition focus:border-accent focus:shadow-[0_0_18px_rgba(110,231,255,0.2)]'

  return (
    <motion.div {...stepAnim} className="flex w-full max-w-md flex-col items-center px-6">
      <TrialTitle
        index="Player Registration"
        title="Insert Coin"
        sub="Five trials guard the portfolio. Register your player tag — champions get remembered, quitters get emailed."
      />
      <div className="mt-8 flex w-full flex-col gap-3">
        <input className={field} placeholder="PLAYER NAME" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        <input className={field} placeholder="EMAIL" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" />
        <input className={field} placeholder="PHONE" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
      </div>
      {err && <p className="mt-3 font-mono text-xs uppercase tracking-widest text-rose-400">{err}</p>}
      <NeonButton className="mt-7" onClick={submit}>
        Enter the arena →
      </NeonButton>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
        Contact goes to Samarth only. No spam — maybe one legendary email.
      </p>
    </motion.div>
  )
}

// 2 ── OVERDRIVE (spacebar / tap mash) --------------------------------------
function OverdriveStep({ onDone, onSkip, skippable }: { onDone: (s: TrialStats) => void; onSkip: () => void; skippable: boolean }) {
  const touch = isTouch()
  const NEED = touch ? 22 : 25
  const TIME = 5
  const [count, setCount] = useState(0)
  const [left, setLeft] = useState(TIME)
  const [phase, setPhase] = useState<'idle' | 'run' | 'fail'>('idle')
  const [fails, setFails] = useState(0)
  const startRef = useRef(0)
  const countRef = useRef(0)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const hit = useCallback(() => {
    if (phaseRef.current === 'fail') return
    if (phaseRef.current === 'idle') {
      setPhase('run')
      startRef.current = performance.now()
    }
    sfxTap()
    countRef.current += 1
    setCount(countRef.current)
    if (countRef.current >= NEED) {
      const secs = (performance.now() - startRef.current) / 1000
      sfxPass()
      onDone({ taps: countRef.current, tapsPerSec: Math.round((countRef.current / Math.max(secs, 0.1)) * 10) / 10 })
    }
  }, [NEED, onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        hit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hit])

  useEffect(() => {
    if (phase !== 'run') return
    const t = setInterval(() => {
      const remain = TIME - (performance.now() - startRef.current) / 1000
      setLeft(Math.max(0, remain))
      if (remain <= 0) {
        clearInterval(t)
        sfxFail()
        setFails((f) => f + 1)
        setPhase('fail')
      }
    }, 50)
    return () => clearInterval(t)
  }, [phase])

  const reset = () => {
    countRef.current = 0
    setCount(0)
    setLeft(TIME)
    setPhase('idle')
  }

  return (
    <motion.div {...stepAnim} className="flex w-full max-w-lg flex-col items-center px-6" onPointerDown={touch ? hit : undefined}>
      <TrialTitle
        index="Trial 01 · Overdrive"
        title="Redline It"
        sub={touch ? `Tap the screen ${NEED} times in ${TIME} seconds. The clock starts on your first tap.` : `Hit SPACE ${NEED} times in ${TIME} seconds. The clock starts on your first press.`}
      />
      <motion.div
        key={count}
        initial={{ scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        className="mt-8 font-display text-8xl font-bold tabular-nums text-white md:text-9xl"
        style={{ textShadow: '0 0 42px rgba(110,231,255,0.5)' }}
      >
        {count}
        <span className="text-3xl text-white/30 md:text-4xl">/{NEED}</span>
      </motion.div>
      <div className="mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-75 ${left < 1.5 ? 'bg-rose-500' : 'bg-accent'}`}
          style={{ width: `${(left / TIME) * 100}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-sm tabular-nums text-white/40">{left.toFixed(1)}s</p>
      {phase === 'fail' && (
        <FailBar note="Engine stalled — too slow" onRetry={reset} onSkip={onSkip} showSkip={skippable && fails >= 1} />
      )}
      {phase === 'idle' && (
        <p className="mt-6 animate-pulse font-mono text-xs uppercase tracking-[0.4em] text-accent">
          {touch ? '— tap to launch —' : '— press space to launch —'}
        </p>
      )}
    </motion.div>
  )
}

// 3 ── WPM SPRINT ------------------------------------------------------------
const PHRASES = [
  'agents write code while directors make the calls',
  'ship the system then let the system ship',
  'autonomous fleets need a human on the pit wall',
]

function TypingStep({ onDone, onSkip, skippable }: { onDone: (s: TrialStats) => void; onSkip: () => void; skippable: boolean }) {
  const phrase = useMemo(() => PHRASES[Math.floor(Math.random() * PHRASES.length)], [])
  const TIME = 16
  const [typed, setTyped] = useState('')
  const [left, setLeft] = useState(TIME)
  const [phase, setPhase] = useState<'idle' | 'run' | 'fail'>('idle')
  const [fails, setFails] = useState(0)
  const startRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [phase])

  useEffect(() => {
    if (phase !== 'run') return
    const t = setInterval(() => {
      const remain = TIME - (performance.now() - startRef.current) / 1000
      setLeft(Math.max(0, remain))
      if (remain <= 0) {
        clearInterval(t)
        sfxFail()
        setFails((f) => f + 1)
        setPhase('fail')
      }
    }, 60)
    return () => clearInterval(t)
  }, [phase])

  const onChange = (v: string) => {
    if (phase === 'fail') return
    if (phase === 'idle' && v.length > 0) {
      setPhase('run')
      startRef.current = performance.now()
    }
    setTyped(v)
    if (v === phrase) {
      const secs = (performance.now() - startRef.current) / 1000
      const wpm = Math.round(phrase.length / 5 / (secs / 60))
      sfxPass()
      onDone({ wpm })
    }
  }

  const reset = () => {
    setTyped('')
    setLeft(TIME)
    setPhase('idle')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <motion.div {...stepAnim} className="flex w-full max-w-2xl flex-col items-center px-6">
      <TrialTitle
        index="Trial 02 · WPM Sprint"
        title="Type or Retire"
        sub={`Reproduce the line below in under ${TIME} seconds. Every character counts — literally.`}
      />
      <div
        className="mt-8 w-full cursor-text rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-center font-mono text-lg leading-relaxed md:text-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        {phrase.split('').map((ch, i) => {
          const t = typed[i]
          const state = t == null ? 'pending' : t === ch ? 'ok' : 'bad'
          return (
            <span
              key={i}
              className={
                state === 'ok' ? 'text-emerald-300'
                : state === 'bad' ? 'bg-rose-500/30 text-rose-300'
                : i === typed.length ? 'animate-pulse border-b-2 border-accent text-white/45'
                : 'text-white/45'
              }
            >
              {ch}
            </span>
          )
        })}
      </div>
      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 w-full max-w-md rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-center font-mono text-sm text-white outline-none focus:border-accent"
        placeholder="type here — go"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
      <div className="mt-5 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-75 ${left < 4 ? 'bg-rose-500' : 'bg-accent'}`}
          style={{ width: `${(left / TIME) * 100}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-sm tabular-nums text-white/40">{left.toFixed(1)}s</p>
      {phase === 'fail' && (
        <FailBar note="Out of time — fingers too polite" onRetry={reset} onSkip={onSkip} showSkip={skippable && fails >= 1} />
      )}
    </motion.div>
  )
}

// 4 ── THE HIDDEN WORD --------------------------------------------------------
function InspectStep({ onDone, onSkip, skippable }: { onDone: (s: TrialStats) => void; onSkip: () => void; skippable: boolean }) {
  const touch = isTouch()
  const [guess, setGuess] = useState('')
  const [fails, setFails] = useState(0)
  const [shake, setShake] = useState(0)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    // the trial itself whispers into the console — devs will hear it
    console.log(
      '%cTRIAL 03 // THE HIDDEN WORD',
      'color:#6ee7ff;font-size:16px;font-weight:bold;font-family:monospace',
    )
    console.log(
      '%cThe DOM keeps secrets. Somewhere in this document sleeps a tag no HTML spec ever blessed. Its name is the word.',
      'color:#8b8fa3;font-family:monospace',
    )
  }, [])

  const submit = () => {
    if (guess.trim().toLowerCase() === MAGIC_WORD) {
      sfxPass()
      onDone({ foundWord: true })
    } else {
      sfxFail()
      setFails((f) => f + 1)
      setShake((s) => s + 1)
    }
  }

  return (
    <motion.div {...stepAnim} className="flex w-full max-w-xl flex-col items-center px-6">
      <TrialTitle
        index="Trial 03 · The Hidden Word"
        title="Inspect Reality"
        sub={
          touch
            ? 'A magic word is sealed inside this page for those with devtools. On a phone, decode the cipher below instead.'
            : 'A magic word hides in this very page. View the source. Inspect the elements. Real engineers carry a crowbar.'
        }
      />
      {touch ? (
        <p className="mt-6 rounded-xl border border-white/12 bg-white/[0.03] px-6 py-4 font-mono text-lg tracking-widest text-accent">
          U2FtYWthZGFicmE=
        </p>
      ) : (
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-white/30">
          hint: the console is already talking to you
        </p>
      )}
      <motion.div
        key={shake}
        animate={{ x: shake ? [0, -12, 12, -8, 8, 0] : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6 flex w-full max-w-md gap-2"
      >
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-center font-mono text-base tracking-[0.2em] text-white outline-none focus:border-accent"
          placeholder="SPEAK THE WORD"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        <NeonButton className="!px-5 shrink-0" onClick={submit}>Cast</NeonButton>
      </motion.div>
      {fails > 0 && (
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-rose-400">
          The gate does not recognise that incantation.
        </p>
      )}
      <div className="mt-6 flex gap-3">
        {fails >= 2 && !hint && (
          <NeonButton tone="ghost" onClick={() => setHint(true)}>
            Buy a hint
          </NeonButton>
        )}
        {skippable && fails >= 2 && (
          <NeonButton tone="amber" onClick={onSkip}>
            Surrender this trial →
          </NeonButton>
        )}
      </div>
      {hint && (
        <p className="mt-4 max-w-sm text-center font-mono text-xs leading-relaxed text-white/45">
          {touch
            ? 'The cipher is base64. Any decoder — or a sharp mind — will read it.'
            : 'Right-click → Inspect. In the <body> lives an element whose TAG NAME is the word itself. It starts with the same letters as this site\'s owner.'}
        </p>
      )}
    </motion.div>
  )
}

// 5 ── LIGHTS OUT (F1 reaction) ----------------------------------------------
function ReactionStep({ onDone, onSkip, skippable }: { onDone: (s: TrialStats) => void; onSkip: () => void; skippable: boolean }) {
  const NEED_MS = 480
  const ATTEMPTS = 3
  const [lights, setLights] = useState(0) // 0..5 lit
  const [phase, setPhase] = useState<'idle' | 'arming' | 'armed' | 'result' | 'fail'>('idle')
  const [ms, setMs] = useState<number | null>(null)
  const [best, setBest] = useState<number | null>(null)
  const [attempt, setAttempt] = useState(0)
  const goRef = useRef(0)
  const timers = useRef<number[]>([])
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const arm = useCallback(() => {
    clearTimers()
    setMs(null)
    setLights(0)
    setPhase('arming')
    for (let i = 1; i <= 5; i++) {
      timers.current.push(
        window.setTimeout(() => {
          setLights(i)
          sfxLight()
        }, i * 620),
      )
    }
    const hold = 5 * 620 + 500 + Math.random() * 1400
    timers.current.push(
      window.setTimeout(() => {
        setLights(0)
        goRef.current = performance.now()
        setPhase('armed')
        sfxGo()
      }, hold),
    )
  }, [])

  const react = useCallback(() => {
    if (phaseRef.current === 'idle' || phaseRef.current === 'result' || phaseRef.current === 'fail') return
    if (phaseRef.current === 'arming') {
      // jump start
      clearTimers()
      sfxFail()
      setMs(-1)
      setAttempt((a) => a + 1)
      setPhase('result')
      return
    }
    const t = Math.round(performance.now() - goRef.current)
    setMs(t)
    setBest((b) => (b == null || t < b ? t : b))
    setAttempt((a) => a + 1)
    setPhase('result')
    if (t <= NEED_MS) sfxPass()
    else sfxFail()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        react()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimers()
    }
  }, [react])

  useEffect(() => {
    if (phase !== 'result') return
    const passed = ms != null && ms > 0 && ms <= NEED_MS
    if (passed) {
      const t = setTimeout(() => onDone({ reactionMs: best ?? ms! }), 1400)
      return () => clearTimeout(t)
    }
    if (attempt >= ATTEMPTS) {
      const t = setTimeout(() => setPhase('fail'), 900)
      return () => clearTimeout(t)
    }
  }, [phase, ms, attempt, best, onDone])

  return (
    <motion.div {...stepAnim} className="flex w-full max-w-xl flex-col items-center px-6" onPointerDown={react}>
      <TrialTitle
        index="Final Trial · Lights Out"
        title="Race Start"
        sub={`Five reds, then darkness. React under ${NEED_MS}ms when the lights go OUT. Jump the start and you're done. ${ATTEMPTS} attempts.`}
      />
      <div className="mt-9 flex gap-3 md:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-14 w-14 rounded-full border-2 transition-all duration-150 md:h-16 md:w-16 ${
              lights >= i
                ? 'border-rose-400 bg-rose-500 shadow-[0_0_34px_rgba(244,63,94,0.8)]'
                : 'border-white/15 bg-white/[0.04]'
            }`}
          />
        ))}
      </div>
      <div className="mt-8 flex h-24 flex-col items-center justify-center">
        {phase === 'idle' && <NeonButton onClick={arm}>Arm the start</NeonButton>}
        {phase === 'arming' && (
          <p className="font-mono text-sm uppercase tracking-[0.4em] text-white/45">hold… hold…</p>
        )}
        {phase === 'armed' && (
          <p className="animate-pulse font-display text-4xl font-bold uppercase text-emerald-300" style={{ textShadow: '0 0 30px rgba(52,211,153,0.8)' }}>
            GO
          </p>
        )}
        {phase === 'result' && ms === -1 && (
          <div className="text-center">
            <p className="font-display text-3xl font-bold uppercase text-rose-400">Jump start</p>
            {attempt < ATTEMPTS && <NeonButton className="mt-4" onClick={arm}>Again</NeonButton>}
          </div>
        )}
        {phase === 'result' && ms != null && ms > 0 && (
          <div className="text-center">
            <p className={`font-display text-5xl font-bold tabular-nums ${ms <= NEED_MS ? 'text-emerald-300' : 'text-rose-400'}`}>
              {ms}
              <span className="text-xl">ms</span>
            </p>
            {ms > NEED_MS && attempt < ATTEMPTS && (
              <NeonButton className="mt-4" onClick={arm}>
                Again ({ATTEMPTS - attempt} left)
              </NeonButton>
            )}
          </div>
        )}
        {phase === 'fail' && (
          <FailBar note="Out of attempts" onRetry={() => { setAttempt(0); setBest(null); arm() }} onSkip={onSkip} showSkip={skippable} />
        )}
      </div>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">
        attempt {Math.min(attempt + 1, ATTEMPTS)}/{ATTEMPTS}
        {best != null && ` · best ${best}ms`}
      </p>
    </motion.div>
  )
}

// 6 ── VICTORY -----------------------------------------------------------------
function VictoryStep({ player, stats, onEnter }: { player: Player; stats: TrialStats; onEnter: () => void }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    sfxVictory()
    markTrialsCleared()
    submitLead(player, 'victory', stats)
  }, [player, stats])

  const title = rankTitle(stats)
  const shareText = `I cleared THE TRIALS on Samarth's portfolio — rank: ${title}${
    stats.reactionMs ? `, reaction ${stats.reactionMs}ms` : ''
  }${stats.wpm ? `, ${stats.wpm} WPM` : ''}. Think you're faster?`

  const share = async () => {
    const url = 'https://gosamarth.com'
    try {
      if (navigator.share) {
        await navigator.share({ title: 'THE TRIALS', text: shareText, url })
        return
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* ignore */
    }
  }

  const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border border-white/12 bg-white/[0.03] px-5 py-3 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-white">{value}</p>
    </div>
  )

  return (
    <motion.div {...stepAnim} className="flex w-full max-w-xl flex-col items-center px-6 text-center">
      {/* burst rays */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(110,231,255,0.16) 0%, rgba(240,171,252,0.07) 40%, transparent 70%)' }}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-emerald-300">Access granted</p>
      <h2
        className="mt-3 font-display text-5xl font-bold uppercase tracking-tight text-white md:text-7xl"
        style={{ textShadow: '0 0 60px rgba(110,231,255,0.45)' }}
      >
        Samakadabra
      </h2>
      <p className="mt-3 text-white/60">
        {player.name}, the gate is open. Official rank:{' '}
        <span className="font-semibold text-accent">{title}</span>
      </p>
      <div className="mt-7 grid w-full max-w-md grid-cols-3 gap-3">
        <Stat label="Taps /s" value={stats.tapsPerSec ? `${stats.tapsPerSec}` : '—'} />
        <Stat label="WPM" value={stats.wpm ? `${stats.wpm}` : '—'} />
        <Stat label="Reaction" value={stats.reactionMs ? `${stats.reactionMs}ms` : '—'} />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NeonButton onClick={onEnter}>Enter the portfolio →</NeonButton>
        <NeonButton tone="ghost" onClick={share}>
          {copied ? 'Copied — go brag' : 'Challenge a friend'}
        </NeonButton>
      </div>
    </motion.div>
  )
}

// ── THE GATE ──────────────────────────────────────────────────────────────
export function TrialsGate({ onVictory, onClose }: { onVictory: () => void; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>('intro')
  const [player, setPlayer] = useState<Player | null>(null)
  const [stats, setStats] = useState<TrialStats>({})
  const [muted, setMutedState] = useState(isMuted())
  const startRef = useRef(performance.now())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const advance = (from: Stage, extra?: TrialStats, skipped = false) => {
    const merged = {
      ...stats,
      ...(extra ?? {}),
      ...(skipped ? { skips: (stats.skips ?? 0) + 1 } : {}),
    }
    if (from === 'reaction') {
      merged.totalSec = Math.round((performance.now() - startRef.current) / 100) / 10
    }
    setStats(merged)
    setStage(STAGE_ORDER[STAGE_ORDER.indexOf(from) + 1])
  }

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-[#07080d] text-white">
      {/* animated grid floor + scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(110,231,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,255,0.5) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 55%, black 30%, transparent 75%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }}
      />
      <Brackets />
      <StageHeader stage={stage} skips={stats.skips ?? 0} />

      {/* mute + exit */}
      <div className="absolute bottom-5 left-6 z-10 flex gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
        <button
          className="pointer-events-auto transition hover:text-white/70"
          onClick={() => {
            setMuted(!muted)
            setMutedState(!muted)
          }}
        >
          sound {muted ? 'off' : 'on'}
        </button>
        <button className="pointer-events-auto transition hover:text-white/70" onClick={onClose}>
          esc · retreat
        </button>
      </div>

      <div className="relative flex h-full items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div key="intro" {...stepAnim} className="flex flex-col items-center px-6 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-accent">Restricted sector</p>
              <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight md:text-8xl">
                The<br />Trials
              </h1>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
                The portfolio doesn't open for tourists. Five trials stand between you and the
                story — speed, fingers, devtools, reflexes. Solve them and the word is yours.
              </p>
              <NeonButton className="mt-8" onClick={() => { sfxTap(); setStage('register') }}>
                I accept →
              </NeonButton>
            </motion.div>
          )}
          {stage === 'register' && (
            <RegisterStep key="reg" onDone={(p) => { setPlayer(p); advance('register') }} />
          )}
          {stage === 'overdrive' && (
            <OverdriveStep
              key="ovr"
              onDone={(s) => advance('overdrive', s)}
              onSkip={() => advance('overdrive', {}, true)}
              skippable
            />
          )}
          {stage === 'typing' && (
            <TypingStep
              key="wpm"
              onDone={(s) => advance('typing', s)}
              onSkip={() => advance('typing', {}, true)}
              skippable
            />
          )}
          {stage === 'inspect' && (
            <InspectStep
              key="dom"
              onDone={(s) => advance('inspect', s)}
              onSkip={() => advance('inspect', {}, true)}
              skippable
            />
          )}
          {stage === 'reaction' && (
            <ReactionStep
              key="rxn"
              onDone={(s) => advance('reaction', s)}
              onSkip={() => advance('reaction', {}, true)}
              skippable
            />
          )}
          {stage === 'victory' && player && (
            <VictoryStep key="win" player={player} stats={stats} onEnter={onVictory} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
