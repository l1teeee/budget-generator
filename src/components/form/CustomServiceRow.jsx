import { useFormStore } from '../../hooks/useFormStore'

export default function CustomServiceRow({ service, symbol }) {
  const { updateCustomService, removeCustomService } = useFormStore()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '9px 12px',
      marginBottom: '6px',
      border: '1px dashed #bdcbe0',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 24px -24px rgba(2,8,23,0.34)',
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        color: '#061b3d',
        width: '20px',
        flexShrink: 0,
        textAlign: 'center',
      }}>
        +
      </span>
      <input
        placeholder="service name"
        value={service.name}
        onChange={e => updateCustomService(service.id, 'name', e.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          color: '#061124',
        }}
      />
      <input
        type="number"
        min="0"
        placeholder="qty"
        value={service.quantity}
        onChange={e => updateCustomService(service.id, 'quantity', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
        onBlur={e => { if (e.target.value === '' || parseInt(e.target.value) < 1) updateCustomService(service.id, 'quantity', 1) }}
        style={{
          width: '40px',
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#061b3d',
          background: '#f7fbff',
          border: '1px solid #dce6f4',
          borderRadius: '8px',
          padding: '4px 0',
        }}
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        width: '76px',
        justifyContent: 'flex-end',
        background: '#f7fbff',
        border: '1px solid #dce6f4',
        borderRadius: '8px',
        padding: '4px 8px',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#8795ad' }}>{symbol}</span>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={service.price || ''}
          onChange={e => updateCustomService(service.id, 'price', parseFloat(e.target.value) || 0)}
          style={{
            width: '48px',
            textAlign: 'right',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: '#061124',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
      </div>
      <button
        aria-label="Remove custom service"
        onClick={() => removeCustomService(service.id)}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '16px',
          color: '#8795ad',
          flexShrink: 0,
          width: '22px',
          height: '22px',
          lineHeight: 1,
          borderRadius: '999px',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#b4564f'; e.currentTarget.style.background = '#fff1f3' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#8795ad'; e.currentTarget.style.background = 'transparent' }}
      >
        x
      </button>
    </div>
  )
}
