import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const DRAW = { duration: 1.1, ease: EASE }
const FADE = { duration: 0.5, ease: EASE }

const END_COLOR = { left: '#CBDDBD', right: '#F0CDB4' }

function wavyH(s, e, amp) {
  const dx = e.x - s.x
  const x1 = s.x + dx * 0.33
  const x2 = s.x + dx * 0.66
  const y1 = s.y + amp
  const y2 = e.y - amp
  return 'M ' + s.x + ' ' + s.y
    + ' C ' + (s.x + dx * 0.16) + ' ' + s.y + ', ' + (x1 - dx * 0.16) + ' ' + y1 + ', ' + x1 + ' ' + y1
    + ' S ' + (x2 - dx * 0.16) + ' ' + y2 + ', ' + x2 + ' ' + y2
    + ' S ' + (e.x - dx * 0.16) + ' ' + e.y + ', ' + e.x + ' ' + e.y
}

export default function SectionConnectorLine({ direction, reduced }) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [path, setPath] = useState('')
  const [grad, setGrad] = useState(null)

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
      const amp = Math.min(22, Math.abs(e.x - s.x) * 0.18)

      setSize({ w, h })
      setPath(wavyH(s, e, amp))
      setGrad({ x1: s.x, y1: s.y, x2: e.x, y2: e.y })
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

  if (!size.w || !path || !grad) return null

  const color = END_COLOR[direction] || '#AEC2FF'
  return (
    <svg className="lk-section-lines" width={size.w} height={size.h} viewBox={'0 0 ' + size.w + ' ' + size.h} aria-hidden="true">
      <defs>
        <linearGradient id="lksecgrad" gradientUnits="userSpaceOnUse" x1={grad.x1} y1={grad.y1} x2={grad.x2} y2={grad.y2}>
          <stop offset="0" stopColor="#AEC2FF" />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <motion.path
        className="lk-connector"
        d={path}
        stroke="url(#lksecgrad)"
        initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ pathLength: reduced ? { duration: 0 } : DRAW, opacity: FADE }}
      />
    </svg>
  )
}
