import { useFormStore } from '../../hooks/useFormStore'
import ReactMark from '../ui/ReactMark'

export default function StatusBar({ onOpenBrand, onOpenJson, onHome }) {
  const { state, saved } = useFormStore()

  return (
    <div className="status-bar">
      {onHome && (
        <button className="status-action" onClick={onHome} aria-label="Back to home">
          ← home
        </button>
      )}
      <div className="status-brand">
        <span className="brand-icon">
          <ReactMark size={20} color="#061b3d" />
        </span>
        <span className="brand-copy">
          <span className="brand-title">BG</span>
          <span className="brand-subtitle">
            budget generator
          </span>
        </span>
      </div>

      <span className="status-divider" />

      <span className="status-meta">
        QUOTE.{state.meta.quoteId || '0000'}
      </span>
      <span className="status-date">
        {state.meta.issuedDate}
      </span>

      <span className="status-save">
        <span
          className="status-dot"
          style={{
            background: saved ? '#ffffff' : 'rgba(255,255,255,0.34)',
            boxShadow: saved ? '0 0 0 5px rgba(255,255,255,0.12)' : 'none',
          }}
        />
        {saved ? 'saved' : 'local'}
      </span>

      <div className="status-actions">
        <button className="status-action" onClick={onOpenBrand}>brand</button>
        <button className="status-action" onClick={onOpenJson}>{'{ } json'}</button>
      </div>
    </div>
  )
}
