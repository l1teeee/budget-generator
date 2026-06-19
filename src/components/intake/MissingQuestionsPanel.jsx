import { useMemo, useRef, useState } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'

const QUICK_FIELDS = new Set([
  'client.name',
  'client.email',
  'project.title',
  'project.validUntil',
  'project.currency',
  'template',
  'services',
])

function answerType(path) {
  if (path === 'project.validUntil') return 'date'
  if (path === 'project.currency') return 'currency'
  if (path === 'template') return 'template'
  return 'text'
}

export default function MissingQuestionsPanel() {
  const { state, update, applyQuoteDraft, setStep } = useFormStore()
  const [answers, setAnswers] = useState({})
  const customId = useRef(0)
  const completeness = useMemo(() => getQuoteCompleteness(state), [state])

  const missing = completeness.missingFields
    .filter((field) => QUICK_FIELDS.has(field.path))
    .slice(0, 4)

  if (missing.length === 0) return null

  const applyAnswer = (field) => {
    const value = String(answers[field.path] || '').trim()
    if (!value) return

    if (field.path === 'services') {
      customId.current += 1
      applyQuoteDraft({
        customServices: [
          ...(state.customServices || []),
          { id: `q-${customId.current}`, name: value, price: 0, quantity: 1 },
        ],
      })
      setStep(3)
    } else {
      update(field.path, value)
    }

    setAnswers((prev) => ({ ...prev, [field.path]: '' }))
  }

  return (
    <section className="missing-panel" aria-label="Missing questions">
      <div className="missing-panel-head">
        <span>Needs attention</span>
        <strong>{completeness.percent}% complete</strong>
      </div>

      <div className="missing-list">
        {missing.map((field) => {
          const type = answerType(field.path)
          const value = answers[field.path] || ''

          return (
            <div className="missing-item" key={field.path}>
              <label htmlFor={`missing-${field.path}`}>{field.question}</label>
              <div className="missing-answer">
                {type === 'currency' ? (
                  <select
                    id={`missing-${field.path}`}
                    value={value}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, [field.path]: event.target.value }))}
                  >
                    <option value="">choose</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="MXN">MXN</option>
                    <option value="GBP">GBP</option>
                  </select>
                ) : type === 'template' ? (
                  <select
                    id={`missing-${field.path}`}
                    value={value}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, [field.path]: event.target.value }))}
                  >
                    <option value="">choose</option>
                    <option value="ledger">Ledger</option>
                    <option value="statement">Statement</option>
                  </select>
                ) : (
                  <input
                    id={`missing-${field.path}`}
                    type={type}
                    value={value}
                    placeholder={field.label}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, [field.path]: event.target.value }))}
                  />
                )}
                <button type="button" onClick={() => applyAnswer(field)} disabled={!value}>
                  apply
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
