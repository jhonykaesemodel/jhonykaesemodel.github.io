import { afterEach, describe, expect, it, vi } from 'vitest'
import { flattenLineage, type EtymologyEntry, type EtymologyNode } from './model'
import { findEtymologyFamily, mergeContinuation, parseWiktionaryLookup, parseWiktionaryResponse } from './wiktionary'

afterEach(() => vi.unstubAllGlobals())

function page(content: string) {
  return {
    parse: {
      title: 'ember',
      revid: 42,
      text: `<div class="mw-heading mw-heading2"><h2 id="English">English</h2></div>${content}`,
    },
  }
}

describe('Wiktionary parsing', () => {
  it('reads structured etymology tree data and preserves uncertainty', () => {
    const tree = {
      children: [{
        keyword: 'inherited',
        terms: [{
          term: 'ember',
          lang: 'en',
          lang_name: 'English',
          children: [{
            keyword: 'from',
            terms: [{
              term: '*aimurją',
              lang: 'gem-pro',
              lang_name: 'Proto-Germanic',
              is_uncertain: true,
              children: [],
            }],
          }],
        }],
      }],
    }
    const result = parseWiktionaryResponse(page(`
      <div class="mw-heading mw-heading3"><h3 id="Etymology">Etymology</h3></div>
      <p>From an older Germanic form.</p>
      <ul data-ety-tree-json="${JSON.stringify(tree).replaceAll('"', '&quot;')}"></ul>
      <div class="mw-heading mw-heading3"><h3 id="Noun">Noun</h3></div>
      <ol><li>A glowing piece of coal.</li></ol>
    `))
    expect(result.lineages[0].term).toBe('ember')
    expect(result.lineages[0].ancestors[0].confidence).toBe('uncertain')
    expect(result.definition).toContain('glowing piece')
    expect(result.sourceUrl).toContain('oldid=42')
    const ids = flattenLineage(result.lineages[0]).map(({ node }) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('falls back to conservative language/form pairs when no graph exists', () => {
    const result = parseWiktionaryResponse(page(`
      <div class="mw-heading mw-heading3"><h3 id="Etymology">Etymology</h3></div>
      <p>From <span class="etyl">Old English</span> <i class="mention" lang="ang">ǣmerge</i>,
      from <span class="etyl">Proto-Germanic</span> <i class="mention" lang="gem-pro">*aimurją</i>.</p>
      <div class="mw-heading mw-heading3"><h3 id="Noun">Noun</h3></div>
      <ol><li>A glowing coal.</li></ol>
    `))
    expect(result.lineages[0].ancestors[0].term).toBe('ǣmerge')
    expect(result.lineages[0].ancestors[0].ancestors[0].term).toBe('*aimurją')
  })

  it('reads non-English language sections instead of discarding them', () => {
    const result = parseWiktionaryResponse({
      parse: {
        title: 'Thiago',
        text: `
          <div class="mw-heading mw-heading2"><h2 id="Portuguese">Portuguese</h2></div>
          <div class="mw-heading mw-heading3"><h3 id="Etymology">Etymology</h3></div>
          <p>Variant spelling of Tiago.</p>
          <div class="mw-heading mw-heading3"><h3 id="Proper_noun">Proper noun</h3></div>
          <ol><li><span class="form-of-definition">alternative spelling of
            <span class="form-of-definition-link"><a title="Tiago">Tiago</a></span>
          </span>; a male given name, equivalent to English
          <span lang="en"><a title="James">James</a></span>.</li></ol>
        `,
      },
    })
    expect(result.language).toBe('Portuguese')
    expect(result.definition).toContain('male given name')
    expect(result.lineages[0].ancestors[0].term).toBe('Tiago')
    expect(result.continuationTerm).toBe('Tiago')
    expect(result.relatedCandidates).toContainEqual(expect.objectContaining({ word: 'James', relation: 'name equivalent' }))
  })

  it('returns every documented language and keeps English first', () => {
    const lookup = parseWiktionaryLookup({
      parse: {
        title: 'amor',
        text: `
          <div class="mw-heading mw-heading2"><h2 id="Portuguese">Portuguese</h2></div>
          <div class="mw-heading mw-heading3"><h3 id="Noun">Noun</h3></div><ol><li>love</li></ol>
          <div class="mw-heading mw-heading2"><h2 id="English">English</h2></div>
          <div class="mw-heading mw-heading3"><h3 id="Noun">Noun</h3></div><ol><li>A god of love.</li></ol>
        `,
      },
    })
    expect(lookup.entries.map((entry) => entry.language)).toEqual(['English', 'Portuguese'])
  })

  it('joins a documented spelling variant to the ancestry on its main entry', () => {
    const variant = parseWiktionaryResponse({
      parse: {
        title: 'Thiago',
        text: `
          <div class="mw-heading mw-heading2"><h2 id="Portuguese">Portuguese</h2></div>
          <div class="mw-heading mw-heading3"><h3 id="Proper_noun">Proper noun</h3></div>
          <ol><li><span class="form-of-definition">alternative spelling of
            <span class="form-of-definition-link"><a title="Tiago">Tiago</a></span>
          </span></li></ol>
        `,
      },
    })
    const main = parseWiktionaryResponse({
      parse: {
        title: 'Tiago',
        text: `
          <div class="mw-heading mw-heading2"><h2 id="Portuguese">Portuguese</h2></div>
          <div class="mw-heading mw-heading3"><h3 id="Etymology">Etymology</h3></div>
          <p>From <span class="etyl">Portuguese</span> <i class="mention">Santiago</i>.</p>
        `,
      },
    })
    const merged = mergeContinuation(variant, main)
    expect(merged.lineages[0].ancestors[0].term).toBe('Tiago')
    expect(merged.lineages[0].ancestors[0].ancestors[0].term).toBe('Santiago')
    expect(merged.continuationSourceUrl).toBe(main.sourceUrl)
  })

  it('shows independently verified name equivalents before other family branches', async () => {
    const hebrew = { id: 'hebrew', term: 'יַעֲקֹב', language: 'Biblical Hebrew', langCode: 'hbo', confidence: 'documented', ancestors: [] } as EtymologyNode
    const entry: EtymologyEntry = {
      word: 'Thiago', language: 'Portuguese', definition: 'a name', etymologyText: '', sourceUrl: '#',
      lineages: [{
        id: 'thiago', term: 'Thiago', language: 'Portuguese', langCode: 'pt', confidence: 'documented', ancestors: [
          { id: 'latin', term: 'Iācōbus', language: 'Latin', langCode: 'la', confidence: 'documented', ancestors: [hebrew] },
        ],
      }],
      relatedCandidates: [
        { word: 'Iago', relation: 'doublet' },
        { word: 'James', relation: 'name equivalent' },
      ],
    }
    const responseFor = (title: string) => {
      const tree = {
        children: [{ terms: [{
          term: title, lang: 'en', lang_name: 'English', children: [{ terms: [{
            term: 'Iacobus', lang: 'la', lang_name: 'Latin', children: [{ terms: [{
              term: 'יַעֲקֹב', lang: 'hbo', lang_name: 'Biblical Hebrew', children: [],
            }] }],
          }] }],
        }] }],
      }
      return {
        ok: true,
        json: async () => ({ parse: { title, text: `
          <div class="mw-heading mw-heading2"><h2 id="English">English</h2></div>
          <div class="mw-heading mw-heading3"><h3 id="Etymology">Etymology</h3></div>
          <p>A documented name lineage.</p>
          <ul data-ety-tree-json="${JSON.stringify(tree).replaceAll('"', '&quot;')}"></ul>
        ` } }),
      }
    }
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const title = new URL(url).searchParams.get('page') || ''
      return responseFor(title)
    }))

    const family = await findEtymologyFamily(entry)
    expect(family.map((match) => match.word)).toEqual(['James', 'Iago'])
    expect(family[0].junction.term).toBe('Iācōbus')
    expect(family[0].oldestShared.term).toBe('יַעֲקֹב')
  })
})
