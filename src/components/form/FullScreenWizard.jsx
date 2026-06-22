import { useRef, useState } from 'react'
import '../../wizard.css'
import { useFormStore } from '../../hooks/useFormStore'
import TemplatePreview from '../preview/TemplatePreview'
import JsonPanel from './JsonPanel'
import BrandDrawer from './BrandDrawer'
import WizardSidebar from './WizardSidebar'
import WizardFieldView from './WizardFieldView'

const TOTAL_MICRO_STEPS = 12
const STEP_START = { 1: 0, 2: 4, 3: 8, 4: 9 }
const SECTIONS_MAP = [
  { label: 'Client', range: [0, 3] },
  { label: 'Project', range: [4, 7] },
  { label: 'Services', range: [8, 8] },
  { label: 'Export', range: [9, 11] },
]

function getStepLabel(ms) {
  const section = SECTIONS_MAP.find((s) => ms >= s.range[0] && ms <= s.range[1])
  return section ? section.label : ''
}

export default function FullScreenWizard({ onHome }) {
  const { step } = useFormStore()
  const [microStep, setMicroStep] = useState(() => STEP_START[step] ?? 0)
  const [direction, setDirection] = useState(1)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [brandOpen, setBrandOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const previewRef = useRef(null)

  const goNext = () => {
    setDirection(1)
    setMicroStep((s) => Math.min(s + 1, TOTAL_MICRO_STEPS - 1))
  }

  const goPrev = () => {
    if (microStep === 0) {
      onHome()
      return
    }

    setDirection(-1)
    setMicroStep((s) => Math.max(s - 1, 0))
  }

  return (
    <div className={`wiz${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <WizardSidebar
        microStep={microStep}
        totalSteps={TOTAL_MICRO_STEPS}
        collapsed={sidebarCollapsed}
        onHome={onHome}
        onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
        onOpenBrand={() => setBrandOpen(true)}
        onOpenJson={() => setJsonOpen(true)}
      />

      <main className="wiz-main" aria-label="Budget wizard">
        {microStep > 0 && (
          <button className="wiz-back" type="button" onClick={goPrev}>
            Back
          </button>
        )}
        <div className="wiz-progress">
          <span className="wiz-progress-section">{getStepLabel(microStep)}</span>
          <span>{microStep + 1} / {TOTAL_MICRO_STEPS}</span>
        </div>

        <WizardFieldView
          microStep={microStep}
          direction={direction}
          onNext={goNext}
          onPrev={goPrev}
          previewRef={previewRef}
          onOpenJson={() => setJsonOpen(true)}
        />

        <div className="wiz-hidden-preview" aria-hidden="true">
          <TemplatePreview previewRef={previewRef} />
        </div>
      </main>

      {jsonOpen && <JsonPanel open onClose={() => setJsonOpen(false)} />}
      {brandOpen && <BrandDrawer open onClose={() => setBrandOpen(false)} />}
    </div>
  )
}
