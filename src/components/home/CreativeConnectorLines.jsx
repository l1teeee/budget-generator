import { useEffect, useState } from 'react'
import OrganicGradientArrowPath from './OrganicGradientArrowPath'
import { buildRibbon, buildRibbonSpine } from './ribbon'

const COLORS = {
  left: ['#AEC2FF', '#C8D4FF', '#CBDDBD'],
  right: ['#AEC2FF', '#C8D4FF', '#F0CDB4'],
}

function opacityFor(active, hovered, dir) {
  if (active !== 'center') return active === dir ? 0.7 : 0.18
  return hovered === dir ? 0.75 : 0.5
}

function ribbonWidth(s, e) {
  const distance = Math.abs(e.x - s.x)

  return Math.max(20, Math.min(42, distance * 0.16))
}

function buildGradient(dir, s, e) {
  const [start, mid, end] = COLORS[dir]

  return {
    x1: s.x,
    y1: s.y,
    x2: e.x,
    y2: e.y,
    stops: [
      { offset: '0%', color: start, opacity: 0.96 },
      { offset: '54%', color: mid, opacity: 0.82 },
      { offset: '100%', color: end, opacity: 0.92 },
    ],
  }
}

function buildShape(dir, s, e, amp) {
  const options = {
    maxHalf: ribbonWidth(s, e),
    minHalf: 7,
    waveAmp: amp,
    samples: 46,
    asymmetry: dir === 'left' ? 0.18 : -0.18,
  }

  return {
    path: buildRibbon(s, e, options),
    spinePath: buildRibbonSpine(s, e, options),
    gradient: buildGradient(dir, s, e),
  }
}

export default function CreativeConnectorLines({ active, hovered, reduced }) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [paths, setPaths] = useState({ left: null, right: null })

  useEffect(() => {
    function compute() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      const hero = document.querySelector('.lk-hero')
      if (!hero) return
      const r = hero.getBoundingClientRect()
      const w = window.innerWidth
      const h = window.innerHeight
      const midY = r.top + r.height / 2

      const leftA = { x: 45, y: h / 2 }
      const rightA = { x: w - 45, y: h / 2 }

      const Ls = { x: r.left, y: midY }
      const Rs = { x: r.right, y: midY }

      const Le = { x: leftA.x + 12, y: leftA.y }
      const Re = { x: rightA.x - 12, y: rightA.y }

      const ampH = Math.min(34, Math.abs(Le.x - Ls.x) * 0.2)
      const ampHr = Math.min(34, Math.abs(Re.x - Rs.x) * 0.2)
      const left = buildShape('left', Ls, Le, ampH)
      const right = buildShape('right', Rs, Re, ampHr)

      setSize({ w, h })
      setPaths({ left, right })
    }

    const raf = window.requestAnimationFrame(compute)
    window.addEventListener('resize', compute)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', compute)
    }
  }, [active])

  if (!size.w) return null

  const dirs = ['left', 'right']
  return (
    <svg className="lk-connectors" width={size.w} height={size.h} viewBox={'0 0 ' + size.w + ' ' + size.h} aria-hidden="true">
      {dirs.map((dir) => (
        <OrganicGradientArrowPath
          key={dir}
          id={'lk-landing-' + dir + '-gradient'}
          className={'lk-organic-arrow--' + dir}
          path={paths[dir].path}
          spinePath={paths[dir].spinePath}
          gradient={paths[dir].gradient}
          opacity={opacityFor(active, hovered, dir)}
          isHovered={hovered === dir}
          reduced={reduced}
        />
      ))}
    </svg>
  )
}
