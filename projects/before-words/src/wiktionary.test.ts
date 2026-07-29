import { describe, expect, it } from 'vitest'
import { parseWiktionaryResponse } from './wiktionary'

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

  it('reports entries without an English section', () => {
    expect(() => parseWiktionaryResponse({
      parse: { title: 'x', text: '<h2 id="Latin">Latin</h2>' },
    })).toThrow(/no English entry/)
  })
})
