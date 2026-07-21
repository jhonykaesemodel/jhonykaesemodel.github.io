import { useCallback, useEffect, useRef, useState } from 'react'
import Landing from './components/Landing'
import GuidedOverlay from './components/GuidedOverlay'
import LabControls from './components/LabControls'
import InterpretationPanel from './components/InterpretationPanel'
import SciencePanel from './components/SciencePanel'
import QuantumCanvas from './visuals/QuantumCanvas'
import { defaultSettings, sampleDetection } from './physics/model'
import { story } from './experience/story'
import type { Detection, ExperienceState, ExperimentSettings, InterpretationId } from './types'

export default function App() {
  const [state, setState] = useState<ExperienceState>('landing')
  const [step, setStep] = useState(0)
  const [settings, setSettings] = useState(defaultSettings)
  const [detections, setDetections] = useState<Detection[]>([])
  const [running, setRunning] = useState(false)
  const [showAmplitude, setShowAmplitude] = useState(true)
  const [labMode, setLabMode] = useState<'experiment' | 'interpretations'>('experiment')
  const [interpretation, setInterpretation] = useState<InterpretationId>('copenhagen')
  const [showScience, setShowScience] = useState(false)
  const id = useRef(0)
  const accumulator = useRef(0)

  const emit = useCallback((count = 1) => {
    setDetections((current) => {
      const additions = Array.from({ length: count }, () => ({
        id: ++id.current,
        y: sampleDetection(settings),
        bornAt: performance.now(),
        slitHint: (Math.random() < 0.5 ? -1 : 1) as -1 | 1,
      }))
      return [...current, ...additions].slice(-1800)
    })
  }, [settings])

  useEffect(() => {
    if (state !== 'guided') return
    const moment = story[step]
    setSettings({ ...defaultSettings, ...moment.settings })
    setShowAmplitude(moment.showAmplitude)
    setDetections([])
    id.current = 0
    accumulator.current = 0
  }, [state, step])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const storyMoment = state === 'guided' ? story[step] : null
      const active = state === 'guided' ? (storyMoment?.settings.rate ?? 0) > 0 : state === 'lab' && running && labMode === 'experiment'
      if (!active) return
      const rate = state === 'guided' ? storyMoment?.settings.rate ?? 0 : settings.rate
      const cap = state === 'guided' ? storyMoment?.targetDetections ?? 0 : 1800
      if (state === 'guided' && detections.length >= cap) return
      accumulator.current += rate / 20
      const count = Math.min(Math.floor(accumulator.current), Math.max(0, cap - detections.length))
      if (count > 0) { accumulator.current -= count; emit(count) }
    }, 50)
    return () => clearInterval(interval)
  }, [detections.length, emit, labMode, running, settings.rate, state, step])

  const next = useCallback(() => {
    const ready = detections.length >= story[step].targetDetections
    if (!ready) return
    if (step === story.length - 1) {
      setState('lab')
      setLabMode('interpretations')
      setRunning(false)
      setSettings(defaultSettings)
      return
    }
    setStep((current) => current + 1)
  }, [detections.length, step])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (showScience) { if (event.key === 'Escape') setShowScience(false); return }
      if (state === 'guided' && event.key === 'ArrowRight') next()
      if (state === 'guided' && event.key === 'ArrowLeft') setStep((current) => Math.max(0, current - 1))
      if ((state === 'guided' || state === 'lab') && event.code === 'Space' && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault(); emit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [emit, next, showScience, state])

  const openLab = () => {
    setState('lab'); setLabMode('experiment'); setSettings(defaultSettings); setDetections([]); setRunning(false); setShowAmplitude(true)
  }
  const updateSettings = (nextSettings: Partial<ExperimentSettings>) => {
    setSettings((current) => ({ ...current, ...nextSettings }))
    setDetections([]); id.current = 0; accumulator.current = 0
  }

  if (state === 'landing') return <Landing onBegin={() => { setStep(0); setState('guided') }} onLab={openLab} />

  return (
    <main className={`experience ${state} ${labMode}`}>
      <QuantumCanvas settings={settings} detections={detections} showAmplitude={showAmplitude} interpretation={labMode === 'interpretations' ? interpretation : undefined} />
      <div className="grain" aria-hidden="true" />
      {state === 'guided' && <GuidedOverlay moment={story[step]} step={step} total={story.length} detections={detections.length} onNext={next} onPrevious={() => setStep((current) => Math.max(0, current - 1))} onEmit={() => emit()} onSkip={openLab} />}
      {state === 'lab' && labMode === 'experiment' && <LabControls settings={settings} detections={detections.length} running={running} showAmplitude={showAmplitude} onSettings={updateSettings} onRunning={setRunning} onAmplitude={setShowAmplitude} onEmit={() => emit()} onClear={() => setDetections([])} onInfo={() => setShowScience(true)} />}
      {state === 'lab' && labMode === 'interpretations' && <InterpretationPanel selected={interpretation} onSelect={setInterpretation} onClose={() => setLabMode('experiment')} />}
      {state === 'lab' && labMode === 'experiment' && <button className="open-lenses" onClick={() => { setLabMode('interpretations'); setRunning(false) }}>Compare reality lenses →</button>}
      {showScience && <SciencePanel onClose={() => setShowScience(false)} />}
    </main>
  )
}
