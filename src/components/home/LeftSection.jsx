import { motion } from 'framer-motion'
import SideSection from './SideSection'
import { item } from './motionVariants'

const STEPS = [
  ['1', 'Enter details', 'Client & project'],
  ['2', 'Calculate', 'Add services & prices'],
  ['3', 'Review', 'Live A4 preview'],
  ['4', 'Export', 'PDF or JSON'],
]

export default function LeftSection({ reduced }) {
  return (
    <SideSection eyebrow="How it works" title="Four steps to a clean budget." reduced={reduced}>
      <motion.p className="lk-panel-sub" variants={item}>From a blank page to a billable quote in minutes.</motion.p>
      <motion.div className="lk-panel-grid" variants={item}>
        {STEPS.map(([n, name, status]) => (
          <div className="lk-step" key={n}>
            <span className="lk-step-n">{n}</span>
            <span className="lk-step-name">{name}</span>
            <span className="lk-step-status">{status}</span>
          </div>
        ))}
      </motion.div>

      <motion.div className="lk-panel-chips" variants={item}>
        <span className="lk-chip">Local-first</span>
        <span className="lk-chip">No account</span>
        <span className="lk-chip">Live preview</span>
      </motion.div>
      <motion.p className="lk-panel-note" variants={item}>Edit, duplicate and export any quote whenever you need it.</motion.p>
    </SideSection>
  )
}
