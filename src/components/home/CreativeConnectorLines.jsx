import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const DRAW = { duration: 1.1, ease: EASE }
const FADE = { duration: 0.5, ease: EASE }

function opacityFor(active, hovered, dir) {
  if (active !== 'center') return active === dir ? 0.7 : 0.18
  return hovered === dir ? 0.75 : 0.5
}

/* horizontal travel (s -> e), gentle double wave in Y */
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

export default function CreativeConnectorLines({ active, hovered, reduced }) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [paths, setPaths] = useState({ left: '', right: '' })

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

      const ampH = Math.min(22, Math.abs(Le.x - Ls.x) * 0.18)
      const ampHr = Math.min(22, Math.abs(Re.x - Rs.x) * 0.18)

      const left = wavyH(Ls, Le, ampH)
      const right = wavyH(Rs, Re, ampHr)

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
        <motion.path
          key={dir}
          className={'lk-connector lk-connector--' + dir}
          d={paths[dir]}
          initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: opacityFor(active, hovered, dir) }}
          transition={{ pathLength: reduced ? { duration: 0 } : DRAW, opacity: FADE }}
        />
      ))}
    </svg>
  )
}
