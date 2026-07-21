export type Phase='cell'|'nucleus'|'gene'|'transcribe'|'edit'|'translate'|'fold'
export const phases:Phase[]=['cell','nucleus','gene','transcribe','edit','translate','fold']
export const story=[
 {phase:'cell' as Phase,kicker:'10–100 µm',title:'Life keeps a border.',body:'A cell is not a bag of parts. Across its membrane, matter and messages are continuously exchanged.',note:'Shown as a generalized animal cell—not any one cell type.'},
 {phase:'nucleus' as Phase,kicker:'≈ 6 µm',title:'Nearly the same library. Different readers.',body:'Most cells in one body carry the same genome. What a cell becomes depends partly on which genes it uses, when, and how much.',note:'Identity also depends on history, environment, structure, and signals.'},
 {phase:'gene' as Phase,kicker:'one region of DNA',title:'A gene is made available.',body:'Regulatory proteins and DNA packaging help cellular machinery reach one useful stretch of sequence.',note:'DNA is regulated information—not a tiny, self-reading blueprint.'},
 {phase:'transcribe' as Phase,kicker:'seconds → minutes',title:'The message is copied.',body:'RNA polymerase moves along DNA and builds a temporary RNA transcript from complementary bases.',note:'The DNA remains in the nucleus; the RNA copy carries the sequence onward.'},
 {phase:'edit' as Phase,kicker:'inside the nucleus',title:'The first draft is edited.',body:'Selected segments are joined into mature messenger RNA. Protective features are added before export.',note:'This model shows splicing, while omitting many layers of RNA processing.'},
 {phase:'translate' as Phase,kicker:'outside the nucleus',title:'The message becomes matter.',body:'A ribosome reads three RNA letters at a time. Transfer RNAs deliver the corresponding amino acids.',note:'Codons specify amino acids or stop—not the final three-dimensional shape.'},
 {phase:'fold' as Phase,kicker:'nanometres',title:'A chain finds a working form.',body:'The amino-acid sequence folds, often with cellular help, into a protein that can move, signal, support, or catalyse.',note:'One gene can yield multiple RNAs and protein forms. Biology is a network, not an assembly line.'},
]
export const template='TACGGAATTCCTACT'
export const transcribe=(dna:string)=>dna.toUpperCase().replace(/[ATCG]/g,b=>({A:'U',T:'A',C:'G',G:'C'}[b]!))
export const codons=(rna:string)=>rna.match(/.{1,3}/g)??[]
const code:Record<string,string>={AUG:'Met',CCU:'Pro',UAA:'Stop',GGA:'Gly',UGA:'Stop'}
export const translate=(rna:string)=>codons(rna).map(c=>code[c]??'Amino acid')
export const nextPhase=(phase:Phase)=>phases[Math.min(phases.indexOf(phase)+1,phases.length-1)]
