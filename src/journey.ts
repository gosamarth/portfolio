import { cars } from './data/cars'

// ─────────────────────────────────────────────────────────────
//  The scroll journey: one entry per full-viewport page.
//  3D camera flies PAGE_DEPTH units forward per page.
// ─────────────────────────────────────────────────────────────

export const PAGE_DEPTH = 13
export const CAM_START_Z = 8

export type PageDef =
  | { kind: 'hero' }
  | { kind: 'about' }
  | { kind: 'garage-intro' }
  | { kind: 'car'; carIndex: number }
  | { kind: 'work' }
  | { kind: 'skills' }
  | { kind: 'contact' }

export const pages: PageDef[] = [
  { kind: 'hero' },
  { kind: 'about' },
  { kind: 'garage-intro' },
  ...cars.map((_, i) => ({ kind: 'car', carIndex: i }) as PageDef),
  { kind: 'work' },
  { kind: 'skills' },
  { kind: 'contact' },
]

export const PAGES = pages.length

/** Camera z when page `p` is centered in the viewport. */
export const zAtPage = (p: number) => CAM_START_Z - PAGE_DEPTH * p

export const carPageStart = pages.findIndex(
  (p) => p.kind === 'car',
)
