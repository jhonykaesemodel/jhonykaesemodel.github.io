export type Scope = 'species' | 'family'
export type EvidenceKind = 'record' | 'object' | 'body' | 'trace' | 'absence'

export type Evidence = {
  id: string
  yearsAgo: number
  dateLabel: string
  title: string
  place: string
  kind: EvidenceKind
  image?: string
  imageAlt?: string
  imageNote?: string
  imageCredit?: string
  imageUrl?: string
  license?: string
  claim: string
  survives: string
  missing: string
  sourceLabel: string
  sourceUrl: string
}

export const SPECIES_YEARS = 315_000
export const FAMILY_YEARS = 3_300_000
export const WRITING_YEARS = 5_200
export const GENERATION_YEARS = 25

export const evidence: Evidence[] = [
  {
    id: 'writing', yearsAgo: WRITING_YEARS, dateLabel: 'before 3200 BCE', title: 'A thought enters matter',
    place: 'Uruk · present-day Iraq', kind: 'record', image: './evidence/writing.jpg',
    imageAlt: 'A small clay tablet covered in early pictographic marks',
    imageNote: 'Late Uruk tablet · around 3300 BCE',
    imageCredit: 'Carole Raddato', imageUrl: 'https://commons.wikimedia.org/wiki/File:Pre-cuneiform_writing_tablet_noting_food_ratios,_Archives_from_the_Temple_of_the_Sky_God,_from_Uruk_(Irak),_Late_Uruk_Period,_around_3300_BC,_Louvre_Lens,_France_(26939082575).jpg', license: 'CC BY-SA 2.0',
    claim: 'One of the earliest surviving writing traditions fixed accounts in clay.',
    survives: 'This tablet records food rations. A message outlived its writer.',
    missing: 'Writing did not begin history. It changed which voices history could preserve.',
    sourceLabel: 'British Museum · Cuneiform', sourceUrl: 'https://www.britishmuseum.org/blog/how-write-cuneiform'
  },
  {
    id: 'flute', yearsAgo: 40_000, dateLabel: 'about 40,000 years ago', title: 'Music without the music',
    place: 'Hohle Fels · Germany', kind: 'object', image: './evidence/flute.jpg',
    imageAlt: 'A reconstructed Paleolithic flute made from vulture bone',
    imageNote: 'Museum reconstruction',
    imageCredit: 'Tomatenpflanze', imageUrl: 'https://commons.wikimedia.org/wiki/File:Fl%C3%B6te_aus_G%C3%A4nsegeierknochen_vom_Hohle_Fels_im_urmu.jpg', license: 'CC BY-SA 4.0',
    claim: 'Bone flutes show that music was established in Ice Age Europe.',
    survives: 'Finger holes, tool marks, and a hollow bird bone survived.',
    missing: 'No melody did. We cannot recover who listened, danced, or cried.',
    sourceLabel: 'University of Tübingen · Hohle Fels', sourceUrl: 'https://uni-tuebingen.de/en/faculties/faculty-of-science/departments/geosciences/work-groups/prehistory-and-archaeological-sciences/ina/early-prehistory-quaternary-ecology/research/excavations/germany/hohle-fels/'
  },
  {
    id: 'blombos', yearsAgo: 73_000, dateLabel: 'about 73,000 years ago', title: 'A mark meant to be seen',
    place: 'Blombos Cave · South Africa', kind: 'object', image: './evidence/blombos.jpg',
    imageAlt: 'A piece of ochre engraved with a deliberate cross-hatched pattern',
    imageNote: 'Related engraved ochre from Blombos · not the 73,000-year drawn flake',
    imageCredit: 'Chris S. Henshilwood', imageUrl: 'https://commons.wikimedia.org/wiki/File:Blombo.jpg', license: 'CC BY-SA 4.0',
    claim: 'Deliberate cross-hatched marks reveal practiced abstract mark-making.',
    survives: 'Pigment, incised lines, and the sequence of gestures can be studied.',
    missing: 'The mark’s meaning—if it carried one—is gone.',
    sourceLabel: 'Nature · 73,000-year-old drawing', sourceUrl: 'https://www.nature.com/articles/s41586-018-0514-3'
  },
  {
    id: 'language', yearsAgo: 150_000, dateLabel: 'date unknown', title: 'The archive that vanished',
    place: 'No single birthplace is known', kind: 'absence',
    claim: 'Spoken language could preserve knowledge long before writing.',
    survives: 'Indirect clues survive in anatomy, genes, tools, and social behavior.',
    missing: 'Speech leaves no fossil. No excavation can uncover the first sentence.',
    sourceLabel: 'Antiquity · Archaeology of language origins', sourceUrl: 'https://www.cambridge.org/core/journals/antiquity/article/abs/archaeology-of-language-originsa-review/4B053CBE2C6D633D3345CE8EE157BB78'
  },
  {
    id: 'sapiens', yearsAgo: 315_000, dateLabel: '315,000 ± 34,000 years ago', title: 'A face, not a beginning',
    place: 'Jebel Irhoud · Morocco', kind: 'body', image: './evidence/jebel-irhoud.jpg',
    imageAlt: 'Side view of a museum cast of the Jebel Irhoud 1 skull',
    imageNote: 'Museum cast',
    imageCredit: 'Jonathan Chen', imageUrl: 'https://commons.wikimedia.org/wiki/File:Jebel_Irhoud-1_NMNH.jpg', license: 'CC BY-SA 4.0',
    claim: 'Jebel Irhoud fossils preserve an early mosaic of Homo sapiens traits.',
    survives: 'Faces, teeth, braincase shape, stone tools, and a dated site context.',
    missing: 'There was no sharp instant when one “first human” appeared.',
    sourceLabel: 'Nature · Jebel Irhoud dating', sourceUrl: 'https://www.nature.com/articles/nature22335'
  },
  {
    id: 'fire', yearsAgo: 1_000_000, dateLabel: 'about 1 million years ago', title: 'A night gathered around fire',
    place: 'Wonderwerk Cave · South Africa', kind: 'trace',
    claim: 'Microscopic ash and burned bone are evidence of fire used inside the cave.',
    survives: 'Ash plant remains and scorched bone remained within a buried sediment layer.',
    missing: 'The embers cannot tell us whether fire was made there, or what was said around it.',
    sourceLabel: 'PNAS · Wonderwerk Cave', sourceUrl: 'https://doi.org/10.1073/pnas.1117620109'
  },
  {
    id: 'lucy', yearsAgo: 3_180_000, dateLabel: 'about 3.18 million years ago', title: 'Long before us, someone walked',
    place: 'Hadar · Ethiopia', kind: 'body', image: './evidence/lucy.jpg',
    imageAlt: 'Museum skeletal reconstruction of Lucy, Australopithecus afarensis',
    imageNote: 'Museum skeletal reconstruction',
    imageCredit: 'Wolfgang Sauber', imageUrl: 'https://commons.wikimedia.org/wiki/File:NHM_-_Australopithecus_afarensis_Skelett.jpg', license: 'CC BY-SA 4.0',
    claim: 'Lucy’s skeleton combines habitual upright walking with climbing adaptations.',
    survives: 'Parts of one skeleton—AL 288-1—and the anatomy of movement.',
    missing: 'Lucy was not Homo sapiens, and the fossil does not prove she was our direct ancestor.',
    sourceLabel: 'Smithsonian · AL 288-1', sourceUrl: 'https://humanorigins.si.edu/evidence/human-fossils/fossils/al-288-1'
  }
]

export type StoryScene = {
  eyebrow: string
  title: string
  body: string
  note: string
  yearsAgo: number
  scope: Scope
  evidenceId?: string
  mode: 'threshold' | 'scale' | 'evidence' | 'absence' | 'embers'
}

export const story: StoryScene[] = [
  {
    eyebrow: 'THE LIT EDGE', title: 'This is the history we can read.',
    body: 'Names. Debts. Prayers. Kings. A voice pressed into matter—and heard by strangers thousands of years later.',
    note: 'Cuneiform originated in Mesopotamia before 3200 BCE. Other early writing traditions arose independently.',
    yearsAgo: WRITING_YEARS, scope: 'species', evidenceId: 'writing', mode: 'threshold'
  },
  {
    eyebrow: 'NOW MAKE THE LINE HONEST', title: 'Writing occupies the final 1.7%.',
    body: 'On the lifetime of our species, almost everything happened before surviving words.',
    note: 'Using 315,000 years as a reference for early Homo sapiens—not as a precise birthday for our species.',
    yearsAgo: WRITING_YEARS, scope: 'species', mode: 'scale'
  },
  {
    eyebrow: 'A FACE · NOT A BEGINNING', title: 'A child was born under another sky.',
    body: 'Not a rough draft of a person. A member of a changing population—with a body, attachments, needs, and a future no fossil can narrate.',
    note: 'We cannot honestly claim a child 300,000 years ago had every modern cognitive or linguistic capability. Those do not fossilize cleanly.',
    yearsAgo: 315_000, scope: 'species', evidenceId: 'sapiens', mode: 'evidence'
  },
  {
    eyebrow: 'THE INVISIBLE ARCHIVE', title: 'Before clay, memory lived in people.',
    body: 'A story could cross generations. A name could outlive a body. But when the chain of voices ended, the archive vanished.',
    note: 'The origin and early form of language remain unresolved; speech itself leaves no archaeological trace.',
    yearsAgo: 150_000, scope: 'species', evidenceId: 'language', mode: 'absence'
  },
  {
    eyebrow: 'AN INSTRUMENT · NOT A SONG', title: 'Someone made the air remember.',
    body: 'A hollow wing bone became breath, pitch, rhythm, gathering. The flute survived. Every performance disappeared.',
    note: 'The pictured object is a reconstruction of the Hohle Fels vulture-bone flute.',
    yearsAgo: 40_000, scope: 'species', evidenceId: 'flute', mode: 'evidence'
  },
  {
    eyebrow: 'BEYOND OUR SPECIES', title: 'Fire made a second kind of day.',
    body: 'By roughly a million years ago, fire burned inside Wonderwerk Cave. Around light and warmth, social time could continue after sunset.',
    note: 'The evidence supports in-cave burning. It does not identify the first controlled fire or prove what happened around it.',
    yearsAgo: 1_000_000, scope: 'family', evidenceId: 'fire', mode: 'embers'
  },
  {
    eyebrow: '3.18 MILLION YEARS AGO', title: 'Long before our stories, there were footsteps.',
    body: 'Lucy’s bones preserve a life adapted to walking upright and climbing. Not our beginning—one branch in a much larger family.',
    note: 'The pictured skeleton is a museum reconstruction. Paleontology reconstructs relationships; it rarely identifies a direct ancestor.',
    yearsAgo: 3_180_000, scope: 'family', evidenceId: 'lucy', mode: 'evidence'
  }
]

export const nextStep = (step: number) => Math.min(step + 1, story.length - 1)
export const previousStep = (step: number) => Math.max(step - 1, 0)
export const scopeYears = (scope: Scope) => scope === 'species' ? SPECIES_YEARS : FAMILY_YEARS
export const clampYears = (years: number, scope: Scope) => Math.min(Math.max(0, years), scopeYears(scope))
export const yearsToPosition = (years: number, scope: Scope) => 1 - clampYears(years, scope) / scopeYears(scope)
export const positionToYears = (position: number, scope: Scope) => Math.round((1 - Math.min(1, Math.max(0, position))) * scopeYears(scope))
export const historyPercent = (part: number, whole = SPECIES_YEARS) => part / whole * 100
export const yearsAsDayMinutes = (years: number, whole = SPECIES_YEARS) => years / whole * 24 * 60
export const lifetimeAsDaySeconds = (lifeYears = 80, whole = SPECIES_YEARS) => lifeYears / whole * 24 * 60 * 60

export const formatYears = (years: number) => {
  if (years >= 1_000_000) return `${Number((years / 1_000_000).toFixed(2))} million years ago`
  if (years >= 10_000) return `${Math.round(years / 1_000).toLocaleString()} thousand years ago`
  if (years >= 1_000) return `${(years / 1_000).toFixed(years % 1_000 === 0 ? 0 : 1)} thousand years ago`
  if (years === 0) return 'Now'
  return `${years.toLocaleString()} years ago`
}

export const visibleEvidence = (scope: Scope) => evidence.filter(item => item.yearsAgo <= scopeYears(scope))
export const nearestEvidence = (years: number, scope: Scope) => {
  const items = visibleEvidence(scope)
  return items.reduce((nearest, item) => Math.abs(item.yearsAgo - years) < Math.abs(nearest.yearsAgo - years) ? item : nearest, items[0])
}
