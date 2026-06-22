import { useFormStore } from '../../hooks/useFormStore'
import { Input } from '../ui/input'

export default function CustomServiceRow({ service, symbol }) {
  const { updateCustomService, removeCustomService } = useFormStore()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '9px 12px',
      marginBottom: '6px',
      border: '1.5px dashed rgba(22,22,29,0.28)',
      background: '#FCFBF8',
      borderRadius: '16px',
    }}>
      <span style={{
        fontSize: '13px',
        fontWeight: 800,
        color: '#16161D',
        width: '20px',
        flexShrink: 0,
        textAlign: 'center',
      }}>
        +
      </span>
      <Input
        className="wiz-custom-name-input"
        placeholder="service name"
        value={service.name}
        onChange={e => updateCustomService(service.id, 'name', e.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: '13px',
          color: '#16161D',
        }}
      />
      <Input
        className="wiz-custom-qty-input"
        type="number"
        min="0"
        placeholder="qty"
        value={service.quantity}
        onChange={e => updateCustomService(service.id, 'quantity', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
        onBlur={e => { if (e.target.value === '' || parseInt(e.target.value) < 1) updateCustomService(service.id, 'quantity', 1) }}
        style={{
          width: '40px',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 800,
          color: '#16161D',
          background: '#F6F4EE',
          border: '1px solid rgba(22,22,29,0.18)',
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
        background: '#F6F4EE',
        border: '1px solid rgba(22,22,29,0.18)',
        borderRadius: '8px',
        padding: '4px 8px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#8A8794' }}>{symbol}</span>
        <Input
          className="wiz-custom-price-input"
          type="number"
          min="0"
          placeholder="0"
          value={service.price || ''}
          onChange={e => updateCustomService(service.id, 'price', parseFloat(e.target.value) || 0)}
          style={{
            width: '48px',
            textAlign: 'right',
            fontSize: '12px',
            fontWeight: 800,
            color: '#16161D',
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
