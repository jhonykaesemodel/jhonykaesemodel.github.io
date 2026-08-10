import { describe, expect, it } from 'vitest'
import { fatherEntry } from './demoData'
import {
  canonicalNodeKey,
  findSharedAncestry,
  layoutLineage,
  maxLineageDepth,
  nextStep,
  primaryNodeAtDepth,
  story,
  type EtymologyNode,
} from './model'

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

  it('normalizes historical diacritics without merging different languages', () => {
    const latin = { id: 'latin', term: 'Iācōbus', language: 'Latin', langCode: 'la', confidence: 'documented', ancestors: [] } as EtymologyNode
    const plainLatin = { ...latin, id: 'plain', term: 'Iacobus' }
    const portuguese = { ...plainLatin, id: 'portuguese', language: 'Portuguese', langCode: 'pt' }
    expect(canonicalNodeKey(latin)).toBe(canonicalNodeKey(plainLatin))
    expect(canonicalNodeKey(latin)).not.toBe(canonicalNodeKey(portuguese))
  })

  it('finds where two modern names first join and how far their shared trail continues', () => {
    const hebrew = { id: 'hebrew', term: 'יַעֲקֹב', language: 'Biblical Hebrew', langCode: 'hbo', confidence: 'documented', ancestors: [] } as EtymologyNode
    const tiago = {
      id: 'tiago', term: 'Tiago', language: 'Portuguese', langCode: 'pt', confidence: 'documented', ancestors: [
        { id: 'latin-a', term: 'Iācōbus', language: 'Latin', langCode: 'la', confidence: 'documented', ancestors: [hebrew] },
      ],
    } as EtymologyNode
    const james = {
      id: 'james', term: 'James', language: 'English', langCode: 'en', confidence: 'documented', ancestors: [
        { id: 'latin-b', term: 'Iacobus', language: 'Latin', langCode: 'la', confidence: 'documented', ancestors: [{ ...hebrew, id: 'hebrew-b' }] },
      ],
    } as EtymologyNode
    const shared = findSharedAncestry(tiago, james)
    expect(shared?.junction.term).toBe('Iācōbus')
    expect(shared?.oldestShared.term).toBe('יַעֲקֹב')
  })
})
