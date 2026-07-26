import { afterEach, describe, expect, it, vi } from 'vitest'
import { AudioEngine } from './AudioEngine'

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
    resume,
  }
  globalThis.AudioContext = vi.fn(() => context) as unknown as typeof AudioContext
  return { context, start, resume }
}

afterEach(() => { globalThis.AudioContext = OriginalAudioContext })

describe('iOS audio activation', () => {
  it('starts a silent source inside the unlock gesture before resuming', async () => {
    const { start, resume } = contextFixture('running')
    const engine = new AudioEngine()
    await expect(engine.unlock()).resolves.toBe(true)
    expect(start).toHaveBeenCalledOnce()
    expect(resume).toHaveBeenCalledOnce()
    expect(start.mock.invocationCallOrder[0]).toBeLessThan(resume.mock.invocationCallOrder[0])
  })

  it('reports when Safari keeps the context suspended', async () => {
    contextFixture('suspended')
    const engine = new AudioEngine()
    await expect(engine.unlock()).resolves.toBe(false)
  })
})
