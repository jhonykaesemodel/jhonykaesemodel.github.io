import type { Confidence, EtymologyEntry, EtymologyLookup, EtymologyNode } from './model'

const API = 'https://en.wiktionary.org/w/api.php'

interface ParseResponse {
  error?: { code?: string; info?: string }
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

interface OpenSearchResponse extends Array<string | string[]> {
  0: string
  1: string[]
  2: string[]
  3: string[]
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

function sectionAfterHeading(heading: Element, level: number) {
  const wrapper = heading.parentElement?.classList.contains(`mw-heading${level}`)
    ? heading.parentElement
    : heading
  const section = document.createElement('section')
  let sibling = wrapper.nextElementSibling
  while (sibling) {
    if (sibling.matches(`h${level}, .mw-heading${level}`)) break
    section.append(sibling.cloneNode(true))
    sibling = sibling.nextElementSibling
  }
  return section
}

function getLanguageSections(document: Document) {
  return Array.from(document.querySelectorAll('h2[id]')).map((heading) => ({
    language: cleanText(heading.textContent ?? heading.id.replaceAll('_', ' '), 80),
    anchor: heading.id,
    section: sectionAfterHeading(heading, 2),
  }))
}

function getEtymologySections(languageSection: Element) {
  const sections: HTMLElement[] = []
  const headings = Array.from(languageSection.querySelectorAll('h3[id^="Etymology"]'))
  headings.forEach((heading) => sections.push(sectionAfterHeading(heading, 3)))
  return sections
}

function fallbackLineage(word: string, language: string, section: HTMLElement) {
  const pairs: Array<{ language: string; term: string; langCode?: string }> = []
  section.querySelectorAll('.etyl').forEach((label) => {
    let candidate = label.nextElementSibling
    while (candidate && !candidate.matches('.mention, .form-of, i, b')) candidate = candidate.nextElementSibling
    const mention = candidate?.matches('.mention, i') ? candidate : label.parentElement?.querySelector('.mention')
    const sourceLanguage = cleanText(label.textContent ?? '', 70)
    const term = cleanText(mention?.textContent ?? '', 70)
    if (sourceLanguage && term && !pairs.some((pair) => pair.language === sourceLanguage && pair.term === term)) {
      pairs.push({ language: sourceLanguage, term, langCode: mention?.getAttribute('lang') || undefined })
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
    language,
    confidence: 'documented' as const,
    relation: 'present form',
    ancestors: ancestor ? [ancestor] : [],
  }]
}

function etymologyProse(section?: HTMLElement) {
  if (!section) return 'No etymology text was found for this spelling and language.'
  const copy = section.cloneNode(true) as HTMLElement
  copy.querySelectorAll('style, script, sup, table, .mw-editsection, .NavFrame, .etymonid').forEach((element) => element.remove())
  return cleanText(copy.textContent ?? '', 520) || 'The source provides a lineage but no short prose summary.'
}

function firstDefinition(languageSection: HTMLElement) {
  const candidate = languageSection.querySelector('ol > li')
  if (!candidate) return 'No concise definition was found for this language.'
  const copy = candidate.cloneNode(true) as HTMLElement
  copy.querySelectorAll('ul, ol, dl, blockquote, table, sup, .HQToggle').forEach((element) => element.remove())
  return cleanText(copy.textContent ?? '', 220) || 'No concise definition was found for this language.'
}

function entryForLanguage(
  word: string,
  revision: number | undefined,
  language: string,
  anchor: string,
  languageSection: HTMLElement,
): EtymologyEntry {
  const etymologySections = getEtymologySections(languageSection)
  const lineages = etymologySections.flatMap((section) => {
    const trees = Array.from(section.querySelectorAll<HTMLElement>('[data-ety-tree-json]'))
      .flatMap((element) => {
        try {
          return convertTree(JSON.parse(element.dataset.etyTreeJson || '{}') as RawTreeRoot)
        } catch {
          return []
        }
      })
    return trees.length ? trees : fallbackLineage(word, language, section)
  })
  const uniqueLineages = lineages.filter((lineage, index, all) =>
    all.findIndex((candidate) => candidate.term === lineage.term
      && candidate.ancestors[0]?.term === lineage.ancestors[0]?.term) === index,
  )
  const formOfLink = languageSection.querySelector<HTMLAnchorElement>('.form-of-definition-link a[title]')
  const continuationTerm = cleanText(formOfLink?.getAttribute('title') ?? formOfLink?.textContent ?? '', 80)
  let mappedLineages = uniqueLineages
  if (mappedLineages.length === 0 && continuationTerm && continuationTerm !== word) {
    nodeSequence += 1
    const ancestorId = `form-of-${nodeSequence}`
    nodeSequence += 1
    mappedLineages = [{
      id: `form-${nodeSequence}`,
      term: word,
      language,
      confidence: 'documented',
      relation: 'present form',
      ancestors: [{
        id: ancestorId,
        term: continuationTerm,
        language,
        confidence: 'documented',
        relation: cleanText(languageSection.querySelector('.form-of-definition')?.textContent ?? 'documented form of', 100),
        ancestors: [],
      }],
    }]
  }
  return {
    word,
    language,
    definition: firstDefinition(languageSection),
    etymologyText: etymologyProse(etymologySections[0]),
    revision,
    sourceUrl: revision
      ? `https://en.wiktionary.org/w/index.php?title=${encodeURIComponent(word)}&oldid=${revision}#${encodeURIComponent(anchor)}`
      : `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}#${encodeURIComponent(anchor)}`,
    lineages: mappedLineages.length
      ? mappedLineages
      : [{
        id: `unknown-${language}-${word}`,
        term: word,
        language,
        confidence: 'documented',
        ancestors: [],
      }],
    notice: uniqueLineages.length
      ? undefined
      : continuationTerm
        ? `This entry identifies ${word} as a documented form of ${continuationTerm}; deeper ancestry continues on that entry.`
        : 'This language entry exists, but its ancestry is not structured enough to map safely.',
    continuationTerm: uniqueLineages.length === 0 ? continuationTerm || undefined : undefined,
  }
}

function attachAncestors(node: EtymologyNode, target: string, ancestors: EtymologyNode[]): EtymologyNode {
  if (node.term.toLocaleLowerCase() === target.toLocaleLowerCase() && node.ancestors.length === 0) {
    return { ...node, ancestors }
  }
  return { ...node, ancestors: node.ancestors.map((ancestor) => attachAncestors(ancestor, target, ancestors)) }
}

export function mergeContinuation(entry: EtymologyEntry, continuation: EtymologyEntry) {
  if (!entry.continuationTerm) return entry
  const deeperRoot = continuation.lineages[0]
  return {
    ...entry,
    lineages: entry.lineages.map((root) => attachAncestors(root, entry.continuationTerm!, deeperRoot.ancestors)),
    notice: `${entry.word} is documented as a form of ${entry.continuationTerm}. The deeper path continues from that entry.`,
    continuationTerm: undefined,
    continuationSourceUrl: continuation.sourceUrl,
  }
}

export function parseWiktionaryLookup(payload: ParseResponse): EtymologyLookup {
  if (payload.error) throw new Error(payload.error.info || 'Wiktionary could not find that entry.')
  if (!payload.parse?.text) throw new Error('No dictionary entry was returned.')
  const parsed = new DOMParser().parseFromString(payload.parse.text, 'text/html')
  const sections = getLanguageSections(parsed)
  if (sections.length === 0) throw new Error(`“${payload.parse.title}” has no language entries in Wiktionary.`)
  const entries = sections.map(({ language, anchor, section }) =>
    entryForLanguage(payload.parse!.title, payload.parse!.revid, language, anchor, section),
  )
  entries.sort((left, right) => {
    if (left.language === 'English') return -1
    if (right.language === 'English') return 1
    return left.language.localeCompare(right.language)
  })
  return { requested: payload.parse.title, entries, suggestions: [] }
}

export function parseWiktionaryResponse(payload: ParseResponse) {
  return parseWiktionaryLookup(payload).entries[0]
}

function editDistance(left: string, right: string) {
  const a = Array.from(left.toLocaleLowerCase())
  const b = Array.from(right.toLocaleLowerCase())
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  a.forEach((character, leftIndex) => {
    let diagonal = row[0]
    row[0] = leftIndex + 1
    b.forEach((other, rightIndex) => {
      const above = row[rightIndex + 1]
      row[rightIndex + 1] = character === other
        ? diagonal
        : Math.min(diagonal, above, row[rightIndex]) + 1
      diagonal = above
    })
  })
  return row[b.length]
}

async function fetchSuggestions(word: string, signal?: AbortSignal) {
  const params = new URLSearchParams({
    action: 'opensearch',
    search: word,
    limit: '20',
    namespace: '0',
    format: 'json',
    origin: '*',
  })
  const response = await fetch(`${API}?${params}`, { signal })
  if (!response.ok) return []
  const payload = await response.json() as OpenSearchResponse
  const maximumDistance = Math.max(2, Math.floor(Array.from(word).length * 0.35))
  return (payload[1] ?? [])
    .map((suggestion) => ({ suggestion, distance: editDistance(word, suggestion) }))
    .filter((candidate) => candidate.distance <= maximumDistance)
    .sort((left, right) => left.distance - right.distance || left.suggestion.localeCompare(right.suggestion))
    .map((candidate) => candidate.suggestion)
    .slice(0, 6)
}

export async function fetchEtymology(word: string, signal?: AbortSignal): Promise<EtymologyLookup> {
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
  const payload = await response.json() as ParseResponse
  if (payload.error?.code === 'missingtitle') {
    return { requested: cleanWord, entries: [], suggestions: await fetchSuggestions(cleanWord, signal) }
  }
  return parseWiktionaryLookup(payload)
}
