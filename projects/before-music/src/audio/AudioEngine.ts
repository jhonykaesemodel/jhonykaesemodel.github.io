import type { AnalysisData, AudioSourceData } from '../types'

export class AudioEngine {
  private context: AudioContext | null = null
  private sourceNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private source: AudioSourceData | null = null
  private startedAt = 0
  private offset = 0
  private playing = false

  private getContext() {
    if (!this.context) this.context = new AudioContext()
    return this.context
  }

  async unlock() {
    const context = this.getContext()
    // iOS Safari needs audio output to be initiated inside the user gesture.
    // Starting a silent one-sample source primes the native audio session without
    // adding a sound or changing the experience's playback position.
    const silent = context.createBufferSource()
    const silence = context.createGain()
    silent.buffer = context.createBuffer(1, 1, context.sampleRate)
    silence.gain.value = 0
    silent.connect(silence).connect(context.destination)
    try { silent.start(0) } catch { /* the context may already be closing */ }
    try {
      await Promise.race([
        context.resume(),
        new Promise<void>((resolve) => window.setTimeout(resolve, 1000)),
      ])
    } catch { return false }
    return context.state === 'running'
  }

  async createDemo(): Promise<AudioSourceData> {
    const sampleRate = 44100
    const duration = 36
    const offline = new OfflineAudioContext(2, sampleRate * duration, sampleRate)
    const master = offline.createGain()
    master.gain.value = 0.58
    master.connect(offline.destination)
    const chords = [
      [110, 164.81, 220], [98, 146.83, 196], [130.81, 196, 261.63], [87.31, 130.81, 174.61],
    ]
    for (let bar = 0; bar < 9; bar += 1) {
      const start = bar * 4
      const chord = chords[bar % chords.length]
      chord.forEach((frequency, voice) => {
        const oscillator = offline.createOscillator()
        const gain = offline.createGain()
        const pan = offline.createStereoPanner()
        oscillator.type = voice === 0 ? 'sine' : 'triangle'
        oscillator.frequency.value = frequency * (voice === 2 ? 2 : 1)
        pan.pan.value = voice === 1 ? -0.45 : voice === 2 ? 0.45 : 0
        gain.gain.setValueAtTime(0, start)
        gain.gain.linearRampToValueAtTime(voice === 0 ? 0.2 : 0.08, start + 0.45)
        gain.gain.exponentialRampToValueAtTime(0.001, Math.min(duration, start + 3.9))
        oscillator.connect(gain).connect(pan).connect(master)
        oscillator.start(start)
        oscillator.stop(Math.min(duration, start + 4))
      })
      for (let beat = 0; beat < 4; beat += 1) {
        const time = start + beat
        const kick = offline.createOscillator()
        const kickGain = offline.createGain()
        kick.frequency.setValueAtTime(95, time)
        kick.frequency.exponentialRampToValueAtTime(42, time + 0.22)
        kickGain.gain.setValueAtTime(0.34, time)
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3)
        kick.connect(kickGain).connect(master)
        kick.start(time)
        kick.stop(time + 0.31)
      }
    }
    const buffer = await offline.startRendering()
    return this.setBuffer(buffer, 'A field of pressure', 'Procedural study', 'demo')
  }

  async loadFile(file: File): Promise<AudioSourceData> {
    const context = this.getContext()
    const buffer = await context.decodeAudioData(await file.arrayBuffer())
    return this.setBuffer(buffer, file.name.replace(/\.[^.]+$/, ''), 'Local audio · never uploaded', 'file')
  }

  private setBuffer(buffer: AudioBuffer, name: string, artist: string, kind: 'demo' | 'file') {
    this.stopSource()
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, channel) =>
      new Float32Array(buffer.getChannelData(channel)),
    )
    this.source = {
      id: `${kind}-${Date.now()}`,
      kind,
      name,
      artist,
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      channels,
      buffer,
    }
    this.offset = 0
    return this.source
  }

  async play() {
    if (this.playing) return true
    if (!this.source) return false
    const context = this.getContext()
    if (!await this.unlock()) return false
    if (this.offset >= this.source.duration) this.offset = 0
    const node = context.createBufferSource()
    const gain = context.createGain()
    node.buffer = this.source.buffer
    gain.gain.value = this.gainNode?.gain.value ?? 0.75
    node.connect(gain).connect(context.destination)
    node.onended = () => {
      if (this.sourceNode === node && this.currentTime >= (this.source?.duration ?? 0) - 0.04) {
        this.offset = this.source?.duration ?? 0
        this.playing = false
      }
    }
    this.sourceNode = node
    this.gainNode = gain
    this.startedAt = context.currentTime - this.offset
    try {
      node.start(0, this.offset)
      this.playing = true
    } catch {
      node.disconnect()
      this.sourceNode = null
      return false
    }
    return true
  }

  pause() {
    if (!this.playing) return
    this.offset = this.currentTime
    this.stopSource(false)
  }

  seek(time: number) {
    const wasPlaying = this.playing
    this.stopSource(false)
    this.offset = Math.max(0, Math.min(time, this.source?.duration ?? 0))
    if (wasPlaying) void this.play()
  }

  restart() {
    this.seek(0)
  }

  setVolume(value: number) {
    if (this.gainNode) this.gainNode.gain.value = value
  }

  get currentTime() {
    if (!this.playing || !this.context || !this.source) return this.offset
    return Math.min(this.source.duration, Math.max(0, this.context.currentTime - this.startedAt))
  }

  get isPlaying() {
    return this.playing
  }

  get audioState() {
    return this.context?.state ?? 'uninitialized'
  }

  private stopSource(clear = true) {
    if (this.sourceNode) {
      this.sourceNode.onended = null
      try { this.sourceNode.stop() } catch { /* already stopped */ }
      this.sourceNode.disconnect()
    }
    this.sourceNode = null
    this.playing = false
    if (clear) this.offset = 0
  }

  dispose() {
    this.stopSource()
    this.source = null
    void this.context?.close()
    this.context = null
  }
}

export function analyzeInWorker(source: AudioSourceData): Promise<AnalysisData> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (event: MessageEvent<AnalysisData>) => {
      resolve(event.data)
      worker.terminate()
    }
    worker.onerror = (event) => {
      reject(new Error(event.message || 'The audio analysis could not be completed.'))
      worker.terminate()
    }
    const copies = source.channels.map((channel) => new Float32Array(channel))
    worker.postMessage({ channels: copies, sampleRate: source.sampleRate }, copies.map((item) => item.buffer))
  })
}
