import { motion } from 'framer-motion'
import { container } from './motionVariants'

export default function ParallaxSection({ children, reduced, className = '' }) {
  return (
    <motion.div
      className={('lk-panel-inner scroll-thin ' + className).trim()}
      variants={container}
      initial={reduced ? 'show' : 'hidden'}
      animate="show"
    >
      {children}
    </motion.div>
  )
}
