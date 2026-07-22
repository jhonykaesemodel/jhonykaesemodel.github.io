import{useEffect,useState}from'react'
import{gamma,lightPathFactor,movingClockRate,properTime,reunionDifference,story}from'./model'

type Perspective='ship'|'earth'
function Brand(){return <span className="brand"><i/>A CLOCK THAT DISAGREES <b>012</b></span>}

function ClockDiagram({beta,perspective,compare=true}:{beta:number;perspective:Perspective;compare?:boolean}){
 const g=gamma(beta),rate=movingClockRate(beta),dx=Math.min(48,beta*g*19),shipStart=compare?62:38,shipEnd=shipStart+dx
 const shipPath=perspective==='ship'?`M60 62 L60 18 L60 62`:`M${shipStart} 62 L${shipStart+dx/2} 18 L${shipEnd} 62`
 return <figure className={`instrument ${perspective}`}>
  <svg viewBox="0 0 120 80" role="img" aria-label={perspective==='ship'?`Inside the ship, its light follows a vertical path and the clock feels normal`:`From Earth at ${beta.toFixed(2)} c, the ship light follows a path ${g.toFixed(3)} times longer`}>
   <defs><linearGradient id="beam" x1="0" x2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#9ed7ff"/></linearGradient></defs>
   <g className="space-lines">{[12,28,44,60].map(y=><line key={y} x1="4" y1={y} x2="116" y2={y}/>)}</g>
   {compare&&<g className="home-clock"><text x="18" y="11">EARTH CLOCK</text><line x1="25" y1="18" x2="25" y2="62" className="beam"/><line x1="18" y1="18" x2="32" y2="18"/><line x1="18" y1="62" x2="32" y2="62"/><text x="18" y="71">PATH 1.000 ×</text></g>}
   <g className="ship-clock">
    {perspective==='earth'&&<><path d={`M${shipStart} 62 L${shipEnd} 62`} className="motion"/><text x={shipStart} y="76">SHIP MOVES →</text></>}
    <line x1={perspective==='ship'?53:shipStart-7} y1="18" x2={perspective==='ship'?67:shipStart+7} y2="18"/>
    <line x1={perspective==='ship'?53:shipEnd-7} y1="62" x2={perspective==='ship'?67:shipEnd+7} y2="62"/>
    <path d={shipPath} className="beam glow"/>
    <circle cx={perspective==='ship'?60:shipStart+dx/2} cy="18" r="1.4"/>
    <text x={perspective==='ship'?49:shipStart} y="11">SHIP CLOCK</text>
    <text x={perspective==='ship'?45:shipStart} y="71">PATH {lightPathFactor(beta).toFixed(3)} ×</text>
   </g>
   <g className="view-label"><text x="5" y="78">{perspective==='ship'?'RIDING WITH THE SHIP':'WATCHING FROM EARTH'}</text><text x="90" y="78">LIGHT = c</text></g>
  </svg>
  <figcaption>{perspective==='ship'?<><b>Beside this clock</b><span>The light path is vertical. Nothing feels slowed.</span></>:<><b>From Earth</b><span>The ship’s light path is {g.toFixed(3)}× longer, so its tick rate is {(rate*100).toFixed(1)}%.</span></>}</figcaption>
 </figure>
}

function Reunion({earth,ship}:{earth:number;ship:number}){const ratio=ship/earth;return <div className="reunion" aria-label={`At reunion Earth clock reads ${earth.toFixed(1)} years and ship clock reads ${ship.toFixed(2)} years`}><p><span>EARTH CLOCK</span><b>{earth.toFixed(1)} years</b></p><i><u style={{width:'100%'}}/></i><p><span>SHIP CLOCK</span><b>{ship.toFixed(2)} years</b></p><i><u className="ship" style={{width:`${ratio*100}%`}}/></i><small>Same departure · same reunion · different elapsed time</small></div>}

function Info({close}:{close:()=>void}){return <div className="scrim"><aside className="info"><button className="close" aria-label="Close" onClick={close}>×</button><p className="eyebrow">MODEL & LIMITS</p><h2>One consequence of special relativity.</h2><p>The exhibit isolates motion-based time dilation. It uses a light clock because the geometry makes the constraint visible; every ideal clock and physical process follows the same elapsed proper time.</p><dl><div><dt>Calculated</dt><dd>The Lorentz factor, moving-clock rate, light-path factor, and elapsed time along idealized constant-speed legs.</dd></div><div><dt>Drawn</dt><dd>Distances, clock sizes, light pulses, and near-light speeds are compressed and amplified for visibility.</dd></div><div><dt>Journey</dt><dd>The reunion result assumes equal outbound and inbound speeds with an instantaneous turnaround. The acceleration details are omitted.</dd></div><div><dt>Not shown</dt><dd>Gravity is absent. Gravitational time dilation belongs to general relativity and also matters for GPS.</dd></div></dl><h3>Scientific starting points</h3><a href="https://www.einstein-online.info/en/spotlight/light-clocks-time-dilation/" target="_blank">Einstein Online — light clocks and time dilation ↗</a><a href="https://www.einstein-online.info/en/spotlight/Twins/" target="_blank">Einstein Online — the traveling twins ↗</a><a href="https://www.nist.gov/atomic-clocks/a-powerful-tool-for-science/putting-einstein-test" target="_blank">NIST — experimental clock tests ↗</a><button className="primary" onClick={close}>Return to the clocks</button></aside></div>}

function Lab(){
 const[beta,setBeta]=useState(.8),[earthYears,setYears]=useState(10),[perspective,setPerspective]=useState<Perspective>('earth')
 const g=gamma(beta),traveler=properTime(earthYears,beta),difference=reunionDifference(earthYears,beta)
 return <><ClockDiagram beta={beta} perspective={perspective} compare={perspective==='earth'}/><section className="panel"><p className="eyebrow">CHANGE THE VIEWPOINT</p><h2>{perspective==='ship'?'Here, the ship clock is normal.':beta<.2?'The paths are nearly equal.':beta<.75?'The diagonal begins to matter.':'One journey, less elapsed time.'}</h2><div className="view-switch" aria-label="Observer viewpoint"><button className={perspective==='ship'?'active':''} onClick={()=>setPerspective('ship')}>Ride with ship</button><button className={perspective==='earth'?'active':''} onClick={()=>setPerspective('earth')}>Watch from Earth</button></div><label>Ship speed <input aria-label="Ship speed" type="range" min="0" max=".99" step=".01" value={beta} onChange={e=>setBeta(+e.target.value)}/><output>{beta.toFixed(2)} c</output></label><label>Earth journey <input aria-label="Earth journey duration" type="range" min="1" max="50" step="1" value={earthYears} onChange={e=>setYears(+e.target.value)}/><output>{earthYears} y</output></label><div className="presets"><button onClick={()=>setBeta(.1)}>.10 c</button><button onClick={()=>setBeta(.8)}>.80 c</button><button onClick={()=>setBeta(.99)}>.99 c</button></div><p className="equation">At {beta.toFixed(2)} c: moving tick = <b>{g.toFixed(3)}×</b> Earth time</p></section><Reunion earth={earthYears} ship={traveler}/><div className="difference">AGE DIFFERENCE AT REUNION <b>{difference.toFixed(2)} years</b></div></>
}

export default function App(){
 const[state,setState]=useState<'landing'|'guided'|'lab'>(()=>location.hash==='#lab'?'lab':'landing'),[step,setStep]=useState(0),[info,setInfo]=useState(false)
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if(state==='guided'&&e.key==='ArrowRight')step===story.length-1?setState('lab'):setStep(v=>v+1);if(state==='guided'&&e.key==='ArrowLeft')setStep(v=>Math.max(0,v-1));if(e.key==='Escape')setInfo(false)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[state,step])
 if(state==='landing')return <main className="landing"><header><Brand/></header><div className="hero-art"><ClockDiagram beta={.8} perspective="earth"/></div><section className="hero"><p className="eyebrow">A FIRST ENCOUNTER WITH RELATIVITY</p><h1>Why can two clocks<br/>measure different <em>amounts of time?</em></h1><p>Follow one pulse of light. Change where you watch from. Reunite the clocks and compare.</p><button className="primary" onClick={()=>setState('guided')}>Begin together →</button><button className="quiet" onClick={()=>setState('lab')}>Open the experiment</button><small>Six moments · reader-paced · no physics assumed</small></section></main>
 const item=story[step]
 return <main className={`experience ${state}`}><header className="top"><Brand/><button onClick={()=>state==='guided'?setState('lab'):setInfo(true)}>{state==='guided'?'Skip to experiment →':'Model & limits ?'}</button></header>{state==='guided'?<><ClockDiagram beta={item.beta} perspective={item.perspective} compare={item.compare}/><section className="story" key={step}><span>{String(step+1).padStart(2,'0')} / {String(story.length).padStart(2,'0')}</span><h2>{item.title}</h2><p>{item.body}</p><small>{item.note}</small><button onClick={()=>step===story.length-1?setState('lab'):setStep(v=>v+1)}>{step===story.length-1?'Try it yourself':'Continue'} →</button></section><nav className="pager"><button aria-label="Previous" disabled={!step} onClick={()=>setStep(v=>v-1)}>←</button><i>{step+1}/{story.length}</i><button aria-label="Next" onClick={()=>step===story.length-1?setState('lab'):setStep(v=>v+1)}>→</button></nav></>:<Lab/>}{info&&<Info close={()=>setInfo(false)}/>}</main>
}
