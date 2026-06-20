import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const FADE = { duration: 0.22, ease: EASE }
const DRAW = { duration: 0.78, ease: EASE }

export default function OrganicGradientArrowPath({
  id,
  path,
  spinePath,
  gradient,
  opacity = 0.55,
  isHovered = false,
  reduced = false,
  className = '',
}) {
  if (!path || !spinePath || !gradient) {
    return null
  }

  const transform = reduced || !isHovered ? 'scale(1)' : 'scale(1.014, 1.025)'
  const animatedOpacity = reduced ? opacity : isHovered ? Math.min(opacity + 0.15, 0.78) : opacity

  return (
    <g className={('lk-organic-arrow ' + className).trim()}>
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={gradient.x1}
          y1={gradient.y1}
          x2={gradient.x2}
          y2={gradient.y2}
        >
          {gradient.stops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </linearGradient>
      </defs>

      <motion.path
        className="lk-organic-ribbon"
        d={path}
        fill={'url(#' + id + ')'}
        initial={{ opacity: 0 }}
        animate={{ opacity: animatedOpacity, transform }}
        transition={FADE}
      />
      <motion.path
        className="lk-organic-spine"
        d={spinePath}
        initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: reduced ? 0.18 : isHovered ? 0.28 : 0.18 }}
        transition={{ pathLength: reduced ? { duration: 0 } : DRAW, opacity: FADE }}
      />
    </g>
  )
}
