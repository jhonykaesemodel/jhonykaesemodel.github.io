import { useEffect, useRef } from 'react'
import { intensityAt } from '../physics/model'
import type { Detection, ExperimentSettings, InterpretationId } from '../types'

interface Props {
  settings: ExperimentSettings
  detections: Detection[]
  showAmplitude: boolean
  interpretation?: InterpretationId
}

const mint = '110, 220, 198'
const amber = '231, 177, 91'

export default function QuantumCanvas({ settings, detections, showAmplitude, interpretation }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const props = useRef({ settings, detections, showAmplitude, interpretation })
  props.current = { settings, detections, showAmplitude, interpretation }

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const context = element.getContext('2d')
    if (!context) return
    let frame = 0
    const observer = new ResizeObserver(() => resize())

    function resize() {
      if (!element || !context) return
      const rect = element.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      element.width = Math.round(rect.width * dpr)
      element.height = Math.round(rect.height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(timestamp: number) {
      if (!element || !context) return
      const { settings: current, detections: points, showAmplitude: amplitude, interpretation: lens } = props.current
      const width = element.clientWidth
      const height = element.clientHeight
      const compact = width < 720
      const sourceX = compact ? width * 0.11 : width * 0.12
      const barrierX = compact ? width * 0.43 : width * 0.46
      const screenX = compact ? width * 0.87 : width * 0.84
      const centerY = height * 0.5
      const slitGap = Math.min(height * 0.15, 84)
      const slitSize = Math.max(13, 27 - current.slitWidth * 5)
      const slitYs = [centerY - slitGap, centerY + slitGap]
      context.clearRect(0, 0, width, height)

      const glow = context.createRadialGradient(width * 0.52, centerY, 0, width * 0.52, centerY, width * 0.58)
      glow.addColorStop(0, 'rgba(28, 78, 69, .12)')
      glow.addColorStop(0.52, 'rgba(12, 29, 27, .035)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      if (amplitude) {
        context.save()
        context.beginPath()
        context.rect(barrierX + 2, 0, screenX - barrierX - 5, height)
        context.clip()
        context.globalCompositeOperation = 'lighter'
        slitYs.forEach((slitY, slitIndex) => {
          if ((current.slitMode === 'upper' && slitIndex === 1) || (current.slitMode === 'lower' && slitIndex === 0)) return
          for (let ring = 0; ring < 19; ring += 1) {
            const cycle = ((timestamp * 0.045 + ring * 21) % 400)
            context.beginPath()
            context.arc(barrierX, slitY, cycle, -Math.PI * 0.48, Math.PI * 0.48)
            const informationFade = 1 - current.distinguishability * 0.42
            context.strokeStyle = `rgba(${slitIndex ? amber : mint}, ${Math.max(0, 0.075 - cycle / 7000) * informationFade})`
            context.lineWidth = 1
            context.stroke()
          }
        })
        context.restore()
      }

      context.strokeStyle = 'rgba(205, 220, 214, .22)'
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(barrierX, 0)
      context.lineTo(barrierX, slitYs[0] - slitSize)
      context.moveTo(barrierX, slitYs[0] + slitSize)
      context.lineTo(barrierX, slitYs[1] - slitSize)
      context.moveTo(barrierX, slitYs[1] + slitSize)
      context.lineTo(barrierX, height)
      context.stroke()

      slitYs.forEach((y, index) => {
        const closed = (current.slitMode === 'upper' && index === 1) || (current.slitMode === 'lower' && index === 0)
        if (closed) {
          context.fillStyle = 'rgba(180,190,185,.22)'
          context.fillRect(barrierX - .5, y - slitSize, 1, slitSize * 2)
        } else {
          context.beginPath()
          context.moveTo(barrierX - 5, y)
          context.lineTo(barrierX + 5, y)
          context.strokeStyle = `rgba(${index ? amber : mint}, .8)`
          context.stroke()
        }
        if (current.distinguishability > 0.03 && !closed) {
          const radius = 8 + current.distinguishability * 8
          context.beginPath()
          context.arc(barrierX, y, radius, 0, Math.PI * 2)
          context.strokeStyle = `rgba(${index ? amber : mint}, ${0.12 + current.distinguishability * 0.5})`
          context.stroke()
        }
      })

      context.beginPath()
      context.arc(sourceX, centerY, 3.5, 0, Math.PI * 2)
      context.fillStyle = 'rgba(239, 235, 220, .9)'
      context.shadowColor = 'rgba(239,235,220,.8)'
      context.shadowBlur = 14
      context.fill()
      context.shadowBlur = 0

      context.beginPath()
      context.moveTo(screenX, height * 0.08)
      context.lineTo(screenX, height * 0.92)
      context.strokeStyle = 'rgba(222, 228, 221, .27)'
      context.stroke()

      let peak = 0
      for (let step = 0; step <= 180; step += 1) peak = Math.max(peak, intensityAt(step / 90 - 1, current))
      context.beginPath()
      for (let step = 0; step <= 180; step += 1) {
        const normalizedY = step / 90 - 1
        const y = centerY + normalizedY * height * 0.41
        const value = intensityAt(normalizedY, current) / Math.max(peak, 0.001)
        const x = screenX - 8 - value * (compact ? width * 0.11 : 76)
        if (step === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = `rgba(${mint}, .42)`
      context.lineWidth = 1.2
      context.stroke()

      const now = performance.now()
      points.forEach((point, index) => {
        const y = centerY + point.y * height * 0.41
        const age = now - point.bornAt
        const arrival = Math.min(1, age / 800)
        if (age < 900) {
          context.save()
          context.globalCompositeOperation = 'lighter'
          const activeSlits = current.slitMode === 'both' ? [0, 1] : [current.slitMode === 'upper' ? 0 : 1]
          const paths = lens === 'bohmian' && point.slitHint !== 0 ? [point.slitHint < 0 ? 0 : 1] : activeSlits
          paths.forEach((slit) => {
            context.beginPath()
            context.moveTo(sourceX, centerY)
            context.quadraticCurveTo(barrierX * 0.68, slitYs[slit], barrierX, slitYs[slit])
            context.quadraticCurveTo((barrierX + screenX) * 0.5, slitYs[slit], screenX, y)
            context.setLineDash([2, 7])
            context.strokeStyle = `rgba(${slit ? amber : mint}, ${0.12 * (1 - arrival)})`
            context.stroke()
          })
          context.restore()
        }
        if (arrival >= 0.95) {
          const jitter = ((point.id * 16807) % 17 - 8) * 0.35
          context.beginPath()
          context.arc(screenX + jitter, y, index > points.length - 12 ? 1.9 : 1.25, 0, Math.PI * 2)
          context.fillStyle = index > points.length - 12 ? 'rgba(239, 215, 166, .95)' : 'rgba(213, 228, 220, .42)'
          context.fill()
        }
      })

      if (lens === 'many-worlds' && points.length) {
        const last = points[points.length - 1]
        const y = centerY + last.y * height * 0.41
        for (let branch = -2; branch <= 2; branch += 1) {
          context.beginPath()
          context.moveTo(screenX + 4, y)
          context.quadraticCurveTo(screenX + 35, y, width, y + branch * 34)
          context.strokeStyle = `rgba(${mint}, ${0.06 - Math.abs(branch) * 0.008})`
          context.stroke()
        }
      }

      context.font = '9px ui-monospace, monospace'
      context.fillStyle = 'rgba(153, 168, 160, .5)'
      context.fillText('SOURCE', sourceX - 18, centerY + 30)
      context.fillText('TWO ALTERNATIVES', barrierX - 45, height - 21)
      context.fillText('EVENTS', screenX - 17, height - 21)
      frame = requestAnimationFrame(draw)
    }
    observer.observe(element)
    resize()
    frame = requestAnimationFrame(draw)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [])

  return <canvas ref={canvas} className="quantum-canvas" aria-label="Animated double-slit experiment showing probability amplitudes and accumulated detections" />
}
