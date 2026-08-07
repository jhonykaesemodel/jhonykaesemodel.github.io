# Before Music — learning model

## Learning contract

- **Question:** What exists in the air before a listener experiences music?
- **Likely misconception:** Sound is a visible squiggle that travels through space, or air particles travel from the source into the ear.
- **Interaction:** Change time and amplitude until coherent pressure fronts emerge from a restless field, then follow the same local PCM instant through Signal and Perception.
- **Transformation:** A stereo pressure history becomes a waveform, a frequency-to-place pattern in the cochlea, and an expressive timing/level field.
- **Boundary:** The decoded samples and derived frequency activity are calculated. Space, color, displacement, cochlear geometry, and neural geometry are explanatory visual amplifications—not a room-acoustics or brain simulation.

## Claim ledger

| Claim used in the experience | Source | Visual decision |
| --- | --- | --- |
| Sound in air propagates as alternating longitudinal compression and rarefaction while local parcels oscillate about equilibrium. | [OpenStax, Sound Waves](https://openstax.org/books/university-physics-volume-1/pages/17-1-sound-waves) | A stable particle cloud shifts locally and collectively. Density alone carries the compression/rarefaction intuition; particle color is stable and does not encode pressure. Random jitter evokes a restless atmosphere but is not a molecular or thermodynamic simulation. |
| A cochlear-fluid ripple creates a traveling wave, with high frequencies represented near the base and low frequencies farther toward the apex. | [NIDCD, How Do We Hear?](https://www.nidcd.nih.gov/health/how-do-we-hear) | Live frequency activity illuminates a spiral place map from high at the outer base to low at the inner apex. |
| Auditory-nerve fibers are frequency tuned and preserve important timing information, with physiological limits. | [NCBI Bookshelf, Tuning and Timing in the Auditory Nerve](https://www.ncbi.nlm.nih.gov/books/NBK11105/) | Outgoing lines and pulses respond to calculated band activity, level, and onset; they are explicitly labeled as expressive rather than literal neurons. |

## Computed model

- Air samples a 32 ms stereo PCM window synchronized to the audio clock. The two stereo channels are smoothly blended across the field without depicting speaker or room geometry. A signed nonlinear display curve magnifies quiet pressure while preserving zero crossings and direction. Up to 9,000 GPU particles remain near fixed equilibrium positions; their signal-scaled jitter and coherent displacement come from the decoded samples, while their stable color exists only for depth and contrast.
- Signal draws the channel-averaged PCM samples surrounding the current playback instant.
- Perception applies logarithmic frequency kernels to the current PCM window. A weighted band centroid, RMS-like level, and positive spectral flux drive the place, intensity, and onset cues.
- Track duration never controls animation speed; all live perception cues use only the short window around the current audio-clock position.
