import { describe, expect, it } from 'vitest'
import { analyzeChannels, buildEnvelope, sumStereo } from './analysisCore'

describe('audio analysis', () => {
  it('builds min/max envelope blocks without losing extrema', () => {
    const level = buildEnvelope(Float32Array.from([0.2, -0.8, 0.7, 0.1, -0.1]), 2)
    expect(Array.from(level.mins).map((value) => +value.toFixed(2))).toEqual([-0.8, 0.1, -0.1])
    expect(Array.from(level.maxes).map((value) => +value.toFixed(2))).toEqual([0.2, 0.7, -0.1])
  })

  it('moves the virtual listener between stereo sources', () => {
    expect(sumStereo(1, 0, -1)).toBeGreaterThan(sumStereo(1, 0, 1))
    expect(sumStereo(0, 1, 1)).toBeGreaterThan(sumStereo(0, 1, -1))
    expect(sumStereo(1, 1, 0)).toBe(1)
  })

  it('returns normalized waveform and frequency metadata', () => {
    const signal = Float32Array.from({ length: 4096 }, (_, index) => Math.sin(index / 12) * 0.5)
    const result = analyzeChannels([signal], 44100)
    expect(result.envelopes).toHaveLength(4)
    expect(result.frequencyBands).toBe(48)
    expect(result.frequencyFrames.length).toBe(result.frequencyBands * result.frequencyFrameCount)
    expect(result.peak).toBeCloseTo(0.5, 2)
    expect(result.rms).toBeGreaterThan(0.3)
  })
})
