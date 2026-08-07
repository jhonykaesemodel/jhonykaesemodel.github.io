import { describe, expect, it } from 'vitest'
import { interpretations, story } from './story'

describe('learning journey', () => {
  it('moves from evidence to interpretation', () => {
    expect(story[0].title).toMatch(/one opening/i)
    expect(story.findIndex((moment) => moment.settings.slitMode === 'double')).toBeGreaterThan(0)
    expect(story.some((moment) => moment.sceneMode === 'wave')).toBe(true)
    expect(story.at(-1)?.title).toMatch(/which slit/i)
    expect(story.filter((moment) => moment.ask).every((moment) => moment.targetDetections === 1)).toBe(true)
  })

  it('keeps interpretation claims and cautions explicit', () => {
    expect(interpretations.map((item) => item.id)).toEqual(['copenhagen', 'many-worlds', 'bohmian', 'collapse'])
    interpretations.forEach((item) => {
      expect(item.claim.length).toBeGreaterThan(50)
      expect(item.caution.length).toBeGreaterThan(50)
    })
  })
})
