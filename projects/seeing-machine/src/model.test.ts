import { describe, expect, it } from 'vitest'
import { modes, story } from './model'
describe('perception journey', () => {
  it('covers every laboratory mode', () => { modes.forEach((mode) => expect(story.some((moment) => moment.mode === mode.id)).toBe(true)) })
  it('begins with completeness and ends with construction', () => { expect(story[0].title).toMatch(/complete/i); expect(story.at(-1)?.title).toMatch(/construction/i) })
})
