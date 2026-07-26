import { useRef, useState } from 'react'
import { ArrowRight, Headphones, Music2, ShieldCheck, Upload } from 'lucide-react'
import { validateAudioFile } from '../audio/validation'
import type { ViewingMode } from '../types'
import ViewingModeToggle from './ViewingModeToggle'

interface Props {
  onDemo: () => void
  onFile: (file: File) => void
  viewingMode: ViewingMode
  onViewingMode: (mode: ViewingMode) => void
}

export default function Landing({ onDemo, onFile, viewingMode, onViewingMode }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const choose = (file?: File) => {
    if (!file) return
    const issue = validateAudioFile(file)
    if (issue) { setError(issue); return }
    setError('')
    onFile(file)
  }
  return (
    <main className={`landing ${viewingMode}`}>
      <header className="landing-header"><span className="site-mark"><span className="mark-dot" />Before Music <span>01</span></span><ViewingModeToggle mode={viewingMode} onChange={onViewingMode} /></header>
      <section className="hero-copy">
        <p className="eyebrow">AN INSTRUMENT FOR SEEING SOUND</p>
        <h1>Music isn’t<br />in the air.</h1>
        <p className="hero-intro">Before your mind makes melody, space, and feeling, there is only a changing field of pressure.</p>
        <button className="primary-button" onClick={onDemo}>
          Enter the experience <ArrowRight size={17} />
        </button>
        <p className="headphone-note"><Headphones size={14} /> Headphones recommended · 6 moments at your pace</p>
      </section>
      <section
        className={`drop-card ${dragging ? 'dragging' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files[0]) }}
      >
        <Music2 className="drop-glyph" size={22} />
        <div><strong>Bring your own sound</strong><span>See a song you already know become unfamiliar.</span></div>
        <button className="text-button" onClick={() => input.current?.click()}><Upload size={15} /> Choose audio</button>
        <input ref={input} type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" hidden onChange={(event) => choose(event.target.files?.[0])} />
      </section>
      {error && <p className="landing-error" role="alert">{error}</p>}
      <footer className="privacy"><ShieldCheck size={14} /> Your audio stays in this browser. Nothing is uploaded.</footer>
      <div className="ambient-orbit" aria-hidden="true"><i /><i /><i /></div>
    </main>
  )
}
