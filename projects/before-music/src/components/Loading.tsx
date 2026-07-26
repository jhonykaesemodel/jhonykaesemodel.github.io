import type { ViewingMode } from '../types'

export default function Loading({ label, viewingMode }: { label: string; viewingMode: ViewingMode }) {
  return <main className={`loading-screen ${viewingMode}`}><div className="loading-ring" /><p>{label}</p><span>Reading pressure, one sample at a time</span></main>
}
