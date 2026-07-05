import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import { Experience } from './three/Experience'
import { Sections } from './ui/Sections'
import { profile } from './data/content'
import { PAGES } from './journey'
import { JOURNEY_HTML_ID, handleJourneyScroll } from './scrollBridge'
import { RevCounter } from './ui/RevCounter'
import { IgnitionLoader } from './ui/IgnitionLoader'

export default function App() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // initialize + keep sync on resize
    const el = scrollerRef.current
    if (el) handleJourneyScroll(el)
    const onResize = () => el && handleJourneyScroll(el)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="fixed inset-0">
      <Canvas camera={{ position: [0, 0.4, 8], fov: 55 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Experience />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Native scroll surface — owns the wheel/touch. The tall spacer defines
          journey length; the fixed overlay inside it carries the HTML and is
          translated in lockstep with the camera by handleJourneyScroll. */}
      <div
        ref={scrollerRef}
        onScroll={(e) => handleJourneyScroll(e.currentTarget)}
        className="absolute inset-0 z-10 overflow-y-auto"
        style={{ overscrollBehavior: 'none' }}
      >
        <div style={{ height: `${PAGES * 100}vh` }} />
        <div
          id={JOURNEY_HTML_ID}
          className="pointer-events-none fixed inset-x-0 top-0"
          style={{ willChange: 'transform' }}
        >
          <Sections />
        </div>
      </div>

      {/* Fixed brand mark — never scrolls */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-16">
        <span className="pointer-events-auto font-display text-sm font-semibold tracking-wide text-white">
          {profile.name}
        </span>
        <span className="hidden text-xs uppercase tracking-[0.3em] text-white/40 md:block">
          Engineering × Horsepower
        </span>
      </header>

      {/* Scroll-speed tachometer HUD */}
      <RevCounter />

      {/* Engine-start loading screen */}
      <IgnitionLoader />
    </div>
  )
}
