import { describe, expect, it } from 'vitest'
import { fatherEntry } from './demoData'
import { layoutLineage, maxLineageDepth, nextStep, primaryNodeAtDepth, story } from './model'

describe('etymology model', () => {
  it('advances and stops at the final guided moment', () => {
    expect(nextStep(0)).toBe(1)
    expect(nextStep(story.length - 1)).toBe(story.length - 1)
  })

  it('finds the oldest mapped depth', () => {
    expect(maxLineageDepth(fatherEntry.lineages[0])).toBe(6)
  })

  it('walks the primary path one historical step at a time', () => {
    expect(primaryNodeAtDepth(fatherEntry.lineages[0], 0).term).toBe('father')
    expect(primaryNodeAtDepth(fatherEntry.lineages[0], 2).term).toBe('fæder')
  })

  it('places the present to the right of its oldest ancestor', () => {
    const nodes = layoutLineage(fatherEntry.lineages[0])
    const present = nodes.find((item) => item.node.term === 'father')
    const ancient = nodes.find((item) => item.node.term === '*ph₂tḗr')
    expect(present?.x).toBeGreaterThan(ancient?.x ?? Infinity)
    expect(present?.depth).toBe(0)
  })

  it('gives reused historical nodes a unique visual identity on each branch', () => {
    const shared = fatherEntry.lineages[0].ancestors[0]
    const branched = {
      ...fatherEntry.lineages[0],
      ancestors: [shared, shared],
    }
    const nodes = layoutLineage(branched)
    expect(new Set(nodes.map((item) => item.instanceId)).size).toBe(nodes.length)
  })
})
