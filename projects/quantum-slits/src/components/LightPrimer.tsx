import { ArrowRight, CircleDot, Waves, X, Zap } from 'lucide-react'

export default function LightPrimer({ onClose }: { onClose: () => void }) {
  return (
    <div className="science-scrim light-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="science-panel light-primer" role="dialog" aria-modal="true" aria-labelledby="light-title">
        <button className="panel-close" onClick={onClose} aria-label="Close light explanation"><X /></button>
        <p className="eyebrow">SIDE QUEST · LIGHT IN 60 SECONDS</p>
        <h2 id="light-title">Not a tiny ball.<br />Not an ocean wave.</h2>
        <div className="light-steps">
          <article>
            <span><Waves /></span>
            <div><b>01 · The wave lesson</b><h3>Phase can add or cancel.</h3><p>Water is useful because crests reinforce crests while crests cancel troughs. Light’s electromagnetic field also has phase—but it needs no water or material medium.</p></div>
          </article>
          <article>
            <span><Zap /></span>
            <div><b>02 · The quantum lesson</b><h3>Energy arrives whole.</h3><p>Turn the light down and a detector still makes complete, localized clicks. It never receives half of one photon.</p></div>
          </article>
          <article>
            <span><CircleDot /></span>
            <div><b>03 · Hold both facts</b><h3>Possibility spreads. Events land.</h3><p>Quantum theory adds probability amplitudes like waves, then predicts where indivisible detection events can appear. The animated surface is that amplitude analogy—not a photograph of a photon.</p></div>
          </article>
        </div>
        <button className="primary" onClick={onClose}>Return to the experiment <ArrowRight size={14} /></button>
      </section>
    </div>
  )
}
