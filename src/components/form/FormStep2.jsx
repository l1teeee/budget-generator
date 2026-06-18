import { useRef, useState } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useStepEntrance } from '../../hooks/useAnimations'
import StepHead from './StepHead'
import TerminalField from '../ui/TerminalField'
import StepNav from './StepNav'

const CURRENCIES = ['USD', 'EUR', 'MXN', 'GBP']

export default function FormStep2() {
  const { state, update, goNext, goPrev } = useFormStore()
  const scope = useRef(null)
  const [errors, setErrors] = useState({})
  useStepEntrance(scope)

  const p = state.project

  const handleNext = () => {
    const next = {}
    if (!p.title.trim()) next.title = true
    if (!p.validUntil) next.validUntil = true
    setErrors(next)
    if (Object.keys(next).length === 0) goNext()
  }

  return (
    <div ref={scope} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepHead number={2} name="Project" hint="what you are quoting" />

      <div style={{ flex: 1 }}>
        <TerminalField label="Project title" required value={p.title} error={errors.title}
          onChange={e => update('project.title', e.target.value)} />
        <TerminalField label="Description" textarea value={p.description}
          onChange={e => update('project.description', e.target.value)} />
        <TerminalField label="Valid until" type="date" required mono value={p.validUntil} error={errors.validUntil}
          onChange={e => update('project.validUntil', e.target.value)} />

        <div data-animate style={{ marginBottom: '20px' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#53627a',
            marginBottom: '10px',
          }}>
            Currency
          </div>
          <div style={{ display: 'flex', gap: '6px', width: 'fit-content', background: '#ffffff', border: '1px solid #d7e1ee', borderRadius: '999px', padding: '4px', boxShadow: '0 12px 26px -24px rgba(2,8,23,0.45)' }}>
            {CURRENCIES.map((code) => {
              const active = p.currency === code
              return (
                <button
                  key={code}
                  onClick={() => update('project.currency', code)}
                  style={{
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    color: active ? '#ffffff' : '#53627a',
                    background: active ? '#061b3d' : 'transparent',
                    boxShadow: active ? '0 10px 22px -18px rgba(2,8,23,0.7)' : 'none',
                  }}
                >
                  {code}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <StepNav onNext={handleNext} onPrev={goPrev} />
      </div>
    </div>
  )
}
