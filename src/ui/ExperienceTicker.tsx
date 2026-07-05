import { useEffect, useState } from 'react'
import { CAREER_EPOCH } from '../data/tech'

// ─────────────────────────────────────────────────────────────
//  A decade, live. Counts every second of the career — proof
//  that the clock never stopped.
// ─────────────────────────────────────────────────────────────

function diffParts(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  const h = to.getHours().toString().padStart(2, '0')
  const m = to.getMinutes().toString().padStart(2, '0')
  const s = to.getSeconds().toString().padStart(2, '0')
  return { years, months, days, clock: `${h}:${m}:${s}` }
}

export function ExperienceTicker() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const start = new Date(CAREER_EPOCH)
  const d = diffParts(start, now)

  return (
    <div className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono">
      <span>
        <span className="text-3xl font-bold text-ink md:text-4xl">{d.years}</span>
        <span className="ml-1 text-xs uppercase tracking-widest text-black/40">yrs</span>
      </span>
      <span>
        <span className="text-3xl font-bold text-ink md:text-4xl">{d.months}</span>
        <span className="ml-1 text-xs uppercase tracking-widest text-black/40">mo</span>
      </span>
      <span>
        <span className="text-3xl font-bold text-ink md:text-4xl">{d.days}</span>
        <span className="ml-1 text-xs uppercase tracking-widest text-black/40">days</span>
      </span>
      <span className="text-sm tabular-nums text-black/35">{d.clock}</span>
      <span className="w-full text-[11px] uppercase tracking-[0.3em] text-black/40 md:w-auto">
        of building — and counting
      </span>
    </div>
  )
}
