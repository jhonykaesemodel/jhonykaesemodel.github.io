import type { ExperimentSettings } from '../types'

export const defaultSettings: ExperimentSettings = {
  wavelength: 0.62,
  slitWidth: 1.35,
  slitSeparation: 4.6,
  distinguishability: 0,
  slitMode: 'single',
  rate: 18,
}

export function sinc(value: number) {
  return Math.abs(value) < 1e-8 ? 1 : Math.sin(value) / value
}

export function visibility(distinguishability: number) {
  const d = Math.max(0, Math.min(1, distinguishability))
  return Math.sqrt(1 - d * d)
}

export function intensityAt(normalizedY: number, settings: ExperimentSettings) {
  const sinTheta = normalizedY * 0.2
  const beta = Math.PI * settings.slitWidth * sinTheta / settings.wavelength
  const envelope = sinc(beta) ** 2
  if (settings.slitMode === 'single') return envelope
  const phaseDifference = 2 * Math.PI * settings.slitSeparation * sinTheta / settings.wavelength
  return Math.max(0, envelope * (1 + visibility(settings.distinguishability) * Math.cos(phaseDifference)))
}

export function slitPositions(settings: ExperimentSettings) {
  return settings.slitMode === 'single'
    ? [0]
    : [-settings.slitSeparation / 2, settings.slitSeparation / 2]
}

export function waveAmplitudeAt(x: number, y: number, time: number, settings: ExperimentSettings) {
  if (x <= 0) return 0
  const visualSeparation = settings.slitSeparation * 0.22
  const positions = settings.slitMode === 'single' ? [0] : [-visualSeparation / 2, visualSeparation / 2]
  const waveNumber = (Math.PI * 2) / Math.max(0.15, settings.wavelength)
  const amplitude = positions.reduce((sum, slitY) => {
    const distance = Math.hypot(x, y - slitY)
    const spread = 1 / Math.sqrt(Math.max(0.35, distance))
    return sum + Math.sin(waveNumber * distance - time) * spread
  }, 0)
  return amplitude / Math.sqrt(positions.length)
}

export function probabilityDistribution(settings: ExperimentSettings, bins = 720) {
  const values = new Float64Array(bins)
  let total = 0
  for (let index = 0; index < bins; index += 1) {
    const y = (index / (bins - 1) - 0.5) * 2
    values[index] = intensityAt(y, settings)
    total += values[index]
  }
  if (total === 0) return values
  for (let index = 0; index < bins; index += 1) values[index] /= total
  return values
}

export function sampleDetection(settings: ExperimentSettings, random = Math.random) {
  const probabilities = probabilityDistribution(settings)
  const target = random()
  let cumulative = 0
  for (let index = 0; index < probabilities.length; index += 1) {
    cumulative += probabilities[index]
    if (cumulative >= target) return (index / (probabilities.length - 1) - 0.5) * 2
  }
  return 1
}

export function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 4294967296
  }
}
