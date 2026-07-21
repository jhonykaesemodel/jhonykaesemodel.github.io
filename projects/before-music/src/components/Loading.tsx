export default function Loading({ label }: { label: string }) {
  return <main className="loading-screen"><div className="loading-ring" /><p>{label}</p><span>Reading pressure, one sample at a time</span></main>
}
