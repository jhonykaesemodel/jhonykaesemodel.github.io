import type { EtymologyEntry, EtymologyNode } from './model'

let sequence = 0

function node(
  term: string,
  language: string,
  confidence: EtymologyNode['confidence'],
  ancestors: EtymologyNode[] = [],
  langCode?: string,
  relation?: string,
): EtymologyNode {
  sequence += 1
  return { id: `demo-${sequence}`, term, language, confidence, ancestors, langCode, relation }
}

const pieFather = node(
  '*ph₂tḗr',
  'Proto-Indo-European',
  'reconstructed',
  [
    node('*peh₂-', 'Proto-Indo-European', 'uncertain', [], 'ine-pro', 'possibly from'),
    node('*-tḗr', 'Proto-Indo-European', 'reconstructed', [], 'ine-pro', 'combined with'),
  ],
  'ine-pro',
  'reconstructed from',
)

export const fatherEntry: EtymologyEntry = {
  word: 'father',
  language: 'English',
  definition: 'A male parent.',
  etymologyText: 'Inherited through Middle English and Old English from Germanic ancestors, ultimately reconstructed to Proto-Indo-European *ph₂tḗr.',
  revision: 91413694,
  sourceUrl: 'https://en.wiktionary.org/w/index.php?title=father&oldid=91413694',
  lineages: [
    node('father', 'English', 'documented', [
      node('fader', 'Middle English', 'documented', [
        node('fæder', 'Old English', 'documented', [
          node('*fader', 'Proto-West Germanic', 'reconstructed', [
            node('*fadēr', 'Proto-Germanic', 'reconstructed', [pieFather], 'gem-pro', 'inherited from'),
          ], 'gmw-pro', 'inherited from'),
        ], 'ang', 'inherited from'),
      ], 'enm', 'inherited from'),
    ], 'en', 'present form'),
  ],
}
