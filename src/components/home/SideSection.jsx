import { motion } from 'framer-motion'
import ParallaxSection from './ParallaxSection'
import { item } from './motionVariants'

export default function SideSection({ eyebrow, title, reduced, children }) {
  return (
    <ParallaxSection reduced={reduced}>
      <motion.p className="lk-eyebrow" variants={item}>{eyebrow}</motion.p>
      <motion.h2 className="lk-h2" variants={item}>{title}</motion.h2>
      {children}
    </ParallaxSection>
  )
}
