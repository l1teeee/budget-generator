import { useState } from 'react'
import { analyzeBudgetInput } from '../../lib/intakeMapper'

export default function JsonIntake({ currentQuote, onAnalyzed, onBack }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  const analyze = () => {
    const result = analyzeBudgetInput({ mode: 'json', rawInput: text, currentQuote })
    setStatus(result.confidence > 0 ? 'JSON parsed. Review the detected fields.' : result.warnings[0])
    onAnalyzed(result, 'json')
  }

  const onFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setText(String(reader.result || ''))
      setStatus('File loaded. Review and analyze.')
    }
    reader.readAsText(file)
    event.target.value = ''
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
          <p className="intake-eyebrow">JSON import</p>
          <h1 className="intake-title compact">Paste quote JSON.</h1>
          <p className="intake-lede compact">
            We keep the existing quote schema and validate locally before applying anything to the wizard.
          </p>
        </div>

        <div className="intake-panel">
          <label className="intake-label" htmlFor="json-intake">
            quote.json
          </label>
          <textarea
            id="json-intake"
            className="intake-textarea code"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="{&#10;  &quot;client&quot;: { &quot;name&quot;: &quot;Juan Perez&quot; }&#10;}"
            spellCheck={false}
          />
          <div className="intake-actions">
            <label className="intake-ghost file-trigger">
              load file
              <input type="file" accept="application/json,.json" onChange={onFile} />
            </label>
            <button type="button" className="intake-primary" onClick={analyze} disabled={!text.trim()}>
              Review JSON
            </button>
          </div>
          {status && <p className="intake-status">{status}</p>}
        </div>
      </section>
    </main>
  )
}
