import { ArrowRight } from 'lucide-react'
import { interpretations } from '../experience/story'
import type { InterpretationId } from '../types'

interface Props { selected: InterpretationId; onSelect: (id: InterpretationId) => void; onClose: () => void }

export default function InterpretationPanel({ selected, onSelect, onClose }: Props) {
  const lens = interpretations.find((item) => item.id === selected)!
  return (
    <div className="interpretation-ui">
      <header className="experience-header"><span className="brand"><i />The Space Between <em>REALITY LENSES</em></span><button onClick={onClose}>Return to experiment <ArrowRight size={14} /></button></header>
      <nav className="lens-tabs" aria-label="Quantum interpretations">
        {interpretations.map((item, index) => <button key={item.id} className={selected === item.id ? 'active' : ''} onClick={() => onSelect(item.id)}><span>0{index + 1}</span>{item.name}</button>)}
      </nav>
      <section className="lens-copy" key={selected}>
        <p className="eyebrow">ONE EXPERIMENT · FOUR ONTOLOGIES</p>
        <h2>{lens.name}</h2>
        <blockquote>{lens.short}</blockquote>
        <div className="lens-grid">
          <article><span>WHAT EXISTS</span><p>{lens.claim}</p></article>
          <article><span>BETWEEN THE SLITS</span><p>{lens.journey}</p></article>
          <article><span>AT MEASUREMENT</span><p>{lens.measurement}</p></article>
        </div>
        <p className="lens-caution">HONEST EDGE · {lens.caution}</p>
      </section>
      <footer className="shared-facts"><span>SHARED OBSERVATION</span><p>Same apparatus. Same probability curve. Same individual detections. The lens changes the account—not the data on this screen.</p></footer>
    </div>
  )
}
