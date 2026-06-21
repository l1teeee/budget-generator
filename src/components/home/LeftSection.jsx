import { motion } from 'framer-motion'
import SideSection from './SideSection'
import { item } from './motionVariants'

const STEPS = [
  ['01', 'Enter details', 'Client & project'],
  ['02', 'Calculate', 'Add services & prices'],
  ['03', 'Review', 'Live A4 preview'],
  ['04', 'Export', 'PDF or JSON'],
]

const TAGS = ['Local-first', 'No account', 'Live preview']

export default function LeftSection({ reduced }) {
  return (
    <SideSection eyebrow="How it works" title="Four steps to a clean budget." reduced={reduced}>
      <motion.p className="lk-panel-sub" variants={item}>From a blank page to a billable quote in minutes.</motion.p>
      <motion.div className="lk-steps-strip" variants={item}>
        {STEPS.map(([n, name, status]) => (
          <div className="lk-stepx" key={n}>
            <span className="lk-stepx-n">{n}</span>
            <span className="lk-stepx-name">{name}</span>
            <span className="lk-stepx-status">{status}</span>
          </div>
        ))}
      </motion.div>
      <motion.p className="lk-panel-tags" variants={item}>
        {TAGS.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </motion.p>
      <motion.p className="lk-panel-note" variants={item}>Edit, duplicate and export any quote whenever you need it.</motion.p>
    </SideSection>
  )
}
