// ─────────────────────────────────────────────────────────────
//  THE TRIALS — shared state, scoring, persistence, lead wire.
//  The portfolio world is guarded. Solve the gauntlet, or pay
//  the toll in contact details. Either way, Samarth wins.
// ─────────────────────────────────────────────────────────────

export const TRIALS_CLEARED_KEY = 'trials.cleared.v1'
export const TRIALS_PLAYER_KEY = 'trials.player.v1'
export const MAGIC_WORD = 'samakadabra'

export type Player = { name: string; email: string; phone: string }

export type TrialStats = {
  taps?: number
  tapsPerSec?: number
  wpm?: number
  foundWord?: boolean
  reactionMs?: number
  totalSec?: number
  skips?: number
}

export function trialsCleared(): boolean {
  try {
    return localStorage.getItem(TRIALS_CLEARED_KEY) === '1'
  } catch {
    return false
  }
}

export function markTrialsCleared() {
  try {
    localStorage.setItem(TRIALS_CLEARED_KEY, '1')
  } catch {
    /* private mode — the gate just asks again next time */
  }
}

export function savePlayer(p: Player) {
  try {
    localStorage.setItem(TRIALS_PLAYER_KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

export function loadPlayer(): Player | null {
  try {
    const raw = localStorage.getItem(TRIALS_PLAYER_KEY)
    return raw ? (JSON.parse(raw) as Player) : null
  } catch {
    return null
  }
}

/** Fire-and-forget lead post — the SWA function writes it to Table Storage. */
export function submitLead(player: Player, stage: 'register' | 'victory', stats?: TrialStats) {
  try {
    void fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...player, stage, stats: stats ?? {} }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* offline / dev — never block the game */
  }
}

/** Rank title from the final scorecard — the shareable flex. */
export function rankTitle(s: TrialStats): string {
  const r = s.reactionMs ?? 9999
  if (s.skips && s.skips > 1) return 'Diplomatic Immunity'
  if (r < 240) return 'Lights-Out Legend'
  if (r < 320) return 'Podium Material'
  if (r < 480) return 'Track-Day Ready'
  return 'Sunday Driver'
}

// ── tiny synth SFX — no assets, WebAudio only ────────────────
let audioCtx: AudioContext | null = null
let muted = false

export function setMuted(m: boolean) {
  muted = m
}
export function isMuted() {
  return muted
}

function ctx(): AudioContext | null {
  if (muted) return null
  try {
    audioCtx ??= new (window.AudioContext || (window as any).webkitAudioContext)()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    return audioCtx
  } catch {
    return null
  }
}

export function beep(freq = 440, dur = 0.07, type: OscillatorType = 'square', gain = 0.035) {
  const c = ctx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(gain, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  o.connect(g).connect(c.destination)
  o.start()
  o.stop(c.currentTime + dur)
}

export function sfxTap() {
  beep(720, 0.045, 'square', 0.03)
}
export function sfxPass() {
  ;[523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'triangle', 0.05), i * 90))
}
export function sfxFail() {
  ;[196, 147].forEach((f, i) => setTimeout(() => beep(f, 0.16, 'sawtooth', 0.045), i * 110))
}
export function sfxLight() {
  beep(392, 0.09, 'sine', 0.045)
}
export function sfxGo() {
  beep(988, 0.18, 'square', 0.055)
}
export function sfxVictory() {
  ;[523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.16, 'triangle', 0.055), i * 110))
}
