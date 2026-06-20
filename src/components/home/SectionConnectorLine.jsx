import { useEffect, useState } from 'react'
import OrganicGradientArrowPath from './OrganicGradientArrowPath'
import { buildRibbon, buildRibbonSpine } from './ribbon'

const COLORS = {
  left: ['#CBDDBD', '#DDEBCF', '#AEC2FF'],
  right: ['#F0CDB4', '#F7DDCC', '#AEC2FF'],
}

function buildGradient(direction, s, e) {
  const [start, mid, end] = COLORS[direction] || COLORS.left

  return {
    x1: s.x,
    y1: s.y,
    x2: e.x,
    y2: e.y,
    stops: [
      { offset: '0%', color: start, opacity: 0.9 },
      { offset: '48%', color: mid, opacity: 0.78 },
      { offset: '100%', color: end, opacity: 0.88 },
    ],
  }
}

function buildShape(direction, s, e, amp) {
  const distance = Math.abs(e.x - s.x)
  const options = {
    maxHalf: Math.max(18, Math.min(38, distance * 0.14)),
    minHalf: 6,
    waveAmp: amp,
    samples: 44,
    asymmetry: direction === 'left' ? -0.12 : 0.12,
  }

  return {
    path: buildRibbon(s, e, options),
    spinePath: buildRibbonSpine(s, e, options),
    gradient: buildGradient(direction, s, e),
  }
}

export default function SectionConnectorLine({ direction, reduced, isHovered = false }) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [shape, setShape] = useState(null)

  useEffect(() => {
    function compute() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      const inner = document.querySelector('.lk-panel-inner')
      if (!inner) return
      const r = inner.getBoundingClientRect()
      const w = window.innerWidth
      const h = window.innerHeight
      const midY = h / 2

      let s
      let e
      if (direction === 'left') {
        s = { x: r.right, y: r.top + r.height / 2 }
        e = { x: w - 55, y: midY }
      } else {
        s = { x: r.left, y: r.top + r.height / 2 }
        e = { x: 55, y: midY }
      }
      const amp = Math.min(30, Math.abs(e.x - s.x) * 0.18)

      setSize({ w, h })
      setShape(buildShape(direction, s, e, amp))
    }

    const raf = window.requestAnimationFrame(compute)
    const t = window.setTimeout(compute, 750)
    window.addEventListener('resize', compute)
    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.removeEventListener('resize', compute)
    }
  }, [direction])

  if (!size.w || !shape) return null

  return (
    <svg className="lk-section-lines" width={size.w} height={size.h} viewBox={'0 0 ' + size.w + ' ' + size.h} aria-hidden="true">
      <OrganicGradientArrowPath
        id={'lk-section-' + direction + '-gradient'}
        className={'lk-organic-arrow--section lk-organic-arrow--section-' + direction}
        path={shape.path}
        spinePath={shape.spinePath}
        gradient={shape.gradient}
        opacity={0.52}
        isHovered={isHovered}
        reduced={reduced}
      />
    </svg>
  )
}
