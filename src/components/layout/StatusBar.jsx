import { useFormStore } from '../../hooks/useFormStore'

export default function StatusBar({ onOpenBrand, onOpenJson, onHome }) {
  const { resetQuote } = useFormStore()

  const onReset = () => {
    if (confirm('Reset all fields to defaults? This clears the current quote.')) resetQuote()
  }

  return (
    <div className="status-bar">
      {onHome && (
        <button className="status-action" onClick={onHome} aria-label="Back to home">
          Home
        </button>
      )}

      <div className="status-brand">
        <span className="brand-copy">
          <span className="brand-title">BudgetFlow AI</span>
        </span>
      </div>

      <div className="status-actions">
        <button className="status-action" onClick={onOpenBrand}>Brand</button>
        <button className="status-action" onClick={onOpenJson}>JSON</button>
        <button className="status-action" onClick={onReset}>Reset</button>
      </div>
    </div>
  )
}
