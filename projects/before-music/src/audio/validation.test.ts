import { describe, expect, it } from 'vitest'
import { validateAudioFile } from './validation'

describe('audio file validation', () => {
  it('accepts browser audio and recognized extensions', () => {
    expect(validateAudioFile({ name: 'song.mp3', size: 12, type: 'audio/mpeg' })).toBeNull()
    expect(validateAudioFile({ name: 'field.wav', size: 12, type: '' })).toBeNull()
  })
  it('rejects empty, oversized, and unrelated files', () => {
    expect(validateAudioFile({ name: 'empty.mp3', size: 0, type: 'audio/mpeg' })).toMatch(/empty/)
    expect(validateAudioFile({ name: 'huge.wav', size: 251 * 1024 * 1024, type: 'audio/wav' })).toMatch(/250 MB/)
    expect(validateAudioFile({ name: 'notes.txt', size: 20, type: 'text/plain' })).toMatch(/Choose/)
  })
})
