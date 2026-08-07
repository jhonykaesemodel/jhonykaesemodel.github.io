import { ExternalLink, X } from 'lucide-react'

export default function SciencePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="science-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="science-panel" role="dialog" aria-modal="true" aria-labelledby="science-title">
        <button className="panel-close" onClick={onClose} aria-label="Close"><X /></button>
        <p className="eyebrow">MODEL & LIMITS</p>
        <h2 id="science-title">Real mathematics.<br />A careful metaphor.</h2>
        <p>The detector samples a Fraunhofer diffraction model. One slit produces a sinc² envelope. Two coherent slit amplitudes add before the Born rule converts their squared magnitude into detection probabilities.</p>
        <dl>
          <div><dt>Accurate here</dt><dd>One- versus two-slit diffraction, coherent amplitude addition, Born-rule sampling, single-event buildup, and the ideal loss of interference when path records are perfectly distinguishable.</dd></div>
          <div><dt>The 3D surface</dt><dd>A scalar phase-and-amplitude analogy calculated from both openings. It teaches spreading, reinforcement, and cancellation; it is not the shape of a photon, an electromagnetic-field solver, or a literal wave in a material medium.</dd></div>
          <div><dt>Not simulated</dt><dd>Near-field optics, detector hardware, polarization, full decoherence dynamics, quantum electrodynamics, Bohmian trajectories, or a specific collapse model.</dd></div>
          <div><dt>Observation</dt><dd>Means a physical interaction that leaves path information somewhere. Conscious awareness is not a variable in this model.</dd></div>
        </dl>
        <h3>Evidence & foundations</h3>
        <ul className="source-list">
          <li><a href="https://www.feynmanlectures.caltech.edu/III_01.html" target="_blank" rel="noreferrer">Feynman · Quantum Behavior <ExternalLink size={12} /></a></li>
          <li><a href="https://www.hitachi.com/rd/research/materials/quantum/doubleslit/index.html" target="_blank" rel="noreferrer">Hitachi R&D · Single-electron buildup <ExternalLink size={12} /></a></li>
          <li><a href="https://arxiv.org/abs/2401.02351" target="_blank" rel="noreferrer">Luo et al. · Single-photon double slit <ExternalLink size={12} /></a></li>
          <li><a href="https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919863" target="_blank" rel="noreferrer">NIST · Measurement and decoherence <ExternalLink size={12} /></a></li>
          <li><a href="https://link.aps.org/doi/10.1103/RevModPhys.29.454" target="_blank" rel="noreferrer">Everett · Relative State <ExternalLink size={12} /></a></li>
          <li><a href="https://doi.org/10.1103/PhysRev.85.166" target="_blank" rel="noreferrer">Bohm · Hidden Variables I <ExternalLink size={12} /></a></li>
          <li><a href="https://doi.org/10.1103/PhysRevD.34.470" target="_blank" rel="noreferrer">Ghirardi, Rimini & Weber · Unified Dynamics <ExternalLink size={12} /></a></li>
        </ul>
        <button className="primary" onClick={onClose}>Return to the experiment</button>
      </section>
    </div>
  )
}
