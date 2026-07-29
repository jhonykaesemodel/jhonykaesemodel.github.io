# Before Words — evidence model

## Learning transformation

- **Question:** How did a present English form arrive here, and where does its evidence meet another word’s path?
- **Misconception:** Every word has one fixed, original “true meaning.”
- **Irreducible interaction:** Trace two forms backward until the nearest shared mapped ancestor appears.
- **Transformation:** Before, a word feels like a finished label. After interacting, the visitor can reason about inheritance, borrowing, reconstruction, uncertainty, and semantic change.
- **Boundary:** Ancestry order and source forms are evidence-led. Vertical distance, color, spacing, and the shared-form bridge are visual encodings rather than literal geography or calendar time.

## Claim ledger

| Claim | Source | Status | Implementation / disclosure |
|---|---|---|---|
| `father` passes through Middle English `fader`, Old English `fæder`, Germanic reconstructions, and PIE `*ph₂tḗr` | [English Wiktionary revision 91413694](https://en.wiktionary.org/w/index.php?title=father&oldid=91413694) | Source-described; PIE forms reconstructed | Guided graph; documented and reconstructed nodes use different marks |
| `paternal` entered English through Old French and Latin formations based on `pater` | [English Wiktionary revision 91140994](https://en.wiktionary.org/w/index.php?title=paternal&oldid=91140994) | Source-described | Guided comparison graph |
| A leading asterisk marks an unattested, reconstructed form in historical linguistics | [Wiktionary glossary](https://en.wiktionary.org/wiki/Appendix:Glossary#reconstructed) | Scholarly convention | Asterisk legend and Evidence & limits panel |
| English Wiktionary data includes structured etymology relations that can be extracted by software | [Wiktextract paper](https://aclanthology.org/2022.lrec-1.140/) | Published system description | Live MediaWiki parsing with a conservative fallback |
| Wiktionary entry text is reusable with attribution under CC BY-SA / GFDL | [Wiktionary copyrights](https://en.wiktionary.org/wiki/Wiktionary:Copyrights) | License | Revision links on every result and attribution in Evidence & limits |

## Runtime behavior

Searches call the English Wiktionary MediaWiki API directly from the visitor’s browser. No query passes through this site, and no search history is persisted. A structured etymology tree is preferred. When it is absent, only explicit language/form pairs rendered in the etymology section are mapped. When neither is available, the app stops rather than inferring a lineage.
