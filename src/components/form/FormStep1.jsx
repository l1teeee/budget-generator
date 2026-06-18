import { useRef, useState } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useStepEntrance } from '../../hooks/useAnimations'
import StepHead from './StepHead'
import TerminalField from '../ui/TerminalField'
import StepNav from './StepNav'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function FormStep1() {
  const { state, update, goNext } = useFormStore()
  const scope = useRef(null)
  const [errors, setErrors] = useState({})
  useStepEntrance(scope)

  const c = state.client

  const handleNext = () => {
    const next = {}
    if (!c.name.trim()) next.name = true
    if (!EMAIL.test(c.email)) next.email = true
    setErrors(next)
    if (Object.keys(next).length === 0) goNext()
  }

  return (
    <div ref={scope} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepHead number={1} name="Client" hint="who receives this quote" />

      <div style={{ flex: 1 }}>
        <TerminalField label="Full name" required value={c.name} error={errors.name}
          onChange={e => update('client.name', e.target.value)} />
        <TerminalField label="Email" type="email" required mono value={c.email} error={errors.email}
          onChange={e => update('client.email', e.target.value)} />
        <TerminalField label="Company" value={c.company}
          onChange={e => update('client.company', e.target.value)} />
        <TerminalField label="Phone" type="tel" mono value={c.phone}
          onChange={e => update('client.phone', e.target.value)} />
      </div>

      <div style={{ marginTop: '24px' }}>
        <StepNav onNext={handleNext} showPrev={false} />
      </div>
    </div>
  )
}
