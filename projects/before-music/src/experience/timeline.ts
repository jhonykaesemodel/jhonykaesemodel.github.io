import type { GuidedMoment } from '../types'

export const GUIDED_DURATION = 45

export const guidedTimeline: GuidedMoment[] = [
  {
    at: 0, until: 5, mode: 'air', temporalZoom: 0.55, amplitude: 0.2,
    caption: 'Before music, there is only air.',
    detail: 'A quiet field of molecules, waiting to be disturbed.',
  },
  {
    at: 5, until: 13, mode: 'air', temporalZoom: 0.8, amplitude: 0.75,
    caption: 'Pressure arrives.',
    detail: 'Compression and rarefaction carry a changing signal through space.',
    action: 'resume',
  },
  {
    at: 13, until: 20, mode: 'air', temporalZoom: 2.2, amplitude: 1.55,
    caption: 'Thousands of changes, every second.',
    detail: 'Motion and distance are magnified here so the invisible can be seen.',
  },
  {
    at: 20, until: 27, mode: 'signal', temporalZoom: 6.8, amplitude: 1.25,
    caption: 'Hold one moment open.',
    detail: 'This line is the decoded sample signal around a single instant.',
    action: 'pause',
  },
  {
    at: 27, until: 35, mode: 'air', temporalZoom: 3.8, amplitude: 1.2,
    caption: 'Two waves meet at one listener.',
    detail: 'Virtual left and right sources combine at the observation point.',
    action: 'resume',
  },
  {
    at: 35, until: 45, mode: 'perception', temporalZoom: 1, amplitude: 1,
    caption: 'Then the ear begins to separate the whole.',
    detail: 'One pressure history becomes bands of activity—and perception begins.',
  },
]

export function getGuidedMoment(elapsed: number) {
  return guidedTimeline.find((moment) => elapsed >= moment.at && elapsed < moment.until)
    ?? guidedTimeline[guidedTimeline.length - 1]
}
