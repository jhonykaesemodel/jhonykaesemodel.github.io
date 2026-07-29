import type { Confidence, EtymologyEntry, EtymologyNode } from './model'

const API = 'https://en.wiktionary.org/w/api.php'

interface ParseResponse {
  error?: { info?: string }
  parse?: {
    title: string
    revid?: number
    text: string
  }
}

interface RawTreeGroup {
  keyword?: string
  keyword_label?: string
  terms?: RawTreeTerm[]
}

interface RawTreeTerm {
  id?: string
  term?: string
  lang?: string
  lang_name?: string
  is_uncertain?: boolean
  children?: RawTreeGroup[]
}

interface RawTreeRoot {
  children?: RawTreeGroup[]
}

let nodeSequence = 0

function cleanText(value: string, limit: number) {
  const cleaned = value.replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
  return cleaned.length > limit ? `${cleaned.slice(0, limit - 1).trim()}…` : cleaned
}

function confidenceFor(term: RawTreeTerm): Confidence {
  if (term.is_uncertain) return 'uncertain'
  if (term.term?.startsWith('*') || term.lang?.endsWith('-pro')) return 'reconstructed'
  return 'documented'
}

function convertTerm(term: RawTreeTerm, relation?: string): EtymologyNode | null {
  if (!term.term || !term.lang_name) return null
  nodeSequence += 1
  const ancestors = (term.children ?? [])
    .flatMap((group) => group.terms?.map((child) => convertTerm(child, group.keyword_label || group.keyword)) ?? [])
    .filter((child): child is EtymologyNode => Boolean(child))
  return {
    id: `wikt-${nodeSequence}`,
    term: term.term,
    language: term.lang_name,
    langCode: term.lang,
    relation,
    confidence: confidenceFor(term),
    ancestors,
  }
}

function convertTree(raw: RawTreeRoot) {
  return (raw.children ?? [])
    .flatMap((group) => group.terms?.map((term) => convertTerm(term, group.keyword_label || group.keyword)) ?? [])
    .filter((node): node is EtymologyNode => Boolean(node))
}

function getEnglishSection(document: Document) {
  const englishHeading = document.querySelector('h2#English')
  const wrapper = englishHeading?.parentElement
  if (!wrapper) return null
  const section = document.createElement('section')
  let sibling = wrapper.nextElementSibling
  while (sibling && !sibling.classList.contains('mw-heading2')) {
    section.append(sibling.cloneNode(true))
    sibling = sibling.nextElementSibling
  }
  return section
}

function getEtymologySections(english: Element) {
  const sections: HTMLElement[] = []
  const headings = Array.from(english.querySelectorAll('h3[id^="Etymology"]'))
  headings.forEach((heading) => {
    const wrapper = heading.parentElement
    if (!wrapper) return
    const section = document.createElement('section')
    let sibling = wrapper.nextElementSibling
    while (sibling && !sibling.classList.contains('mw-heading2') && !sibling.classList.contains('mw-heading3')) {
      section.append(sibling.cloneNode(true))
      sibling = sibling.nextElementSibling
    }
    sections.push(section)
  })
  return sections
}

function fallbackLineage(word: string, section: HTMLElement) {
  const pairs: Array<{ language: string; term: string; langCode?: string }> = []
  section.querySelectorAll('.etyl').forEach((label) => {
    let candidate = label.nextElementSibling
    while (candidate && !candidate.matches('.mention, .form-of, i, b')) candidate = candidate.nextElementSibling
    const mention = candidate?.matches('.mention, i') ? candidate : label.parentElement?.querySelector('.mention')
    const language = cleanText(label.textContent ?? '', 70)
    const term = cleanText(mention?.textContent ?? '', 70)
    if (language && term && !pairs.some((pair) => pair.language === language && pair.term === term)) {
      pairs.push({ language, term, langCode: mention?.getAttribute('lang') || undefined })
    }
  })
  if (pairs.length === 0) return []

  let ancestor: EtymologyNode | null = null
  pairs.slice(0, 10).reverse().forEach((pair) => {
    nodeSequence += 1
    const confidence: Confidence = pair.term.startsWith('*') || pair.language.startsWith('Proto-')
      ? 'reconstructed'
      : 'documented'
    ancestor = {
      id: `fallback-${nodeSequence}`,
      term: pair.term,
      language: pair.language,
      langCode: pair.langCode,
      confidence,
      relation: 'from',
      ancestors: ancestor ? [ancestor] : [],
    }
  })
  nodeSequence += 1
  return [{
    id: `fallback-${nodeSequence}`,
    term: word,
    language: 'English',
    langCode: 'en',
    confidence: 'documented' as const,
    relation: 'present form',
    ancestors: ancestor ? [ancestor] : [],
  }]
}

function etymologyProse(section?: HTMLElement) {
  if (!section) return 'No English etymology text was found for this spelling.'
  const copy = section.cloneNode(true) as HTMLElement
  copy.querySelectorAll('style, script, sup, table, .mw-editsection, .NavFrame, .etymonid').forEach((element) => element.remove())
  return cleanText(copy.textContent ?? '', 520) || 'The source provides a lineage but no short prose summary.'
}

function firstDefinition(english: HTMLElement) {
  const candidate = english.querySelector('ol > li')
  if (!candidate) return 'No concise English definition was found.'
  const copy = candidate.cloneNode(true) as HTMLElement
  copy.querySelectorAll('ul, ol, dl, blockquote, table, sup, .HQToggle').forEach((element) => element.remove())
  return cleanText(copy.textContent ?? '', 220) || 'No concise English definition was found.'
}

export function parseWiktionaryResponse(payload: ParseResponse): EtymologyEntry {
  if (payload.error) throw new Error(payload.error.info || 'Wiktionary could not find that entry.')
  if (!payload.parse?.text) throw new Error('No dictionary entry was returned.')

  const parsed = new DOMParser().parseFromString(payload.parse.text, 'text/html')
  const english = getEnglishSection(parsed)
  if (!english) throw new Error(`“${payload.parse.title}” has no English entry in Wiktionary.`)

  const etymologySections = getEtymologySections(english)
  const lineages = etymologySections.flatMap((section) => {
    const trees = Array.from(section.querySelectorAll<HTMLElement>('[data-ety-tree-json]'))
      .flatMap((element) => {
        try {
          return convertTree(JSON.parse(element.dataset.etyTreeJson || '{}') as RawTreeRoot)
        } catch {
          return []
        }
      })
    return trees.length ? trees : fallbackLineage(payload.parse!.title, section)
  })

  const uniqueLineages = lineages.filter((lineage, index, all) =>
    all.findIndex((candidate) => candidate.term === lineage.term
      && candidate.ancestors[0]?.term === lineage.ancestors[0]?.term) === index,
  )
  const word = payload.parse.title
  const revision = payload.parse.revid
  return {
    word,
    definition: firstDefinition(english),
    etymologyText: etymologyProse(etymologySections[0]),
    revision,
    sourceUrl: revision
      ? `https://en.wiktionary.org/w/index.php?title=${encodeURIComponent(word)}&oldid=${revision}`
      : `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
    lineages: uniqueLineages.length
      ? uniqueLineages
      : [{
        id: `unknown-${word}`,
        term: word,
        language: 'English',
        langCode: 'en',
        confidence: 'documented',
        ancestors: [],
      }],
    notice: uniqueLineages.length
      ? undefined
      : 'The source has an English entry, but its ancestry is not structured enough to map safely.',
  }
}

export async function fetchEtymology(word: string, signal?: AbortSignal) {
  const cleanWord = word.trim().replace(/\s+/g, ' ')
  if (!cleanWord) throw new Error('Enter a word or name.')
  if (cleanWord.length > 80) throw new Error('Try a word or short name under 80 characters.')
  const params = new URLSearchParams({
    action: 'parse',
    page: cleanWord,
    prop: 'text|revid',
    redirects: '1',
    format: 'json',
    formatversion: '2',
    origin: '*',
  })
  const response = await fetch(`${API}?${params}`, { signal })
  if (!response.ok) throw new Error('The language archive could not be reached. Check your connection and try again.')
  return parseWiktionaryResponse(await response.json() as ParseResponse)
}
