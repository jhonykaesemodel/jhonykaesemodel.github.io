import { ExternalLink, X } from 'lucide-react'

export default function SciencePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="science-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="science-panel" role="dialog" aria-modal="true" aria-labelledby="science-title">
        <button className="panel-close" onClick={onClose} aria-label="Close"><X /></button>
        <p className="eyebrow">MODEL & LIMITS</p>
        <h2 id="science-title">Real mathematics.<br />A careful metaphor.</h2>
        <p>The detector samples a Fraunhofer two-slit intensity: a single-slit diffraction envelope multiplied by two-path interference. Partial path information reduces fringe visibility using the saturated ideal relation <b>V² + D² = 1</b>.</p>
        <dl>
          <div><dt>Accurate here</dt><dd>Amplitude addition, Born-rule sampling, single-event buildup, diffraction controls, and ideal path–visibility complementarity.</dd></div>
          <div><dt>Not simulated</dt><dd>A time-dependent Schrödinger wavepacket, detector hardware, spin, polarization, full decoherence dynamics, Bohmian trajectories, or a specific collapse model.</dd></div>
          <div><dt>Observation</dt><dd>Means a physical interaction that leaves path information somewhere. Conscious awareness is not a variable in this model.</dd></div>
        </dl>
        <h3>Primary foundations</h3>
        <ul className="source-list">
          <li><a href="https://www.feynmanlectures.caltech.edu/III_01.html" target="_blank" rel="noreferrer">Feynman · Quantum Behavior <ExternalLink size={12} /></a></li>
          <li><a href="https://link.aps.org/doi/10.1103/RevModPhys.29.454" target="_blank" rel="noreferrer">Everett · Relative State <ExternalLink size={12} /></a></li>
          <li><a href="https://doi.org/10.1103/PhysRev.85.166" target="_blank" rel="noreferrer">Bohm · Hidden Variables I <ExternalLink size={12} /></a></li>
          <li><a href="https://doi.org/10.1103/PhysRevD.34.470" target="_blank" rel="noreferrer">Ghirardi, Rimini & Weber · Unified Dynamics <ExternalLink size={12} /></a></li>
        </ul>
        <button className="primary" onClick={onClose}>Return to the experiment</button>
      </section>
    </div>
  )
}
