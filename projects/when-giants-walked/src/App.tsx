import { useEffect, useMemo, useState } from "react";
import {
  aliveAt,
  creatures,
  gapBetween,
  overlapped,
  periodAt,
  story,
  type Creature,
} from "./model";
function Brand({ lab = false }: { lab?: boolean }) {
  return (
    <span className="brand">
      <i />
      WHEN GIANTS WALKED {lab && <em>LAB</em>}
      <b>07</b>
    </span>
  );
}
function Silhouette({ kind }: { kind: Creature["kind"] }) {
  return (
    <svg className={`dino ${kind}`} viewBox="0 0 260 120" aria-hidden="true">
      <path
        d={
          kind === "giant"
            ? "M20 73 Q70 55 112 66 Q142 66 164 38 L195 8 L205 12 L186 62 Q212 72 242 80 L220 88 L178 82 L168 112 L153 112 L154 80 L101 80 L88 111 L72 111 L75 77 L35 86 Z"
            : kind === "armored"
              ? "M18 78 Q52 42 116 52 L143 43 L178 61 L222 66 L246 76 L219 82 L183 77 L174 109 L158 109 L157 80 L91 79 L77 109 L61 109 L63 82 L30 89 Z"
              : kind === "bird"
                ? "M25 65 Q74 21 125 58 Q164 31 230 38 L178 67 L225 94 Q160 87 126 72 L94 110 L85 106 L100 69 L31 77 Z"
                : kind === "runner"
                  ? "M24 75 Q75 43 129 64 L171 44 L217 19 L225 25 L182 67 L239 78 L216 86 L167 76 L142 112 L128 108 L147 74 L92 76 L62 105 L48 103 L68 72 Z"
                  : "M20 78 Q76 40 129 62 L166 47 L214 24 L229 29 L189 65 L244 72 L222 83 L176 75 L161 108 L145 108 L149 75 L96 76 L73 109 L56 108 L75 72 Z"
        }
      />
      {kind === "armored" &&
        [46, 72, 98, 124].map((x) => (
          <path key={x} d={`M${x} 55 l10 -22 l9 23z`} />
        ))}
    </svg>
  );
}
function TimeWorld({ age }: { age: number }) {
  const period = periodAt(age),
    alive = aliveAt(age);
  return (
    <div className={`time-world ${period.toLowerCase()}`}>
      <div className="sky">
        <i className="sun" />
        <i className="cloud c1" />
        <i className="cloud c2" />
      </div>
      <div className="land">
        <i />
        <i />
      </div>
      <div className="forest">
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} />
        ))}
      </div>
      <div className="creatures">
        {alive.length ? (
          alive.slice(0, 3).map((c, i) => (
            <div className={`creature c${i}`} key={c.name}>
              <Silhouette kind={c.kind} />
              <span>{c.name}</span>
            </div>
          ))
        ) : (
          <p>
            {age < 66
              ? "The surviving world changes."
              : "No modeled species at this instant."}
          </p>
        )}
      </div>
      <div className="age">
        <b>
          {age < 0.01 ? "300,000" : Math.round(age)}{" "}
          {age < 0.01 ? "years" : "million years"} ago
        </b>
        <span>{period === "After" ? "CENOZOIC" : period.toUpperCase()}</span>
      </div>
    </div>
  );
}
function Timeline({
  age,
  setAge,
}: {
  age: number;
  setAge: (v: number) => void;
}) {
  return (
    <div className="timeline">
      <div className="periods">
        <i className="triassic" />
        <i className="jurassic" />
        <i className="cretaceous" />
        <i className="after" />
      </div>
      <input
        aria-label="Millions of years ago"
        type="range"
        min="0"
        max="252"
        step=".1"
        value={252 - age}
        onChange={(e) => setAge(252 - +e.target.value)}
      />
      <div className="ticks">
        <span>252 Ma</span>
        <span>201</span>
        <span>145</span>
        <span>66</span>
        <span>NOW</span>
      </div>
    </div>
  );
}
function Compare() {
  const [a, setA] = useState(creatures[2]),
    [b, setB] = useState(creatures[8]);
  const gap = gapBetween(a, b);
  return (
    <section className="compare">
      <p className="eyebrow">COULD THEY HAVE MET?</p>
      <div>
        <select
          aria-label="First dinosaur"
          value={a.name}
          onChange={(e) =>
            setA(creatures.find((c) => c.name === e.target.value)!)
          }
        >
          {creatures.map((c) => (
            <option>{c.name}</option>
          ))}
        </select>
        <i>×</i>
        <select
          aria-label="Second dinosaur"
          value={b.name}
          onChange={(e) =>
            setB(creatures.find((c) => c.name === e.target.value)!)
          }
        >
          {creatures.map((c) => (
            <option>{c.name}</option>
          ))}
        </select>
      </div>
      <h3>
        {overlapped(a, b)
          ? "Yes—their known ranges overlap."
          : `No—about ${Math.round(gap)} million years apart.`}
      </h3>
      <p>
        {a.place} · {a.from}–{a.to} Ma
        <br />
        {b.place} · {b.from}–{b.to} Ma
      </p>
    </section>
  );
}
function Info({ close }: { close: () => void }) {
  return (
    <div className="scrim">
      <section className="info">
        <button className="close" onClick={close} aria-label="Close">
          ×
        </button>
        <p className="eyebrow">MODEL & LIMITS</p>
        <h2>Deep time is evidence with gaps.</h2>
        <p>
          The period boundaries and broad events are grounded in geology.
          Species ranges are rounded approximations from fossil evidence, which
          is incomplete and continuously revised.
        </p>
        <dl>
          <div>
            <dt>Scenes</dt>
            <dd>
              Atmosphere, plants, colors, behavior, and groupings are stylized.
              Species shown at one time did not necessarily share one habitat.
            </dd>
          </div>
          <div>
            <dt>Ranges</dt>
            <dd>
              A fossil’s oldest and youngest known occurrences do not prove the
              exact origin or extinction dates of a species.
            </dd>
          </div>
          <div>
            <dt>Names</dt>
            <dd>
              “Dinosaur” excludes pterosaurs and marine reptiles. Birds are the
              surviving avian dinosaur lineage.
            </dd>
          </div>
          <div>
            <dt>Impact</dt>
            <dd>
              The end-Cretaceous extinction was global and selective; this app
              compresses its causes and aftermath into one boundary.
            </dd>
          </div>
        </dl>
        <h3>Scientific starting points</h3>
        <a
          href="https://www.usgs.gov/youth-and-education-in-science/mesozoic"
          target="_blank"
        >
          USGS: the Mesozoic ↗
        </a>
        <a
          href="https://www.usgs.gov/faqs/did-all-dinosaurs-live-together-and-same-time?page=1"
          target="_blank"
        >
          USGS: did dinosaurs live together? ↗
        </a>
        <a
          href="https://naturalhistory.si.edu/education/teaching-resources/paleontology/extinction-over-time"
          target="_blank"
        >
          Smithsonian: extinction over time ↗
        </a>
        <button className="primary" onClick={close}>
          Return to deep time
        </button>
      </section>
    </div>
  );
}
function Lab() {
  const [age, setAge] = useState(152);
  return (
    <>
      <TimeWorld age={age} />
      <Timeline age={age} setAge={setAge} />
      <section className="lab-title">
        <p className="eyebrow">252 MILLION YEARS → NOW</p>
        <h2>Drag across a world that never held still.</h2>
      </section>
      <Compare />
    </>
  );
}
export default function App() {
  const [state, setState] = useState<"landing" | "guided" | "lab">(() =>
      location.hash === "#lab" ? "lab" : "landing",
    ),
    [step, setStep] = useState(0),
    [info, setInfo] = useState(false);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (state === "guided" && e.key === "ArrowRight") {
        step === 5 ? setState("lab") : setStep((v) => v + 1);
      }
      if (state === "guided" && e.key === "ArrowLeft")
        setStep((v) => Math.max(0, v - 1));
      if (e.key === "Escape") setInfo(false);
    };
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, [state, step]);
  if (state === "landing")
    return (
      <main className="landing">
        <header>
          <Brand />
        </header>
        <div className="hero-dino" aria-hidden="true">
          <Silhouette kind="giant" />
          <i />
          <i />
        </div>
        <section className="hero">
          <p className="eyebrow">A WALK THROUGH 186 MILLION YEARS</p>
          <h1>
            There was never
            <br />
            one age <em>of dinosaurs.</em>
          </h1>
          <p>
            Cross continents, extinctions, and impossible distances between
            creatures we imagine standing side by side.
          </p>
          <button className="primary" onClick={() => setState("guided")}>
            Step into deep time <span>→</span>
          </button>
          <button className="secondary" onClick={() => setState("lab")}>
            Open timeline explorer
          </button>
          <small>Six ages · at your pace · made for curious families</small>
        </section>
        <footer>
          Every silhouette is a clue. Fossil evidence is always incomplete.
        </footer>
      </main>
    );
  const item = story[step];
  return (
    <main className={`experience ${state}`}>
      <header className="top">
        <Brand lab={state === "lab"} />
        <button
          onClick={() => (state === "guided" ? setState("lab") : setInfo(true))}
        >
          {state === "guided" ? "Skip to timeline →" : "Evidence & limits ?"}
        </button>
      </header>
      {state === "guided" ? (
        <>
          <TimeWorld age={item.age} />
          <section className="story" key={step}>
            <span>
              {String(step + 1).padStart(2, "0")} / 06 ·{" "}
              {item.age < 0.01 ? "0.0003" : item.age} Ma
            </span>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            <small>{item.note}</small>
            <button
              onClick={() =>
                step === 5 ? setState("lab") : setStep((v) => v + 1)
              }
            >
              {step === 5 ? "Explore the timeline" : "Walk forward"} →
            </button>
          </section>
          <nav className="story-nav">
            <button
              aria-label="Previous"
              disabled={!step}
              onClick={() => setStep((v) => Math.max(0, v - 1))}
            >
              ←
            </button>
            <i>{step + 1}/6</i>
            <button
              aria-label="Next"
              onClick={() =>
                step === 5 ? setState("lab") : setStep((v) => v + 1)
              }
            >
              →
            </button>
          </nav>
          <div
            className="progress"
            style={
              { "--p": `${((step + 1) / 6) * 100}%` } as React.CSSProperties
            }
          />
        </>
      ) : (
        <Lab />
      )}
      {info && <Info close={() => setInfo(false)} />}
      <div className="grain" />
    </main>
  );
}
