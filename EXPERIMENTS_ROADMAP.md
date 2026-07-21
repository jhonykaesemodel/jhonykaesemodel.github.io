# Interactive Museum Roadmap

Every experiment follows the same product contract:

1. One surprising question, understandable without prior knowledge.
2. A reader-paced guided journey that requires interaction before advancing.
3. A laboratory where the visitor can vary the mechanism directly.
4. A concise “model and limits” panel with primary or institutional sources.
5. No accounts, tracking, backend, or stored personal data.
6. Desktop-first art direction with complete phone usability, keyboard access,
   reduced-motion support, and readable contrast.

## Release sequence

### 003 — The Seeing Machine

**Question:** How much of the world do your eyes actually deliver?

The visitor discovers their blind spot, peripheral crowding, contextual color,
change blindness, and saccadic continuity. The laboratory separates retinal
input from the stable scene we experience. It must never imply that perception
is simply inaccurate; the emphasis is that compression and inference make
useful, continuous vision possible.

### 004 — Inside One Cell

**Question:** How does a microscopic city continuously rebuild itself?

A continuous scale journey moves from a human body to a cell, nucleus, DNA,
gene, RNA, ribosome, and protein. The irreducible interaction is expressing one
gene: unzip, transcribe, edit, export, translate, fold. Scale and time are always
labelled; organelles are presented as dynamic systems rather than static blobs.

### 005 — Two, Apart

**Question:** What kind of correlation cannot be explained by shared secrets?

The visitor first invents a classical strategy for a Bell-style game, then runs
trials and discovers its ceiling. Quantum correlations exceed that ceiling
without enabling messages faster than light. The laboratory compares product,
separable, and entangled states; interpretations remain secondary to the shared
statistics.

### 006 — Clockwork Sky

**Question:** How many familiar phenomena come from one moving geometry?

A manipulable three-dimensional Earth–Moon–Sun system unifies day and night,
seasons, lunar phases, solar and lunar eclipses, tides, and shadow geometry.
Real and “explanation” scales are switchable because astronomical size and
distance cannot be simultaneously legible on a small screen. The experience
explicitly corrects the common misconceptions that seasons arise from Earth–Sun
distance and that every new moon produces an eclipse.

### 007 — When Giants Walked

**Question:** Can a child feel 186 million years rather than merely read it?

The primary interaction stretches geological time across the room. Children
place dinosaurs, continents, plants, and extinction events, then compress the
entire span until human history becomes nearly invisible. Species are grouped
by verified time range and location; fictional encounters are prevented.

### 008 — Sing, Goddess / Tell Me, Muse

**Question:** How do choices echo through two foundational journeys?

One story atlas contains two linked paths: the Iliad’s compressed weeks around
Troy and the Odyssey’s long return to Ithaca. Visitors follow characters,
places, promises, divine interventions, hospitality, pride, grief, and
consequence. A family mode uses clear retellings without flattening violence or
presenting disputed geography as certain; a source mode maps moments to book
and line references in public-domain translations.

### 009 — Gravity Garden

**Question:** Why does an orbiting body keep falling without falling down?

The visitor throws a small world sideways and watches one velocity vector become
a collision, a bound orbit, or an escape. The laboratory integrates an ideal
Newtonian two-body system rather than drawing decorative ellipses. Distance,
mass, and speed are normalized; atmosphere, additional bodies, relativity, and
real-world scale are disclosed as omissions.

### 010 — How a Thought Moves

**Question:** How do many tiny signals become one decisive neural pulse?

The visitor sends excitatory and inhibitory inputs into a neuron, watches a
leaky membrane potential integrate them, and crosses an all-or-none threshold.
The resulting spike travels down an axon and influences another cell. The
laboratory is explicitly a leaky integrate-and-fire teaching model, not a claim
that one neuron contains a thought or that neurons are simple electrical wires.

### 011 — The Breath Between Worlds

**Question:** How can the same carbon become air, leaf, body, ocean, and rock?

The visitor follows one marked carbon atom through linked reservoirs while the
larger system continues to breathe around it. Fast biological exchanges sit
beside deep-ocean and geological timescales; combustion exposes the unusually
fast human path from slow storage into the active cycle. Routes are illustrative,
not a deterministic itinerary or a climate forecast.

### 012 — A Clock That Disagrees

**Question:** How can two honest clocks disagree and both be right?

A manipulable light clock makes special-relativistic time dilation emerge from
geometry and the invariant speed of light. The visitor then encounters mutual
time dilation, relativity of simultaneity, and the clock corrections needed by
satellite navigation. Calculations use exact special-relativity formulas;
diagrams, speeds, and distances are heavily compressed for comprehension.

### 013 — The Probability Machine

**Question:** How can single events stay uncertain while crowds become stable?

The visitor predicts before sampling, then runs one, one hundred, and ten
thousand trials. Local streaks coexist with long-run structure. Additional
lenses reveal collision probability and the effect of base rates on evidence.
Every result is generated locally from the stated model; probability describes
the model, not a hidden promise about the next event.

### 014 — How a Machine Sees

**Question:** What does an autonomous machine know about the world before it acts?

A synthetic street scene can be peeled from camera pixels and lidar returns into
detections, tracks, forecasts, and uncertainty. Rain, occlusion, and sensor loss
show why perception is evidence rather than ground truth. It uses a deliberately
small illustrative model and no claim that a deployed autonomous system works in
exactly this way.

## Release policy

Each experiment ships in its own pull request. It is merged only after unit
tests, a production build, desktop and 390×844 browser checks, a production
dependency audit, and successful verification from the public custom domain.
