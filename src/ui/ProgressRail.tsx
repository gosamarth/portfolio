import { useEffect, useState } from 'react'
import { scrollState } from '../scrollBridge'
import { TECH_PAGES } from '../data/tech'

// ─────────────────────────────────────────────────────────────
//  A quiet map of the journey, pinned to the right edge of the
//  portfolio world. Shows where you are; click to travel.
// ─────────────────────────────────────────────────────────────

const STOPS: { page: number; label: string }[] = [
  { page: 0, label: 'Start' },
  { page: 1, label: 'The story' },
  { page: 3, label: 'Five shifts' },
  { page: 8, label: 'Where I plug in' },
  { page: 9, label: 'The climb' },
  { page: 10, label: 'Receipts' },
  { page: 12, label: 'Work with me' },
  { page: 13, label: 'Off duty' },
  { page: 14, label: 'Contact' },
]

export function ProgressRail() {
  const [page, setPage] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setPage(scrollState.offset * (TECH_PAGES - 1))
    }, 120)
    return () => clearInterval(t)
  }, [])

  const jump = (target: number) => {
    const el = document.querySelector('.overflow-y-auto')
    if (!el) return
    el.scrollTo({
      top: ((el.scrollHeight - el.clientHeight) * target) / (TECH_PAGES - 1),
      behavior: 'smooth',
    })
  }

  // a stop is active from its page until the next stop's page
  const activeIdx = STOPS.reduce((acc, s, i) => (page >= s.page - 0.5 ? i : acc), 0)

  return (
    <nav
      aria-label="Journey progress"
      className="pointer-events-none fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
    >
      {STOPS.map((s, i) => {
        const active = i === activeIdx
        return (
          <button
            key={s.label}
            onClick={() => jump(s.page)}
            className="group pointer-events-auto flex items-center gap-2.5"
            aria-label={`Go to ${s.label}`}
          >
            <span
              className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
                active ? 'text-black/70 opacity-100' : 'translate-x-1 text-black/35 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                active ? 'h-2.5 w-2.5 bg-[#121317]' : 'h-1.5 w-1.5 bg-black/25 group-hover:bg-black/50'
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}
