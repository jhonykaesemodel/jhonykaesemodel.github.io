import { useEffect, useMemo, useState, type FormEvent } from 'react'
import AncestryMap from './AncestryMap'
import { fatherEntry, paternalEntry } from './demoData'
import {
  countByConfidence,
  findCommonAncestor,
  story,
  type EtymologyEntry,
  type EtymologyNode,
} from './model'
import { fetchEtymology } from './wiktionary'

type AppState = 'landing' | 'guided' | 'lab'
type SearchSide = 'left' | 'right'

function Brand() {
  return <span className="brand"><i />BEFORE WORDS <b>015</b></span>
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
          <div><dt>Distance</dt><dd>Vertical position preserves ancestry order. It is not a calendar scale.</dd></div>
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
        <button className="primary-button" onClick={close}>Return to the map</button>
      </aside>
    </div>
  )
}

function SearchBox({
  side,
  entry,
  loading,
  error,
  onSearch,
  onRemove,
}: {
  side: SearchSide
  entry?: EtymologyEntry | null
  loading: boolean
  error?: string
  onSearch: (side: SearchSide, word: string) => void
  onRemove?: () => void
}) {
  const [value, setValue] = useState(entry?.word ?? '')
  useEffect(() => setValue(entry?.word ?? ''), [entry?.word])
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(side, value)
  }
  return (
    <form className={`search-box ${side}`} onSubmit={submit}>
      <label htmlFor={`word-${side}`}>{side === 'left' ? 'TRACE A WORD OR NAME' : 'COMPARE WITH'}</label>
      <div>
        <input
          id={`word-${side}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={side === 'left' ? 'window, robot, John…' : 'another word'}
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          aria-describedby={error ? `error-${side}` : undefined}
        />
        <button type="submit" disabled={loading}>{loading ? 'READING…' : 'TRACE →'}</button>
        {onRemove && <button className="remove-word" type="button" aria-label="Remove comparison word" onClick={onRemove}>×</button>}
      </div>
      {error && <span id={`error-${side}`} className="search-error" role="alert">{error}</span>}
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
      <span>{entry.word} has {entry.lineages.length} mapped origins</span>
      {entry.lineages.map((lineage, index) => (
        <button key={lineage.id} className={index === value ? 'active' : ''} onClick={() => onChange(index)}>
          {index + 1}
        </button>
      ))}
    </div>
  )
}

function Laboratory({ onInfo }: { onInfo: () => void }) {
  const [left, setLeft] = useState<EtymologyEntry>(fatherEntry)
  const [right, setRight] = useState<EtymologyEntry | null>(paternalEntry)
  const [leftLineage, setLeftLineage] = useState(0)
  const [rightLineage, setRightLineage] = useState(0)
  const [selected, setSelected] = useState<EtymologyNode>(fatherEntry.lineages[0])
  const [loading, setLoading] = useState<SearchSide | null>(null)
  const [errors, setErrors] = useState<Partial<Record<SearchSide, string>>>({})

  const leftRoot = left.lineages[leftLineage] ?? left.lineages[0]
  const rightRoot = right?.lineages[rightLineage] ?? right?.lineages[0]
  const common = findCommonAncestor(leftRoot, rightRoot)
  const counts = useMemo(() => countByConfidence(leftRoot), [leftRoot])

  const search = async (side: SearchSide, word: string) => {
    setLoading(side)
    setErrors((previous) => ({ ...previous, [side]: undefined }))
    try {
      const result = await fetchEtymology(word)
      if (side === 'left') {
        setLeft(result)
        setLeftLineage(0)
      } else {
        setRight(result)
        setRightLineage(0)
      }
      setSelected(result.lineages[0])
    } catch (reason) {
      setErrors((previous) => ({
        ...previous,
        [side]: reason instanceof Error ? reason.message : 'That path could not be read.',
      }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <section className="laboratory">
      <div className="lab-searches">
        <SearchBox side="left" entry={left} loading={loading === 'left'} error={errors.left} onSearch={search} />
        {right
          ? <SearchBox side="right" entry={right} loading={loading === 'right'} error={errors.right} onSearch={search} onRemove={() => setRight(null)} />
          : <button className="add-comparison" onClick={() => setRight(paternalEntry)}>+ COMPARE ANOTHER WORD</button>}
      </div>
      <div className="preset-row" aria-label="Example words">
        <span>TRY</span>
        {['window', 'robot', 'John', 'salary'].map((word) => (
          <button key={word} onClick={() => void search('left', word)}>{word}</button>
        ))}
      </div>
      <AncestryMap
        left={left}
        right={right}
        leftLineage={leftLineage}
        rightLineage={rightLineage}
        selectedId={selected.id}
        onSelect={setSelected}
      />
      <LineageChooser entry={left} value={leftLineage} onChange={(index) => {
        setLeftLineage(index)
        setSelected(left.lineages[index])
      }} />
      {right && <LineageChooser entry={right} value={rightLineage} onChange={(index) => {
        setRightLineage(index)
        setSelected(right.lineages[index])
      }} />}
      <aside className="word-readout" aria-live="polite">
        <p className="eyebrow">{selected.confidence.toUpperCase()} FORM</p>
        <h2>{selected.term}</h2>
        <p className="readout-language">{selected.language}</p>
        {selected.relation && <span>{selected.relation.replace(/\[\[.*?\|(.*?)\]\]/g, '$1').replace(/\[\[|\]\]/g, '')}</span>}
        <div className="evidence-counts">
          <span><b>{counts.documented}</b> documented</span>
          <span><b>{counts.reconstructed}</b> reconstructed</span>
          {counts.uncertain > 0 && <span><b>{counts.uncertain}</b> uncertain</span>}
        </div>
      </aside>
      <aside className="meaning-readout">
        <p><strong>{left.word}</strong> · {left.definition}</p>
        <p>{left.etymologyText}</p>
        {left.notice && <small>{left.notice}</small>}
        <a href={left.sourceUrl} target="_blank" rel="noreferrer">SOURCE · WIKTIONARY REVISION {left.revision ?? 'CURRENT'} ↗</a>
        {right && <a href={right.sourceUrl} target="_blank" rel="noreferrer">COMPARE SOURCE · {right.word.toUpperCase()} ↗</a>}
      </aside>
      <div className={`connection-readout ${common ? 'found' : ''}`}>
        {right
          ? common
            ? <><span>NEAREST SHARED FORM</span><strong>{common.left.node.term}</strong><small>{common.left.node.language}</small></>
            : <><span>NO SHARED FORM IN THESE MAPPED PATHS</span><small>Absence here is not proof of unrelated origin.</small></>
          : <><span>ONE PATH OPEN</span><small>Add a second word to search for shared ancestry.</small></>}
      </div>
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
          <AncestryMap left={fatherEntry} maxDepth={6} compact />
        </div>
        <section className="hero-copy">
          <p className="eyebrow">AN ARCHAEOLOGY OF LANGUAGE</p>
          <h1>Every word<br /><em>remembers.</em></h1>
          <p>Enter a word or name. Follow it through older voices, borrowed forms, and reconstructed ancestors.</p>
          <button className="primary-button" onClick={() => setState('guided')}>Begin with one word →</button>
          <button className="quiet-button" onClick={() => setState('lab')}>Open the ancestry map</button>
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
          {state === 'guided' && <button onClick={() => setState('lab')}>SKIP TO MAP →</button>}
          <button onClick={() => setInfo(true)}>EVIDENCE & LIMITS ?</button>
        </div>
      </header>
      {state === 'guided' ? (
        <section className={`guided-stage lens-${moment.lens}`}>
          <AncestryMap
            left={fatherEntry}
            right={moment.compare ? paternalEntry : null}
            maxDepth={moment.depth}
            lens={moment.lens}
          />
          <article className="story-card" key={step}>
            <span>{String(step + 1).padStart(2, '0')} / {String(story.length).padStart(2, '0')}</span>
            <h2>{moment.title}</h2>
            <p>{moment.body}</p>
            <small>{moment.note}</small>
            <button onClick={next}>{step === story.length - 1 ? 'Open the map' : 'Continue'} →</button>
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
