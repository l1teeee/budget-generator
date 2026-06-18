const SYMBOLS = { USD: '$', EUR: '\u20ac', MXN: '$', GBP: '\u00a3' }
const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const money = (n, code) => (SYMBOLS[code] || '$') + fmt(n)

export default function DocLedger({ data }) {
  const brand = data.brand || {}
  const meta = data.meta || {}
  const client = data.client || {}
  const project = data.project || {}
  const totals = data.totals || {}
  const lineItems = data.lineItems || []
  const notes = data.notes
  const currency = project.currency || 'USD'

  const projectTitle = project.title || 'Untitled project'
  const clientName = client.name || 'Client name'
  const brandName = brand.name || 'Brand'
  const footerParts = [brand.website, brand.email, brand.phone].filter(Boolean)

  const cell = (label, value) => (
    <div style={{ flex: 1, padding: '12px 16px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8795ad' }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#061124', marginTop: '4px' }}>{value}</div>
    </div>
  )

  return (
    <div style={{ width: '794px', height: '1123px', background: '#ffffff', color: '#061124', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, color: '#061b3d' }}>{brandName}</div>
            {brand.tagline ? (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8795ad', marginTop: '2px' }}>{brand.tagline}</div>
            ) : null}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#061b3d', background: '#eef5ff', padding: '5px 12px', borderRadius: '999px' }}>QUOTE.{meta.quoteId || '0000'}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8795ad', marginTop: '6px' }}>{meta.issuedDate}</div>
          </div>
        </div>

        <div style={{ height: '1px', background: '#dce6f4', margin: '26px 0 28px' }} />

        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', fontWeight: 600, letterSpacing: 0, lineHeight: 1.05, color: '#061124' }}>{projectTitle}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8795ad' }}>FOR</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#061124' }}>{clientName + (client.company ? ' / ' + client.company : '')}</span>
        </div>

        <div style={{ display: 'flex', background: '#f7fbff', border: '1px solid #dce6f4', borderRadius: '14px', margin: '28px 0', overflow: 'hidden' }}>
          {cell('ISSUED', meta.issuedDate || '-')}
          <div style={{ width: '1px', background: '#dce6f4' }} />
          {cell('VALID UNTIL', project.validUntil || '-')}
          <div style={{ width: '1px', background: '#dce6f4' }} />
          {cell('CURRENCY', currency)}
        </div>

        <div style={{ display: 'flex', paddingBottom: '10px', borderBottom: '2px solid #061b3d', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8795ad' }}>
          <span style={{ flex: 1 }}>ITEM</span>
          <span style={{ width: '56px', textAlign: 'right' }}>QTY</span>
          <span style={{ width: '96px', textAlign: 'right' }}>RATE</span>
          <span style={{ width: '110px', textAlign: 'right' }}>AMOUNT</span>
        </div>

        {lineItems.length === 0 ? (
          <div style={{ padding: '14px 0', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#8795ad' }}>No line items</div>
        ) : (
          lineItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid #dce6f4' }}>
              <span style={{ flex: 1, paddingRight: '16px', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#061124' }}>{item.name}</span>
              <span style={{ width: '56px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#53627a', fontVariantNumeric: 'tabular-nums' }}>{item.quantity}</span>
              <span style={{ width: '96px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#53627a', fontVariantNumeric: 'tabular-nums' }}>{money(item.price, currency)}</span>
              <span style={{ width: '110px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#061124', fontVariantNumeric: 'tabular-nums' }}>{money(item.price * item.quantity, currency)}</span>
            </div>
          ))
        )}

        <div style={{ width: '320px', marginLeft: 'auto', marginTop: '20px', background: '#f7fbff', border: '1px solid #dce6f4', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
            <span style={{ color: '#53627a' }}>SUBTOTAL</span>
            <span style={{ color: '#061124', fontVariantNumeric: 'tabular-nums' }}>{money(totals.subtotal, currency)}</span>
          </div>
          {totals.discountAmount > 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
              <span style={{ color: '#53627a' }}>DISCOUNT ({totals.discountPct}%)</span>
              <span style={{ color: '#061124', fontVariantNumeric: 'tabular-nums' }}>-{money(totals.discountAmount, currency)}</span>
            </div>
          ) : null}
          {totals.taxAmount > 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
              <span style={{ color: '#53627a' }}>TAX ({totals.taxPct}%)</span>
              <span style={{ color: '#061124', fontVariantNumeric: 'tabular-nums' }}>{money(totals.taxAmount, currency)}</span>
            </div>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', background: '#061b3d', borderRadius: '12px', padding: '12px 16px' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#cfe3ff' }}>TOTAL</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', fontWeight: 500, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>{money(totals.total, currency)}</span>
          </div>
        </div>

        {notes ? (
          <div style={{ marginTop: '32px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8795ad', marginBottom: '8px' }}>NOTES</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', lineHeight: 1.6, color: '#53627a', maxWidth: '460px' }}>{notes}</div>
          </div>
        ) : null}
      </div>

      <div style={{ position: 'absolute', left: '56px', right: '56px', bottom: '48px', borderTop: '1px solid #dce6f4', paddingTop: '14px', display: 'flex', gap: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8795ad' }}>
        {footerParts.map((part, i) => (
          <span key={i} style={{ display: 'flex', gap: '12px' }}>
            {i > 0 ? <span>/</span> : null}
            <span>{part}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
