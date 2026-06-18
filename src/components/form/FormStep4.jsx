import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useStepEntrance } from '../../hooks/useAnimations'
import StepHead from './StepHead'
import TerminalField from '../ui/TerminalField'
import StepNav from './StepNav'
import PDFButton from '../ui/PDFButton'

const TEMPLATES = [
  { id: 'ledger', name: 'Ledger', desc: 'tabular financial sheet' },
  { id: 'statement', name: 'Statement', desc: 'editorial block header' },
]

export default function FormStep4({ previewRef, onOpenJson }) {
  const { state, update, setTemplate, goPrev } = useFormStore()
  const scope = useRef(null)
  useStepEntrance(scope)

  return (
    <div ref={scope} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepHead number={4} name="Export" hint="pick a layout / export pdf or json" />

      <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        <div data-animate style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#53627a',
          marginBottom: '12px',
        }}>
          Template
        </div>

        <div data-animate style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '26px' }}>
          {TEMPLATES.map(t => {
            const active = state.template === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  border: `1px solid ${active ? '#061b3d' : '#dce6f4'}`,
                  background: active ? '#061b3d' : '#ffffff',
                  borderRadius: '14px',
                  boxShadow: active ? '0 14px 30px -24px rgba(2,8,23,0.78)' : '0 10px 24px -24px rgba(2,8,23,0.34)',
                }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  flexShrink: 0,
                  borderRadius: '7px',
                  border: active ? '1px solid #ffffff' : '1px solid #bdcbe0',
                  background: '#ffffff',
                }}>
                  {active && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5L4 7.5L10 1" stroke="#061b3d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 600, color: active ? '#ffffff' : '#061124' }}>
                    {t.name}
                  </span>
                  <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: active ? '#b8c8e2' : '#8795ad', marginTop: '3px', letterSpacing: '0.03em' }}>
                    {t.desc}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <TerminalField label="Notes" textarea value={state.notes}
          onChange={e => update('notes', e.target.value)} />

        <button
          data-animate
          onClick={onOpenJson}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#061b3d',
            background: '#eaf1fb',
            borderRadius: '999px',
            padding: '9px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px',
            boxShadow: '0 10px 24px -24px rgba(2,8,23,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dcecff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#eaf1fb' }}
        >
          {'{ }'} import / export json
        </button>
      </div>

      <div data-animate style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <PDFButton previewRef={previewRef} />
        <StepNav onPrev={goPrev} showNext={false} />
      </div>
    </div>
  )
}
