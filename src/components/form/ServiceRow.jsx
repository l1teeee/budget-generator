import { useFormStore } from '../../hooks/useFormStore'

const fmt = (n) => Number(n).toLocaleString('en-US')

export default function ServiceRow({ service, symbol }) {
  const { toggleService, updateServiceQuantity } = useFormStore()
  const on = service.selected

  return (
    <div
      onClick={() => toggleService(service.id)}
      data-link-card
      tabIndex={0}
      onKeyDown={e => {
        if (e.target.tagName === 'INPUT') return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleService(service.id)
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 12px',
        marginBottom: '6px',
        border: `1.5px solid ${on ? '#16161D' : 'rgba(22,22,29,0.16)'}`,
        background: on ? '#EAEEFB' : '#FCFBF8',
        borderRadius: '16px',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background-color 180ms ease, border-color 180ms ease',
      }}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        flexShrink: 0,
        borderRadius: '7px',
        border: on ? '1.5px solid #16161D' : '1.5px solid rgba(22,22,29,0.34)',
        background: '#ffffff',
      }}>
        {on && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="#16161D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>

      <span style={{
        flex: 1,
        minWidth: 0,
        fontFamily: "'Hanken Grotesk', Inter, sans-serif",
        fontSize: '13px',
        color: on ? '#16161D' : '#565563',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {service.name}
      </span>

      {on && (
        <input
          type="number"
          min="1"
          value={service.quantity}
          onClick={e => e.stopPropagation()}
          onChange={e => updateServiceQuantity(service.id, parseInt(e.target.value) || 1)}
          style={{
            width: '42px',
            textAlign: 'center',
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '12px',
            color: '#16161D',
            background: '#ffffff',
            border: '1.5px solid rgba(22,22,29,0.18)',
            borderRadius: '8px',
            padding: '3px 0',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
      )}

      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        color: on ? '#16161D' : '#565563',
        fontVariantNumeric: 'tabular-nums',
        width: '70px',
        textAlign: 'right',
        flexShrink: 0,
      }}>
        {symbol}{fmt(service.price)}
      </span>
    </div>
  )
}
