import type { AnalysisData, AudioSourceData } from '../types'

export function prefersNativeIOSPlayback(
  userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent,
  platform = typeof navigator === 'undefined' ? '' : navigator.platform,
  maxTouchPoints = typeof navigator === 'undefined' ? 0 : navigator.maxTouchPoints,
) {
  return /iPad|iPhone|iPod/i.test(userAgent)
    || (/Mac/i.test(platform) && maxTouchPoints > 1)
}

function writeText(view: DataView, offset: number, text: string) {
  for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index))
}

export function audioBufferToWave(buffer: AudioBuffer) {
  const channelCount = Math.min(2, Math.max(1, buffer.numberOfChannels))
  const bytesPerSample = 2
  const dataLength = buffer.length * channelCount * bytesPerSample
  const output = new ArrayBuffer(44 + dataLength)
  const view = new DataView(output)
  writeText(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  writeText(view, 8, 'WAVE')
  writeText(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channelCount, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * channelCount * bytesPerSample, true)
  view.setUint16(32, channelCount * bytesPerSample, true)
  view.setUint16(34, 16, true)
  writeText(view, 36, 'data')
  view.setUint32(40, dataLength, true)
  const channels = Array.from({ length: channelCount }, (_, channel) => buffer.getChannelData(channel))
  let offset = 44
  for (let sample = 0; sample < buffer.length; sample += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const value = Math.max(-1, Math.min(1, channels[channel][sample] ?? 0))
      view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true)
      offset += bytesPerSample
    }
  }
  return new Blob([output], { type: 'audio/wav' })
}

export function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error ?? new Error('Could not read this audio file.'))
    reader.readAsArrayBuffer(blob)
  })
}

export class AudioEngine {
  private context: AudioContext | null = null
  private sourceNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private mediaElement: HTMLAudioElement | null = null
  private mediaUrl: string | null = null
  private source: AudioSourceData | null = null
  private startedAt = 0
  private offset = 0
  private playing = false
  private volume = 0.75
  private readonly nativeIOSPlayback: boolean

  constructor(forceNativeIOSPlayback = prefersNativeIOSPlayback()) {
    this.nativeIOSPlayback = forceNativeIOSPlayback
  }

  private getContext() {
    if (!this.context) this.context = new AudioContext()
    return this.context
  }

  async unlock() {
    if (this.nativeIOSPlayback) return true
    const context = this.getContext()
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
    const playback = this.nativeIOSPlayback ? audioBufferToWave(buffer) : undefined
    return this.setBuffer(buffer, 'A field of pressure', 'Procedural study', 'demo', playback)
  }

  async loadFile(file: File): Promise<AudioSourceData> {
    const context = this.getContext()
    const buffer = await context.decodeAudioData(await readBlobAsArrayBuffer(file))
    return this.setBuffer(buffer, file.name.replace(/\.[^.]+$/, ''), 'Local audio · never uploaded', 'file', file)
  }

  private setBuffer(buffer: AudioBuffer, name: string, artist: string, kind: 'demo' | 'file', playback?: Blob) {
    this.stopPlayback()
    this.releaseMedia()
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
    if (this.nativeIOSPlayback && playback) this.configureMedia(playback)
    return this.source
  }

  private configureMedia(playback: Blob) {
    const media = document.createElement('audio')
    this.mediaUrl = URL.createObjectURL(playback)
    media.src = this.mediaUrl
    media.preload = 'auto'
    media.setAttribute('playsinline', '')
    media.setAttribute('aria-hidden', 'true')
    media.style.display = 'none'
    media.volume = this.volume
    media.onplay = () => { this.playing = true }
    media.onpause = () => { this.playing = false }
    media.onended = () => {
      this.offset = this.source?.duration ?? media.duration
      this.playing = false
    }
    document.body.append(media)
    this.mediaElement = media
  }

  async play() {
    if (this.playing) return true
    if (!this.source) return false
    if (this.mediaElement) {
      if (this.offset >= this.source.duration) this.offset = 0
      if (this.offset > 0) {
        try {
          this.mediaElement.currentTime = this.offset
        } catch {
          // Metadata may not be ready on the first iOS tap. Playback can still start.
        }
      }
      try {
        this.mediaElement.volume = this.volume
        const started = this.mediaElement.play()
        await started
        this.playing = !this.mediaElement.paused
        return this.playing
      } catch {
        this.playing = false
        return false
      }
    }
    const context = this.getContext()
    if (!await this.unlock()) return false
    if (this.offset >= this.source.duration) this.offset = 0
    const node = context.createBufferSource()
    const gain = context.createGain()
    node.buffer = this.source.buffer
    gain.gain.value = this.volume
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
    this.stopPlayback(false)
  }

  seek(time: number) {
    const wasPlaying = this.playing
    this.stopPlayback(false)
    this.offset = Math.max(0, Math.min(time, this.source?.duration ?? 0))
    if (this.mediaElement) {
      try { this.mediaElement.currentTime = this.offset } catch { /* metadata may still be loading */ }
    }
    if (wasPlaying) void this.play()
  }

  restart() {
    this.seek(0)
  }

  setVolume(value: number) {
    this.volume = value
    if (this.gainNode) this.gainNode.gain.value = value
    if (this.mediaElement) this.mediaElement.volume = value
  }

  get currentTime() {
    if (!this.source) return 0
    if (this.mediaElement) {
      const time = Number.isFinite(this.mediaElement.currentTime) ? this.mediaElement.currentTime : this.offset
      return Math.min(this.source.duration, Math.max(0, time))
    }
    if (!this.playing || !this.context) return this.offset
    return Math.min(this.source.duration, Math.max(0, this.context.currentTime - this.startedAt))
  }

  get isPlaying() {
    return this.playing
  }

  get audioState() {
    if (this.mediaElement) return this.mediaElement.paused ? 'suspended' : 'running'
    return this.context?.state ?? 'uninitialized'
  }

  private stopPlayback(clear = true) {
    if (this.mediaElement) this.mediaElement.pause()
    if (this.sourceNode) {
      this.sourceNode.onended = null
      try { this.sourceNode.stop() } catch { /* already stopped */ }
      this.sourceNode.disconnect()
    }
    this.sourceNode = null
    this.playing = false
    if (clear) {
      this.offset = 0
      if (this.mediaElement) {
        try { this.mediaElement.currentTime = 0 } catch { /* metadata may still be loading */ }
      }
    }
  }

  private releaseMedia() {
    if (this.mediaElement) {
      this.mediaElement.onplay = null
      this.mediaElement.onpause = null
      this.mediaElement.onended = null
      this.mediaElement.removeAttribute('src')
      this.mediaElement.load()
      this.mediaElement.remove()
    }
    if (this.mediaUrl) URL.revokeObjectURL(this.mediaUrl)
    this.mediaElement = null
    this.mediaUrl = null
  }

  dispose() {
    this.stopPlayback()
    this.releaseMedia()
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
