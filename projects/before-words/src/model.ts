export type Confidence = 'documented' | 'reconstructed' | 'uncertain'

export interface EtymologyNode {
  id: string
  term: string
  language: string
  langCode?: string
  relation?: string
  confidence: Confidence
  ancestors: EtymologyNode[]
}

export interface EtymologyEntry {
  word: string
  definition: string
  etymologyText: string
  revision?: number
  sourceUrl: string
  lineages: EtymologyNode[]
  notice?: string
}

export interface StoryMoment {
  title: string
  body: string
  note: string
  depth: number
  compare: boolean
  lens: 'form' | 'language' | 'certainty' | 'connection'
}

export const story: StoryMoment[] = [
  {
    title: 'A word looks complete.',
    body: 'Father arrives in the mind as one familiar object: a sound, a spelling, and a meaning.',
    note: 'Present-day meaning is not the same thing as etymology.',
    depth: 0,
    compare: false,
    lens: 'form',
  },
  {
    title: 'But another word is underneath.',
    body: 'Before father, English speakers inherited fader. Before that, speakers wrote fæder.',
    note: 'These historical forms are documented in surviving language records.',
    depth: 2,
    compare: false,
    lens: 'form',
  },
  {
    title: 'Languages carry the form.',
    body: 'No person designed the whole path. Each generation received a word and changed it while using it.',
    note: 'The vertical distance is ordered history, not a literal timescale.',
    depth: 5,
    compare: false,
    lens: 'language',
  },
  {
    title: 'Eventually, writing ends.',
    body: 'Older forms marked with an asterisk are reconstructions: explanations inferred by comparing related languages.',
    note: 'Reconstructed does not mean imagined; it means supported indirectly rather than written down.',
    depth: 7,
    compare: false,
    lens: 'certainty',
  },
  {
    title: 'A second path approaches.',
    body: 'Paternal entered English through French and Latin. Father traveled through Germanic speech. Their paths converge deeper down.',
    note: 'Words can share ancestry without one being borrowed directly from the other.',
    depth: 7,
    compare: true,
    lens: 'connection',
  },
  {
    title: 'Language is a braided inheritance.',
    body: 'Search any English word or name. Compare two paths. When evidence stops or scholars disagree, the map will say so.',
    note: 'The source graph is evidence—not a claim that a word has one timeless “true” meaning.',
    depth: 7,
    compare: true,
    lens: 'connection',
  },
]

export const nextStep = (step: number) => Math.min(step + 1, story.length - 1)

export function normalizeTerm(term: string) {
  return term
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/^[*†‡]+/, '')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .toLocaleLowerCase('en')
}

export function nodeKey(node: Pick<EtymologyNode, 'term' | 'language' | 'langCode'>) {
  return `${node.langCode || node.language.toLocaleLowerCase('en')}::${normalizeTerm(node.term)}`
}

export interface NodeAtDepth {
  node: EtymologyNode
  depth: number
}

export function flattenLineage(root: EtymologyNode, maxDepth = Number.POSITIVE_INFINITY) {
  const output: NodeAtDepth[] = []
  const visit = (node: EtymologyNode, depth: number) => {
    if (depth > maxDepth) return
    output.push({ node, depth })
    node.ancestors.forEach((ancestor) => visit(ancestor, depth + 1))
  }
  visit(root, 0)
  return output
}

export interface CommonAncestor {
  key: string
  left: NodeAtDepth
  right: NodeAtDepth
}

export function findCommonAncestor(left?: EtymologyNode, right?: EtymologyNode): CommonAncestor | null {
  if (!left || !right) return null
  const rightNodes = new Map(flattenLineage(right).map((item) => [nodeKey(item.node), item]))
  const matches = flattenLineage(left)
    .filter((item) => item.depth > 0)
    .map((item) => ({ key: nodeKey(item.node), left: item, right: rightNodes.get(nodeKey(item.node)) }))
    .filter((item): item is CommonAncestor => Boolean(item.right))
    .sort((a, b) => (a.left.depth + a.right.depth) - (b.left.depth + b.right.depth))
  return matches[0] ?? null
}

export interface PositionedNode extends NodeAtDepth {
  x: number
  y: number
  parentId?: string
}

function leafCount(node: EtymologyNode, depth: number, maxDepth: number): number {
  if (depth >= maxDepth || node.ancestors.length === 0) return 1
  return node.ancestors.reduce((sum, child) => sum + leafCount(child, depth + 1, maxDepth), 0)
}

export function layoutLineage(
  root: EtymologyNode,
  xStart: number,
  width: number,
  maxDepth = 8,
  bottom = 610,
  step = 76,
) {
  const leaves = leafCount(root, 0, maxDepth)
  let cursor = 0
  const nodes: PositionedNode[] = []
  const visit = (node: EtymologyNode, depth: number, parentId?: string): number => {
    const visibleChildren = depth < maxDepth ? node.ancestors : []
    let x: number
    if (visibleChildren.length === 0) {
      x = xStart + width * ((cursor + 0.5) / leaves)
      cursor += 1
    } else {
      const positions = visibleChildren.map((child) => visit(child, depth + 1, node.id))
      x = positions.reduce((sum, value) => sum + value, 0) / positions.length
    }
    nodes.push({ node, depth, x, y: bottom - depth * step, parentId })
    return x
  }
  visit(root, 0)
  return nodes
}

export function countByConfidence(root: EtymologyNode) {
  return flattenLineage(root).reduce(
    (counts, { node }) => ({ ...counts, [node.confidence]: counts[node.confidence] + 1 }),
    { documented: 0, reconstructed: 0, uncertain: 0 } as Record<Confidence, number>,
  )
}
