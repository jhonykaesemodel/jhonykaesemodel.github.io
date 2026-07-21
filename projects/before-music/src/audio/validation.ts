const MAX_BYTES = 250 * 1024 * 1024
const extensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac']

export function validateAudioFile(file: Pick<File, 'name' | 'size' | 'type'>): string | null {
  if (file.size <= 0) return 'That file appears to be empty.'
  if (file.size > MAX_BYTES) return 'Choose an audio file smaller than 250 MB.'
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!file.type.startsWith('audio/') && !extensions.includes(extension)) {
    return 'Choose an MP3, WAV, OGG, M4A, AAC, or another browser-supported audio file.'
  }
  return null
}
