import { useEffect, useMemo, useState, type FormEvent } from 'react'
import AncestryMap from './AncestryMap'
import { fatherEntry } from './demoData'
import {
  countByConfidence,
  maxLineageDepth,
  primaryNodeAtDepth,
  story,
  type EtymologyEntry,
  type EtymologyNode,
} from './model'
import { fetchEtymology } from './wiktionary'

type AppState = 'landing' | 'guided' | 'lab'

function Brand() {
  return <span className="brand"><i />BEFORE WORDS <b>015</b></span>
}

function cleanRelation(value: string) {
  return value.replace(/\[\[.*?\|(.*?)\]\]/g, '$1').replace(/\[\[|\]\]/g, '')
}

function EvidencePanel({ close }: { close: () => void }) {
  return (
    <div className="scrim" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <aside className="evidence-panel" role="dialog" aria-modal="true" aria-labelledby="evidence-title">
        <button className="close-button" aria-label="Close evidence panel" onClick={close}>×</button>
        <p className="eyebrow">EVIDENCE & LIMITS</p>
        <h2 id="evidence-title">A history of use.<br />Not a hidden essence.</h2>
        <p>
          The map reads the English Wiktionary entry requested in your browser. Structured lineage
          data is shown when available; conservative text extraction is used otherwise.
        </p>
        <dl>
          <div><dt>Solid</dt><dd>A written form or borrowing described by the source.</dd></div>
          <div><dt>Asterisk</dt><dd>A form reconstructed by historical linguists from related evidence.</dd></div>
          <div><dt>Question</dt><dd>An origin or relationship explicitly marked uncertain.</dd></div>
          <div><dt>Distance</dt><dd>Leftward position preserves ancestry order. It is not a calendar scale.</dd></div>
          <div><dt>Meaning</dt><dd>Current definitions do not reveal a word’s original or “true” meaning. Meanings change.</dd></div>
          <div><dt>Names</dt><dd>Names may have several independent origins. A missing path is reported, never invented.</dd></div>
        </dl>
        <h3>Sources & privacy</h3>
        <p>
          Search terms are sent directly to Wikimedia to retrieve the public dictionary entry.
          This site has no backend, account, analytics, cookies, or stored search history.
        </p>
        <a href="https://en.wiktionary.org/wiki/Wiktionary:Copyrights" target="_blank" rel="noreferrer">Wiktionary · CC BY-SA / GFDL ↗</a>
        <a href="https://aclanthology.org/2022.lrec-1.140/" target="_blank" rel="noreferrer">Wiktextract · machine-readable structure ↗</a>
        <button className="primary-button" onClick={close}>Return to the trace</button>
      </aside>
    </div>
  )
}

function SearchBox({
  entry,
  loading,
  error,
  onSearch,
}: {
  entry: EtymologyEntry
  loading: boolean
  error?: string
  onSearch: (word: string) => void
}) {
  const [value, setValue] = useState(entry.word)
  useEffect(() => setValue(entry.word), [entry.word])
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(value)
  }
  return (
    <form className="search-box" onSubmit={submit}>
      <label htmlFor="word">TRACE A WORD OR NAME</label>
      <div>
        <input
          id="word"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="window, robot, John…"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          aria-describedby={error ? 'word-error' : undefined}
        />
        <button type="submit" disabled={loading}>{loading ? 'READING…' : 'TRACE →'}</button>
      </div>
      {error && <span id="word-error" className="search-error" role="alert">{error}</span>}
    </form>
  )
}

function LineageChooser({
  entry,
  value,
  onChange,
}: {
  entry: EtymologyEntry
  value: number
  onChange: (index: number) => void
}) {
  if (entry.lineages.length < 2) return null
  return (
    <div className="lineage-chooser">
      <span>{entry.word} has {entry.lineages.length} possible mapped origins</span>
      {entry.lineages.map((lineage, index) => (
        <button key={lineage.id} className={index === value ? 'active' : ''} onClick={() => onChange(index)}>
          {index + 1}
        </button>
      ))}
    </div>
  )
}

function Laboratory({ onInfo }: { onInfo: () => void }) {
  const [entry, setEntry] = useState<EtymologyEntry>(fatherEntry)
  const [lineage, setLineage] = useState(0)
  const [traceDepth, setTraceDepth] = useState(0)
  const [selected, setSelected] = useState<EtymologyNode>(fatherEntry.lineages[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const root = entry.lineages[lineage] ?? entry.lineages[0]
  const oldestDepth = maxLineageDepth(root)
  const counts = useMemo(() => countByConfidence(root), [root])

  useEffect(() => {
    setSelected(primaryNodeAtDepth(root, traceDepth))
  }, [root, traceDepth])

  const search = async (word: string) => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await fetchEtymology(word)
      setEntry(result)
      setLineage(0)
      setTraceDepth(0)
      setSelected(result.lineages[0])
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'That path could not be read.')
    } finally {
      setLoading(false)
    }
  }

  const changeLineage = (index: number) => {
    setLineage(index)
    setTraceDepth(0)
    setSelected(entry.lineages[index])
  }

  return (
    <section className="laboratory">
      <div className="lab-searches">
        <SearchBox entry={entry} loading={loading} error={error} onSearch={search} />
      </div>
      <div className="preset-row" aria-label="Example words">
        <span>TRY</span>
        {['window', 'robot', 'John', 'salary'].map((word) => (
          <button key={word} onClick={() => void search(word)}>{word}</button>
        ))}
      </div>
      <AncestryMap
        entry={entry}
        lineage={lineage}
        revealDepth={traceDepth}
        activeDepth={traceDepth}
        selectedId={selected.id}
        onSelect={setSelected}
      />
      <LineageChooser entry={entry} value={lineage} onChange={changeLineage} />
      <section className="time-control" aria-label="Travel through the word's ancestry">
        <div className="time-labels"><span>OLDEST MAPPED</span><span>NOW</span></div>
        <input
          aria-label="Travel backward through the word"
          type="range"
          min="0"
          max={oldestDepth}
          value={traceDepth}
          dir="rtl"
          onChange={(event) => setTraceDepth(Number(event.target.value))}
        />
        <div className="time-actions">
          <button disabled={traceDepth === oldestDepth} onClick={() => setTraceDepth((depth) => Math.min(oldestDepth, depth + 1))}>← ONE STEP OLDER</button>
          <span>{traceDepth === oldestDepth ? 'EVIDENCE ENDS HERE' : `${traceDepth} OF ${oldestDepth} STEPS BACK`}</span>
          <button disabled={traceDepth === 0} onClick={() => setTraceDepth((depth) => Math.max(0, depth - 1))}>TOWARD NOW →</button>
        </div>
      </section>
      <aside className="word-readout" aria-live="polite">
        <p className="eyebrow">{selected.confidence.toUpperCase()} FORM</p>
        <h2>{selected.term}</h2>
        <p className="readout-language">{selected.language}</p>
        {selected.relation && <span>{cleanRelation(selected.relation)}</span>}
        <div className="evidence-counts">
          <span><b>{counts.documented}</b> documented</span>
          <span><b>{counts.reconstructed}</b> reconstructed</span>
          {counts.uncertain > 0 && <span><b>{counts.uncertain}</b> uncertain</span>}
        </div>
      </aside>
      <aside className="meaning-readout">
        <p><strong>{entry.word}</strong> · {entry.definition}</p>
        <p>{entry.etymologyText}</p>
        {entry.notice && <small>{entry.notice}</small>}
        <a href={entry.sourceUrl} target="_blank" rel="noreferrer">SOURCE · WIKTIONARY REVISION {entry.revision ?? 'CURRENT'} ↗</a>
      </aside>
      <button className="floating-info" onClick={onInfo}>Evidence & limits ?</button>
    </section>
  )
}

export default function App() {
  const [state, setState] = useState<AppState>('landing')
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState(false)
  const moment = story[step]

  const next = () => {
    if (step === story.length - 1) setState('lab')
    else setStep((value) => value + 1)
  }
  const previous = () => setStep((value) => Math.max(0, value - 1))

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (state !== 'guided') return
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') previous()
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  })

  useEffect(() => {
    if (state !== 'landing') window.scrollTo(0, 0)
  }, [state, step])

  if (state === 'landing') {
    return (
      <main className="landing">
        <header><Brand /><a href="../../ai/">ALL EXPERIMENTS ↗</a></header>
        <div className="landing-map" aria-hidden="true">
          <AncestryMap entry={fatherEntry} revealDepth={6} compact />
        </div>
        <section className="hero-copy">
          <p className="eyebrow">AN ARCHAEOLOGY OF LANGUAGE</p>
          <h1>Every word<br /><em>remembers.</em></h1>
          <p>Choose one word or name. Travel backward through older voices until the evidence can take us no farther.</p>
          <button className="primary-button" onClick={() => setState('guided')}>Begin with one word →</button>
          <button className="quiet-button" onClick={() => setState('lab')}>Trace a word now</button>
          <small>Live English Wiktionary evidence · uncertainties remain visible</small>
        </section>
      </main>
    )
  }

  return (
    <main className={`experience ${state}`}>
      <header className="topbar">
        <Brand />
        <div>
          {state === 'guided' && <button onClick={() => setState('lab')}>SKIP TO TRACE →</button>}
          <button onClick={() => setInfo(true)}>EVIDENCE & LIMITS ?</button>
        </div>
      </header>
      {state === 'guided' ? (
        <section className={`guided-stage lens-${moment.lens}`}>
          <AncestryMap
            entry={fatherEntry}
            revealDepth={moment.depth}
            activeDepth={moment.depth}
            lens={moment.lens}
          />
          <article className="story-card" key={step}>
            <span>{String(step + 1).padStart(2, '0')} / {String(story.length).padStart(2, '0')}</span>
            <h2>{moment.title}</h2>
            <p>{moment.body}</p>
            <small>{moment.note}</small>
            <button onClick={next}>{step === story.length - 1 ? 'Trace your own word' : 'Continue'} →</button>
          </article>
          <nav className="guided-pager" aria-label="Guided journey">
            <button aria-label="Previous moment" disabled={step === 0} onClick={previous}>←</button>
            <span>CLICK OR USE ← →</span>
            <button aria-label="Next moment" onClick={next}>→</button>
          </nav>
        </section>
      ) : <Laboratory onInfo={() => setInfo(true)} />}
      {info && <EvidencePanel close={() => setInfo(false)} />}
    </main>
  )
}
