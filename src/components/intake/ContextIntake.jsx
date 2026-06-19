import { useState } from 'react'
import { analyzeBudgetInput } from '../../lib/intakeMapper'

const EXAMPLE = 'Necesito una cotizacion para Juan Perez, email juan@email.com, proyecto landing page para una cafeteria, presupuesto en USD, incluir diseno, desarrollo y soporte.'

export default function ContextIntake({ currentQuote, onAnalyzed, onBack }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  const analyze = () => {
    const result = analyzeBudgetInput({ mode: 'context', rawInput: text, currentQuote })
    setStatus(result.confidence > 0 ? 'Context analyzed locally. Review before applying.' : result.warnings[0])
    onAnalyzed(result, 'context')
  }

  return (
    <main className="intake-page">
      <header className="intake-nav">
        <button type="button" className="intake-logo" onClick={onBack}>
          BudgetFlow AI
        </button>
        <button type="button" className="intake-ghost" onClick={onBack}>
          back
        </button>
      </header>

      <section className="intake-workbench">
        <div>
          <p className="intake-eyebrow">Context mode</p>
          <h1 className="intake-title compact">Paste rough project notes.</h1>
          <p className="intake-lede compact">
            This does not call an AI API yet. It uses a local adapter shaped like the future AI response.
          </p>
        </div>

        <div className="intake-panel">
          <label className="intake-label" htmlFor="context-intake">
            Project context
          </label>
          <textarea
            id="context-intake"
            className="intake-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={EXAMPLE}
          />
          <div className="intake-actions">
            <button type="button" className="intake-ghost" onClick={() => setText(EXAMPLE)}>
              use example
            </button>
            <button type="button" className="intake-primary" onClick={analyze} disabled={!text.trim()}>
              Analyze context
            </button>
          </div>
          {status && <p className="intake-status">{status}</p>}
        </div>
      </section>
    </main>
  )
}
