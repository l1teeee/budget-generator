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
        border: `1px solid ${on ? '#061b3d' : '#dce6f4'}`,
        background: on ? '#061b3d' : '#ffffff',
        borderRadius: '12px',
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: on ? '0 14px 30px -24px rgba(2,8,23,0.78)' : '0 10px 24px -24px rgba(2,8,23,0.36)',
        transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
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
        border: on ? '1px solid #ffffff' : '1px solid #bdcbe0',
        background: on ? '#ffffff' : '#ffffff',
      }}>
        {on && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="#061b3d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>

      <span style={{
        flex: 1,
        minWidth: 0,
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        color: on ? '#ffffff' : '#53627a',
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
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: '#061b3d',
            background: '#ffffff',
            border: '1px solid #bdcbe0',
            borderRadius: '8px',
            padding: '3px 0',
          }}
        />
      )}

      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        color: on ? '#ffffff' : '#8795ad',
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
