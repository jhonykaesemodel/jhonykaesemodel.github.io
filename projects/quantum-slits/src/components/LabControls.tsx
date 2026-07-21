import { Eye, EyeOff, HelpCircle, Pause, Play, RotateCcw } from 'lucide-react'
import { visibility } from '../physics/model'
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
}

export default function LabControls(props: Props) {
  const update = (next: Partial<ExperimentSettings>) => props.onSettings(next)
  const d = props.settings.distinguishability
  const pathLabel = d < .08 ? 'NO RECORD' : d > .92 ? 'PATH KNOWABLE' : 'PARTIAL TRACE'
  return (
    <div className="lab-controls">
      <header className="experience-header">
        <span className="brand"><i />The Space Between <em>LAB</em></span>
        <button onClick={props.onInfo}><HelpCircle size={14} /> Model & limits</button>
      </header>

      <section className="lab-intro">
        <p className="eyebrow">WHAT CAN THE UNIVERSE DISTINGUISH?</p>
        <h2>{pathLabel}</h2>
        <p>Path knowledge <strong>{Math.round(d * 100)}%</strong> · fringe visibility <strong>{Math.round(visibility(d) * 100)}%</strong></p>
      </section>

      <aside className="control-panel">
        <div className="control-heading"><span>APPARATUS</span><button onClick={props.onClear}><RotateCcw size={13} /> Reset screen</button></div>
        <label className="major-control">Which-path trace <output>{Math.round(d * 100)}%</output><input type="range" min="0" max="1" step="0.01" value={d} onChange={(e) => update({ distinguishability: +e.target.value })} /></label>
        <p className="tradeoff"><i style={{ width: `${visibility(d) * 100}%` }} /> visible interference</p>
        <label>Wavelength <output>{props.settings.wavelength.toFixed(2)}</output><input type="range" min="0.35" max="1.1" step="0.01" value={props.settings.wavelength} onChange={(e) => update({ wavelength: +e.target.value })} /></label>
        <label>Slit separation <output>{props.settings.slitSeparation.toFixed(1)}</output><input type="range" min="2.2" max="7" step="0.1" value={props.settings.slitSeparation} onChange={(e) => update({ slitSeparation: +e.target.value })} /></label>
        <label>Slit width <output>{props.settings.slitWidth.toFixed(1)}</output><input type="range" min="0.65" max="2.6" step="0.05" value={props.settings.slitWidth} onChange={(e) => update({ slitWidth: +e.target.value })} /></label>
        <div className="slit-choice" role="group" aria-label="Open slits">
          {(['upper', 'both', 'lower'] as const).map((mode) => <button key={mode} className={props.settings.slitMode === mode ? 'active' : ''} onClick={() => update({ slitMode: mode })}>{mode}</button>)}
        </div>
        <button className="amplitude-toggle" onClick={() => props.onAmplitude(!props.showAmplitude)}>{props.showAmplitude ? <Eye size={14} /> : <EyeOff size={14} />} Amplitude field</button>
      </aside>

      <section className="lab-transport">
        <div><span>{props.detections.toLocaleString()}</span><small>DETECTION EVENTS</small></div>
        <button onClick={props.onEmit}>Release one</button>
        <button className="stream" onClick={() => props.onRunning(!props.running)}>{props.running ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />} {props.running ? 'Pause stream' : 'Start stream'}</button>
        <label>Rate <input aria-label="Detection rate" type="range" min="1" max="120" value={props.settings.rate} onChange={(e) => update({ rate: +e.target.value })} /></label>
      </section>
    </div>
  )
}
