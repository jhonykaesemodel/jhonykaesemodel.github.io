import {describe, expect, it} from 'vitest'
import {
  clampYears, evidence, FAMILY_YEARS, historyPercent, lifetimeAsDaySeconds, nearestEvidence,
  nextStep, positionToYears, previousStep, SPECIES_YEARS, story, visibleEvidence,
  WRITING_YEARS, yearsAsDayMinutes, yearsToPosition
} from './model'

describe('guided timeline', () => {
  it('advances and stops at both boundaries', () => {
    expect(nextStep(0)).toBe(1)
    expect(nextStep(story.length - 1)).toBe(story.length - 1)
    expect(previousStep(0)).toBe(0)
    expect(previousStep(3)).toBe(2)
  })
})

describe('deep-time scale', () => {
  it('maps the oldest point left and now right', () => {
    expect(yearsToPosition(SPECIES_YEARS, 'species')).toBe(0)
    expect(yearsToPosition(0, 'species')).toBe(1)
    expect(positionToYears(0, 'family')).toBe(FAMILY_YEARS)
    expect(positionToYears(1, 'family')).toBe(0)
  })

  it('clamps dates when the scope changes', () => {
    expect(clampYears(FAMILY_YEARS, 'species')).toBe(SPECIES_YEARS)
    expect(clampYears(-10, 'species')).toBe(0)
  })

  it('keeps scale analogies numerically honest', () => {
    expect(historyPercent(WRITING_YEARS)).toBeCloseTo(1.6508, 3)
    expect(yearsAsDayMinutes(WRITING_YEARS)).toBeCloseTo(23.77, 1)
    expect(lifetimeAsDaySeconds(80)).toBeCloseTo(21.94, 1)
  })

  it('keeps milestones ordered and filters them by scope', () => {
    expect(evidence.every((item, index) => index === 0 || evidence[index - 1].yearsAgo <= item.yearsAgo)).toBe(true)
    expect(visibleEvidence('species').some(item => item.id === 'lucy')).toBe(false)
    expect(visibleEvidence('family').some(item => item.id === 'lucy')).toBe(true)
  })

  it('selects the closest surviving clue', () => {
    expect(nearestEvidence(38_000, 'species').id).toBe('flute')
    expect(nearestEvidence(3_200_000, 'family').id).toBe('lucy')
  })
})
