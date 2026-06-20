import { motion } from 'framer-motion'
import ParallaxSection from './ParallaxSection'
import { item } from './motionVariants'

export default function SideSection({ eyebrow, title, reduced, children }) {
  return (
    <ParallaxSection reduced={reduced}>
      <span className="lk-panel-accent lk-parallax" data-depth="0.18" aria-hidden="true" />
      <motion.p className="lk-eyebrow" variants={item}>{eyebrow}</motion.p>
      <motion.h2 className="lk-h2" variants={item}>{title}</motion.h2>
      {children}
    </ParallaxSection>
  )
}
