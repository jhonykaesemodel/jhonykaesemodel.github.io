import type { AnalysisData, EnvelopeLevel } from '../types'

export interface FrequencyKernel {
  cosine: Float32Array
  sine: Float32Array
}

export function magnifyPressureForDisplay(value: number) {
  const bounded = Math.max(-1, Math.min(1, value))
  return Math.sign(bounded) * Math.pow(Math.abs(bounded), 0.46)
}

export function createFrequencyKernels(sampleRate: number, bandCount = 48, windowSize = 384) {
  const highestFrequency = Math.min(18000, sampleRate * 0.45)
  return Array.from({ length: bandCount }, (_, band): FrequencyKernel => {
    const frequency = 45 * Math.pow(highestFrequency / 45, band / Math.max(1, bandCount - 1))
    const cosine = new Float32Array(windowSize)
    const sine = new Float32Array(windowSize)
    for (let index = 0; index < windowSize; index += 1) {
      const phase = (2 * Math.PI * frequency * index) / sampleRate
      const window = 0.5 - 0.5 * Math.cos((2 * Math.PI * index) / Math.max(1, windowSize - 1))
      cosine[index] = Math.cos(phase) * window
      sine[index] = Math.sin(phase) * window
    }
    return { cosine, sine }
  })
}

export function analyzeFrequencyWindow(
  channels: Float32Array[],
  centerSample: number,
  kernels: FrequencyKernel[],
  output = new Float32Array(kernels.length),
) {
  const left = channels[0]
  const right = channels[Math.min(1, channels.length - 1)] ?? left
  if (!left?.length) return output.fill(0)
  const windowSize = kernels[0]?.cosine.length ?? 0
  const start = centerSample - Math.floor(windowSize / 2)
  for (let band = 0; band < kernels.length; band += 1) {
    let real = 0
    let imaginary = 0
    const kernel = kernels[band]
    for (let index = 0; index < windowSize; index += 1) {
      const sampleIndex = Math.max(0, Math.min(left.length - 1, start + index))
      const value = ((left[sampleIndex] ?? 0) + (right[sampleIndex] ?? 0)) * 0.5
      real += value * kernel.cosine[index]
      imaginary -= value * kernel.sine[index]
    }
    output[band] = Math.min(1, Math.sqrt(real * real + imaginary * imaginary) / Math.max(1, windowSize * 0.18))
  }
  return output
}

export interface AuditoryFeatures {
  level: number
  onset: number
  centroid: number
}

export function summarizeAuditoryActivity(
  current: Float32Array,
  previous: Float32Array,
): AuditoryFeatures {
  let energy = 0
  let positiveChange = 0
  let weighted = 0
  let total = 0
  for (let band = 0; band < current.length; band += 1) {
    const value = Math.max(0, current[band] ?? 0)
    energy += value * value
    positiveChange += Math.max(0, value - (previous[band] ?? 0))
    weighted += value * band
    total += value
  }
  return {
    level: current.length ? Math.min(1, Math.sqrt(energy / current.length) * 2.4) : 0,
    onset: current.length ? Math.min(1, (positiveChange / current.length) * 5.5) : 0,
    centroid: total > 0 && current.length > 1 ? weighted / total / (current.length - 1) : 0,
  }
}

export function buildEnvelope(channel: Float32Array, blockSize: number): EnvelopeLevel {
  const length = Math.ceil(channel.length / blockSize)
  const mins = new Float32Array(length)
  const maxes = new Float32Array(length)
  for (let block = 0; block < length; block += 1) {
    let min = 1
    let max = -1
    const end = Math.min(channel.length, (block + 1) * blockSize)
    for (let index = block * blockSize; index < end; index += 1) {
      min = Math.min(min, channel[index])
      max = Math.max(max, channel[index])
    }
    mins[block] = min
    maxes[block] = max
  }
  return { blockSize, mins, maxes }
}

export function analyzeChannels(channels: Float32Array[], sampleRate: number): AnalysisData {
  const mono = channels.length === 1
    ? channels[0]
    : Float32Array.from(channels[0], (value, index) => (value + (channels[1]?.[index] ?? value)) * 0.5)
  let peak = 0
  let squareSum = 0
  for (const sample of mono) {
    peak = Math.max(peak, Math.abs(sample))
    squareSum += sample * sample
  }
  const envelopes = [64, 256, 1024, 4096].map((size) => buildEnvelope(mono, size))
  const frequencyBands = 48
  const windowSize = 1024
  const frequencyFrameCount = Math.min(360, Math.max(1, Math.floor(mono.length / windowSize)))
  const frequencyFrames = new Float32Array(frequencyFrameCount * frequencyBands)
  const stride = Math.max(windowSize, Math.floor((mono.length - windowSize) / frequencyFrameCount))
  for (let frame = 0; frame < frequencyFrameCount; frame += 1) {
    const offset = Math.min(Math.max(0, mono.length - windowSize), frame * stride)
    for (let band = 0; band < frequencyBands; band += 1) {
      const frequency = 45 * Math.pow(18000 / 45, band / (frequencyBands - 1))
      const omega = (2 * Math.PI * frequency) / sampleRate
      let real = 0
      let imaginary = 0
      for (let i = 0; i < windowSize && offset + i < mono.length; i += 4) {
        const window = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / windowSize)
        const value = mono[offset + i] * window
        real += value * Math.cos(omega * i)
        imaginary -= value * Math.sin(omega * i)
      }
      frequencyFrames[frame * frequencyBands + band] = Math.min(1, Math.sqrt(real * real + imaginary * imaginary) / 32)
    }
  }
  return {
    envelopes,
    frequencyFrames,
    frequencyBands,
    frequencyFrameCount,
    peak,
    rms: mono.length ? Math.sqrt(squareSum / mono.length) : 0,
  }
}
