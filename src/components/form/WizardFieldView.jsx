import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useFormStore } from '../../hooks/useFormStore'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'
import ServiceRow from './ServiceRow'
import CustomServiceRow from './CustomServiceRow'
import PDFButton from '../ui/PDFButton'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { DatePicker } from '../ui/heroui-date-picker'

const CURRENCIES = ['USD', 'EUR', 'MXN', 'GBP']
const SYMBOLS = { USD: '$', EUR: '\u20ac', MXN: '$', GBP: '\u00a3' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TEMPLATE_OPTIONS = [
  { id: 'ledger', name: 'Ledger', desc: 'Tabular financial sheet' },
  { id: 'statement', name: 'Statement', desc: 'Editorial block header' },
]

const MICRO_STEPS = [
  {
    eyebrow: 'Client',
    question: "What is the client's name?",
    path: 'client.name',
    type: 'text',
    placeholder: 'Jane Client',
    label: 'Client name',
    required: true,
    error: 'Add the client name.',
  },
  {
    eyebrow: 'Client',
    question: 'What email should appear on the quote?',
    path: 'client.email',
    type: 'email',
    placeholder: 'jane@company.com',
    label: 'Client email',
    required: true,
    error: 'Add a valid email address.',
    validate: (value) => EMAIL.test(String(value || '').trim()),
  },
  {
    eyebrow: 'Client',
    question: 'What company is this for?',
    path: 'client.company',
    type: 'text',
    placeholder: 'Acme Studio',
    label: 'Company',
    hint: 'Optional. Leave blank for individual clients.',
    required: false,
  },
  {
    eyebrow: 'Client',
    question: 'What phone number should be listed?',
    path: 'client.phone',
    type: 'tel',
    placeholder: '+1 555 0100',
    label: 'Phone number',
    hint: 'Optional. Use the format your client expects.',
    required: false,
  },
  {
    eyebrow: 'Project',
    question: 'What should this project be called?',
    path: 'project.title',
    type: 'text',
    placeholder: 'Website redesign',
    label: 'Project title',
    required: true,
    error: 'Add a project title.',
  },
  {
    eyebrow: 'Project',
    question: 'How would you describe the scope?',
    path: 'project.description',
    type: 'textarea',
    placeholder: 'Short summary of deliverables, timeline, and scope.',
    label: 'Project scope',
    hint: 'Optional. This appears in the PDF overview.',
    required: false,
  },
  {
    eyebrow: 'Project',
    question: 'Until what date is the quote valid?',
    path: 'project.validUntil',
    type: 'date',
    placeholder: '',
    label: 'Valid until',
    required: true,
    error: 'Choose a valid date.',
  },
]

const fmt = (number) => Number(number).toLocaleString('en-US', { maximumFractionDigits: 0 })

function readPath(source, path) {
  return path.split('.').reduce((current, key) => current?.[key], source)
}

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

function PercentInput({ label, value, onChange }) {
  const id = useId()

  return (
    <div className="wiz-percent-field">
      <Label className="wiz-percent-label" htmlFor={id}>{label}</Label>
      <div className="wiz-percent-control">
        <Input
          id={id}
          className="wiz-percent-input"
          type="number"
          min="0"
          max="100"
          value={value || ''}
          placeholder="0"
          onChange={onChange}
        />
        <span>%</span>
      </div>
    </div>
  )
}

function TotalBox({ totals, symbol }) {
  return (
    <div className="wiz-total-box">
      <div className="wiz-total-row">
        <span>Subtotal</span>
        <strong>{symbol}{fmt(totals.subtotal)}</strong>
      </div>
      {totals.discountAmount > 0 && (
        <div className="wiz-total-row">
          <span>Discount {totals.discountPct}%</span>
          <strong>-{symbol}{fmt(totals.discountAmount)}</strong>
        </div>
      )}
      {totals.taxAmount > 0 && (
        <div className="wiz-total-row">
          <span>Tax {totals.taxPct}%</span>
          <strong>{symbol}{fmt(totals.taxAmount)}</strong>
        </div>
      )}
      <div className="wiz-total-row is-grand">
        <span>Total</span>
        <strong>{symbol}{fmt(totals.total)}</strong>
      </div>
    </div>
  )
}

export default function WizardFieldView({ microStep, direction, onNext, previewRef, onOpenJson }) {
  const {
    state,
    update,
    lineItems,
    totals,
    addCustomService,
    setTemplate,
  } = useFormStore()
  const [errorState, setErrorState] = useState({ microStep, message: '' })
  const error = errorState.microStep === microStep ? errorState.message : ''
  const setError = (message) => setErrorState({ microStep, message })
  const focusRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const completeness = useMemo(() => getQuoteCompleteness(state), [state])
  const symbol = SYMBOLS[state.project.currency] || '$'

  useEffect(() => {
    const id = setTimeout(() => {
      focusRef.current?.focus()
    }, 120)
    return () => clearTimeout(id)
  }, [microStep])

  const current = MICRO_STEPS[microStep]
  const currentPath = current?.path
  const isServicesStep = microStep === 8
  const isExportStep = microStep === 11
  const isTemplateStep = microStep === 9
  const isCurrencyStep = microStep === 7
  const isNotesStep = microStep === 10
  const required = Boolean(current?.required || isServicesStep || isTemplateStep || isCurrencyStep)
  const optional = !required && !isExportStep
  const continueDisabled = isServicesStep && lineItems.length === 0

  const validateStep = () => {
    if (current?.required) {
      const value = currentPath ? readPath(state, currentPath) : ''
      const valid = current?.validate
        ? current.validate(value)
        : String(value || '').trim().length > 0

      if (!valid) return current?.error || 'Complete this field.'
    }

    if (isCurrencyStep && !CURRENCIES.includes(state.project.currency)) {
      return 'Choose a supported currency.'
    }

    if (isServicesStep && lineItems.length === 0) {
      return 'Select or add at least one priced line item.'
    }

    if (isTemplateStep && !state.template) {
      return 'Choose a template.'
    }

    return ''
  }

  const handleContinue = () => {
    const nextError = validateStep()
    if (nextError) {
      setError(nextError)
      return
    }
    onNext()
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return
    if (event.target.tagName === 'TEXTAREA') return
    if (event.target.closest('.wiz-actions')) return
    if (isServicesStep || isExportStep) return
    event.preventDefault()
    handleContinue()
  }

  const updateField = (path) => (event) => {
    setError('')
    update(path, event.target.value)
  }

  const fieldValue = currentPath ? readPath(state, currentPath) || '' : ''

  const renderTextField = () => {
    if (!current || !currentPath) return null

    const isTextarea = current.type === 'textarea'

    return (
      <>
        <div className="wiz-field-eyebrow">{current.eyebrow}</div>
        <Label className="wiz-field-question" htmlFor={`wiz-field-${microStep}`}>
          {current.question}
        </Label>
        {isTextarea ? (
          <div className="wiz-textarea-shell">
            <Label className="wiz-textarea-label" htmlFor={`wiz-field-${microStep}`}>
              {current.label}
            </Label>
            <textarea
              id={`wiz-field-${microStep}`}
              ref={focusRef}
              className={`wiz-textarea${error ? ' has-error' : ''}`}
              value={fieldValue}
              placeholder={current.placeholder}
              rows={5}
              required={current.required}
              onChange={updateField(currentPath)}
              aria-invalid={Boolean(error)}
              aria-describedby={`wiz-hint-${microStep}`}
            />
          </div>
        ) : (
          <div className={`wiz-control-field${error ? ' has-error' : ''}`}>
            <Label className="wiz-control-label" htmlFor={`wiz-field-${microStep}`}>
              {current.label}
            </Label>
            <Input
              id={`wiz-field-${microStep}`}
              ref={focusRef}
              className="wiz-control-input"
              type={current.type}
              value={fieldValue}
              placeholder={current.placeholder}
              required={current.required}
              onChange={updateField(currentPath)}
              aria-invalid={Boolean(error)}
              aria-describedby={`wiz-hint-${microStep}`}
            />
          </div>
        )}
        <div
          id={`wiz-hint-${microStep}`}
          className={`wiz-input-hint${error ? ' is-error' : ''}`}
        >
          {error || current.hint || (current.required ? 'Required.' : '')}
        </div>
      </>
    )
  }

  const renderDateField = () => (
    <>
      <div className="wiz-field-eyebrow">Project</div>
      <div className="wiz-field-question">Until what date is the quote valid?</div>
      <DatePicker
        label="Valid until"
        value={isoToDateValue(state.project.validUntil)}
        required
        invalid={Boolean(error)}
        minWidth="wiz-date-field"
        description={error || 'This appears on the final quote and can be changed later.'}
        onChange={(next) => {
          setError('')
          update('project.validUntil', next?.iso || '')
        }}
      />
      <div className={`wiz-input-hint${error ? ' is-error' : ''}`}>
        {error || ''}
      </div>
    </>
  )

  const renderCurrency = () => (
    <>
      <div className="wiz-field-eyebrow">Project</div>
      <div className="wiz-field-question">Which currency should pricing use?</div>
      <div className="wiz-currency-pills" role="radiogroup" aria-label="Currency">
        {CURRENCIES.map((currency, index) => {
          const active = state.project.currency === currency
          return (
            <button
              key={currency}
              ref={index === 0 ? focusRef : undefined}
              type="button"
              role="radio"
              aria-checked={active}
              className={`wiz-currency-pill${active ? ' is-active' : ''}`}
              onClick={() => {
                setError('')
                update('project.currency', currency)
              }}
            >
              {currency}
            </button>
          )
        })}
      </div>
      <div className={`wiz-input-hint${error ? ' is-error' : ''}`}>
        {error || 'Used for every service and exported total.'}
      </div>
    </>
  )

  const renderServices = () => (
    <>
      <div className="wiz-field-eyebrow">Services</div>
      <div className="wiz-field-question">Which services should be included?</div>
      <div className="wiz-services-scroll scroll-thin">
        <div className="wiz-service-head">
          <span className="wiz-service-title">Predefined services</span>
          <span className="wiz-service-count">
            {state.services.filter((service) => service.selected).length} selected
          </span>
        </div>
        {state.services.map((service) => (
          <ServiceRow key={service.id} service={service} symbol={symbol} />
        ))}

        <div className="wiz-service-head" style={{ marginTop: 20 }}>
          <span className="wiz-service-title">Custom line items</span>
          <button className="wiz-add-service" type="button" onClick={addCustomService}>
            Add item
          </button>
        </div>
        {state.customServices.length > 0 ? (
          state.customServices.map((service) => (
            <CustomServiceRow key={service.id} service={service} symbol={symbol} />
          ))
        ) : (
          <div className="wiz-service-empty">
            Add a custom line item when the quote needs something outside the predefined catalog.
          </div>
        )}

        <div className="wiz-adjustments">
          <PercentInput
            label="Discount"
            value={state.discount}
            onChange={(event) => update('discount', parseFloat(event.target.value) || 0)}
          />
          <PercentInput
            label="Tax"
            value={state.taxRate}
            onChange={(event) => update('taxRate', parseFloat(event.target.value) || 0)}
          />
        </div>

        <TotalBox totals={totals} symbol={symbol} />
      </div>
      <div className={`wiz-input-hint${error ? ' is-error' : ''}`}>
        {error || (lineItems.length === 0 ? 'Select or add at least one line item to continue.' : `${lineItems.length} line item${lineItems.length === 1 ? '' : 's'} ready.`)}
      </div>
    </>
  )

  const renderTemplate = () => (
    <>
      <div className="wiz-field-eyebrow">Export</div>
      <div className="wiz-field-question">Which PDF layout should this quote use?</div>
      <div className="wiz-template-options">
        {TEMPLATE_OPTIONS.map((template, index) => {
          const active = state.template === template.id
          return (
            <button
              key={template.id}
              ref={index === 0 ? focusRef : undefined}
              type="button"
              className={`wiz-template-option${active ? ' is-active' : ''}`}
              onClick={() => {
                setError('')
                setTemplate(template.id)
              }}
            >
              <span className="wiz-template-check" aria-hidden="true">{active ? '\u2713' : ''}</span>
              <span>
                <span className="wiz-template-title">{template.name}</span>
                <span className="wiz-template-desc">{template.desc}</span>
              </span>
            </button>
          )
        })}
      </div>
      <div className={`wiz-input-hint${error ? ' is-error' : ''}`}>
        {error || 'You can change this before exporting.'}
      </div>
    </>
  )

  const renderNotes = () => (
    <>
      <div className="wiz-field-eyebrow">Export</div>
      <Label className="wiz-field-question" htmlFor="wiz-notes">
        Any notes to include in the document?
      </Label>
      <textarea
        id="wiz-notes"
        ref={focusRef}
        className="wiz-textarea"
        value={state.notes}
        placeholder="Payment terms, assumptions, exclusions, or next steps."
        rows={6}
        onChange={(event) => update('notes', event.target.value)}
      />
      <div className="wiz-input-hint">Optional. Keep it concise for the final PDF.</div>
    </>
  )

  const renderExport = () => {
    const ready = completeness.complete
    return (
      <>
        <div className="wiz-field-eyebrow">Export</div>
        <div className="wiz-field-question">Export the finished quote.</div>
        <div className="wiz-export-box">
          <div className="wiz-export-status">
            <span>{ready ? 'All required fields are complete.' : `${completeness.missingFields.length} required field${completeness.missingFields.length === 1 ? '' : 's'} remaining.`}</span>
            <strong>{ready ? 'Ready' : 'Incomplete'}</strong>
          </div>
          <div className="wiz-export-total">
            <span>Total</span>
            <strong>{symbol}{fmt(totals.total)}</strong>
          </div>
          <div className="wiz-export-actions">
            <PDFButton previewRef={previewRef} />
            <button className="wiz-json-btn" type="button" onClick={onOpenJson}>
              {'{ }'} JSON
            </button>
          </div>
        </div>
      </>
    )
  }

  const renderStep = () => {
    if (isCurrencyStep) return renderCurrency()
    if (isServicesStep) return renderServices()
    if (isTemplateStep) return renderTemplate()
    if (isNotesStep) return renderNotes()
    if (isExportStep) return renderExport()
    if (current?.type === 'date') return renderDateField()
    return renderTextField()
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={microStep}
        className={`wiz-field${isServicesStep ? ' wiz-services' : ''}`}
        initial={{
          opacity: 0,
          y: prefersReducedMotion ? 0 : direction >= 0 ? 32 : -24,
        }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: prefersReducedMotion ? 0 : direction >= 0 ? -18 : 24,
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
        onKeyDown={handleKeyDown}
      >
        {renderStep()}

        {!isExportStep && (
          <div className="wiz-actions">
            <button
              className="wiz-btn-continue"
              type="button"
              onClick={handleContinue}
              disabled={continueDisabled}
            >
              Continue
            </button>
            {optional && (
              <button className="wiz-btn-skip" type="button" onClick={onNext}>
                Skip
              </button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
