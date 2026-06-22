import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useStepEntrance } from '../../hooks/useAnimations'
import StepHead from './StepHead'
import TerminalField from '../ui/TerminalField'
import StepNav from './StepNav'
import PDFButton from '../ui/PDFButton'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'

const TEMPLATES = [
  { id: 'ledger', name: 'Ledger', desc: 'tabular financial sheet' },
  { id: 'statement', name: 'Statement', desc: 'editorial block header' },
]
const ACTIVE_BORDER = '#7E98F2'
const SOFT_BORDER = 'rgba(92,99,122,0.24)'

export default function FormStep4({ previewRef, onOpenJson }) {
  const { state, update, setTemplate, goPrev } = useFormStore()
  const scope = useRef(null)
  useStepEntrance(scope)
  const completeness = getQuoteCompleteness(state)
  const ready = completeness.complete

  return (
    <div ref={scope} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepHead number={4} name="Export" hint="pick a layout / export pdf or json" />

      <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        <div data-animate style={{
          marginBottom: '22px',
          padding: '16px',
          background: ready ? '#EAEEFB' : '#F6F4EE',
          border: `1.5px solid ${SOFT_BORDER}`,
          borderRadius: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#565563' }}>
              Document status
            </span>
            <strong style={{ fontSize: '14px', color: '#16161D' }}>
              {ready ? 'Ready to export' : 'Missing required fields'}
            </strong>
          </div>
          {!ready && (
            <p style={{ margin: '10px 0 0', color: '#565563', lineHeight: 1.45, fontSize: '14px' }}>
              Complete {completeness.missingFields.length} required field{completeness.missingFields.length === 1 ? '' : 's'} before exporting PDF.
            </p>
          )}
        </div>

        <div data-animate style={{
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#565563',
          marginBottom: '12px',
        }}>
          Template selection
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
                  border: `1.5px solid ${active ? ACTIVE_BORDER : SOFT_BORDER}`,
                  background: active ? '#EAEEFB' : '#FCFBF8',
                  borderRadius: '16px',
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
                  border: `1px solid ${active ? ACTIVE_BORDER : SOFT_BORDER}`,
                  background: active ? '#AEC2FF' : '#ffffff',
                }}>
                  {active && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5L4 7.5L10 1" stroke="#16161D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '15px', fontWeight: 800, color: '#16161D' }}>
                    {t.name}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#565563', marginTop: '3px' }}>
                    {t.desc}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <TerminalField label="Notes" textarea value={state.notes}
          onChange={e => update('notes', e.target.value)} />

        <div data-animate style={{ margin: '20px 0 10px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#565563' }}>
          JSON import / export
        </div>
        <button
          data-animate
          onClick={onOpenJson}
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#16161D',
            background: '#EAEEFB',
            border: `1.5px solid ${SOFT_BORDER}`,
            borderRadius: '999px',
            padding: '9px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          {'{ }'} import / export json
        </button>
      </div>

      <div data-animate style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#565563' }}>
          PDF export
        </div>
        <PDFButton previewRef={previewRef} />
        <StepNav onPrev={goPrev} showNext={false} />
      </div>
    </div>
  )
}
