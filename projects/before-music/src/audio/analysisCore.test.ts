import { describe, expect, it } from 'vitest'
import { analyzeChannels, analyzeFrequencyWindow, buildEnvelope, createFrequencyKernels, magnifyPressureForDisplay, sumStereo, summarizeAuditoryActivity } from './analysisCore'

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

  it('magnifies quiet pressure without changing its sign or zero crossing', () => {
    expect(magnifyPressureForDisplay(0)).toBe(0)
    expect(magnifyPressureForDisplay(0.01)).toBeGreaterThan(0.01)
    expect(magnifyPressureForDisplay(-0.01)).toBeLessThan(-0.01)
    expect(magnifyPressureForDisplay(2)).toBe(1)
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

  it('calculates perception bands around the current instant instead of the whole-track ratio', () => {
    const sampleRate = 8000
    const signal = Float32Array.from({ length: sampleRate * 4 }, (_, index) =>
      index < sampleRate * 2 ? 0 : Math.sin((2 * Math.PI * 440 * index) / sampleRate) * 0.8,
    )
    const kernels = createFrequencyKernels(sampleRate, 24, 384)
    const quiet = analyzeFrequencyWindow([signal], sampleRate, kernels)
    const tone = analyzeFrequencyWindow([signal], sampleRate * 3, kernels)
    expect(Math.max(...quiet)).toBeLessThan(0.01)
    expect(Math.max(...tone)).toBeGreaterThan(0.5)
  })

  it('extracts level, onset, and spectral center from auditory-band activity', () => {
    const previous = new Float32Array([0.1, 0.1, 0.1, 0.1])
    const current = new Float32Array([0.1, 0.2, 0.6, 0.9])
    const features = summarizeAuditoryActivity(current, previous)
    expect(features.level).toBeGreaterThan(0.5)
    expect(features.onset).toBeGreaterThan(0)
    expect(features.centroid).toBeGreaterThan(0.5)
    expect(summarizeAuditoryActivity(previous, current).onset).toBe(0)
  })
})
