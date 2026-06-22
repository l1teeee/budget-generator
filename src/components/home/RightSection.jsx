import { motion } from 'framer-motion'
import SideSection from './SideSection'
import { item } from './motionVariants'

const TYPES = [
  ['Services', 'Hourly or fixed'],
  ['Products', 'Unit pricing'],
  ['Retainer', 'Monthly scope'],
  ['Project', 'One-off build'],
]

const FEATURES = [
  'PDF & JSON export',
  'Live A4 preview',
  'Custom branding',
  'Ledger & Statement',
  'Multi-currency',
  'Reusable items',
]

export default function RightSection({ reduced }) {
  return (
    <SideSection eyebrow="What it covers" title="Built for real quotes." reduced={reduced}>
      <motion.p className="lk-panel-sub" variants={item}>Flexible pricing models for any kind of work.</motion.p>
      <motion.div className="lk-type-list" variants={item}>
        {TYPES.map(([t, s]) => (
          <div className="lk-type-row" key={t}>
            <span className="lk-type-name">{t}</span>
            <span className="lk-type-desc">{s}</span>
          </div>
        ))}
      </motion.div>
      <motion.div className="lk-feat-grid" variants={item}>
        {FEATURES.map((f) => (
          <span className="lk-feat-chip" key={f}>{f}</span>
        ))}
      </motion.div>
    </SideSection>
  )
}
