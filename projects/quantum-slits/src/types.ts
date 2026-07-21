export type ExperienceState = 'landing' | 'guided' | 'lab'
export type InterpretationId = 'copenhagen' | 'many-worlds' | 'bohmian' | 'collapse'

export interface ExperimentSettings {
  wavelength: number
  slitWidth: number
  slitSeparation: number
  distinguishability: number
  slitMode: 'both' | 'upper' | 'lower'
  rate: number
}

export interface Detection {
  id: number
  y: number
  bornAt: number
  slitHint: -1 | 0 | 1
}

export interface StoryMoment {
  title: string
  body: string
  note: string
  settings: Partial<ExperimentSettings>
  targetDetections: number
  showAmplitude: boolean
  ask?: string
}

export interface Interpretation {
  id: InterpretationId
  name: string
  short: string
  claim: string
  journey: string
  measurement: string
  caution: string
}
