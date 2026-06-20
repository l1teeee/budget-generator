import { motion } from 'framer-motion'

const ARROWS = {
  right: 'M4 12 H18 M12.5 6.5 L18 12 L12.5 17.5',
  left: 'M20 12 H6 M11.5 6.5 L6 12 L11.5 17.5',
  down: 'M12 4 V18 M6.5 12.5 L12 18 L17.5 12.5',
  up: 'M12 20 V6 M6.5 11.5 L12 6 L17.5 11.5',
}

const HOVER_SHIFT = {
  left: { x: -2 },
  right: { x: 2 },
  down: { y: 2 },
  up: { y: -2 },
}

export default function MinimalSvgArrowButton({ direction, ariaLabel, onClick, onHover, className = '' }) {
  return (
    <motion.button
      type="button"
      className={('lk-arrow lk-arrow--' + direction + ' ' + className).trim()}
      aria-label={ariaLabel}
      onClick={onClick}
      onHoverStart={() => onHover && onHover(direction)}
      onHoverEnd={() => onHover && onHover(null)}
      onFocus={() => onHover && onHover(direction)}
      onBlur={() => onHover && onHover(null)}
      initial={{ opacity: 0.55 }}
      whileHover={{ opacity: 0.85, scale: 1.03, ...HOVER_SHIFT[direction] }}
      whileFocus={{ opacity: 0.85 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <svg
        className="lk-arrow-ico"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={ARROWS[direction]} />
      </svg>
    </motion.button>
  )
}
