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
          <div><dt>Air</dt><dd>Two digital channels become idealized plane waves. Their visible displacement is greatly magnified.</dd></div>
          <div><dt>Signal</dt><dd>The exact average of the left and right PCM samples surrounding this instant.</dd></div>
          <div><dt>Perception</dt><dd>Frequency energy separated into logarithmic bands—an analogy for the inner ear, not a model of the brain.</dd></div>
          <div><dt>Playback</dt><dd>On iPhone and iPad, Safari’s native media player carries the sound while the same local file supplies the decoded visual signal.</dd></div>
          <div><dt>Viewing</dt><dd>Night and daylight use different contrast and blending. They display the same samples and analysis.</dd></div>
        </dl>
        <p className="caveat">This is not a reconstruction of your room, speakers, or literal molecular positions. Color, distance, density, and time are expressive scales used to make pressure visible.</p>
        <button className="primary-button" onClick={onClose}>Return to the field</button>
      </section>
    </div>
  )
}
