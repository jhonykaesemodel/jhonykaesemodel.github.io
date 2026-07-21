export type Model = "instructions" | "quantum";
export const CLASSICAL_LIMIT = 0.75;
export const QUANTUM_RATE = Math.cos(Math.PI / 8) ** 2;
export const quantumCorrelation = (a: number, b: number) => Math.cos(a - b);
export const winProbability = (model: Model, x: number, y: number) =>
  model === "instructions"
    ? x === 1 && y === 1
      ? 0
      : 1
    : (1 +
        (x === 1 && y === 1 ? -1 : 1) *
          quantumCorrelation(
            (x * Math.PI) / 2,
            y === 0 ? Math.PI / 4 : -Math.PI / 4,
          )) /
      2;
export const expectedRate = (model: Model) =>
  [0, 0, 1, 1].reduce(
    (s, x, i) => s + winProbability(model, x, [0, 1, 0, 1][i]),
    0,
  ) / 4;
export const sampleTrial = (
  model: Model,
  x: number,
  y: number,
  random = Math.random,
) => {
  const win = random() < winProbability(model, x, y);
  const a = random() < 0.5 ? 0 : 1;
  const target = x & y;
  return { x, y, a, b: win ? a ^ target : a ^ target ^ 1, win };
};
export const story = [
  {
    title: "One event becomes two.",
    body: "A source prepares a pair that must be described together. The particles travel toward distant observers: Alice and Bob.",
    note: "The line between them marks a shared quantum state—not a physical cord or signal.",
  },
  {
    title: "Each answer alone is random.",
    body: "Alice chooses a measurement and receives 0 or 1. So does Bob. Neither local stream contains a readable message.",
    note: "Entanglement changes joint statistics, not either observer’s unpredictable local outcomes.",
  },
  {
    title: "Together, a pattern appears.",
    body: "Only after the records are compared do correlations emerge. Their strength depends on both measurement choices.",
    note: "Ordinary shared causes can correlate results too. Bell found how to tell the difference.",
  },
  {
    title: "Imagine hidden instruction cards.",
    body: "Perhaps each pair carries answers prepared at the source. Alice and Bob may agree on three of four possible question-pairs.",
    note: "For the CHSH challenge, every local prewritten strategy wins at most 75% on uniformly random questions.",
  },
  {
    title: "Now ask nature.",
    body: "The quantum strategy predicts about 85.4% wins. Run enough trials and the classical ceiling is crossed.",
    note: "Equivalent correlation form: the CHSH value can reach 2√2, while local hidden-variable models are bounded by 2.",
  },
  {
    title: "Distance is not the trick.",
    body: "No usable message jumps between the detectors. The surprise is that locally pre-existing answers cannot explain the joint data.",
    note: "Bell tests constrain local hidden-variable explanations; they do not select one interpretation of quantum mechanics.",
  },
];
