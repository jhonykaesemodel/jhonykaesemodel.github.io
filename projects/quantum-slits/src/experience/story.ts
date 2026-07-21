import type { Interpretation, StoryMoment } from '../types'

export const story: StoryMoment[] = [
  {
    title: 'Begin with one event.',
    body: 'A source releases one quantum. The screen answers with one indivisible point.',
    note: 'Nothing arrives as half a detection.',
    settings: { slitMode: 'both', distinguishability: 0, rate: 0 }, targetDetections: 1, showAmplitude: false,
    ask: 'Release one',
  },
  {
    title: 'The next point cannot be predicted.',
    body: 'Quantum theory gives the probability of each place—not the address of the next arrival.',
    note: 'Each event is definite. Its location is not determined by the model.',
    settings: { rate: 3 }, targetDetections: 14, showAmplitude: false,
  },
  {
    title: 'Yet uncertainty has a shape.',
    body: 'Let hundreds arrive. A precise pattern slowly appears from individually unpredictable events.',
    note: 'The distribution is stable even when the sequence is not.',
    settings: { rate: 95 }, targetDetections: 450, showAmplitude: false,
  },
  {
    title: 'Possibilities combine before probabilities.',
    body: 'An amplitude reaches the screen through each slit. Add those amplitudes, then square their magnitude.',
    note: 'This is why opening a second path can make some outcomes less likely.',
    settings: { rate: 24 }, targetDetections: 280, showAmplitude: true,
  },
  {
    title: 'Make the paths distinguishable.',
    body: 'Let the environment carry a reliable mark of which slit. The alternatives can no longer interfere.',
    note: 'No human needs to look. A physical record is enough.',
    settings: { distinguishability: 1, rate: 55 }, targetDetections: 350, showAmplitude: true,
  },
  {
    title: 'Reality trades pattern for path.',
    body: 'Between perfect ambiguity and perfect path knowledge, the fringes fade continuously.',
    note: 'In this ideal model: visibility² + distinguishability² = 1.',
    settings: { distinguishability: 0.64, rate: 38 }, targetDetections: 300, showAmplitude: true,
  },
  {
    title: 'The experiment ends. The stories begin.',
    body: 'Every interpretation must account for these same points and the same probability curve.',
    note: 'They disagree about what the mathematics says exists between events.',
    settings: { distinguishability: 0, rate: 22 }, targetDetections: 200, showAmplitude: true,
  },
]

export const interpretations: Interpretation[] = [
  {
    id: 'copenhagen', name: 'Copenhagen family', short: 'Possibility becomes an outcome.',
    claim: 'The quantum state encodes the possible outcomes and their amplitudes. Asking for a definite path without a path measurement may be the wrong question.',
    journey: 'Both alternatives contribute to the state. The formalism does not assign an ordinary hidden route between preparation and detection.',
    measurement: 'A measurement yields one outcome; the state is updated or said to collapse. Different Copenhagen-style accounts draw the quantum–classical boundary differently.',
    caution: '“Copenhagen” is a family of views, not one perfectly uniform doctrine—and it does not require a conscious mind to create reality.',
  },
  {
    id: 'many-worlds', name: 'Everett / Many Worlds', short: 'The state never collapses.',
    claim: 'The universal wavefunction evolves continuously. Measurement entangles system, apparatus, environment, and observer.',
    journey: 'Both slit amplitudes remain in the total state. When path information leaks outward, the alternatives become correlated with different environmental records.',
    measurement: 'Decoherence makes branches effectively unable to interfere. An observer in each branch records a definite result relative to that branch.',
    caution: 'The picture must still explain why experienced outcomes follow Born-rule probabilities; “a new universe pops into existence” is an oversimplification.',
  },
  {
    id: 'bohmian', name: 'Bohmian mechanics', short: 'A particle has a position; a wave guides it.',
    claim: 'The particle follows one definite trajectory while the guiding wave evolves through both slits.',
    journey: 'Its exact initial position determines its route. The wave’s phase guides the motion so an ensemble of unknown initial positions forms the interference pattern.',
    measurement: 'The apparatus is another physical system with definite configuration. Effective collapse emerges when branches cease to overlap in configuration space.',
    caution: 'The theory is explicitly nonlocal. Our visual path is only a conceptual cue; this app does not integrate the full Bohmian guidance equation.',
  },
  {
    id: 'collapse', name: 'Objective collapse', short: 'Collapse is a real physical process.',
    claim: 'The wavefunction is physical, but superpositions spontaneously localize with a small probability that grows for larger systems.',
    journey: 'At the scale of this ideal slit experiment, the state normally evolves and interferes almost exactly as standard quantum theory predicts.',
    measurement: 'No special observer is required. A sufficiently amplified system localizes because the dynamics itself contains stochastic collapse.',
    caution: 'Unlike the other lenses here, collapse models modify the dynamics and can in principle differ experimentally. This app does not simulate a specific model’s parameters.',
  },
]
