import { useMemo } from 'react'
import {
  findCommonAncestor,
  layoutLineage,
  nodeKey,
  type EtymologyEntry,
  type EtymologyNode,
  type PositionedNode,
} from './model'

interface Props {
  left: EtymologyEntry
  right?: EtymologyEntry | null
  leftLineage?: number
  rightLineage?: number
  maxDepth?: number
  lens?: 'form' | 'language' | 'certainty' | 'connection'
  selectedId?: string
  onSelect?: (node: EtymologyNode) => void
  compact?: boolean
}

function edgePath(parent: PositionedNode, child: PositionedNode) {
  const bend = (parent.y + child.y) / 2
  return `M${parent.x} ${parent.y - 16} C${parent.x} ${bend},${child.x} ${bend},${child.x} ${child.y + 16}`
}

function NodeMark({
  item,
  selected,
  shared,
  onSelect,
}: {
  item: PositionedNode
  selected: boolean
  shared: boolean
  onSelect?: (node: EtymologyNode) => void
}) {
  const { node, x, y, depth } = item
  return (
    <g
      className={`word-node ${node.confidence} ${selected ? 'selected' : ''} ${shared ? 'shared' : ''}`}
      transform={`translate(${x} ${y})`}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={`${node.term}, ${node.language}, ${node.confidence}`}
      onClick={() => onSelect?.(node)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.(node)
        }
      }}
    >
      <circle r={depth === 0 ? 8 : 5} />
      <circle className="node-halo" r={depth === 0 ? 17 : 12} />
      <text className="node-term" y={depth === 0 ? -19 : -15}>{node.term}</text>
      <text className="node-language" y={depth === 0 ? 27 : 22}>{node.language}</text>
      {node.confidence !== 'documented' && (
        <text className="node-status" x={9} y={-7}>{node.confidence === 'uncertain' ? '?' : '*'}</text>
      )}
    </g>
  )
}

function MapSide({
  nodes,
  selectedId,
  sharedKey,
  onSelect,
}: {
  nodes: PositionedNode[]
  selectedId?: string
  sharedKey?: string
  onSelect?: (node: EtymologyNode) => void
}) {
  const byId = new Map(nodes.map((item) => [item.node.id, item]))
  return (
    <>
      <g className="branches">
        {nodes.map((item) => {
          const parent = item.parentId ? byId.get(item.parentId) : undefined
          return parent ? <path key={`${parent.node.id}-${item.node.id}`} d={edgePath(parent, item)} /> : null
        })}
      </g>
      <g>
        {nodes.map((item) => (
          <NodeMark
            key={item.node.id}
            item={item}
            selected={selectedId === item.node.id}
            shared={Boolean(sharedKey && nodeKey(item.node) === sharedKey)}
            onSelect={onSelect}
          />
        ))}
      </g>
    </>
  )
}

export default function AncestryMap({
  left,
  right,
  leftLineage = 0,
  rightLineage = 0,
  maxDepth = 8,
  lens = 'connection',
  selectedId,
  onSelect,
  compact = false,
}: Props) {
  const leftRoot = left.lineages[leftLineage] ?? left.lineages[0]
  const rightRoot = right?.lineages[rightLineage] ?? right?.lineages[0]
  const leftNodes = useMemo(
    () => layoutLineage(leftRoot, rightRoot ? 80 : 210, rightRoot ? 430 : 780, maxDepth),
    [leftRoot, rightRoot, maxDepth],
  )
  const rightNodes = useMemo(
    () => rightRoot ? layoutLineage(rightRoot, 690, 430, maxDepth) : [],
    [rightRoot, maxDepth],
  )
  const common = findCommonAncestor(leftRoot, rightRoot)
  const leftCommon = common ? leftNodes.find((item) => nodeKey(item.node) === common.key) : undefined
  const rightCommon = common ? rightNodes.find((item) => nodeKey(item.node) === common.key) : undefined
  const generations = Array.from({ length: maxDepth + 1 }, (_, index) => index)

  return (
    <svg
      className={`ancestry-map lens-${lens} ${compact ? 'compact' : ''}`}
      viewBox="0 0 1200 680"
      role="img"
      aria-label={right
        ? `Etymology comparison between ${left.word} and ${right.word}`
        : `Etymology ancestry of ${left.word}`}
    >
      <defs>
        <linearGradient id="line-fade" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#d9ae75" stopOpacity=".75" />
          <stop offset="1" stopColor="#d9ae75" stopOpacity=".12" />
        </linearGradient>
        <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g className="time-field" aria-hidden="true">
        {generations.map((generation) => {
          const y = 610 - generation * 76
          return (
            <g key={generation}>
              <line x1="34" x2="1166" y1={y} y2={y} />
              <text x="35" y={y - 8}>{generation === 0 ? 'NOW' : `OLDER · ${generation}`}</text>
            </g>
          )
        })}
      </g>
      {rightRoot && <line className="compare-divider" x1="600" x2="600" y1="42" y2="640" />}
      {leftCommon && rightCommon && maxDepth >= Math.max(leftCommon.depth, rightCommon.depth) && (
        <g className="common-bridge" aria-label={`Shared ancestor ${leftCommon.node.term}`}>
          <path d={`M${leftCommon.x} ${leftCommon.y} C600 ${Math.min(leftCommon.y, rightCommon.y) - 55},600 ${Math.min(leftCommon.y, rightCommon.y) - 55},${rightCommon.x} ${rightCommon.y}`} />
          <circle cx="600" cy={Math.min(leftCommon.y, rightCommon.y) - 42} r="28" />
          <text x="600" y={Math.min(leftCommon.y, rightCommon.y) - 47}>SHARED FORM</text>
          <text className="common-term" x="600" y={Math.min(leftCommon.y, rightCommon.y) - 30}>{leftCommon.node.term}</text>
        </g>
      )}
      <MapSide nodes={leftNodes} selectedId={selectedId} sharedKey={common?.key} onSelect={onSelect} />
      {rightRoot && <MapSide nodes={rightNodes} selectedId={selectedId} sharedKey={common?.key} onSelect={onSelect} />}
      <g className="map-key" aria-hidden="true">
        <circle className="documented-key" cx="947" cy="652" r="4" />
        <text x="958" y="655">DOCUMENTED</text>
        <circle className="reconstructed-key" cx="1040" cy="652" r="4" />
        <text x="1051" y="655">RECONSTRUCTED *</text>
        <circle className="uncertain-key" cx="1152" cy="652" r="4" />
        <text x="1163" y="655">?</text>
      </g>
    </svg>
  )
}
