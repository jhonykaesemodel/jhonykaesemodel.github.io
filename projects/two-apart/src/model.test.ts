import { describe, expect, it } from "vitest";
import {
  CLASSICAL_LIMIT,
  expectedRate,
  QUANTUM_RATE,
  sampleTrial,
} from "./model";
describe("Bell model", () => {
  it("keeps local instructions at the classical limit", () =>
    expect(expectedRate("instructions")).toBe(CLASSICAL_LIMIT));
  it("matches the optimal quantum CHSH rate", () =>
    expect(expectedRate("quantum")).toBeCloseTo(QUANTUM_RATE, 10));
  it("preserves random local marginals", () => {
    expect(sampleTrial("quantum", 0, 0, () => 0).a).toBe(0);
    expect(sampleTrial("quantum", 0, 0, () => 0.99).a).toBe(1);
  });
});
