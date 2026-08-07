import { ArrowRight, CircleDot, MousePointer2 } from 'lucide-react'

export default function Landing({ onBegin, onLab }: { onBegin: () => void; onLab: () => void }) {
  return (
    <main className="landing">
      <header className="brand"><i />The Space Between <span>02</span></header>
      <div className="landing-visual" aria-hidden="true"><i /><i /><i /><i /><b /><b /></div>
      <section className="hero">
        <p className="eyebrow">AN INTERACTIVE ENCOUNTER WITH QUANTUM REALITY</p>
        <h1>One opening.<br /><em>Then the impossible.</em></h1>
        <p>Begin with one photon and one slit. Add a second opening only when the first picture is clear.</p>
        <div className="hero-actions">
          <button className="primary" onClick={onBegin}>Begin the experiment <ArrowRight size={16} /></button>
          <button className="secondary" onClick={onLab}>Open laboratory</button>
        </div>
        <small><MousePointer2 size={13} /> Eight moments · at your pace · no physics required</small>
      </section>
      <footer><CircleDot size={13} /> A model of the double-slit experiment. Interpretations are presented as lenses, not settled facts.</footer>
    </main>
  )
}
