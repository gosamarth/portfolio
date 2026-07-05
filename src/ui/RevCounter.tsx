import { useEffect, useRef } from 'react'
import { scrollState } from '../scrollBridge'

// ─────────────────────────────────────────────────────────────
//  Bottom-right tachometer HUD:
//  · needle + km/h readout driven by live scroll velocity
//  · thin outer arc = journey progress
// ─────────────────────────────────────────────────────────────

const NEEDLE_MIN = -120 // deg at 0 km/h
const NEEDLE_MAX = 120 // deg at VMAX
const VMAX = 250

export function RevCounter() {
  const needleRef = useRef<SVGLineElement>(null)
  const speedRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    let raf = 0
    let last = scrollState.offset
    let lastT = performance.now()
    let speed = 0

    const tick = (t: number) => {
      const dt = Math.max((t - lastT) / 1000, 1e-4)
      lastT = t
      const dOff = Math.abs(scrollState.offset - last)
      last = scrollState.offset

      // offset/sec → fake km/h, smoothed like a real damped needle
      const target = Math.min((dOff / dt) * 1400, VMAX)
      speed += (target - speed) * Math.min(dt * 6, 1)

      const v = Math.round(speed)
      const angle = NEEDLE_MIN + (speed / VMAX) * (NEEDLE_MAX - NEEDLE_MIN)
      if (needleRef.current)
        needleRef.current.setAttribute('transform', `rotate(${angle} 50 54)`)
      if (speedRef.current) speedRef.current.textContent = String(v)
      if (progressRef.current) {
        const C = 2 * Math.PI * 46
        progressRef.current.style.strokeDashoffset = String(
          C * (1 - scrollState.offset),
        )
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-20 hidden md:block">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* journey progress ring */}
          <circle
            cx="50" cy="50" r="46"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"
          />
          <circle
            ref={progressRef}
            cx="50" cy="50" r="46"
            fill="none" stroke="#6ee7ff" strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={String(2 * Math.PI * 46)}
            strokeDashoffset={String(2 * Math.PI * 46)}
            transform="rotate(-90 50 50)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(110,231,255,0.8))' }}
          />
          {/* tach tick marks */}
          {Array.from({ length: 9 }, (_, i) => {
            const a = ((NEEDLE_MIN + (i / 8) * 240) * Math.PI) / 180
            const x1 = 50 + Math.sin(a) * 34
            const y1 = 54 - Math.cos(a) * 34
            const x2 = 50 + Math.sin(a) * 39
            const y2 = 54 - Math.cos(a) * 39
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={i >= 7 ? '#f0abfc' : 'rgba(255,255,255,0.35)'}
                strokeWidth="1.6" strokeLinecap="round"
              />
            )
          })}
          {/* needle */}
          <line
            ref={needleRef}
            x1="50" y1="54" x2="50" y2="20"
            stroke="#f0abfc" strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${NEEDLE_MIN} 50 54)`}
            style={{ filter: 'drop-shadow(0 0 4px rgba(240,171,252,0.9))' }}
          />
          <circle cx="50" cy="54" r="3.5" fill="#0b0e17" stroke="#f0abfc" strokeWidth="1.5" />
        </svg>
        <div className="absolute inset-x-0 bottom-3 text-center font-display leading-none">
          <span ref={speedRef} className="text-lg font-bold text-white">0</span>
          <span className="ml-1 text-[9px] uppercase tracking-widest text-white/40">km/h</span>
        </div>
      </div>
    </div>
  )
}
