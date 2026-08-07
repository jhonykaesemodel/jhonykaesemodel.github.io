import type { Interpretation, StoryMoment } from '../types'

export const story: StoryMoment[] = [
  {
    title: 'Begin with one opening.',
    body: 'A source faces a barrier and a screen. For now, only one narrow slit is open.',
    note: 'One change at a time. First learn the geometry.',
    settings: { slitMode: 'single', distinguishability: 0, rate: 0 }, targetDetections: 0, showAmplitude: true, sceneMode: 'wave',
  },
  {
    title: 'Release one piece of light.',
    body: 'The detector does not receive a faint smear. It records one complete event at one place.',
    note: 'Light exchanges energy in discrete quanta called photons.',
    settings: { slitMode: 'single', distinguishability: 0, rate: 0 }, targetDetections: 1, showAmplitude: false, sceneMode: 'quantum',
    ask: 'Release one',
  },
  {
    title: 'One slit still spreads possibility.',
    body: 'Let many photons arrive. A broad diffraction band forms instead of a sharp image of the opening.',
    note: 'A narrower opening produces a wider spread.',
    settings: { slitMode: 'single', rate: 105 }, targetDetections: 420, showAmplitude: false, sceneMode: 'quantum',
  },
  {
    title: 'Borrow an intuition from water.',
    body: 'An opening does not launch a narrow ray. A wave entering a gap spreads outward from it.',
    note: 'The rippling surface shows phase and overlap. It is an analogy—not a hidden ocean made of light.',
    settings: { slitMode: 'single', rate: 0 }, targetDetections: 0, showAmplitude: true, sceneMode: 'wave',
  },
  {
    title: 'Now open a second slit.',
    body: 'Each opening launches a spreading wave. Where peaks meet peaks they reinforce; peaks meeting troughs cancel.',
    note: 'Two open paths can create dark places where one open path allowed arrivals.',
    settings: { slitMode: 'double', rate: 0 }, targetDetections: 0, showAmplitude: true, sceneMode: 'wave',
  },
  {
    title: 'Dim the light. Keep both slits.',
    body: 'Send photons so sparsely that only one is inside the apparatus at a time. The next event still lands at one point.',
    note: 'There is no second photon present for it to collide or interfere with.',
    settings: { slitMode: 'double', distinguishability: 0, rate: 0 }, targetDetections: 1, showAmplitude: false, sceneMode: 'quantum',
    ask: 'Release one photon',
  },
  {
    title: 'One point knows nothing. Many remember.',
    body: 'Each arrival looks random. Together they build the same bright and dark interference bands predicted by adding amplitudes.',
    note: 'The pattern forms even when the quanta traverse the apparatus one at a time.',
    settings: { slitMode: 'double', distinguishability: 0, rate: 130 }, targetDetections: 720, showAmplitude: false, sceneMode: 'quantum',
  },
  {
    title: 'Ask which slit—and the pattern leaves.',
    body: 'If the apparatus stores reliable path information, the two alternatives no longer interfere. The dark gaps fill in.',
    note: 'No conscious observer is required. A physical record in the environment is enough.',
    settings: { slitMode: 'double', distinguishability: 1, rate: 120 }, targetDetections: 520, showAmplitude: false, sceneMode: 'quantum',
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
