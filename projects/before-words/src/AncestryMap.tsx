import { useMemo } from 'react'
import {
  layoutLineage,
  maxLineageDepth,
  type EtymologyEntry,
  type EtymologyNode,
  type PositionedNode,
} from './model'

interface Props {
  entry: EtymologyEntry
  lineage?: number
  revealDepth?: number
  activeDepth?: number
  lens?: 'form' | 'language' | 'certainty' | 'boundary'
  selectedId?: string
  onSelect?: (node: EtymologyNode) => void
  compact?: boolean
}

function edgePath(parent: PositionedNode, child: PositionedNode) {
  const bend = (parent.x + child.x) / 2
  return `M${parent.x - 12} ${parent.y} C${bend} ${parent.y},${bend} ${child.y},${child.x + 12} ${child.y}`
}

function NodeMark({
  item,
  selected,
  active,
  hidden,
  onSelect,
}: {
  item: PositionedNode
  selected: boolean
  active: boolean
  hidden: boolean
  onSelect?: (node: EtymologyNode) => void
}) {
  const { node, x, y, depth } = item
  return (
    <g
      className={`word-node ${node.confidence} ${selected ? 'selected' : ''} ${active ? 'active-depth' : ''} ${hidden ? 'unrevealed' : ''}`}
      transform={`translate(${x} ${y})`}
      role={!hidden && onSelect ? 'button' : undefined}
      tabIndex={!hidden && onSelect ? 0 : undefined}
      aria-hidden={hidden || undefined}
      aria-label={`${node.term}, ${node.language}, ${node.confidence}`}
      onClick={() => !hidden && onSelect?.(node)}
      onKeyDown={(event) => {
        if (!hidden && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onSelect?.(node)
        }
      }}
    >
      <circle r={depth === 0 ? 8 : 5} />
      <circle className="node-halo" r={depth === 0 ? 17 : 12} />
      <text className="node-term" y="-16">{node.term}</text>
      <text className="node-language" y="23">{node.language}</text>
      {node.confidence !== 'documented' && (
        <text className="node-status" x="9" y="-7">{node.confidence === 'uncertain' ? '?' : '*'}</text>
      )}
    </g>
  )
}

export default function AncestryMap({
  entry,
  lineage = 0,
  revealDepth,
  activeDepth,
  lens = 'form',
  selectedId,
  onSelect,
  compact = false,
}: Props) {
  const root = entry.lineages[lineage] ?? entry.lineages[0]
  const oldestDepth = maxLineageDepth(root)
  const visibleDepth = Math.min(revealDepth ?? oldestDepth, oldestDepth)
  const nodes = useMemo(() => layoutLineage(root, oldestDepth), [root, oldestDepth])
  const byId = new Map(nodes.map((item) => [item.node.id, item]))
  const depthX = (depth: number) => 1080 - 960 * (depth / Math.max(1, oldestDepth))

  return (
    <svg
      className={`ancestry-map lens-${lens} ${compact ? 'compact' : ''}`}
      viewBox="0 0 1200 680"
      role="group"
      aria-label={`Etymology ancestry of ${entry.word}`}
    >
      <defs>
        <linearGradient id="line-fade" x1="1" y1="0" x2="0" y2="0">
          <stop stopColor="#d9ae75" stopOpacity=".75" />
          <stop offset="1" stopColor="#d9ae75" stopOpacity=".12" />
        </linearGradient>
        <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g className="time-field" aria-hidden="true">
        {Array.from({ length: oldestDepth + 1 }, (_, depth) => (
          <g key={depth}>
            <line x1={depthX(depth)} x2={depthX(depth)} y1="68" y2="590" />
            <text x={depthX(depth)} y="52">
              {depth === 0 ? 'NOW' : depth === oldestDepth ? 'OLDEST MAPPED' : `OLDER · ${depth}`}
            </text>
          </g>
        ))}
      </g>
      {activeDepth !== undefined && (
        <g className="time-cursor" aria-hidden="true">
          <line x1={depthX(activeDepth)} x2={depthX(activeDepth)} y1="72" y2="590" />
          <circle cx={depthX(activeDepth)} cy="612" r="4" />
        </g>
      )}
      <g className="branches">
        {nodes.map((item) => {
          const parent = item.parentId ? byId.get(item.parentId) : undefined
          if (!parent) return null
          return (
            <path
              className={item.depth > visibleDepth ? 'unrevealed' : ''}
              key={`${parent.node.id}-${item.node.id}`}
              d={edgePath(parent, item)}
            />
          )
        })}
      </g>
      <g>
        {nodes.map((item) => (
          <NodeMark
            key={item.node.id}
            item={item}
            selected={selectedId === item.node.id}
            active={item.depth === activeDepth}
            hidden={item.depth > visibleDepth}
            onSelect={onSelect}
          />
        ))}
      </g>
      <g className="map-key" aria-hidden="true">
        <circle className="documented-key" cx="862" cy="652" r="4" />
        <text x="873" y="655">DOCUMENTED</text>
        <circle className="reconstructed-key" cx="970" cy="652" r="4" />
        <text x="981" y="655">RECONSTRUCTED *</text>
        <circle className="uncertain-key" cx="1110" cy="652" r="4" />
        <text x="1121" y="655">UNCERTAIN ?</text>
      </g>
    </svg>
  )
}
