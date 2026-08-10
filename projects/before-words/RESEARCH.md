# Before Words — evidence model

## Learning transformation

- **Question:** How did one present form arrive here, and which apparently different words or names join the same historical family?
- **Misconception:** Similar spellings must be related, different spellings must be unrelated, and every word has one fixed, original “true meaning.”
- **Irreducible interaction:** Drag one word backward through the evidence, then unfold independently verified present-day branches that meet it at the same historical form and language.
- **Transformation:** Before, each word feels like a finished and isolated label. After interacting, the visitor can reason about inheritance, borrowing, shared junctions, reconstruction, uncertainty, and semantic change.
- **Boundary:** Ancestry order and source forms are evidence-led. Horizontal distance, color, and spacing are visual encodings rather than literal geography or calendar time.

## Claim ledger

| Claim | Source | Status | Implementation / disclosure |
|---|---|---|---|
| `father` passes through Middle English `fader`, Old English `fæder`, Germanic reconstructions, and PIE `*ph₂tḗr` | [English Wiktionary revision 91413694](https://en.wiktionary.org/w/index.php?title=father&oldid=91413694) | Source-described; PIE forms reconstructed | Guided graph; documented and reconstructed nodes use different marks |
| A leading asterisk marks an unattested, reconstructed form in historical linguistics | [Wiktionary glossary](https://en.wiktionary.org/wiki/Appendix:Glossary#reconstructed) | Scholarly convention | Asterisk legend and Evidence & limits panel |
| English Wiktionary data includes structured etymology relations that can be extracted by software | [Wiktextract paper](https://aclanthology.org/2022.lrec-1.140/) | Published system description | Live MediaWiki parsing with a conservative fallback |
| An English Wiktionary page may contain level-two entry sections for several languages | [Wiktionary entry layout](https://en.wiktionary.org/wiki/Wiktionary:Entry_layout#Language) | Editorial structure | Every available language section is parsed; the visitor chooses among them |
| `Thiago` is documented as a Portuguese alternative spelling of `Tiago`; the deeper ancestry is recorded on the `Tiago` entry | [Thiago](https://en.wiktionary.org/wiki/Thiago#Portuguese), [Tiago](https://en.wiktionary.org/wiki/Tiago#Portuguese) | Source-described | The two source paths are joined and both revision links remain visible |
| Portuguese `Tiago` and English `James` descend through the Jacob name family, including Latin and Greek forms from Biblical Hebrew `יַעֲקֹב` | [Tiago](https://en.wiktionary.org/wiki/Tiago#Portuguese), [James](https://en.wiktionary.org/wiki/James#English) | Source-described; ultimate interpretation of the Hebrew name remains an etymological analysis | The app retrieves both entries independently and shows the family link only when their structured traces share a normalized form and language |
| Wiktextract can capture descendant relations as well as etymology | [Wiktextract documentation](https://github.com/tatuylonen/wiktextract) | Tool capability; source coverage varies | The client uses explicit doublet/cognate/name-equivalent links as candidates, then verifies them against both ancestry graphs rather than assuming a relationship |
| Wiktionary entry text is reusable with attribution under CC BY-SA / GFDL | [Wiktionary copyrights](https://en.wiktionary.org/wiki/Wiktionary:Copyrights) | License | Revision links on every result and attribution in Evidence & limits |

## Runtime behavior

Searches call the English Wiktionary MediaWiki API directly from the visitor’s browser. That edition contains entries for hundreds of languages; every level-two language section available for a spelling is offered in the interface. No query passes through this site, and no search history is persisted. A structured etymology tree is preferred. When it is absent, only explicit language/form pairs or a documented form-of relationship are mapped.

Family discovery begins only with explicit doublet, cognate, related-form, or name-equivalent links in the retrieved entry. Each candidate is then fetched independently. A family branch is displayed only if both graphs contain the same normalized historical form in the same language; normalization removes presentation differences such as macrons and Hebrew pointing but never ignores language. The interface distinguishes the nearest shared junction from the oldest shared form still mapped by both sources. This improves consistency, but it cannot prove an ultimate origin: dictionary coverage is incomplete, multiple etymologies can be valid, and evidence may end at different depths.

When an exact title is absent, the app offers nearby dictionary spellings but does not treat them as relatives. When no supported evidence is available, the app stops rather than inferring a lineage.
