/// <reference lib="webworker" />
import { analyzeChannels } from './analysisCore'

self.onmessage = (event: MessageEvent<{ channels: Float32Array[]; sampleRate: number }>) => {
  const result = analyzeChannels(event.data.channels, event.data.sampleRate)
  self.postMessage(result)
}

export {}
