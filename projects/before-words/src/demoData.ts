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

export const paternalEntry: EtymologyEntry = {
  word: 'paternal',
  definition: 'Of or pertaining to one’s father.',
  etymologyText: 'English borrowed the word through Old French, from Vulgar Latin and Latin formations built on pater, “father.”',
  revision: 91140994,
  sourceUrl: 'https://en.wiktionary.org/w/index.php?title=paternal&oldid=91140994',
  lineages: [
    node('paternal', 'English', 'documented', [
      node('paternal', 'Old French', 'documented', [
        node('paternālis', 'Vulgar Latin', 'reconstructed', [
          node('paternus', 'Latin', 'documented', [
            node('pater', 'Latin', 'documented', [pieFather], 'la', 'from'),
          ], 'la', 'formed from'),
        ], 'la-vul', 'from'),
      ], 'fro', 'borrowed from'),
    ], 'en', 'present form'),
  ],
}
