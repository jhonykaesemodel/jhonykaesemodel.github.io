import { describe, expect, it } from 'vitest'
import { fatherEntry, paternalEntry } from './demoData'
import { findCommonAncestor, layoutLineage, nextStep, normalizeTerm, story } from './model'

describe('etymology model', () => {
  it('advances and stops at the final guided moment', () => {
    expect(nextStep(0)).toBe(1)
    expect(nextStep(story.length - 1)).toBe(story.length - 1)
  })

  it('normalizes typographic variants without treating language as irrelevant', () => {
    expect(normalizeTerm('*ph₂tḗr')).toBe('ph2ter')
  })

  it('finds the nearest form shared by two paths', () => {
    const common = findCommonAncestor(fatherEntry.lineages[0], paternalEntry.lineages[0])
    expect(common?.left.node.term).toBe('*ph₂tḗr')
    expect(common?.left.node.language).toBe('Proto-Indo-European')
  })

  it('preserves ancestry order in the vertical layout', () => {
    const nodes = layoutLineage(fatherEntry.lineages[0], 0, 500)
    const present = nodes.find((item) => item.node.term === 'father')
    const ancient = nodes.find((item) => item.node.term === '*ph₂tḗr')
    expect(present?.y).toBeGreaterThan(ancient?.y ?? Infinity)
    expect(present?.depth).toBe(0)
  })
})
