import { describe, expect, it } from 'vitest'
import { getGuidedMoment, guidedTimeline, GUIDED_DURATION } from './timeline'

describe('guided timeline', () => {
  it('has continuous coverage for the full journey', () => {
    expect(guidedTimeline[0].at).toBe(0)
    expect(guidedTimeline.at(-1)?.until).toBe(GUIDED_DURATION)
    guidedTimeline.slice(1).forEach((moment, index) => expect(moment.at).toBe(guidedTimeline[index].until))
  })
  it('selects moments at boundaries', () => {
    expect(getGuidedMoment(0).caption).toContain('air')
    expect(getGuidedMoment(20).mode).toBe('signal')
    expect(getGuidedMoment(40).mode).toBe('perception')
  })
})
