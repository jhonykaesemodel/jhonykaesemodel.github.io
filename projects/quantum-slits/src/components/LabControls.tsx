import { CircleDot, HelpCircle, Pause, Play, RotateCcw, Waves } from 'lucide-react'
import type { ExperimentSettings } from '../types'

interface Props {
  settings: ExperimentSettings
  detections: number
  running: boolean
  showAmplitude: boolean
  onSettings: (next: Partial<ExperimentSettings>) => void
  onRunning: (running: boolean) => void
  onAmplitude: (show: boolean) => void
  onEmit: () => void
  onClear: () => void
  onInfo: () => void
  onLight: () => void
}

export default function LabControls(props: Props) {
  const double = props.settings.slitMode === 'double'
  const marked = props.settings.distinguishability > 0.5
  const update = (next: Partial<ExperimentSettings>) => {
    props.onRunning(false)
    props.onSettings(next)
  }
  return (
    <div className="lab-controls">
      <header className="experience-header">
        <span className="brand"><i />The Space Between <em>LAB</em></span>
        <div><button onClick={props.onLight}><Waves size={14} /> What is light?</button><button onClick={props.onInfo}><HelpCircle size={14} /> Model & limits</button></div>
      </header>

      <section className="lab-intro">
        <p className="eyebrow">{double ? marked ? 'TWO OPENINGS · PATH RECORDED' : 'TWO OPENINGS · PATH UNKNOWN' : 'START HERE · ONE OPENING'}</p>
        <h2>{double ? marked ? 'The gaps fill in.' : 'Some arrivals become impossible.' : 'Possibility spreads.'}</h2>
        <p>{double ? marked ? 'Path information prevents the alternatives from interfering.' : 'Two amplitudes reinforce and cancel before an event appears.' : 'Build the broad one-slit pattern. Then open the second slit.'}</p>
      </section>

      <aside className="control-panel simple-controls">
        <div className="control-heading"><span>OPENINGS</span><button onClick={props.onClear}><RotateCcw size={13} /> Clear detector</button></div>
        <div className="opening-choice" role="group" aria-label="Number of open slits">
          <button className={!double ? 'active' : ''} onClick={() => update({ slitMode: 'single', distinguishability: 0 })}><span>01</span><b>One slit</b><small>Learn the spread</small></button>
          <button className={double ? 'active' : ''} onClick={() => update({ slitMode: 'double', distinguishability: 0 })}><span>02</span><b>Two slits</b><small>Reveal interference</small></button>
        </div>
        <button className={`concept-toggle ${props.showAmplitude ? 'active' : ''}`} onClick={() => props.onAmplitude(!props.showAmplitude)}><Waves size={15} /><span><b>{props.showAmplitude ? 'Hide possibility wave' : 'See possibility wave'}</b><small>Phase surface · visual analogy</small></span></button>
        {double && <button className={`concept-toggle path-toggle ${marked ? 'active marked' : ''}`} onClick={() => update({ distinguishability: marked ? 0 : 1 })}><CircleDot size={15} /><span><b>{marked ? 'Erase path record' : 'Mark which slit'}</b><small>{marked ? 'Let alternatives interfere again' : 'Make the two paths distinguishable'}</small></span></button>}
      </aside>

      <section className="lab-transport">
        <div><span>{props.detections.toLocaleString()}</span><small>DETECTION EVENTS</small></div>
        <button onClick={props.onEmit}>Release one</button>
        <button className="stream" onClick={() => props.onRunning(!props.running)}>{props.running ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />} {props.running ? 'Pause' : 'Build the pattern'}</button>
        <label>Rate <input aria-label="Detection rate" type="range" min="1" max="160" value={props.settings.rate} onChange={(e) => props.onSettings({ rate: +e.target.value })} /></label>
      </section>
    </div>
  )
}
