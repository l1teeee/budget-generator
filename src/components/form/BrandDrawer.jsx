import { useFormStore } from '../../hooks/useFormStore'
import TerminalField from '../ui/TerminalField'

export default function BrandDrawer({ open, onClose }) {
  const { state, update, resetQuote } = useFormStore()
  if (!open) return null

  const b = state.brand

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(2,8,23,0.72)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="scroll-thin"
        style={{
          width: '420px',
          maxWidth: '100%',
          height: '100%',
          overflowY: 'auto',
          background: '#ffffff',
          borderLeft: '1px solid #d7e1ee',
          padding: '28px',
          boxShadow: '-30px 0 70px -34px rgba(2,8,23,0.72)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#061124' }}>
            brand / sender
          </span>
          <button
            aria-label="Close brand panel"
            onClick={onClose}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', color: '#53627a', lineHeight: 1, width: '28px', height: '28px', borderRadius: '999px' }}
          >
            x
          </button>
        </div>

        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: '#53627a',
          lineHeight: 1.6,
          marginBottom: '22px',
        }}>
          Edit who is sending the quote. Works for any sector: agency, freelance, studio, retail.
        </div>

        <TerminalField label="Brand name" value={b.name} onChange={e => update('brand.name', e.target.value)} />
        <TerminalField label="Tagline" value={b.tagline} onChange={e => update('brand.tagline', e.target.value)} />
        <TerminalField label="Website" mono value={b.website} onChange={e => update('brand.website', e.target.value)} />
        <TerminalField label="Email" type="email" mono value={b.email} onChange={e => update('brand.email', e.target.value)} />
        <TerminalField label="Phone" type="tel" mono value={b.phone} onChange={e => update('brand.phone', e.target.value)} />
        <TerminalField label="Quote ID" mono value={state.meta.quoteId} onChange={e => update('meta.quoteId', e.target.value)} />

        <button
          onClick={() => { if (confirm('Reset all fields to defaults? This clears the current quote.')) { resetQuote(); onClose() } }}
          style={{
            marginTop: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#b4564f',
            background: '#ffffff',
            border: '1px solid #f1c9d0',
            borderRadius: '999px',
            padding: '11px 16px',
            width: '100%',
            boxShadow: '0 10px 24px -24px rgba(2,8,23,0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fff1f3' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ffffff' }}
        >
          reset quote
        </button>
      </div>
    </div>
  )
}
