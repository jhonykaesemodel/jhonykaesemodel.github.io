import { useEffect, useMemo, useState } from "react";
import {
  CLASSICAL_LIMIT,
  expectedRate,
  sampleTrial,
  story,
  type Model,
} from "./model";
function Brand({ lab = false }: { lab?: boolean }) {
  return (
    <span className="brand">
      <i />
      TWO, APART {lab && <em>LAB</em>}
      <b>05</b>
    </span>
  );
}
function PairField({
  model = "quantum",
  pulse = 0,
  outcomes,
}: {
  model?: Model;
  pulse?: number;
  outcomes?: { a: number; b: number };
}) {
  return (
    <div className={`pair-field ${model}`}>
      <div className="source">
        <i />
        <span>PAIR SOURCE</span>
      </div>
      <div key={pulse} className="flight left">
        <i />
      </div>
      <div key={`r${pulse}`} className="flight right">
        <i />
      </div>
      <div className="station alice">
        <span>ALICE</span>
        <b>{outcomes?.a ?? "?"}</b>
        <i />
      </div>
      <div className="station bob">
        <span>BOB</span>
        <b>{outcomes?.b ?? "?"}</b>
        <i />
      </div>
      <div className="relation" />
      <p>NO COMMUNICATION DURING EACH TRIAL</p>
    </div>
  );
}
function Meter({ wins, total }: { wins: number; total: number }) {
  const rate = total ? wins / total : 0;
  return (
    <div className="meter">
      <div className="meter-top">
        <span>OBSERVED WIN RATE</span>
        <b>{total ? `${(rate * 100).toFixed(1)}%` : "—"}</b>
      </div>
      <div className="track">
        <i style={{ width: `${rate * 100}%` }} />
        <em style={{ left: "75%" }}>LOCAL LIMIT · 75%</em>
      </div>
      <small>
        {wins.toLocaleString()} wins / {total.toLocaleString()} trials
      </small>
    </div>
  );
}
function Info({ close }: { close: () => void }) {
  return (
    <div className="scrim">
      <section className="info">
        <button className="close" aria-label="Close" onClick={close}>
          ×
        </button>
        <p className="eyebrow">MODEL & LIMITS</p>
        <h2>A statistical theorem, made touchable.</h2>
        <p>
          This simulates ideal CHSH-game probabilities, not laboratory hardware.
          It omits detector loss, noise, spacetime separation, random-setting
          hardware, and statistical confidence analysis.
        </p>
        <dl>
          <div>
            <dt>Classical</dt>
            <dd>
              “Instructions” means any local hidden-variable strategy with
              independent random inputs. The 75% ceiling is mathematical, not an
              engineering limitation.
            </dd>
          </div>
          <div>
            <dt>Quantum</dt>
            <dd>
              The 85.4% rate is the ideal maximum for this game using an
              entangled state and selected measurement angles.
            </dd>
          </div>
          <div>
            <dt>No signal</dt>
            <dd>
              Alice and Bob each see random outcomes. Correlation is visible
              only after ordinary communication compares their records.
            </dd>
          </div>
          <div>
            <dt>Meaning</dt>
            <dd>
              Experiments violate Bell inequalities. This rules out local
              hidden-variable accounts under the test assumptions; it does not
              prove that information traveled faster than light.
            </dd>
          </div>
        </dl>
        <h3>Scientific starting points</h3>
        <a
          href="https://www.nobelprize.org/prizes/physics/2022/press-release/"
          target="_blank"
        >
          2022 Nobel Prize: Bell experiments ↗
        </a>
        <a href="https://cds.cern.ch/record/111654" target="_blank">
          Bell’s 1964 paper at CERN ↗
        </a>
        <a
          href="https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/chsh-game"
          target="_blank"
        >
          IBM Quantum: the CHSH game ↗
        </a>
        <button className="primary" onClick={close}>
          Return to the experiment
        </button>
      </section>
    </div>
  );
}
function Lab() {
  const [model, setModel] = useState<Model>("instructions"),
    [wins, setWins] = useState(0),
    [total, setTotal] = useState(0),
    [pulse, setPulse] = useState(0),
    [last, setLast] = useState<{ a: number; b: number }>();
  const theoretical = expectedRate(model);
  const run = (count: number) => {
    let w = 0,
      l;
    for (let i = 0; i < count; i++) {
      const x = Math.random() < 0.5 ? 0 : 1,
        y = Math.random() < 0.5 ? 0 : 1;
      l = sampleTrial(model, x, y);
      w += +l.win;
    }
    setWins((v) => v + w);
    setTotal((v) => v + count);
    setLast(l);
    setPulse((v) => v + 1);
  };
  useEffect(() => {
    setWins(0);
    setTotal(0);
    setLast(undefined);
  }, [model]);
  return (
    <>
      <PairField model={model} pulse={pulse} outcomes={last} />
      <nav className="model-tabs">
        <button
          className={model === "instructions" ? "active" : ""}
          onClick={() => setModel("instructions")}
        >
          <span>01</span>LOCAL INSTRUCTIONS
        </button>
        <button
          className={model === "quantum" ? "active" : ""}
          onClick={() => setModel("quantum")}
        >
          <span>02</span>QUANTUM PAIR
        </button>
      </nav>
      <section className="lab-panel">
        <p className="eyebrow">BELL / CHSH CHALLENGE</p>
        <h2>
          {model === "instructions"
            ? "Can prewritten answers survive every question?"
            : "Can correlation exceed the local ceiling?"}
        </h2>
        <div className="run">
          <button onClick={() => run(1)}>Run 1</button>
          <button onClick={() => run(100)}>Run 100</button>
          <button onClick={() => run(1000)}>Run 1,000</button>
        </div>
        <p className="prediction">
          IDEAL PREDICTION <b>{(theoretical * 100).toFixed(1)}%</b>
        </p>
      </section>
      <Meter wins={wins} total={total} />
    </>
  );
}
export default function App() {
  const [state, setState] = useState<"landing" | "guided" | "lab">(() =>
      location.hash === "#lab" ? "lab" : "landing",
    ),
    [step, setStep] = useState(0),
    [info, setInfo] = useState(false);
  const model = useMemo<Model>(
    () => (step < 3 ? "quantum" : step === 3 ? "instructions" : "quantum"),
    [step],
  );
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (state === "guided" && e.key === "ArrowRight") {
        step === story.length - 1 ? setState("lab") : setStep((v) => v + 1);
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
        <div className="hero-pair" aria-hidden="true">
          <i />
          <i />
          <b />
        </div>
        <section className="hero">
          <p className="eyebrow">A TEST AT THE EDGE OF LOCAL REALITY</p>
          <h1>
            Two events.
            <br />
            One pattern <em>no plan can fake.</em>
          </h1>
          <p>
            Separate a quantum pair. Ask each side a random question. Discover
            what nature refuses to explain locally.
          </p>
          <button className="primary" onClick={() => setState("guided")}>
            Separate the pair <span>→</span>
          </button>
          <button className="secondary" onClick={() => setState("lab")}>
            Open Bell laboratory
          </button>
          <small>Six moments · at your pace · no equations required</small>
        </section>
        <footer>Nothing here sends information faster than light.</footer>
      </main>
    );
  return (
    <main className={`experience ${state}`}>
      <header className="top">
        <Brand lab={state === "lab"} />
        <button
          onClick={() => (state === "guided" ? setState("lab") : setInfo(true))}
        >
          {state === "guided" ? "Skip to lab →" : "Model & limits ?"}
        </button>
      </header>
      {state === "guided" ? (
        <>
          <PairField model={model} pulse={step} />
          <section className="story" key={step}>
            <span>{String(step + 1).padStart(2, "0")} / 06</span>
            <h2>{story[step].title}</h2>
            <p>{story[step].body}</p>
            <small>{story[step].note}</small>
            <button
              onClick={() =>
                step === 5 ? setState("lab") : setStep((v) => v + 1)
              }
            >
              {step === 5 ? "Test the inequality" : "Continue"} →
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
