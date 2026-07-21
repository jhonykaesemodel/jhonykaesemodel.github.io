import type { AnalysisData, EnvelopeLevel } from '../types'

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

export function sumStereo(left: number, right: number, listenerPosition: number) {
  const pan = Math.max(-1, Math.min(1, listenerPosition))
  return left * (0.5 - pan * 0.25) + right * (0.5 + pan * 0.25)
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
