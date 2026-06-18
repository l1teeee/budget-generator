import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useStepEntrance } from '../../hooks/useAnimations'
import StepHead from './StepHead'
import ServiceRow from './ServiceRow'
import CustomServiceRow from './CustomServiceRow'
import StepNav from './StepNav'

const SYMBOLS = { USD: '$', EUR: '\u20ac', MXN: '$', GBP: '\u00a3' }
const fmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

function PctInput({ label, value, onChange }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#53627a',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#ffffff',
        border: '1px solid #d7e1ee',
        borderRadius: '999px',
        padding: '9px 16px',
        boxShadow: '0 10px 24px -24px rgba(2,8,23,0.42)',
      }}>
        <input
          type="number"
          min="0"
          max="100"
          value={value || ''}
          placeholder="0"
          onChange={onChange}
          style={{
            width: '46px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            color: '#061124',
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#8795ad' }}>%</span>
      </div>
    </div>
  )
}

export default function FormStep3() {
  const { state, lineItems, totals, addCustomService, update, goNext, goPrev } = useFormStore()
  const scope = useRef(null)
  useStepEntrance(scope)

  const symbol = SYMBOLS[state.project.currency] || '$'
  const canProceed = lineItems.length > 0

  const sub = { fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#53627a' }
  const subVal = { fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#061b3d', fontVariantNumeric: 'tabular-nums' }

  return (
    <div ref={scope} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepHead number={3} name="Services" hint="select line items / add your own" />

      <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        <div data-animate>
          {state.services.map(s => (
            <ServiceRow key={s.id} service={s} symbol={symbol} />
          ))}
        </div>

        {state.customServices.length > 0 && (
          <div data-animate style={{ marginTop: '12px' }}>
            {state.customServices.map(s => (
              <CustomServiceRow key={s.id} service={s} symbol={symbol} />
            ))}
          </div>
        )}

        <button
          data-animate
          onClick={addCustomService}
          style={{
            marginTop: '10px',
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
            boxShadow: '0 10px 24px -24px rgba(2,8,23,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dcecff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#eaf1fb' }}
        >
          + add custom service
        </button>

        <div data-animate style={{ display: 'flex', gap: '16px', marginTop: '26px' }}>
          <PctInput label="Discount" value={state.discount} onChange={e => update('discount', parseFloat(e.target.value) || 0)} />
          <PctInput label="Tax" value={state.taxRate} onChange={e => update('taxRate', parseFloat(e.target.value) || 0)} />
        </div>

        {canProceed && (
          <div data-animate style={{ marginTop: '24px', background: '#ffffff', border: '1px solid #dce6f4', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 12px 28px -24px rgba(2,8,23,0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span style={sub}>subtotal</span>
              <span style={subVal}>{symbol}{fmt(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span style={sub}>discount {totals.discountPct}%</span>
                <span style={subVal}>-{symbol}{fmt(totals.discountAmount)}</span>
              </div>
            )}
            {totals.taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span style={sub}>tax {totals.taxPct}%</span>
                <span style={subVal}>{symbol}{fmt(totals.taxAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #dce6f4' }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#061124' }}>Total</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', fontWeight: 500, color: '#061b3d', fontVariantNumeric: 'tabular-nums' }}>{symbol}{fmt(totals.total)}</span>
            </div>
          </div>
        )}

        {!canProceed && (
          <div data-animate style={{ marginTop: '18px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8795ad', letterSpacing: '0.04em' }}>
            select at least one line item to continue
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <StepNav onNext={goNext} onPrev={goPrev} nextDisabled={!canProceed} />
      </div>
    </div>
  )
}
