import { ArrowLeft, ArrowRight, Atom, SkipForward, Waves } from 'lucide-react'
import type { StoryMoment } from '../types'

interface Props {
  moment: StoryMoment
  step: number
  total: number
  detections: number
  onNext: () => void
  onPrevious: () => void
  onEmit: () => void
  onSkip: () => void
  onLight: () => void
}

export default function GuidedOverlay({ moment, step, total, detections, onNext, onPrevious, onEmit, onSkip, onLight }: Props) {
  const ready = detections >= moment.targetDetections || moment.targetDetections === 0
  return (
    <div className="guided-ui">
      <header className="experience-header"><span className="brand"><i />The Space Between</span><div><button onClick={onLight}><Waves size={14} /> What is light?</button><button onClick={onSkip}><SkipForward size={14} /> Skip to laboratory</button></div></header>
      <section className="story-copy" key={step}>
        <span className="chapter">{String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <h2>{moment.title}</h2>
        <p>{moment.body}</p>
        <small>{moment.note}</small>
        {moment.ask && detections < moment.targetDetections && <button className="emit" onClick={onEmit}><Atom size={15} /> {moment.ask}</button>}
        {!moment.ask && !ready && <div className="gathering"><i style={{ width: `${Math.min(100, detections / moment.targetDetections * 100)}%` }} /><span>{detections} events</span></div>}
        <button className="continue" onClick={onNext} disabled={!ready}>{step === total - 1 ? 'Enter the laboratory' : 'Continue'} <ArrowRight size={15} /></button>
      </section>
      <nav className="story-nav">
        <button aria-label="Previous moment" onClick={onPrevious} disabled={step === 0}><ArrowLeft size={15} /></button>
        <span>{ready ? 'USE ← → OR CONTINUE' : 'LET THE PATTERN FORM'}</span>
        <button aria-label="Next moment" onClick={onNext} disabled={!ready}><ArrowRight size={15} /></button>
      </nav>
      <div className="story-progress"><i style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
    </div>
  )
}
