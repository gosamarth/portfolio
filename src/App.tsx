import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Experience } from './three/Experience'
import { TechWorld } from './three/TechWorld'
import { Sections } from './ui/Sections'
import { TechSections } from './ui/TechSections'
import { WorldSelect } from './ui/WorldSelect'
import { profile } from './data/content'
import { PAGES } from './journey'
import { TECH_PAGES } from './data/tech'
import { JOURNEY_HTML_ID, handleJourneyScroll, setJourneyPages, scrollState } from './scrollBridge'
import { RevCounter } from './ui/RevCounter'
import { IgnitionLoader } from './ui/IgnitionLoader'
import type { WorldMode } from './world'

export default function App() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<WorldMode>('select')
  const inWorld = mode !== 'select'
  const pages = mode === 'tech' ? TECH_PAGES : PAGES

  // keep the scroll bridge aware of the active world's length
  useEffect(() => {
    setJourneyPages(pages)
    const el = scrollerRef.current
    if (el) {
      el.scrollTop = 0
      scrollState.offset = 0
      handleJourneyScroll(el)
    }
  }, [mode, pages])

  useEffect(() => {
    const el = scrollerRef.current
    const onResize = () => el && handleJourneyScroll(el)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // world-select keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode !== 'select') {
        if (e.key === 'Escape') setMode('select')
        return
      }
      if (e.key.toLowerCase() === 'g') setMode('garage')
      if (e.key.toLowerCase() === 't') setMode('tech')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode])

  return (
    <div className="fixed inset-0">
      {/* One persistent Canvas — scenes swap inside it (unmounting whole
          Canvases leaks stacked WebGL contexts during world switches). */}
      <Canvas camera={{ position: [0, 0.4, 8], fov: 55 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          {mode === 'garage' && <Experience />}
          {mode === 'tech' && <TechWorld />}
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Native scroll surface — owns the wheel/touch. */}
      {inWorld && (
        <div
          ref={scrollerRef}
          onScroll={(e) => handleJourneyScroll(e.currentTarget)}
          className="absolute inset-0 z-10 overflow-y-auto"
          style={{ overscrollBehavior: 'none' }}
        >
          <div style={{ height: `${pages * 100}vh` }} />
          <div id={JOURNEY_HTML_ID} className="pointer-events-none fixed inset-x-0 top-0" style={{ willChange: 'transform' }}>
            {mode === 'garage' ? <Sections /> : <TechSections />}
          </div>
        </div>
      )}

      {/* Fixed brand mark + world switch */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-16">
        <span className="pointer-events-auto font-display text-sm font-semibold tracking-wide text-white">
          {profile.name}
        </span>
        {inWorld && (
          <button
            onClick={() => setMode('select')}
            className={`pointer-events-auto rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] transition hover:bg-white/10 ${
              mode === 'garage' ? 'border-accent/40 text-accent' : 'border-emerald-300/40 text-emerald-300'
            }`}
            title="Esc"
          >
            ⇄ Switch World
          </button>
        )}
      </header>

      {/* Scroll-speed tachometer HUD (garage only — the deck has its own vibe) */}
      {mode === 'garage' && <RevCounter />}

      {/* World selection screen */}
      {mode === 'select' && <WorldSelect onSelect={setMode} />}

      {/* Engine-start loading screen — one ignition per world entry */}
      {inWorld && <IgnitionLoader key={mode} />}
    </div>
  )
}
