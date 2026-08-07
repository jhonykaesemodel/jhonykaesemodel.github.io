import { HelpCircle, Pause, Play, RotateCcw, Upload } from 'lucide-react'
import type { AudioSourceData, ViewingMode, ViewMode, VisualSettings } from '../types'
import ViewingModeToggle from './ViewingModeToggle'

interface Props {
  source: AudioSourceData
  settings: VisualSettings
  currentTime: number
  isPlaying: boolean
  volume: number
  onToggle: () => void
  onSeek: (time: number) => void
  onVolume: (volume: number) => void
  onSettings: (settings: Partial<VisualSettings>) => void
  onRestart: () => void
  onReplace: () => void
  onInfo: () => void
  viewingMode: ViewingMode
  onViewingMode: (mode: ViewingMode) => void
}

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`

export default function LabControls(props: Props) {
  const modeCopy: Record<ViewMode, [string, string]> = {
    air: ['AIR', 'Warm fronts crowd the air. Cool fronts release it.'],
    signal: ['SIGNAL', 'Raw PCM samples around the listening instant'],
    perception: ['PERCEPTION', 'One waveform unfolds into place, intensity, and timing'],
  }
  return (
    <div className={`lab-ui mode-${props.settings.mode}`}>
      <header className="experience-header">
        <span className="site-mark"><span className="mark-dot" />Before Music <em>LAB</em></span>
        <div><ViewingModeToggle mode={props.viewingMode} onChange={props.onViewingMode} /><button className="desktop-help" onClick={props.onInfo}><HelpCircle size={15} /> How to read this</button><button onClick={props.onReplace}><Upload size={14} /> Replace audio</button></div>
      </header>
      <section className="mode-description">
        <span>{modeCopy[props.settings.mode][0]}</span>
        <p>{modeCopy[props.settings.mode][1]}</p>
      </section>
      <nav className="view-tabs" aria-label="Visualization mode">
        {(['air', 'signal', 'perception'] as ViewMode[]).map((mode, index) => (
          <button key={mode} className={props.settings.mode === mode ? 'active' : ''} onClick={() => props.onSettings({ mode })}>
            <span>0{index + 1}</span>{mode}
          </button>
        ))}
      </nav>
      {props.settings.mode === 'air' && (
        <div className="process-labels air-process" aria-hidden="true">
          <span>TWO VIRTUAL SOURCES</span>
          <span>PRESSURE HISTORY ACROSS SPACE</span>
          <span>LISTENING POINT</span>
        </div>
      )}
      {props.settings.mode === 'perception' && (
        <div className="process-labels perception-process" aria-hidden="true">
          <span>ARRIVING PRESSURE</span>
          <span>COCHLEAR PLACE MAP<br /><i>HIGH → LOW</i></span>
          <span>NEURAL TIMING + LEVEL</span>
        </div>
      )}
      <aside className="parameter-panel">
        <p>FIELD PARAMETERS <span>ARTISTIC AMPLIFICATION</span></p>
        <label>Temporal zoom <output>{props.settings.temporalZoom.toFixed(1)}×</output><input type="range" min="0.5" max="8" step="0.1" value={props.settings.temporalZoom} onChange={(e) => props.onSettings({ temporalZoom: +e.target.value })} /></label>
        <label>Amplitude <output>{props.settings.amplitude.toFixed(1)}×</output><input type="range" min="0.1" max="2.5" step="0.1" value={props.settings.amplitude} onChange={(e) => props.onSettings({ amplitude: +e.target.value })} /></label>
        <label>Field density <output>{Math.round(props.settings.density * 100)}%</output><input type="range" min="0.3" max="1" step="0.05" value={props.settings.density} onChange={(e) => props.onSettings({ density: +e.target.value })} /></label>
        <label>Listening point <output>{props.settings.listenerPosition > 0.05 ? 'RIGHT' : props.settings.listenerPosition < -0.05 ? 'LEFT' : 'CENTER'}</output><input type="range" min="-1" max="1" step="0.05" value={props.settings.listenerPosition} onChange={(e) => props.onSettings({ listenerPosition: +e.target.value })} /></label>
      </aside>
      <section className="transport">
        <div className="track-meta"><i /><div><strong>{props.source.name}</strong><span>{props.source.artist}</span></div></div>
        <button className="icon-button" aria-label="Restart" onClick={props.onRestart}><RotateCcw size={16} /></button>
        <button className="round-control" aria-label={props.isPlaying ? 'Pause audio' : 'Play audio'} onClick={props.onToggle}>{props.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button>
        <time>{format(props.currentTime)}</time>
        <input className="seek" aria-label="Audio position" type="range" min="0" max={props.source.duration} step="0.01" value={Math.min(props.currentTime, props.source.duration)} onChange={(event) => props.onSeek(+event.target.value)} />
        <time>{format(props.source.duration)}</time>
        <label className="volume">VOL<input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={props.volume} onChange={(event) => props.onVolume(+event.target.value)} /></label>
      </section>
    </div>
  )
}
