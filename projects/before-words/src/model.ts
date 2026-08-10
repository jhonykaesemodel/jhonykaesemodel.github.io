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
  language: string
  definition: string
  etymologyText: string
  revision?: number
  sourceUrl: string
  lineages: EtymologyNode[]
  notice?: string
  continuationTerm?: string
  continuationSourceUrl?: string
  relatedCandidates?: RelatedCandidate[]
}

export interface RelatedCandidate {
  word: string
  relation: 'doublet' | 'cognate' | 'name equivalent'
  langCode?: string
}

export interface SharedAncestry {
  junction: EtymologyNode
  oldestShared: EtymologyNode
  leftDepth: number
  rightDepth: number
}

export interface FamilyMatch extends SharedAncestry {
  word: string
  language: string
  relation: RelatedCandidate['relation']
  sourceUrl: string
}

export interface EtymologyLookup {
  requested: string
  entries: EtymologyEntry[]
  suggestions: string[]
}

export interface StoryMoment {
  title: string
  body: string
  note: string
  depth: number
  lens: 'form' | 'language' | 'certainty' | 'boundary'
}

export const story: StoryMoment[] = [
  {
    title: 'A word looks complete.',
    body: 'Father arrives in the mind as one familiar object: a sound, a spelling, and a meaning.',
    note: 'Present-day meaning is not the same thing as etymology.',
    depth: 0,
    lens: 'form',
  },
  {
    title: 'Move one voice backward.',
    body: 'Before father, English speakers inherited fader. Move again and the surviving form becomes fæder.',
    note: 'These historical forms are documented in surviving language records.',
    depth: 2,
    lens: 'form',
  },
  {
    title: 'The spelling keeps moving.',
    body: 'No person designed the whole path. Each generation received a word and changed it while using it.',
    note: 'Horizontal distance preserves ancestry order. It is not a calendar scale.',
    depth: 3,
    lens: 'language',
  },
  {
    title: 'Written evidence ends.',
    body: 'Beyond surviving texts, historical linguists infer older forms by comparing patterns across related languages.',
    note: 'An asterisk marks a reconstruction: supported indirectly, not found in a document.',
    depth: 4,
    lens: 'certainty',
  },
  {
    title: 'Reconstruction carries us farther.',
    body: 'The path reaches a proposed Proto-Indo-European ancestor, then branches into possible older pieces.',
    note: 'A question mark keeps scholarly uncertainty visible instead of pretending the trail is complete.',
    depth: 6,
    lens: 'certainty',
  },
  {
    title: 'Every trail has an edge.',
    body: 'Trace any English word or name backward, one step at a time, until the available evidence can take us no farther.',
    note: 'The path is a history of use—not a claim that a word has one timeless “true” meaning.',
    depth: 6,
    lens: 'boundary',
  },
]

export const nextStep = (step: number) => Math.min(step + 1, story.length - 1)

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

export function maxLineageDepth(root: EtymologyNode) {
  return flattenLineage(root).reduce((maximum, item) => Math.max(maximum, item.depth), 0)
}

export function primaryNodeAtDepth(root: EtymologyNode, depth: number) {
  let current = root
  for (let index = 0; index < depth && current.ancestors.length > 0; index += 1) {
    current = current.ancestors[0]
  }
  return current
}

export interface PositionedNode extends NodeAtDepth {
  instanceId: string
  x: number
  y: number
  parentInstanceId?: string
}

function leafCount(node: EtymologyNode, depth: number, maxDepth: number): number {
  if (depth >= maxDepth || node.ancestors.length === 0) return 1
  return node.ancestors.reduce((sum, child) => sum + leafCount(child, depth + 1, maxDepth), 0)
}

export function layoutLineage(
  root: EtymologyNode,
  maxDepth = 8,
  left = 120,
  right = 1080,
  top = 130,
  bottom = 520,
) {
  const leaves = leafCount(root, 0, maxDepth)
  let cursor = 0
  const nodes: PositionedNode[] = []
  const deepest = Math.max(1, Math.min(maxDepth, maxLineageDepth(root)))
  const visit = (node: EtymologyNode, depth: number, path: string, parentInstanceId?: string): number => {
    const instanceId = `${node.id}:${path}`
    const visibleChildren = depth < maxDepth ? node.ancestors : []
    let y: number
    if (visibleChildren.length === 0) {
      y = top + (bottom - top) * ((cursor + 0.5) / leaves)
      cursor += 1
    } else {
      const positions = visibleChildren.map((child, index) => visit(child, depth + 1, `${path}.${index}`, instanceId))
      y = positions.reduce((sum, value) => sum + value, 0) / positions.length
    }
    const x = right - (right - left) * (depth / deepest)
    nodes.push({ node, depth, instanceId, x, y, parentInstanceId })
    return y
  }
  visit(root, 0, '0')
  return nodes
}

export function countByConfidence(root: EtymologyNode) {
  return flattenLineage(root).reduce(
    (counts, { node }) => ({ ...counts, [node.confidence]: counts[node.confidence] + 1 }),
    { documented: 0, reconstructed: 0, uncertain: 0 } as Record<Confidence, number>,
  )
}

export function normalizeHistoricalForm(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/^[*†?]+/, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')
}

export function canonicalNodeKey(node: EtymologyNode) {
  const language = (node.langCode || node.language).toLocaleLowerCase().replace(/[^a-z0-9]+/g, '')
  return `${language}:${normalizeHistoricalForm(node.term)}`
}

export function findSharedAncestry(left: EtymologyNode, right: EtymologyNode): SharedAncestry | null {
  const leftNodes = flattenLineage(left)
  const rightByKey = new Map<string, NodeAtDepth[]>()
  flattenLineage(right).forEach((item) => {
    const key = canonicalNodeKey(item.node)
    rightByKey.set(key, [...(rightByKey.get(key) ?? []), item])
  })

  const shared = leftNodes.flatMap((leftItem) =>
    (rightByKey.get(canonicalNodeKey(leftItem.node)) ?? []).map((rightItem) => ({ leftItem, rightItem })),
  )
  if (shared.length === 0) return null

  const byNearestJunction = [...shared].sort((a, b) =>
    (a.leftItem.depth + a.rightItem.depth) - (b.leftItem.depth + b.rightItem.depth),
  )
  const byOldestEvidence = [...shared].sort((a, b) =>
    (b.leftItem.depth + b.rightItem.depth) - (a.leftItem.depth + a.rightItem.depth),
  )
  const junction = byNearestJunction[0]
  const oldest = byOldestEvidence[0]
  return {
    junction: junction.leftItem.node,
    oldestShared: oldest.leftItem.node,
    leftDepth: junction.leftItem.depth,
    rightDepth: junction.rightItem.depth,
  }
}
