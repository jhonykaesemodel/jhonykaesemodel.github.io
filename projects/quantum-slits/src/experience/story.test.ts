import { describe, expect, it } from 'vitest'
import { interpretations, story } from './story'

describe('learning journey', () => {
  it('moves from evidence to interpretation', () => {
    expect(story[0].title).toMatch(/one event/i)
    expect(story.at(-1)?.title).toMatch(/stories begin/i)
    expect(story.every((moment) => moment.targetDetections > 0)).toBe(true)
  })

  it('keeps interpretation claims and cautions explicit', () => {
    expect(interpretations.map((item) => item.id)).toEqual(['copenhagen', 'many-worlds', 'bohmian', 'collapse'])
    interpretations.forEach((item) => {
      expect(item.claim.length).toBeGreaterThan(50)
      expect(item.caution.length).toBeGreaterThan(50)
    })
  })
})
