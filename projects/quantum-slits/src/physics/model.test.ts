import { describe, expect, it } from 'vitest'
import { defaultSettings, intensityAt, probabilityDistribution, sampleDetection, seededRandom, sinc, visibility } from './model'

describe('double-slit model', () => {
  it('handles the sinc limit and visibility tradeoff', () => {
    expect(sinc(0)).toBe(1)
    expect(visibility(0)).toBe(1)
    expect(visibility(1)).toBe(0)
    for (const distinguishability of [0, .2, .6, 1]) {
      expect(visibility(distinguishability) ** 2 + distinguishability ** 2).toBeCloseTo(1, 10)
    }
  })

  it('normalizes the detector probability distribution', () => {
    const probabilities = probabilityDistribution(defaultSettings)
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10)
    expect(probabilities.every((value) => value >= 0)).toBe(true)
  })

  it('removes a dark fringe when path information is complete', () => {
    const darkFringe = defaultSettings.wavelength / (0.4 * defaultSettings.slitSeparation)
    const coherent = intensityAt(darkFringe, { ...defaultSettings, distinguishability: 0 })
    const distinguishable = intensityAt(darkFringe, { ...defaultSettings, distinguishability: 1 })
    expect(coherent).toBeLessThan(1e-8)
    expect(distinguishable).toBeGreaterThan(.5)
  })

  it('samples reproducible detections within the screen', () => {
    const randomA = seededRandom(42)
    const randomB = seededRandom(42)
    const a = Array.from({ length: 20 }, () => sampleDetection(defaultSettings, randomA))
    const b = Array.from({ length: 20 }, () => sampleDetection(defaultSettings, randomB))
    expect(a).toEqual(b)
    expect(a.every((value) => value >= -1 && value <= 1)).toBe(true)
  })
})
