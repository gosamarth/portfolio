import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { profile } from '../data/content'

// ─────────────────────────────────────────────────────────────
//  Engine-start loading screen: a tachometer needle sweeps with
//  asset-load progress; on 100% the gauge redlines — IGNITION —
//  and the overlay fades out.
// ─────────────────────────────────────────────────────────────

const SWEEP_MIN = -120
const SWEEP_MAX = 120

export function IgnitionLoader() {
  const { progress } = useProgress()
  const [phase, setPhase] = useState<'loading' | 'ignition' | 'gone'>('loading')

  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      setPhase('ignition')
      const t1 = setTimeout(() => setPhase('gone'), 1100)
      return () => clearTimeout(t1)
    }
  }, [progress, phase])

  if (phase === 'gone') return null

  const angle = SWEEP_MIN + (Math.min(progress, 100) / 100) * (SWEEP_MAX - SWEEP_MIN)
  const igniting = phase === 'ignition'

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink transition-opacity duration-500 ${
        igniting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDelay: igniting ? '0.6s' : '0s' }}
    >
      <p className="eyebrow mb-6">{profile.name}</p>

      <div className="relative h-44 w-44">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* dial */}
          <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          {Array.from({ length: 13 }, (_, i) => {
            const a = ((SWEEP_MIN + (i / 12) * 240) * Math.PI) / 180
            const x1 = 50 + Math.sin(a) * 36
            const y1 = 54 - Math.cos(a) * 36
            const x2 = 50 + Math.sin(a) * 42
            const y2 = 54 - Math.cos(a) * 42
            return (
              <line
                key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={i >= 10 ? '#f0abfc' : 'rgba(255,255,255,0.3)'}
                strokeWidth="1.8" strokeLinecap="round"
              />
            )
          })}
          {/* needle sweeping with load progress */}
          <line
            x1="50" y1="54" x2="50" y2="16"
            stroke={igniting ? '#f0abfc' : '#6ee7ff'}
            strokeWidth="2.2" strokeLinecap="round"
            transform={`rotate(${igniting ? SWEEP_MAX : angle} 50 54)`}
            style={{
              transition: 'transform 0.25s ease-out',
              filter: `drop-shadow(0 0 6px ${igniting ? 'rgba(240,171,252,1)' : 'rgba(110,231,255,0.9)'})`,
            }}
          />
          <circle cx="50" cy="54" r="4" fill="#05060a" stroke="#6ee7ff" strokeWidth="1.5" />
        </svg>
        <div className="absolute inset-x-0 bottom-5 text-center font-display">
          <span className="text-2xl font-bold text-white">{Math.round(progress)}</span>
          <span className="ml-0.5 text-xs text-white/40">%</span>
        </div>
      </div>

      <p
        className={`mt-6 font-display text-sm font-semibold uppercase tracking-[0.45em] ${
          igniting ? 'animate-pulse text-glow' : 'text-white/50'
        }`}
      >
        {igniting ? 'Ignition' : 'Starting engine'}
      </p>
    </div>
  )
}
