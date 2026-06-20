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
  'Ledger & Statement templates',
  'Live A4 preview',
  'Custom branding',
  'Multi-currency ready',
  'Reusable line items',
]

export default function RightSection({ reduced }) {
  return (
    <SideSection eyebrow="What it covers" title="Built for real quotes." reduced={reduced}>
      <motion.p className="lk-panel-sub" variants={item}>Flexible pricing models for any kind of work.</motion.p>
      <motion.div className="lk-panel-grid" variants={item}>
        {TYPES.map(([t, s]) => (
          <div className="lk-panel-card" key={t} role="group" tabIndex={0} aria-label={t + ': ' + s}>
            <strong>{t}</strong>
            <span>{s}</span>
          </div>
        ))}
      </motion.div>

      <motion.ul className="lk-panel-list" variants={item}>
        {FEATURES.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </motion.ul>
      <motion.p className="lk-panel-note" variants={item}>Switch templates anytime without losing your data.</motion.p>
    </SideSection>
  )
}
