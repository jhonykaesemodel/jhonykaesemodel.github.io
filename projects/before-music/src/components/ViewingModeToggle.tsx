import { Moon, Sun } from 'lucide-react'
import type { ViewingMode } from '../types'

interface Props {
  mode: ViewingMode
  onChange: (mode: ViewingMode) => void
}

export default function ViewingModeToggle({ mode, onChange }: Props) {
  const next = mode === 'night' ? 'daylight' : 'night'
  return (
    <button
      className="viewing-toggle"
      type="button"
      aria-label={`Switch to ${next} viewing mode`}
      aria-pressed={mode === 'daylight'}
      onClick={() => onChange(next)}
    >
      {mode === 'daylight' ? <Sun size={14} /> : <Moon size={14} />}
      <span>{mode === 'daylight' ? 'Daylight' : 'Night'}</span>
    </button>
  )
}
