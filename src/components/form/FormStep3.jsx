import { useMemo, useRef, useState } from 'react'
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
        fontSize: '9px',
        fontWeight: 800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#565563',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#FCFBF8',
        border: '1.5px solid rgba(22,22,29,0.18)',
        borderRadius: '999px',
        padding: '9px 16px',
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
            fontSize: '13px',
            fontWeight: 800,
            color: '#16161D',
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#8A8794' }}>%</span>
      </div>
    </div>
  )
}

export default function FormStep3() {
  const { state, lineItems, totals, addCustomService, update, goNext, goPrev } = useFormStore()
  const scope = useRef(null)
  const [query, setQuery] = useState('')
  useStepEntrance(scope)

  const symbol = SYMBOLS[state.project.currency] || '$'
  const canProceed = lineItems.length > 0
  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return state.services
    return state.services.filter((service) => service.name.toLowerCase().includes(q))
  }, [query, state.services])

  const sub = { fontSize: '12px', fontWeight: 700, color: '#565563' }
  const subVal = { fontSize: '12px', fontWeight: 800, color: '#16161D', fontVariantNumeric: 'tabular-nums' }

  return (
    <div ref={scope} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepHead number={3} name="Services" hint="select line items / add your own" />

      <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        <div data-animate style={{ marginBottom: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px',
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#565563',
            }}>
              Predefined services
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#8A8794' }}>
              {state.services.filter((service) => service.selected).length} selected
            </span>
          </div>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            style={{
              width: '100%',
              height: '44px',
              marginBottom: '12px',
              padding: '0 16px',
              background: '#F6F4EE',
              border: '1.5px solid rgba(22,22,29,0.18)',
              borderRadius: '999px',
              fontSize: '14px',
              color: '#16161D',
            }}
          />

          {filteredServices.length > 0 ? (
            filteredServices.map(s => (
              <ServiceRow key={s.id} service={s} symbol={symbol} />
            ))
          ) : (
            <div style={{ padding: '14px 0', color: '#8A8794', fontWeight: 600 }}>
              No services match that search.
            </div>
          )}
        </div>

        <div data-animate style={{ marginTop: '18px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px',
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#565563',
            }}>
              Custom line items
            </span>
            <button
              onClick={addCustomService}
              style={{
                minHeight: '34px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#AEC2FF',
                background: '#16161D',
                borderRadius: '999px',
                padding: '0 14px',
              }}
            >
              add item
            </button>
          </div>

          {state.customServices.length > 0 ? (
            state.customServices.map(s => (
              <CustomServiceRow key={s.id} service={s} symbol={symbol} />
            ))
          ) : (
            <div style={{
              padding: '16px',
              color: '#565563',
              background: '#F6F4EE',
              border: '1.5px dashed rgba(22,22,29,0.22)',
              borderRadius: '16px',
              fontSize: '14px',
              lineHeight: 1.45,
            }}>
              Add a custom line item when the quote needs something outside the predefined catalog.
            </div>
          )}
        </div>

        <div data-animate style={{ display: 'flex', gap: '16px', marginTop: '26px' }}>
          <PctInput label="Discount" value={state.discount} onChange={e => update('discount', parseFloat(e.target.value) || 0)} />
          <PctInput label="Tax" value={state.taxRate} onChange={e => update('taxRate', parseFloat(e.target.value) || 0)} />
        </div>

        {canProceed && (
          <div data-animate style={{ position: 'sticky', bottom: 0, marginTop: '24px', background: '#FCFBF8', border: '1.5px solid #16161D', borderRadius: '16px', padding: '16px 18px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(22,22,29,0.16)' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16161D' }}>Total</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#16161D', fontVariantNumeric: 'tabular-nums' }}>{symbol}{fmt(totals.total)}</span>
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
