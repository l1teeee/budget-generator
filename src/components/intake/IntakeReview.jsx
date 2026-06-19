import { describeMappedData } from '../../lib/intakeMapper'

function ListBlock({ title, items, empty }) {
  return (
    <div className="intake-review-block">
      <h2>{title}</h2>
      {items.length ? (
        <div className="intake-review-list">
          {items.map((item, index) => (
            <div className="intake-review-row" key={`${title}-${index}`}>
              <span>{item.label || item.stepLabel || item}</span>
              <strong>{item.value || item.reason || item.path || ''}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="intake-empty">{empty}</p>
      )}
    </div>
  )
}

export default function IntakeReview({ result, mode, onApply, onBack }) {
  const mapped = describeMappedData(result?.mappedData)
  const missing = result?.missingFields || []
  const questions = result?.suggestedQuestions || []
  const warnings = result?.warnings || []
  const confidence = Math.round((result?.confidence || 0) * 100)

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

      <section className="intake-review">
        <div className="intake-review-hero">
          <p className="intake-eyebrow">{mode === 'json' ? 'JSON review' : 'Context review'}</p>
          <h1 className="intake-title compact">Review before the wizard.</h1>
          <p className="intake-lede compact">
            Apply the draft, then BudgetFlow will open on the first step that still needs attention.
          </p>
          <div className="intake-confidence">
            <span>confidence</span>
            <strong>{confidence}%</strong>
          </div>
        </div>

        <div className="intake-review-grid">
          <ListBlock title="Detected data" items={mapped} empty="No mapped data yet." />
          <ListBlock title="Missing fields" items={missing} empty="Required fields look complete." />
          <ListBlock
            title="Suggested questions"
            items={questions.map((question) => ({ label: question, value: '' }))}
            empty="No questions needed."
          />
          <ListBlock
            title="Warnings"
            items={warnings.map((warning) => ({ label: warning, value: '' }))}
            empty="No warnings."
          />
        </div>

        <div className="intake-actions review-actions">
          <button type="button" className="intake-ghost" onClick={onBack}>
            revise input
          </button>
          <button type="button" className="intake-primary" onClick={onApply} disabled={!result || result.confidence === 0}>
            Apply draft
          </button>
        </div>
      </section>
    </main>
  )
}
