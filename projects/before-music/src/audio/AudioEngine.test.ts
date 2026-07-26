import { afterEach, describe, expect, it, vi } from 'vitest'
import { AudioEngine, audioBufferToWave, prefersNativeIOSPlayback } from './AudioEngine'

const OriginalAudioContext = globalThis.AudioContext

function contextFixture(state: AudioContextState = 'running') {
  const start = vi.fn()
  const resume = vi.fn().mockResolvedValue(undefined)
  const source = { buffer: null, connect: vi.fn((target: unknown) => target), start }
  const gain = { gain: { value: 1 }, connect: vi.fn((target: unknown) => target) }
  const context = {
    state,
    sampleRate: 44100,
    destination: {},
    createBuffer: vi.fn(() => ({})),
    createBufferSource: vi.fn(() => source),
    createGain: vi.fn(() => gain),
    decodeAudioData: vi.fn(),
    close: vi.fn(),
    resume,
  }
  globalThis.AudioContext = vi.fn(() => context) as unknown as typeof AudioContext
  return { context, start, resume }
}

afterEach(() => { globalThis.AudioContext = OriginalAudioContext })

describe('iOS audio activation', () => {
  it('starts a silent source inside the unlock gesture before resuming', async () => {
    const { start, resume } = contextFixture('running')
    const engine = new AudioEngine(false)
    await expect(engine.unlock()).resolves.toBe(true)
    expect(start).toHaveBeenCalledOnce()
    expect(resume).toHaveBeenCalledOnce()
    expect(start.mock.invocationCallOrder[0]).toBeLessThan(resume.mock.invocationCallOrder[0])
  })

  it('reports when Safari keeps the context suspended', async () => {
    contextFixture('suspended')
    const engine = new AudioEngine(false)
    await expect(engine.unlock()).resolves.toBe(false)
  })

  it('detects iPhone and touch-capable iPadOS devices', () => {
    expect(prefersNativeIOSPlayback('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)', 'iPhone', 5)).toBe(true)
    expect(prefersNativeIOSPlayback('Mozilla/5.0 (Macintosh)', 'MacIntel', 5)).toBe(true)
    expect(prefersNativeIOSPlayback('Mozilla/5.0 (Macintosh)', 'MacIntel', 0)).toBe(false)
  })

  it('encodes the procedural demo as Safari-compatible PCM wave audio', () => {
    const samples = Float32Array.from([0, 0.5, -0.5, 0])
    const buffer = {
      numberOfChannels: 1, length: samples.length, sampleRate: 44100,
      getChannelData: () => samples,
    } as unknown as AudioBuffer
    const wave = audioBufferToWave(buffer)
    expect(wave.type).toBe('audio/wav')
    expect(wave.size).toBe(44 + samples.length * 2)
  })

  it('uses Safari native media playback on iOS', async () => {
    const { context } = contextFixture('suspended')
    const samples = Float32Array.from([0, 0.25, -0.25, 0])
    const buffer = {
      numberOfChannels: 1, length: samples.length, sampleRate: 44100, duration: samples.length / 44100,
      getChannelData: () => samples,
    } as unknown as AudioBuffer
    context.decodeAudioData.mockResolvedValue(buffer)
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:ios-audio') })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
      Object.defineProperty(this, 'paused', { configurable: true, value: false })
      return Promise.resolve()
    })
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
      Object.defineProperty(this, 'paused', { configurable: true, value: true })
    })
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined)
    try {
      const engine = new AudioEngine(true)
      await engine.loadFile(new File([new Uint8Array([1, 2, 3])], 'song.wav', { type: 'audio/wav' }))
      await expect(engine.play()).resolves.toBe(true)
      expect(play).toHaveBeenCalledOnce()
      expect(context.resume).not.toHaveBeenCalled()
      engine.dispose()
    } finally {
      Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: originalCreateObjectURL })
      Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: originalRevokeObjectURL })
    }
  })
})
