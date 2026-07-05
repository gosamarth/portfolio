// Single source of truth for the journey scroll.
// One formula drives everything: offset = scrollTop / (scrollHeight - clientHeight).
// The scroller writes it; the HTML overlay translates by exactly
// offset * (pages-1) * viewportHeight; the camera reads the same number.
// No library mapping in between — zero drift, ever.

export const JOURNEY_HTML_ID = 'journey-html'

export const scrollState = { offset: 0 }

// The active world sets its page count here (garage: 14, tech: 7).
let journeyPages = 14
export function setJourneyPages(n: number) {
  journeyPages = n
}

export function handleJourneyScroll(el: HTMLElement) {
  const max = el.scrollHeight - el.clientHeight
  const offset = max > 0 ? el.scrollTop / max : 0
  scrollState.offset = offset
  const html = document.getElementById(JOURNEY_HTML_ID)
  if (html) {
    const y = -offset * (journeyPages - 1) * window.innerHeight
    html.style.transform = `translate3d(0, ${y}px, 0)`
  }
}
