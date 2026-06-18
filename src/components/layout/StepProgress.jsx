import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useProgressFill } from '../../hooks/useAnimations'

const STEPS = [
  { n: 1, label: 'client' },
  { n: 2, label: 'project' },
  { n: 3, label: 'services' },
  { n: 4, label: 'export' },
]

export default function StepProgress() {
  const { step, setStep } = useFormStore()
  const fillRef = useRef(null)
  useProgressFill(fillRef, step / STEPS.length)

  return (
    <div className="step-rail">
      <div className="step-track">
        <div ref={fillRef} className="step-fill" />
      </div>

      <div className="step-list">
        {STEPS.map(s => {
          const active = step === s.n
          const done = step > s.n
          return (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={`step-button${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}
            >
              <span className="step-number">
                {String(s.n).padStart(2, '0')}
              </span>
              <span className="step-label">
                {s.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
