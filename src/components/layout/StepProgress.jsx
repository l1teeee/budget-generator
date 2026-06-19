import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useProgressFill } from '../../hooks/useAnimations'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'

const STEPS = [
  { n: 1, label: 'Client' },
  { n: 2, label: 'Project' },
  { n: 3, label: 'Services' },
  { n: 4, label: 'Export' },
]

export default function StepProgress() {
  const { state, step, setStep } = useFormStore()
  const fillRef = useRef(null)
  const completeness = getQuoteCompleteness(state)
  const current = STEPS.find((item) => item.n === step)
  useProgressFill(fillRef, completeness.percent / 100)

  return (
    <div className="step-rail" aria-label="Budget progress">
      <div className="step-overview">
        <span className="step-overview-label">Step {step} of {STEPS.length}</span>
        <strong>{current?.label}</strong>
      </div>

      <div className="step-list">
        {STEPS.map(s => {
          const active = step === s.n
          const info = completeness.steps.find((item) => item.number === s.n)
          const done = info?.complete
          const needs = info?.status === 'partial'
          const empty = info?.status === 'missing'
          return (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={`step-button${active ? ' is-active' : ''}${done ? ' is-done' : ''}${needs ? ' is-needs' : ''}${empty ? ' is-empty' : ''}`}
            >
              <span className="step-number">
                {String(s.n).padStart(2, '0')}
              </span>
              <span className="step-label">
                {s.label}
              </span>
              <span className="step-state">
                {done ? 'Done' : needs ? 'Review' : 'Empty'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="step-track" aria-hidden>
        <div ref={fillRef} className="step-fill" />
      </div>
    </div>
  )
}
