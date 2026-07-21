import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import type { GuidedMoment } from '../types'

interface Props {
  moment: GuidedMoment
  step: number
  total: number
  isPlaying: boolean
  onToggle: () => void
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
}

export default function GuidedOverlay({ moment, step, total, isPlaying, onToggle, onNext, onPrevious, onSkip }: Props) {
  return (
    <div className="guided-overlay">
      <button className="advance-surface" aria-label="Continue to the next moment" onClick={onNext} />
      <header className="experience-header"><span className="site-mark"><span className="mark-dot" />Before Music</span><button onClick={onSkip}>Skip journey <ArrowRight size={14} /></button></header>
      <div className="scale-label">VISUAL SCALE · {moment.temporalZoom.toFixed(1)}× TIME MAGNIFICATION</div>
      <section className="guided-caption" key={moment.at} aria-live="polite">
        <span>{String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <h2>{moment.caption}</h2>
        <p>{moment.detail}</p>
        <button className="continue-button" onClick={onNext}>
          {step === total - 1 ? 'Enter the laboratory' : 'Continue'} <ArrowRight size={15} />
        </button>
      </section>
      <div className="guided-progress"><i style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
      <div className="guided-navigation">
        <button aria-label="Previous moment" onClick={onPrevious} disabled={step === 0}><ArrowLeft size={15} /></button>
        <span>CLICK OR USE ← →</span>
        <button aria-label="Next moment" onClick={onNext}><ArrowRight size={15} /></button>
      </div>
      <button className="round-control guided-play" aria-label={isPlaying ? 'Pause audio' : 'Play audio'} onClick={onToggle}>
        {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
      </button>
    </div>
  )
}
