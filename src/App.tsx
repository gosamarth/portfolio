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
import { ProgressRail } from './ui/ProgressRail'
import { Toaster, toast } from './ui/Toaster'
import { TrialsGate } from './trials/TrialsGate'
import { CheatSplash } from './trials/CheatSplash'
import { CHEAT_CODE, loadPlayer, markTrialsCleared, submitLead, trialsCleared } from './trials/trials'
import { Lobby } from './ui/Lobby'
import { ArcadeMenu } from './arcade/ArcadeMenu'
import { RevMatch } from './arcade/RevMatch'
import { LightsGP } from './arcade/LightsGP'
import { TunnelRunScene, TunnelRunHud } from './arcade/TunnelRun'
import { SlabStackScene, SlabStackHud } from './arcade/SlabStack'
import { DirectorRushScene, DirectorRushHud } from './arcade/DirectorRush'
import { NeonDriftScene, NeonDriftHud } from './arcade/NeonDrift'
import { TrafficWeaveScene, TrafficWeaveHud } from './arcade/TrafficWeave'
import { RedlineDrag } from './arcade/RedlineDrag'
import { SpotMachine } from './arcade/SpotMachine'
import { BugSquash } from './arcade/BugSquash'
import { RegexRanger } from './arcade/RegexRanger'
import { DeployFriday } from './arcade/DeployFriday'
import type { GameKey } from './arcade/arcade'
import type { WorldMode } from './world'

export default function App() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<WorldMode>('select')
  const [trialsOpen, setTrialsOpen] = useState(false)
  const [cheating, setCheating] = useState(false)
  const [game, setGame] = useState<GameKey | null>(null)
  // "inWorld" = a scroll-journey world; hub/arcade are their own screens
  const inWorld = mode === 'garage' || mode === 'tech'

  const triggerCheat = () => {
    setTrialsOpen(false)
    setCheating(true)
    markTrialsCleared()
    const p = loadPlayer()
    if (p) submitLead(p, 'cheat-return')
  }

  // The portfolio is guarded — THE TRIALS open unless already cleared.
  const requestMode = (m: WorldMode) => {
    if (m === 'tech' && !trialsCleared()) {
      setTrialsOpen(true)
      return
    }
    setTrialsOpen(false)
    setGame(null)
    setMode(m)
  }
  const light = mode === 'tech'
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

  // world-select keyboard shortcuts (dormant while THE TRIALS are running)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (trialsOpen || cheating) return
      if (mode !== 'select') {
        if (e.key === 'Escape') {
          if (mode === 'arcade' && game) setGame(null)
          else setMode('select')
        }
        return
      }
      if (e.key.toLowerCase() === 'g' || e.key === 'ArrowLeft') requestMode('garage')
      if (e.key.toLowerCase() === 't' || e.key === 'ArrowRight') requestMode('tech')
      if (e.key.toLowerCase() === 'l') requestMode('hub')
      if (e.key.toLowerCase() === 'a') requestMode('arcade')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, trialsOpen, cheating, game])

  // the site talks back: playful once-per-session toasts on milestones
  useEffect(() => {
    if (mode === 'garage') {
      toast('Warming the tyres. The tunnel likes a heavy scroll.', { once: 'garage-enter', delay: 3800 })
      let prev = scrollState.offset
      const iv = setInterval(() => {
        const o = scrollState.offset
        if (o - prev > 0.075) toast('Easy on the throttle 🏁', { once: 'throttle' })
        if (o > 0.93) toast('That Vento at the end? Where it all began.', { once: 'vento' })
        prev = o
      }, 700)
      return () => clearInterval(iv)
    }
    if (mode === 'tech') {
      toast('No tourists in here. Make yourself at home.', { once: 'tech-enter', light: true, delay: 3600 })
      const iv = setInterval(() => {
        if (scrollState.offset > 0.56)
          toast('Serious scroller. The open channel waits on the last page.', { once: 'tech-mid', light: true })
      }, 900)
      return () => clearInterval(iv)
    }
    if (mode === 'arcade') {
      toast('Free play. High scores are forever, quarters are not required.', { once: 'arcade-enter', delay: 2200 })
      return
    }
    if (mode === 'select' && !trialsOpen) {
      const t = setTimeout(
        () => toast("The doors don't bite. G for the garage, T for the trials.", { once: 'select-idle' }),
        26000,
      )
      return () => clearTimeout(t)
    }
  }, [mode, trialsOpen])

  // the champion's cheat — type "knockknock" anywhere, no input box needed
  useEffect(() => {
    let buffer = ''
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (cheating || mode === 'tech') return
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        buffer = (buffer + e.key.toLowerCase()).slice(-CHEAT_CODE.length)
        if (buffer === CHEAT_CODE) {
          buffer = ''
          triggerCheat()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, cheating])

  return (
    <div className="fixed inset-0">
      {/* One persistent Canvas — scenes swap inside it (unmounting whole
          Canvases leaks stacked WebGL contexts during world switches). */}
      <Canvas camera={{ position: [0, 0.4, 8], fov: 55 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          {mode === 'garage' && <Experience />}
          {mode === 'tech' && <TechWorld />}
          {mode === 'arcade' && game === 'tunnel' && <TunnelRunScene />}
          {mode === 'arcade' && game === 'stack' && <SlabStackScene />}
          {mode === 'arcade' && game === 'rush' && <DirectorRushScene />}
          {mode === 'arcade' && game === 'drift' && <NeonDriftScene />}
          {mode === 'arcade' && game === 'weave' && <TrafficWeaveScene />}
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
          <div className="journey-spacer" style={{ ['--journey-pages' as string]: pages }} />
          <div id={JOURNEY_HTML_ID} className="pointer-events-none fixed inset-x-0 top-0" style={{ willChange: 'transform' }}>
            {mode === 'garage' ? <Sections /> : <TechSections />}
          </div>
        </div>
      )}

      {/* Fixed brand mark + world switch (worlds only — the seam owns the select screen) */}
      {inWorld && (
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-16">
        <span className={`pointer-events-auto font-display text-sm font-semibold tracking-wide ${light ? 'text-[#121317]' : 'text-white'}`}>
          {profile.name}
        </span>
        {inWorld && (
          <button
            onClick={() => setMode('select')}
            className={`pointer-events-auto rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] transition ${
              light
                ? 'border-black/25 text-black/70 hover:bg-black/5'
                : 'border-accent/40 text-accent hover:bg-white/10'
            }`}
            title="Esc"
          >
            ⇄ Switch World
          </button>
        )}
      </header>
      )}

      {/* Scroll-speed tachometer HUD (garage only — the deck has its own vibe) */}
      {mode === 'garage' && <RevCounter />}

      {/* Journey map rail (portfolio only, desktop) */}
      {mode === 'tech' && <ProgressRail />}

      {/* World selection screen */}
      {mode === 'select' && <WorldSelect onSelect={requestMode} />}

      {/* THE LOBBY — mission tiles */}
      {mode === 'hub' && <Lobby onExit={() => setMode('select')} onGo={(m) => requestMode(m)} />}

      {/* THE ARCADE */}
      {mode === 'arcade' && !game && <ArcadeMenu onPlay={setGame} onExit={() => setMode('select')} />}
      {mode === 'arcade' && game === 'rev' && <RevMatch onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'gp' && <LightsGP onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'tunnel' && <TunnelRunHud onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'stack' && <SlabStackHud onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'rush' && <DirectorRushHud onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'drift' && <NeonDriftHud onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'weave' && <TrafficWeaveHud onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'drag' && <RedlineDrag onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'spot' && <SpotMachine onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'squash' && <BugSquash onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'regex' && <RegexRanger onExit={() => setGame(null)} />}
      {mode === 'arcade' && game === 'friday' && <DeployFriday onExit={() => setGame(null)} />}

      {/* THE TRIALS — the gauntlet guarding the portfolio */}
      {trialsOpen && (
        <TrialsGate
          onVictory={() => {
            setTrialsOpen(false)
            setMode('tech')
          }}
          onCheat={triggerCheat}
          onClose={() => setTrialsOpen(false)}
        />
      )}

      {/* KNOCKKNOCK — champion re-entry splash */}
      {cheating && (
        <CheatSplash
          onDone={() => {
            setCheating(false)
            setMode('tech')
            toast('Knock knock. Good to have you back, champion.', { once: 'cheat-back', light: true, delay: 1400 })
          }}
        />
      )}

      {/* Conversational toasts */}
      <Toaster />

      {/* Engine-start loading screen — one ignition per world entry */}
      {inWorld && <IgnitionLoader key={mode} />}
    </div>
  )
}
