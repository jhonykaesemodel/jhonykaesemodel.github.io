export type ExperienceState = 'landing' | 'loading' | 'guided' | 'lab' | 'error'
export type ViewMode = 'air' | 'signal' | 'perception'
export type ViewingMode = 'night' | 'daylight'

export interface AudioSourceData {
  id: string
  kind: 'demo' | 'file'
  name: string
  artist: string
  duration: number
  sampleRate: number
  channels: Float32Array[]
  buffer: AudioBuffer
}

export interface EnvelopeLevel {
  blockSize: number
  mins: Float32Array
  maxes: Float32Array
}

export interface AnalysisData {
  envelopes: EnvelopeLevel[]
  frequencyFrames: Float32Array
  frequencyBands: number
  frequencyFrameCount: number
  peak: number
  rms: number
}

export interface VisualSettings {
  mode: ViewMode
  temporalZoom: number
  amplitude: number
  density: number
}

export interface GuidedMoment {
  at: number
  until: number
  caption: string
  detail: string
  mode: ViewMode
  temporalZoom: number
  amplitude: number
  action?: 'pause' | 'resume'
}
