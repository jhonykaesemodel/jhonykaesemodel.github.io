import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
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
import { fetchEtymology, mergeContinuation } from './wiktionary'

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
          The map reads language sections from English Wiktionary in your browser. That edition
          documents words and names from hundreds of languages. Structured lineage data is shown
          when available; conservative text extraction is used otherwise.
        </p>
        <dl>
          <div><dt>Solid</dt><dd>A written form or borrowing described by the source.</dd></div>
          <div><dt>Asterisk</dt><dd>A form reconstructed by historical linguists from related evidence.</dd></div>
          <div><dt>Question</dt><dd>An origin or relationship explicitly marked uncertain.</dd></div>
          <div><dt>Distance</dt><dd>Leftward position preserves ancestry order. It is not a calendar scale.</dd></div>
          <div><dt>Meaning</dt><dd>Current definitions do not reveal a word’s original or “true” meaning. Meanings change.</dd></div>
          <div><dt>Names</dt><dd>Personal spellings may have no dictionary record. Nearby documented spellings are suggestions, never assumed ancestry.</dd></div>
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
  word,
  loading,
  error,
  onSearch,
}: {
  word: string
  loading: boolean
  error?: string
  onSearch: (word: string) => void
}) {
  const [value, setValue] = useState(word)
  useEffect(() => setValue(word), [word])
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

function LanguageChooser({
  entries,
  entry,
  onChange,
}: {
  entries: EtymologyEntry[]
  entry: EtymologyEntry
  onChange: (entry: EtymologyEntry) => void
}) {
  return (
    <label className="language-chooser">
      <span>LANGUAGE</span>
      <select
        aria-label="Language for this word"
        value={entry.language}
        onChange={(event) => {
          const selectedEntry = entries.find((candidate) => candidate.language === event.target.value)
          if (selectedEntry) onChange(selectedEntry)
        }}
      >
        {entries.map((candidate) => (
          <option key={candidate.language} value={candidate.language}>{candidate.language}</option>
        ))}
      </select>
    </label>
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
  const [query, setQuery] = useState(fatherEntry.word)
  const [entries, setEntries] = useState<EtymologyEntry[]>([fatherEntry])
  const [entry, setEntry] = useState<EtymologyEntry | null>(fatherEntry)
  const [lineage, setLineage] = useState(0)
  const [traceDepth, setTraceDepth] = useState(0)
  const [selected, setSelected] = useState<EtymologyNode | null>(fatherEntry.lineages[0])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const request = useRef<AbortController | null>(null)

  const root = entry ? entry.lineages[lineage] ?? entry.lineages[0] : null
  const oldestDepth = root ? maxLineageDepth(root) : 0
  const counts = useMemo(
    () => root ? countByConfidence(root) : { documented: 0, reconstructed: 0, uncertain: 0 },
    [root],
  )

  useEffect(() => {
    if (root) setSelected(primaryNodeAtDepth(root, traceDepth))
  }, [root, traceDepth])

  useEffect(() => () => request.current?.abort(), [])

  const search = async (word: string) => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setQuery(word.trim())
    setEntries([])
    setEntry(null)
    setSelected(null)
    setLineage(0)
    setTraceDepth(0)
    setSuggestions([])
    setLoading(true)
    setError(undefined)
    try {
      const result = await fetchEtymology(word, controller.signal)
      if (controller.signal.aborted) return
      let resolvedEntries = result.entries
      const firstEntry = resolvedEntries[0]
      if (firstEntry?.continuationTerm) {
        try {
          const continuation = await fetchEtymology(firstEntry.continuationTerm, controller.signal)
          const matchingEntry = continuation.entries.find((candidate) => candidate.language === firstEntry.language)
          if (matchingEntry) {
            resolvedEntries = [mergeContinuation(firstEntry, matchingEntry), ...resolvedEntries.slice(1)]
          }
        } catch {
          if (controller.signal.aborted) return
        }
      }
      if (controller.signal.aborted) return
      setEntries(resolvedEntries)
      setSuggestions(result.suggestions)
      if (resolvedEntries.length > 0) {
        const first = resolvedEntries[0]
        setQuery(first.word)
        setEntry(first)
        setSelected(first.lineages[0])
      } else {
        setError(`No exact documented entry was found for “${result.requested}”.`)
      }
    } catch (reason) {
      if (controller.signal.aborted) return
      setError(reason instanceof Error ? reason.message : 'That path could not be read.')
    } finally {
      if (request.current === controller) setLoading(false)
    }
  }

  const changeLineage = (index: number) => {
    if (!entry) return
    setLineage(index)
    setTraceDepth(0)
    setSelected(entry.lineages[index])
  }

  const changeLanguage = (nextEntry: EtymologyEntry) => {
    setEntry(nextEntry)
    setLineage(0)
    setTraceDepth(0)
    setSelected(nextEntry.lineages[0])
  }

  return (
    <section className="laboratory">
      <div className="lab-searches">
        <SearchBox word={query} loading={loading} error={error} onSearch={search} />
      </div>
      <div className="preset-row" aria-label="Example words">
        <span>TRY</span>
        {['Thiago', 'amor', 'Liebe', '東京'].map((word) => (
          <button key={word} onClick={() => void search(word)}>{word}</button>
        ))}
      </div>
      {loading && (
        <div className="trace-status" role="status">
          <i />
          <p>Clearing the present.<br /><span>Reading every documented language for “{query}”…</span></p>
        </div>
      )}
      {!loading && !entry && (
        <div className="trace-status empty" role="status">
          <p>The archive has no exact trail for <strong>{query}</strong>.</p>
          {suggestions.length > 0 ? (
            <>
              <span>Nearby documented spellings—not assumed relatives:</span>
              <div className="suggestion-row">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} onClick={() => void search(suggestion)}>{suggestion} →</button>
                ))}
              </div>
            </>
          ) : <span>Try another spelling. This absence is a gap in the source, not proof that the name has no history.</span>}
        </div>
      )}
      {entry && root && selected && (
        <>
          <LanguageChooser entries={entries} entry={entry} onChange={changeLanguage} />
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
            <p><strong>{entry.word}</strong> · {entry.language} · {entry.definition}</p>
            <p>{entry.etymologyText}</p>
            {entry.notice && <small>{entry.notice}</small>}
            <a href={entry.sourceUrl} target="_blank" rel="noreferrer">SOURCE · WIKTIONARY REVISION {entry.revision ?? 'CURRENT'} ↗</a>
            {entry.continuationSourceUrl && (
              <a href={entry.continuationSourceUrl} target="_blank" rel="noreferrer">CONTINUED ANCESTRY SOURCE ↗</a>
            )}
          </aside>
        </>
      )}
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
          <p>Search a documented word or name across hundreds of languages. Travel backward until the evidence can take us no farther.</p>
          <button className="primary-button" onClick={() => setState('guided')}>Begin with one word →</button>
          <button className="quiet-button" onClick={() => setState('lab')}>Trace a word now</button>
          <small>Hundreds of languages through English Wiktionary · uncertainties remain visible</small>
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
