import { useEffect, useRef, useState } from 'react'
import OrganicGradientArrowPath from './OrganicGradientArrowPath'
import { buildConnectorCurve } from './ribbon'

const COLORS = {
  left: ['#AEC2FF', '#C8D4FF', '#CBDDBD'],
  right: ['#AEC2FF', '#C8D4FF', '#F0CDB4'],
}

function opacityFor(active, hovered, dir) {
  if (active !== 'center') return active === dir ? 0.7 : 0.18
  return hovered === dir ? 0.78 : 0.55
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
      { offset: '54%', color: mid, opacity: 0.84 },
      { offset: '100%', color: end, opacity: 0.92 },
    ],
  }
}

function buildShape(dir, s, e, amp, phase) {
  const options = {
    waveAmp: amp,
    waves: 3.1,
    samples: 84,
    asymmetry: dir === 'left' ? 0.16 : -0.16,
    phase: (dir === 'left' ? 0 : Math.PI * 0.3) + phase,
  }

  return {
    linePath: buildConnectorCurve(s, e, options),
    gradient: buildGradient(dir, s, e),
  }
}

function buildPaths(geom, phase, ampMul) {
  return {
    left: buildShape('left', geom.left.s, geom.left.e, geom.left.amp * ampMul, phase),
    right: buildShape('right', geom.right.s, geom.right.e, geom.right.amp * ampMul, -phase),
  }
}

export default function CreativeConnectorLines({ active, hovered, reduced }) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [paths, setPaths] = useState({ left: null, right: null })
  const geom = useRef(null)

  // measure the geometry (endpoints + amplitude) on mount / resize / nav
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

      // start a little inside the hero so the end tucks under the panel
      const Ls = { x: r.left + 30, y: midY }
      const Rs = { x: r.right - 30, y: midY }

      const Le = { x: leftA.x + 12, y: leftA.y }
      const Re = { x: rightA.x - 12, y: rightA.y }

      const ampH = Math.min(64, Math.abs(Le.x - Ls.x) * 0.46)
      const ampHr = Math.min(64, Math.abs(Re.x - Rs.x) * 0.46)

      geom.current = {
        left: { s: Ls, e: Le, amp: ampH },
        right: { s: Rs, e: Re, amp: ampHr },
      }

      setSize({ w, h })
      setPaths(buildPaths(geom.current, 0, 1))
    }

    const raf = window.requestAnimationFrame(compute)
    window.addEventListener('resize', compute)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', compute)
    }
  }, [active])

  // gentle continuous undulation so the lines feel alive, not static
  useEffect(() => {
    if (reduced || active !== 'center') return undefined

    let raf = 0
    let start = 0

    function tick(ts) {
      if (!start) start = ts
      const t = (ts - start) / 1000
      const phase = Math.sin(t * 0.45) * 1.15 + t * 0.12
      const ampMul = 1 + Math.sin(t * 0.7) * 0.08

      if (geom.current) {
        setPaths(buildPaths(geom.current, phase, ampMul))
      }

      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [reduced, active])

  if (!size.w || !paths.left) return null

  const dirs = ['left', 'right']
  return (
    <svg className="lk-connectors" width={size.w} height={size.h} viewBox={'0 0 ' + size.w + ' ' + size.h} aria-hidden="true">
      {dirs.map((dir) => (
        <OrganicGradientArrowPath
          key={dir}
          id={'lk-landing-' + dir + '-gradient'}
          className={'lk-organic-arrow--' + dir}
          linePath={paths[dir].linePath}
          gradient={paths[dir].gradient}
          strokeWidth={52}
          opacity={opacityFor(active, hovered, dir)}
          isHovered={hovered === dir}
          reduced={reduced}
        />
      ))}
    </svg>
  )
}
