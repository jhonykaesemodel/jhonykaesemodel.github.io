import { useEffect, useState } from 'react'
import { modes, story, type Mode } from './model'

function Brand({ lab = false }: { lab?: boolean }) { return <span className="brand"><i />The Seeing Machine {lab && <em>LAB</em>}<b>03</b></span> }

function FoveaDemo() {
  const [focus, setFocus] = useState({ x: 50, y: 50 })
  const scene = <div className="scene-content"><span className="sun"/><span className="mountain one"/><span className="mountain two"/><span className="tree t1">♠</span><span className="tree t2">♠</span><span className="tree t3">♠</span><span className="bird">⌁</span><span className="house">⌂</span><span className="word w1">RIVER</span><span className="word w2">STONE</span><span className="word w3">LIGHT</span></div>
  return <div className="fovea demo" style={{ '--fx': `${focus.x}%`, '--fy': `${focus.y}%` } as React.CSSProperties} onPointerMove={(e) => { const r=e.currentTarget.getBoundingClientRect(); setFocus({x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100}) }}>
    <div className="peripheral">{scene}</div><div className="focused">{scene}</div><i className="focus-ring"/><p>MOVE YOUR FOCUS</p>
  </div>
}

function BlindSpotDemo() {
  const [spacing, setSpacing] = useState(31)
  const [pattern, setPattern] = useState(false)
  return <div className={`blindspot demo ${pattern ? 'pattern' : ''}`}>
    <div className="blind-field"><span className="fixation">+</span><span className="vanishing" style={{ left: `${50 + spacing}%` }} /></div>
    <div className="blind-instructions"><strong>CLOSE LEFT EYE</strong><span>Keep the + fixed in your right eye. Change your distance from the screen.</span><label>Calibration <input type="range" min="18" max="42" value={spacing} onChange={e=>setSpacing(+e.target.value)}/></label><button onClick={()=>setPattern(!pattern)}>{pattern?'Plain field':'Add continuous pattern'}</button></div>
  </div>
}

function ContextDemo() {
  const [removed, setRemoved] = useState(false)
  return <div className={`context demo ${removed?'removed':''}`}>
    <div className="contexts"><div className="surround dark"><i/></div><div className="surround light"><i/></div></div>
    <div className="context-readout"><span>TILE A <b>#82958D</b></span><span>TILE B <b>#82958D</b></span></div>
    <button onClick={()=>setRemoved(!removed)}>{removed?'Restore context':'Remove the surroundings'}</button>
  </div>
}

function ChangeDemo() {
  const [phase, setPhase] = useState(0)
  const [revealed, setRevealed] = useState(false)
  useEffect(()=>{ if(revealed)return; const timer=setInterval(()=>setPhase(v=>(v+1)%4),620); return()=>clearInterval(timer)},[revealed])
  const blank = phase===1 || phase===3
  const changed = phase>=2
  return <div className="change demo">
    <div className={`change-scene ${blank?'blank':''} ${changed?'changed':''} ${revealed?'revealed':''}`}><i className="moon"/><i className="ground"/><i className="building"><b/><b/><b/></i><i className="tower"/><i className="changed-window"/></div>
    <div className="change-copy"><strong>{revealed?'THE LEFT WINDOW CHANGED':'FIND THE CHANGE'}</strong><span>{revealed?'Attention had to land there before the difference became experience.':'The blank removes the motion signal that would normally give it away.'}</span><button onClick={()=>setRevealed(!revealed)}>{revealed?'Try again':'Reveal change'}</button></div>
  </div>
}

function Demo({ mode }: { mode: Mode }) { if(mode==='blind-spot')return <BlindSpotDemo/>; if(mode==='context')return <ContextDemo/>; if(mode==='change')return <ChangeDemo/>; return <FoveaDemo/> }

function Info({ close }: { close:()=>void }) { return <div className="scrim"><section className="info"><button className="close" onClick={close}>×</button><p className="eyebrow">MODEL & LIMITS</p><h2>Your experience is the instrument.</h2><p>These demonstrations reproduce robust perceptual effects, but they do not measure your retina, eye movements, visual acuity, or clinical vision. Screen size, viewing distance, lighting, and individual differences matter.</p><dl><div><dt>Blind spot</dt><dd>The optic disc contains no rods or cones. Binocular overlap and perceptual completion usually keep it outside awareness.</dd></div><div><dt>Fovea</dt><dd>The movable aperture is an explanatory exaggeration. Peripheral vision is not simply a Gaussian blur; sensitivity differs across detail, contrast, color, motion, and crowding.</dd></div><div><dt>Context</dt><dd>The tiles are digitally identical. The demonstration evokes simultaneous contrast, not the full machinery of color constancy.</dd></div><div><dt>Change</dt><dd>The flicker interruption illustrates change blindness. It is not a test of attention or ability.</dd></div></dl><h3>Research starting points</h3><a href="https://pubmed.ncbi.nlm.nih.gov/38968753/" target="_blank">Blind-spot filling-in research ↗</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4031196/" target="_blank">Visual stability across eye movements ↗</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC35483/" target="_blank">Color constancy research ↗</a><button className="primary" onClick={close}>Return to seeing</button></section></div> }

export default function App() {
  const [state,setState]=useState<'landing'|'guided'|'lab'>('landing')
  const [step,setStep]=useState(0)
  const [mode,setMode]=useState<Mode>('fovea')
  const [info,setInfo]=useState(false)
  useEffect(()=>{if(state==='guided')setMode(story[step].mode)},[state,step])
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(state==='guided'&&e.key==='ArrowRight'){if(step===story.length-1)setState('lab');else setStep(v=>v+1)}if(state==='guided'&&e.key==='ArrowLeft')setStep(v=>Math.max(0,v-1));if(e.key==='Escape')setInfo(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[state,step])
  if(state==='landing')return <main className="landing"><header><Brand/></header><div className="iris" aria-hidden="true"><i/><i/><i/><b/></div><section className="hero"><p className="eyebrow">AN EXPERIMENT PERFORMED INSIDE YOUR OWN VISION</p><h1>You do not see<br/>what reaches <em>your eyes.</em></h1><p>Find the holes, edits, guesses, and shortcuts inside an experience that feels complete.</p><button className="primary" onClick={()=>setState('guided')}>Begin looking <span>→</span></button><button className="secondary" onClick={()=>setState('lab')}>Open perception lab</button><small>Six moments · at your pace · no camera access</small></section><footer>Your visual system remains private. This experience uses no eye tracking.</footer></main>
  return <main className={`experience ${state}`}><Demo mode={mode}/><div className="grain"/>
    <header className="top"><Brand lab={state==='lab'}/><button onClick={()=>state==='guided'?setState('lab'):setInfo(true)}>{state==='guided'?'Skip to lab →':'Model & limits ?'}</button></header>
    {state==='guided'&&<><section className="story" key={step}><span>{String(step+1).padStart(2,'0')} / {String(story.length).padStart(2,'0')}</span><h2>{story[step].title}</h2><p>{story[step].body}</p><small>{story[step].note}</small><button onClick={()=>step===story.length-1?setState('lab'):setStep(v=>v+1)}>{step===story.length-1?'Enter the laboratory':'Continue'} →</button></section><nav className="story-nav"><button disabled={step===0} onClick={()=>setStep(v=>Math.max(0,v-1))}>←</button><i>{step+1}/{story.length}</i><button onClick={()=>step===story.length-1?setState('lab'):setStep(v=>v+1)}>→</button></nav></>}
    {state==='lab'&&<><nav className="modes">{modes.map((item,index)=><button key={item.id} className={mode===item.id?'active':''} onClick={()=>setMode(item.id)}><span>0{index+1}</span>{item.name}</button>)}</nav><section className="lab-question"><p className="eyebrow">LIVE PERCEPTION STUDY</p><h2>{modes.find(m=>m.id===mode)?.question}</h2></section></>}
    {info&&<Info close={()=>setInfo(false)}/>}
    {state==='guided'&&<div className="progress" style={{'--p':`${(step+1)/story.length*100}%`} as React.CSSProperties}/>}
  </main>
}
