import { motion } from 'framer-motion'
import { useFormStore } from '../../hooks/useFormStore'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'
import { Braces, PanelLeftClose, PanelLeftOpen, Settings2 } from 'lucide-react'

const sidebarVariants = { open: { width: '232px' }, closed: { width: '72px' } }
const transitionProps = { type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.22 }

const SECTION_STEPS = [
  { n: 1, label: 'Client', range: [0, 3], total: 4 },
  { n: 2, label: 'Project', range: [4, 7], total: 4 },
  { n: 3, label: 'Services', range: [8, 8], total: 1 },
  { n: 4, label: 'Export', range: [9, 11], total: 3 },
]

export default function WizardSidebar({
  microStep,
  totalSteps,
  collapsed,
  onToggleCollapse,
  onOpenBrand,
  onOpenJson,
}) {
  const { state } = useFormStore()
  const completeness = getQuoteCompleteness(state)
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <motion.aside
      className="wiz-sidebar"
      aria-label="Wizard sections"
      initial={collapsed ? 'closed' : 'open'}
      animate={collapsed ? 'closed' : 'open'}
      variants={sidebarVariants}
      transition={transitionProps}
      data-collapsed={collapsed || undefined}
    >
      <button
        className="wiz-sidebar-toggle"
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
      >
        <ToggleIcon size={16} strokeWidth={2.2} />
      </button>

      <nav className="wiz-section-list" aria-label="Quote progress">
        {SECTION_STEPS.map((section, index) => {
          const active = microStep >= section.range[0] && microStep <= section.range[1]
          const pastSection = microStep > section.range[1]
          const done = Boolean(completeness.steps[index]?.complete) && pastSection
          const isLast = index === SECTION_STEPS.length - 1

          return (
            <div
              key={section.n}
              className={[
                'wiz-section-item',
                active ? 'is-active' : '',
                done ? 'is-done' : '',
              ].filter(Boolean).join(' ')}
              aria-current={active ? 'step' : undefined}
              aria-label={`${section.label}${active ? ', current step' : done ? ', complete' : ''}`}
            >
              <div className="wiz-section-rail" aria-hidden="true">
                <span className="wiz-section-dot">
                  {done ? '✓' : section.n}
                </span>
                {!isLast && <span className="wiz-section-seg" />}
              </div>
              <div className="wiz-section-meta">
                <span className="wiz-section-label">{section.label}</span>
                {active && section.total > 1 && (
                  <span className="wiz-section-substep">
                    {microStep - section.range[0] + 1} / {section.total}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="wiz-sidebar-foot">
        <div className="wiz-sidebar-meter">
          {microStep + 1} / {totalSteps}
        </div>
        <button className="wiz-sidebar-action" type="button" onClick={onOpenBrand}>
          <Settings2 size={15} strokeWidth={2.2} aria-hidden="true" />
          <span>Brand settings</span>
        </button>
        <button className="wiz-sidebar-action" type="button" onClick={onOpenJson}>
          <Braces size={15} strokeWidth={2.2} aria-hidden="true" />
          <span>JSON</span>
        </button>
      </div>
    </motion.aside>
  )
}
