import {CSSProperties, useEffect, useMemo, useRef, useState} from 'react'
import {
  evidence, Evidence, FAMILY_YEARS, formatYears, historyPercent, nearestEvidence, positionToYears,
  previousStep, Scope, scopeYears, SPECIES_YEARS, story, visibleEvidence, WRITING_YEARS, yearsAsDayMinutes,
  yearsToPosition
} from './model'

type AppState = 'landing' | 'guided' | 'lab'

function Brand() {
  return <a className="brand" href="../" aria-label="Back to AI experiments"><i/>THE UNWRITTEN <b>016</b></a>
}

function Header({state, onLab, onInfo}: {state: AppState, onLab: () => void, onInfo: () => void}) {
  return <header className="topbar">
    <Brand/>
    <nav aria-label="Experience controls">
      {state === 'guided' && <button onClick={onLab}>Skip story</button>}
      {state === 'lab' && <button className="active" aria-current="page">Explore</button>}
      <button onClick={onInfo}>Evidence &amp; limits</button>
    </nav>
  </header>
}

function EvidenceImage({item, compact = false}: {item?: Evidence, compact?: boolean}) {
  if (!item?.image) return <div className={`absence-visual ${item?.id === 'fire' ? 'fire' : ''}`} aria-hidden="true">
    {Array.from({length: 34}, (_, i) => <i key={i} style={{'--i': i, opacity: .15 + (i % 5) * .08} as CSSProperties}/>) }
    <span>{item?.id === 'fire' ? 'ash remembers heat' : 'no sound survives'}</span>
  </div>
  return <figure className={compact ? 'evidence-image compact' : 'evidence-image'}>
    <img src={item.image} alt={item.imageAlt}/>
    <figcaption>
      {item.imageNote} ·
      Photo: <a href={item.imageUrl} target="_blank" rel="noreferrer">{item.imageCredit}</a> · {item.license}
    </figcaption>
  </figure>
}

function TimeField({years, scope, activeId, mode, interactive = false, onSelect}: {
  years: number, scope: Scope, activeId?: string, mode?: string, interactive?: boolean,
  onSelect?: (item: Evidence) => void
}) {
  const points = visibleEvidence(scope)
  const position = yearsToPosition(years, scope)
  const generations = Math.round(scopeYears(scope) / 25)
  const marks = useMemo(() => Array.from({length: 72}, (_, i) => ({
    x: (i * 47 % 101), y: (i * 71 % 97), delay: (i % 9) * -.7, size: 1 + (i % 3) * .7
  })), [])

  return <div className={`time-field mode-${mode || 'lab'}`} aria-label={`Timeline focused on ${formatYears(years)}`}>
    <div className="dust" aria-hidden="true">{marks.map((mark, i) => <i key={i} style={{
      left: `${mark.x}%`, top: `${mark.y}%`, animationDelay: `${mark.delay}s`, width: mark.size, height: mark.size
    }}/>)}</div>
    <div className="scale-caption oldest">
      <span>{scope === 'species' ? 'EARLY HOMO SAPIENS' : 'EARLY STONE TOOLS'}</span>
      <b>{formatYears(scopeYears(scope)).replace(' ago', '')}</b>
    </div>
    <div className="scale-caption now"><span>YOU ARE HERE</span><b>now</b></div>
    <div className="timeline-rule" aria-hidden="true">
      <div className="lived-time" style={{width: `${position * 100}%`}}/>
      <div className="writing-sliver" style={{width: `${historyPercent(WRITING_YEARS, scopeYears(scope))}%`}}/>
      <div className={`cursor ${position > .78 ? 'right' : ''}`} style={{left: `${position * 100}%`}}><i/><span>{formatYears(years)}</span></div>
      {points.map(item => <button
        key={item.id}
        className={`time-point kind-${item.kind} ${activeId === item.id ? 'selected' : ''}`}
        style={{left: `${yearsToPosition(item.yearsAgo, scope) * 100}%`}}
        onClick={() => onSelect?.(item)}
        aria-label={`${item.title}, ${item.dateLabel}`}
        tabIndex={interactive ? 0 : -1}
      ><i/><span>{item.id === 'sapiens' ? 'H. sapiens' : item.id}</span></button>)}
    </div>
    <div className="scale-footer">
      <span>{generations.toLocaleString()} generations at 25 years each</span>
      <span>linear scale · dates are estimates</span>
    </div>
  </div>
}

function Landing({onBegin, onLab, onInfo}: {onBegin: () => void, onLab: () => void, onInfo: () => void}) {
  return <main className="landing">
    <Header state="landing" onLab={onLab} onInfo={onInfo}/>
    <div className="landing-lines" aria-hidden="true">
      {Array.from({length: 21}, (_, i) => <i key={i} style={{left: `${4 + i * 4.7}%`, animationDelay: `${-i * .23}s`}}/>)}
      <span className="recorded"><b>5,200</b> years we can read</span>
      <span className="unrecorded"><b>309,800</b> years without surviving words</span>
    </div>
    <section className="landing-copy">
      <p className="eyebrow">A DEEP-TIME EXPERIENCE</p>
      <h1>Almost every human story<br/><em>was never written.</em></h1>
      <p className="promise">Walk the lifetime of our species. Meet the fragments that survived—and feel the enormity of everything they cannot tell us.</p>
      <div className="actions">
        <button className="primary" onClick={onBegin}>Begin at the lit edge <span>→</span></button>
        <button className="quiet" onClick={onLab}>Open the evidence atlas</button>
      </div>
    </section>
    <footer><span>≈ 7 minutes</span><span>Reader-paced · sound not required</span></footer>
  </main>
}

function Guided({step, setStep, onLab, onInfo}: {
  step: number, setStep: (step: number) => void, onLab: () => void, onInfo: () => void
}) {
  const scene = story[step]
  const item = evidence.find(entry => entry.id === scene.evidenceId)
  const advance = () => step === story.length - 1 ? onLab() : setStep(step + 1)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); advance() }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setStep(previousStep(step)) }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  return <main className={`guided scene-${scene.mode}`}>
    <Header state="guided" onLab={onLab} onInfo={onInfo}/>
    <section className="guided-stage" onClick={advance} aria-label="Continue the story">
      <TimeField years={scene.yearsAgo} scope={scene.scope} activeId={scene.evidenceId} mode={scene.mode}/>
      {(scene.mode === 'evidence' || scene.mode === 'threshold' || scene.mode === 'absence' || scene.mode === 'embers') &&
        <div className="guided-evidence"><EvidenceImage item={item}/></div>}
    </section>
    <section className="story-card" aria-live="polite">
      <div className="story-progress"><span>0{step + 1}</span><i/><span>0{story.length}</span></div>
      <p className="eyebrow">{scene.eyebrow}</p>
      <h2>{scene.title}</h2>
      <p className="story-body">{scene.body}</p>
      <p className="scene-note"><i/> {scene.note}</p>
      <div className="story-actions">
        <button className="back" onClick={() => setStep(previousStep(step))} disabled={step === 0} aria-label="Previous scene">←</button>
        <button className="continue" onClick={advance}>{step === story.length - 1 ? 'Take the timeline' : 'Continue'} <span>→</span></button>
      </div>
    </section>
    {step === 1 && <div className="day-scale"><span>IF 315,000 YEARS WERE ONE DAY</span><b>writing begins at 11:{Math.round(60 - yearsAsDayMinutes(WRITING_YEARS) % 60).toString().padStart(2, '0')} pm</b><small>one 80-year life lasts 22 seconds</small></div>}
  </main>
}

function EvidenceCard({item}: {item: Evidence}) {
  return <article className="evidence-card">
    <div className="evidence-heading">
      <div><p className="eyebrow">{item.kind} · {item.place}</p><h2>{item.title}</h2></div>
      <p className="date">{item.dateLabel}</p>
    </div>
    <div className="evidence-body">
      <EvidenceImage item={item} compact/>
      <div className="claim-stack">
        <div className="claim"><span>WHAT SURVIVES</span><p>{item.survives}</p></div>
        <div className="claim supports"><span>WHAT IT SUPPORTS</span><p>{item.claim}</p></div>
        <div className="claim missing"><span>WHAT IS LOST</span><p>{item.missing}</p></div>
        <a className="source-link" href={item.sourceUrl} target="_blank" rel="noreferrer">Read the evidence · {item.sourceLabel} ↗</a>
      </div>
    </div>
  </article>
}

function Lab({onInfo}: {onInfo: () => void}) {
  const [scope, setScope] = useState<Scope>('species')
  const [years, setYears] = useState(SPECIES_YEARS)
  const [selected, setSelected] = useState<Evidence>(() => nearestEvidence(SPECIES_YEARS, 'species'))
  const [walking, setWalking] = useState(false)
  const walkStarted = useRef(0)
  const frame = useRef(0)
  const position = yearsToPosition(years, scope)

  const chooseScope = (next: Scope) => {
    setScope(next)
    const nextYears = next === 'species' ? Math.min(years, SPECIES_YEARS) : years
    setYears(nextYears)
    setSelected(nearestEvidence(nextYears, next))
    setWalking(false)
  }
  const chooseYears = (nextYears: number) => {
    setYears(nextYears)
    setSelected(nearestEvidence(nextYears, scope))
  }
  const chooseEvidence = (item: Evidence) => { setYears(item.yearsAgo); setSelected(item); setWalking(false) }

  useEffect(() => {
    if (!walking) return
    walkStarted.current = performance.now()
    const startYears = years
    const duration = 18_000 * (startYears / scopeYears(scope))
    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - walkStarted.current) / duration)
      const nextYears = Math.round(startYears * (1 - progress))
      setYears(nextYears)
      setSelected(nearestEvidence(nextYears, scope))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
      else setWalking(false)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [walking, scope])

  return <main className="lab-page">
    <Header state="lab" onLab={() => undefined} onInfo={onInfo}/>
    <section className="lab-intro">
      <div><p className="eyebrow">THE EVIDENCE ATLAS</p><h1>Move through what remains.</h1></div>
      <p>Dates are not chapter headings. They are islands of surviving evidence in an ocean of lived time.</p>
    </section>
    <section className="instrument" aria-label="Interactive deep-time timeline">
      <TimeField years={years} scope={scope} activeId={selected.id} interactive onSelect={chooseEvidence}/>
      <div className="instrument-controls">
        <div className="scope-switch" role="group" aria-label="Timeline scale">
          <button className={scope === 'species' ? 'active' : ''} onClick={() => chooseScope('species')}><span>OUR SPECIES</span><b>315 thousand years</b></button>
          <button className={scope === 'family' ? 'active' : ''} onClick={() => chooseScope('family')}><span>HUMAN FAMILY</span><b>3.3 million years</b></button>
        </div>
        <div className="scrubber">
          <button className={`walk ${walking ? 'active' : ''}`} onClick={() => setWalking(value => !value)} aria-label={walking ? 'Pause walk through time' : 'Walk toward the present'}>{walking ? 'Ⅱ' : '▶'}</button>
          <label><span className="sr-only">Position in time</span><input type="range" min="0" max="10000" value={Math.round(position * 10000)} onChange={event => chooseYears(positionToYears(Number(event.target.value) / 10000, scope))}/></label>
          <output>{formatYears(years)}</output>
        </div>
        <div className="milestone-list" aria-label="Evidence stops">
          {visibleEvidence(scope).map(item => <button key={item.id} className={selected.id === item.id ? 'active' : ''} onClick={() => chooseEvidence(item)}><i className={`kind-${item.kind}`}/><span>{item.title}</span><small>{item.dateLabel}</small></button>)}
        </div>
      </div>
    </section>
    <EvidenceCard item={selected}/>
    <section className="scale-reckoning">
      <p className="eyebrow">A SCALE FOR THE BODY</p>
      <div><span><b>{historyPercent(WRITING_YEARS).toFixed(1)}%</b> of Homo sapiens time contains surviving writing</span><i/><span><b>{(SPECIES_YEARS / 80).toLocaleString(undefined, {maximumFractionDigits: 0})}</b> full lifetimes fit behind us</span><i/><span><b>22 seconds</b> is one 80-year life if our species lasts one day</span></div>
    </section>
    <footer className="lab-footer"><p>The map is not the past. It is the small part of the past that matter kept.</p><button onClick={onInfo}>How we know · sources &amp; limits →</button></footer>
  </main>
}

function InfoPanel({onClose}: {onClose: () => void}) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <aside className="info-panel" role="dialog" aria-modal="true" aria-labelledby="info-title">
      <button className="close" onClick={onClose} aria-label="Close evidence panel">×</button>
      <p className="eyebrow">EVIDENCE &amp; LIMITS</p>
      <h2 id="info-title">Not a single source of truth.<br/><em>A map back to the evidence.</em></h2>
      <p>Human origins is active science. Dates move, interpretations compete, and new finds can redraw the family tree. This exhibit keeps claims close to primary research and major research institutions, but it is not a replacement for them.</p>
      <h3>What the line simplifies</h3>
      <ul>
        <li><b>There was no first modern human on one birthday.</b> Species emerge across changing populations. 315,000 years is a reference point from Jebel Irhoud, with a ±34,000-year dating range.</li>
        <li><b>Artifacts are minimum ages, not invention dates.</b> The oldest object found is rarely the first one made.</li>
        <li><b>Language, stories, and music are radically under-preserved.</b> Instruments and indirect clues survive; performances do not.</li>
        <li><b>The timeline is linear.</b> Visual sizes are proportional within the selected scale. Location and color are interface choices.</li>
      </ul>
      <h3>Sources in the atlas</h3>
      <div className="source-list">{evidence.map(item => <a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer"><span>{item.title}</span><small>{item.sourceLabel} ↗</small></a>)}</div>
      <h3>Image record</h3>
      <p className="small">All evidence images are stored locally so the experience makes no background network requests. Links below open their original Wikimedia Commons records.</p>
      <div className="source-list images">{evidence.filter(item => item.image).map(item => <a key={item.id} href={item.imageUrl} target="_blank" rel="noreferrer"><span>{item.imageCredit}</span><small>{item.license} · {item.title} ↗</small></a>)}</div>
    </aside>
  </div>
}

export default function App() {
  const [state, setState] = useState<AppState>('landing')
  const [step, setStep] = useState(0)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    if (!infoOpen) return
    const key = (event: KeyboardEvent) => event.key === 'Escape' && setInfoOpen(false)
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [infoOpen])

  return <>
    {state === 'landing' && <Landing onBegin={() => {setStep(0); setState('guided')}} onLab={() => setState('lab')} onInfo={() => setInfoOpen(true)}/>}
    {state === 'guided' && <Guided step={step} setStep={setStep} onLab={() => setState('lab')} onInfo={() => setInfoOpen(true)}/>}
    {state === 'lab' && <Lab onInfo={() => setInfoOpen(true)}/>}
    {infoOpen && <InfoPanel onClose={() => setInfoOpen(false)}/>}
  </>
}
