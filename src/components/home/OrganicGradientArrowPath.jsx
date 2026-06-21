import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const FADE = { duration: 0.22, ease: EASE }
const DRAW = { duration: 0.78, ease: EASE }

export default function OrganicGradientArrowPath({
  id,
  linePath,
  gradient,
  strokeWidth = 30,
  opacity = 0.55,
  isHovered = false,
  reduced = false,
  className = '',
}) {
  if (!linePath || !gradient) {
    return null
  }

  const animatedOpacity = reduced ? opacity : isHovered ? Math.min(opacity + 0.15, 0.85) : opacity
  const width = reduced || !isHovered ? strokeWidth : strokeWidth + 3

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

      {/* base layer: wider, blurred, low opacity -> depth behind the defined line */}
      <motion.path
        className="lk-organic-line lk-organic-line--glow"
        d={linePath}
        fill="none"
        stroke={'url(#' + id + ')'}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: animatedOpacity * 0.55, strokeWidth: width + 24 }}
        transition={{ opacity: FADE, strokeWidth: FADE }}
      />
      {/* top layer: the defined pastel-gradient stroke */}
      <motion.path
        className="lk-organic-line"
        d={linePath}
        fill="none"
        stroke={'url(#' + id + ')'}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0, pathLength: reduced ? 1 : 0 }}
        animate={{ opacity: animatedOpacity, pathLength: 1, strokeWidth: width }}
        transition={{ pathLength: reduced ? { duration: 0 } : DRAW, opacity: FADE, strokeWidth: FADE }}
      />
    </g>
  )
}
