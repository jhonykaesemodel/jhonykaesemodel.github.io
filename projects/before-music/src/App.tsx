import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowLeft, Volume2 } from 'lucide-react'
import { AudioEngine, analyzeInWorker } from './audio/AudioEngine'
import { validateAudioFile } from './audio/validation'
import Landing from './components/Landing'
import Loading from './components/Loading'
import GuidedOverlay from './components/GuidedOverlay'
import LabControls from './components/LabControls'
import InfoPanel from './components/InfoPanel'
import ViewingModeToggle from './components/ViewingModeToggle'
import { guidedTimeline } from './experience/timeline'
import type { AnalysisData, AudioSourceData, ExperienceState, ViewingMode, VisualSettings } from './types'

const initialSettings: VisualSettings = { mode: 'air', temporalZoom: 1, amplitude: 1, density: 0.8, listenerPosition: 0 }
const ExperienceCanvas = lazy(() => import('./visuals/ExperienceCanvas'))
const initialViewingMode = (): ViewingMode => {
  const hour = new Date().getHours()
  return hour >= 7 && hour < 19 ? 'daylight' : 'night'
}

export default function App() {
  const engine = useRef(new AudioEngine())
  const fileInput = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<ExperienceState>('landing')
  const [source, setSource] = useState<AudioSourceData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [error, setError] = useState('')
  const [loadingLabel, setLoadingLabel] = useState('Preparing the field')
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [guidedStep, setGuidedStep] = useState(0)
  const [settings, setSettings] = useState(initialSettings)
  const [volume, setVolume] = useState(0.75)
  const [showInfo, setShowInfo] = useState(false)
  const [viewingMode, setViewingMode] = useState<ViewingMode>(initialViewingMode)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const resumeAfterBackground = useRef(false)

  const prepare = useCallback(async (loader: () => Promise<AudioSourceData>) => {
    setState('loading')
    setError('')
    setLoadingLabel('Preparing the field')
    try {
      const unlocked = await engine.current.unlock()
      setAudioBlocked(!unlocked)
      const nextSource = await loader()
      setLoadingLabel('Reading pressure, one sample at a time')
      const nextAnalysis = await analyzeInWorker(nextSource)
      setSource(nextSource)
      setAnalysis(nextAnalysis)
      setSettings(initialSettings)
      setGuidedStep(0)
      setState('guided')
    } catch (reason) {
      const message = reason instanceof Error && reason.message
        ? reason.message
        : 'This browser could not decode that audio file.'
      setError(message)
      setState('error')
    }
  }, [])

  const loadFile = useCallback((file: File) => {
    const issue = validateAudioFile(file)
    if (issue) { setError(issue); setState('error'); return }
    void prepare(() => engine.current.loadFile(file))
  }, [prepare])

  useEffect(() => {
    let frame = 0
    const tick = () => {
      setCurrentTime(engine.current.currentTime)
      setPlaying(engine.current.isPlaying)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [state])

  const moment = guidedTimeline[guidedStep]
  useEffect(() => {
    if (state !== 'guided') return
    setSettings((previous) => ({ ...previous, mode: moment.mode, temporalZoom: moment.temporalZoom, amplitude: moment.amplitude }))
  }, [guidedStep, moment, state])

  const requestPlay = useCallback(async () => {
    const started = await engine.current.play()
    setAudioBlocked(!started)
    return started
  }, [])

  const enableAudio = useCallback(async () => {
    // Keep the native media play call in the original click stack on iOS.
    // Awaiting an AudioContext unlock first can cause Safari to reject playback.
    if (source) {
      await requestPlay()
      return
    }

    const unlocked = await engine.current.unlock()
    setAudioBlocked(!unlocked)
  }, [requestPlay, source])

  const toggle = () => engine.current.isPlaying ? engine.current.pause() : void requestPlay()
  const enterLab = () => { setState('lab'); setSettings(initialSettings); if (!engine.current.isPlaying) void requestPlay() }
  const applyGuidedPlayback = (step: number) => {
    if (step === 0 || step === 3) engine.current.pause()
    else if (!engine.current.isPlaying) void requestPlay()
  }
  const nextGuided = () => {
    if (guidedStep >= guidedTimeline.length - 1) { enterLab(); return }
    const next = guidedStep + 1
    applyGuidedPlayback(next)
    setGuidedStep(next)
  }
  const previousGuided = () => {
    const previous = Math.max(0, guidedStep - 1)
    applyGuidedPlayback(previous)
    setGuidedStep(previous)
  }

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        resumeAfterBackground.current = engine.current.isPlaying
        if (engine.current.isPlaying) engine.current.pause()
      } else if (resumeAfterBackground.current) {
        resumeAfterBackground.current = false
        setAudioBlocked(true)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((state === 'lab' || state === 'guided') && event.code === 'Space' && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault()
        engine.current.isPlaying ? engine.current.pause() : void requestPlay()
      }
      if (state === 'guided' && event.code === 'ArrowRight') {
        event.preventDefault()
        nextGuided()
      }
      if (state === 'guided' && event.code === 'ArrowLeft') {
        event.preventDefault()
        previousGuided()
      }
      if (event.code === 'Escape') setShowInfo(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [guidedStep, requestPlay, state])

  useEffect(() => () => engine.current.dispose(), [])

  const reset = () => { engine.current.pause(); engine.current.restart(); setSource(null); setAnalysis(null); setState('landing') }

  if (state === 'landing') return <Landing viewingMode={viewingMode} onViewingMode={setViewingMode} onDemo={() => void prepare(() => engine.current.createDemo())} onFile={loadFile} />
  if (state === 'loading') return <Loading label={loadingLabel} viewingMode={viewingMode} />
  if (state === 'error') return (
    <main className={`error-screen ${viewingMode}`}><div className="error-viewing"><ViewingModeToggle mode={viewingMode} onChange={setViewingMode} /></div><AlertTriangle /><p className="eyebrow">THE SIGNAL BROKE</p><h1>We couldn’t read that sound.</h1><p>{error}</p><button className="primary-button" onClick={reset}><ArrowLeft size={16} /> Return to the beginning</button></main>
  )
  if (!source || !analysis) return null
  return (
    <main className={`experience ${state} ${viewingMode}`}>
      <Suspense fallback={<div className="canvas-fallback" />}>
        <ExperienceCanvas source={source} analysis={analysis} settings={settings} getTime={() => engine.current.currentTime} guided={state === 'guided'} viewingMode={viewingMode} />
      </Suspense>
      <div className="grain" aria-hidden="true" />
      {state === 'guided' && <GuidedOverlay moment={moment} step={guidedStep} total={guidedTimeline.length} isPlaying={playing} viewingMode={viewingMode} onViewingMode={setViewingMode} onToggle={toggle} onNext={nextGuided} onPrevious={previousGuided} onSkip={enterLab} />}
      {state === 'lab' && <LabControls source={source} settings={settings} currentTime={currentTime} isPlaying={playing} volume={volume} viewingMode={viewingMode} onViewingMode={setViewingMode} onToggle={toggle} onSeek={(time) => engine.current.seek(time)} onVolume={(next) => { setVolume(next); engine.current.setVolume(next) }} onSettings={(next) => setSettings((previous) => ({ ...previous, ...next }))} onRestart={() => engine.current.restart()} onReplace={() => fileInput.current?.click()} onInfo={() => setShowInfo(true)} />}
      {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}
      {audioBlocked && <section className="audio-gate" role="status"><Volume2 size={18} /><div><strong>Safari paused the sound.</strong><span>Tap once to enable audio on this device.</span></div><button onClick={() => void enableAudio()}>Enable sound</button></section>}
      <input ref={fileInput} hidden type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" onChange={(event) => event.target.files?.[0] && loadFile(event.target.files[0])} />
    </main>
  )
}
