import { X } from 'lucide-react'

export default function InfoPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="info-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="info-panel" role="dialog" aria-modal="true" aria-labelledby="info-title">
        <button className="info-close" onClick={onClose} aria-label="Close information"><X /></button>
        <p className="eyebrow">HOW TO READ THIS</p>
        <h2 id="info-title">A truthful signal.<br />An imagined space.</h2>
        <p>The movement begins with the decoded samples in your audio file. Every view follows the playback clock and selects the sample window around that instant.</p>
        <dl>
          <div><dt>Air</dt><dd>Thousands of imagined air parcels jitter locally while the decoded stereo signal moves them coherently. Warm crowding means compression; cool opening means rarefaction. The particles are not literal molecules, and every displacement is greatly magnified.</dd></div>
          <div><dt>Signal</dt><dd>The exact average of the left and right PCM samples surrounding this instant.</dd></div>
          <div><dt>Perception</dt><dd>The spiral is an expressive basilar-membrane map: high frequencies excite its outer base and low frequencies its inner apex. The outgoing fibers encode calculated frequency activity, level, and onset—not literal neurons or measured brain activity.</dd></div>
          <div><dt>Playback</dt><dd>On iPhone and iPad, Safari’s native media player carries the sound while the same local file supplies the decoded visual signal.</dd></div>
          <div><dt>Viewing</dt><dd>Night and daylight use different contrast and blending. They display the same samples and analysis.</dd></div>
        </dl>
        <p className="caveat">This is not a reconstruction of your room, speakers, literal molecular positions, or brain. Color, distance, neural geometry, density, and time are expressive scales. The decoded pressure signal and frequency analysis are real.</p>
        <div className="info-sources">
          <span>PHYSICS + PHYSIOLOGY</span>
          <a href="https://openstax.org/books/university-physics-volume-1/pages/17-1-sound-waves" target="_blank" rel="noreferrer">OpenStax · Sound waves ↗</a>
          <a href="https://www.nidcd.nih.gov/health/how-do-we-hear" target="_blank" rel="noreferrer">NIDCD · How do we hear? ↗</a>
          <a href="https://www.ncbi.nlm.nih.gov/books/NBK11105/" target="_blank" rel="noreferrer">NCBI · Tuning and timing in the auditory nerve ↗</a>
        </div>
        <button className="primary-button" onClick={onClose}>Return to the field</button>
      </section>
    </div>
  )
}
