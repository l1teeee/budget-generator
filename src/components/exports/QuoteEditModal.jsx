import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormStore } from '../../hooks/useFormStore'
import ServiceRow from '../form/ServiceRow'
import CustomServiceRow from '../form/CustomServiceRow'
import DocLedger from '../preview/DocLedger'
import DocStatement from '../preview/DocStatement'
import { DatePicker } from '../ui/heroui-date-picker'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import './QuoteEditModal.css'

const CURRENCIES = ['USD', 'EUR', 'MXN', 'GBP']
const SYMBOLS = { USD: '$', EUR: '€', MXN: '$', GBP: '£' }
const TEMPLATE_OPTIONS = [
  { id: 'ledger', name: 'Ledger', desc: 'Tabular financial sheet' },
  { id: 'statement', name: 'Statement', desc: 'Editorial block header' },
]

function isoToDateValue(value) {
  const [year, month, day] = String(value || '').split('-')
  if (!year || !month || !day) return null
  return {
    month: String(Number(month)),
    day: String(Number(day)),
    year,
    iso: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
  }
}

const fmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

export default function QuoteEditModal({ onClose }) {
  const navigate = useNavigate()
  const {
    state,
    update,
    addCustomService,
    setTemplate,
    lineItems,
    totals,
  } = useFormStore()

  const symbol = SYMBOLS[state.project.currency] || '$'

  const previewWrapRef = useRef(null)
  const [previewScale, setPreviewScale] = useState(0.4)

  useEffect(() => {
    const el = previewWrapRef.current
    if (!el) return
    const compute = () => {
      const { width, height } = el.getBoundingClientRect()
      const scaleW = width / 794
      const scaleH = height / 1123
      setPreviewScale(Math.min(scaleW, scaleH) * 0.96)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const previewData = {
    brand: state.brand,
    meta: state.meta,
    client: state.client,
    project: state.project,
    totals,
    lineItems,
    notes: state.notes,
  }

  const handleExport = () => {
    onClose()
    navigate('/wizard')
  }

  return (
    <div className="eq-overlay" role="dialog" aria-modal="true" aria-label="Edit quote">
      <div className="eq-header">
        <div className="eq-header-left">
          <button className="eq-back" onClick={onClose} aria-label="Close">
            ←
          </button>
          <span className="eq-header-title">Edit Quote</span>
        </div>
        <div className="eq-header-actions">
          <button className="eq-btn-export" onClick={handleExport}>
            Export
          </button>
          <button className="eq-btn-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>

      <div className="eq-body">
        <div className="eq-fields scroll-thin">

          {/* Client */}
          <section className="eq-section">
            <div className="eq-section-label">Client</div>
            <div className="eq-field-grid">
              <div className="eq-field">
                <Label className="eq-label" htmlFor="eq-client-name">Name</Label>
                <Input
                  id="eq-client-name"
                  className="eq-input"
                  type="text"
                  value={state.client.name}
                  placeholder="Jane Client"
                  onChange={(e) => update('client.name', e.target.value)}
                />
              </div>
              <div className="eq-field">
                <Label className="eq-label" htmlFor="eq-client-email">Email</Label>
                <Input
                  id="eq-client-email"
                  className="eq-input"
                  type="email"
                  value={state.client.email}
                  placeholder="jane@company.com"
                  onChange={(e) => update('client.email', e.target.value)}
                />
              </div>
              <div className="eq-field">
                <Label className="eq-label" htmlFor="eq-client-company">Company</Label>
                <Input
                  id="eq-client-company"
                  className="eq-input"
                  type="text"
                  value={state.client.company}
                  placeholder="Acme Studio"
                  onChange={(e) => update('client.company', e.target.value)}
                />
              </div>
              <div className="eq-field">
                <Label className="eq-label" htmlFor="eq-client-phone">Phone</Label>
                <Input
                  id="eq-client-phone"
                  className="eq-input"
                  type="tel"
                  value={state.client.phone}
                  placeholder="+1 555 0100"
                  onChange={(e) => update('client.phone', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Project */}
          <section className="eq-section">
            <div className="eq-section-label">Project</div>
            <div className="eq-field-grid">
              <div className="eq-field eq-field--full">
                <Label className="eq-label" htmlFor="eq-project-title">Title</Label>
                <Input
                  id="eq-project-title"
                  className="eq-input"
                  type="text"
                  value={state.project.title}
                  placeholder="Website redesign"
                  onChange={(e) => update('project.title', e.target.value)}
                />
              </div>
              <div className="eq-field eq-field--full">
                <Label className="eq-label" htmlFor="eq-project-desc">Description</Label>
                <textarea
                  id="eq-project-desc"
                  className="eq-textarea"
                  value={state.project.description}
                  placeholder="Short summary of deliverables, timeline, and scope."
                  rows={3}
                  onChange={(e) => update('project.description', e.target.value)}
                />
              </div>
              <div className="eq-field">
                <Label className="eq-label">Valid until</Label>
                <DatePicker
                  label="Valid until"
                  value={isoToDateValue(state.project.validUntil)}
                  onChange={(next) => update('project.validUntil', next?.iso || '')}
                />
              </div>
              <div className="eq-field">
                <Label className="eq-label">Currency</Label>
                <div className="eq-currency-pills" role="radiogroup" aria-label="Currency">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={state.project.currency === c}
                      className={`eq-pill${state.project.currency === c ? ' is-active' : ''}`}
                      onClick={() => update('project.currency', c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="eq-section">
            <div className="eq-section-label">Services</div>

            <div className="eq-services-head">
              <span className="eq-services-title">Predefined services</span>
              <span className="eq-services-count">
                {state.services.filter((s) => s.selected).length} selected
              </span>
            </div>
            {state.services.map((service) => (
              <ServiceRow key={service.id} service={service} symbol={symbol} />
            ))}

            <div className="eq-services-head" style={{ marginTop: 16 }}>
              <span className="eq-services-title">Custom line items</span>
              <button className="eq-add-item" type="button" onClick={addCustomService}>
                + Add item
              </button>
            </div>
            {state.customServices.length > 0 ? (
              state.customServices.map((service) => (
                <CustomServiceRow key={service.id} service={service} symbol={symbol} />
              ))
            ) : (
              <div className="eq-services-empty">
                Add a custom line item when the quote needs something outside the catalog.
              </div>
            )}

            <div className="eq-adjustments">
              <div className="eq-adjust-field">
                <Label className="eq-label" htmlFor="eq-discount">Discount</Label>
                <div className="eq-adjust-control">
                  <Input
                    id="eq-discount"
                    className="eq-input"
                    type="number"
                    min="0"
                    max="100"
                    value={state.discount || ''}
                    placeholder="0"
                    onChange={(e) => update('discount', parseFloat(e.target.value) || 0)}
                  />
                  <span className="eq-adjust-unit">%</span>
                </div>
              </div>
              <div className="eq-adjust-field">
                <Label className="eq-label" htmlFor="eq-tax">Tax</Label>
                <div className="eq-adjust-control">
                  <Input
                    id="eq-tax"
                    className="eq-input"
                    type="number"
                    min="0"
                    max="100"
                    value={state.taxRate || ''}
                    placeholder="0"
                    onChange={(e) => update('taxRate', parseFloat(e.target.value) || 0)}
                  />
                  <span className="eq-adjust-unit">%</span>
                </div>
              </div>
            </div>

            <div className="eq-totals">
              <div className="eq-total-row">
                <span>Subtotal</span>
                <strong>{symbol}{fmt(totals.subtotal)}</strong>
              </div>
              {totals.discountAmount > 0 && (
                <div className="eq-total-row">
                  <span>Discount {totals.discountPct}%</span>
                  <strong>-{symbol}{fmt(totals.discountAmount)}</strong>
                </div>
              )}
              {totals.taxAmount > 0 && (
                <div className="eq-total-row">
                  <span>Tax {totals.taxPct}%</span>
                  <strong>{symbol}{fmt(totals.taxAmount)}</strong>
                </div>
              )}
              <div className="eq-total-row is-grand">
                <span>Total</span>
                <strong>{symbol}{fmt(totals.total)}</strong>
              </div>
            </div>
          </section>

          {/* Export settings */}
          <section className="eq-section">
            <div className="eq-section-label">Export</div>
            <div className="eq-template-options">
              {TEMPLATE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`eq-template-btn${state.template === t.id ? ' is-active' : ''}`}
                  onClick={() => setTemplate(t.id)}
                >
                  <span className="eq-template-check" aria-hidden="true">
                    {state.template === t.id ? '✓' : ''}
                  </span>
                  <span>
                    <span className="eq-template-name">{t.name}</span>
                    <span className="eq-template-desc">{t.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="eq-field eq-field--full" style={{ marginTop: 16 }}>
              <Label className="eq-label" htmlFor="eq-notes">Notes</Label>
              <textarea
                id="eq-notes"
                className="eq-textarea"
                value={state.notes}
                placeholder="Payment terms, assumptions, exclusions, or next steps."
                rows={4}
                onChange={(e) => update('notes', e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* Live preview */}
        <div className="eq-preview">
          <div className="eq-preview-label">Live preview</div>
          <div className="eq-preview-wrap" ref={previewWrapRef}>
            <div
              className="eq-preview-doc"
              style={{ transform: `scale(${previewScale})` }}
            >
              {state.template === 'statement' ? (
                <DocStatement data={previewData} />
              ) : (
                <DocLedger data={previewData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
