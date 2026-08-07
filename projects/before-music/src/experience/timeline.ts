import type { GuidedMoment } from '../types'

export const GUIDED_DURATION = 45

export const guidedTimeline: GuidedMoment[] = [
  {
    at: 0, until: 5, mode: 'air', temporalZoom: 0.55, amplitude: 0.2,
    caption: 'Before music, the air is already restless.',
    detail: 'These are imagined air parcels. Their chaotic motion is expressive; watch what the signal makes them do together.',
  },
  {
    at: 5, until: 13, mode: 'air', temporalZoom: 0.8, amplitude: 0.75,
    caption: 'Chaos finds a pattern.',
    detail: 'No parcel crosses the field. Each shifts locally as warm compression and cool rarefaction pass.',
    action: 'resume',
  },
  {
    at: 13, until: 20, mode: 'air', temporalZoom: 2.2, amplitude: 1.55,
    caption: 'The invisible becomes immense.',
    detail: 'Thousands of pressure changes per second emerge as collective order. Motion and distance are greatly magnified.',
  },
  {
    at: 20, until: 27, mode: 'signal', temporalZoom: 6.8, amplitude: 1.25,
    caption: 'Hold one moment open.',
    detail: 'This line is the decoded sample signal around a single instant.',
    action: 'pause',
  },
  {
    at: 27, until: 35, mode: 'air', temporalZoom: 3.8, amplitude: 1.2,
    caption: 'A whole song lives in tiny shifts.',
    detail: 'Every coherent displacement follows the decoded stereo signal around this instant.',
    action: 'resume',
  },
  {
    at: 35, until: 45, mode: 'perception', temporalZoom: 1, amplitude: 1,
    caption: 'The ear unfolds one wave into a world.',
    detail: 'The cochlea maps frequency to place. Hair cells turn motion into neural timing and intensity.',
  },
]

export function getGuidedMoment(elapsed: number) {
  return guidedTimeline.find((moment) => elapsed >= moment.at && elapsed < moment.until)
    ?? guidedTimeline[guidedTimeline.length - 1]
}
