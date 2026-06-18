const SYMBOLS = { USD: '$', EUR: '\u20ac', MXN: '$', GBP: '\u00a3' }
const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const money = (n, code) => (SYMBOLS[code] || '$') + fmt(n)

function SectionLabel({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8795ad' }}>{text}</span>
      <span style={{ flex: 1, height: '1px', background: '#dce6f4' }} />
    </div>
  )
}

export default function DocStatement({ data }) {
  const brand = data.brand || {}
  const meta = data.meta || {}
  const client = data.client || {}
  const project = data.project || {}
  const totals = data.totals || {}
  const lineItems = data.lineItems || []
  const notes = data.notes
  const currency = project.currency || 'USD'

  const projectTitle = project.title || 'Untitled project'
  const brandName = brand.name || 'Brand'
  const clientLine = [client.name || 'Client name', client.company, client.email].filter(Boolean).join(' / ')

  const showSummary = totals.discountAmount > 0 || totals.taxAmount > 0
  const summaryText = 'subtotal ' + money(totals.subtotal, currency) + (totals.discountAmount > 0 ? ' / -' + money(totals.discountAmount, currency) : '') + (totals.taxAmount > 0 ? ' / tax ' + money(totals.taxAmount, currency) : '')

  const footerParts = [brand.website, brand.email, brand.phone, project.validUntil ? 'valid until ' + project.validUntil : null].filter(Boolean)

  return (
    <div style={{ width: '794px', height: '1123px', background: '#ffffff', color: '#061124', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ background: '#061b3d', height: '128px', padding: '0 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '18px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 600, color: '#ffffff', letterSpacing: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '540px' }}>{projectTitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#ffffff' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#cfe3ff', whiteSpace: 'nowrap' }}>{brandName}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 56px 120px' }}>
        <div style={{ marginBottom: '40px' }}>
          <SectionLabel text="CLIENT" />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#061124' }}>{clientLine}</div>
        </div>

        {project.description ? (
          <div style={{ marginBottom: '40px' }}>
            <SectionLabel text="SCOPE" />
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', lineHeight: 1.6, color: '#203552', maxWidth: '520px' }}>{project.description}</div>
          </div>
        ) : null}

        <div>
          <SectionLabel text="DELIVERABLES" />
          {lineItems.length === 0 ? (
            <div style={{ padding: '11px 0', borderBottom: '1px solid #dce6f4', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#8795ad' }}>No line items</div>
          ) : (
            lineItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '11px 0', borderBottom: '1px solid #dce6f4' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#203552' }}>{item.name + (item.quantity > 1 ? ' x' + item.quantity : '')}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: '#061124' }}>{money(item.price * item.quantity, currency)}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '28px' }}>
          {showSummary ? (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8795ad', textAlign: 'right', marginBottom: '10px' }}>{summaryText}</div>
          ) : null}
          <div style={{ background: '#061b3d', padding: '18px 32px', display: 'flex', alignItems: 'center', gap: '32px', borderRadius: '16px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#cfe3ff' }}>TOTAL</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: '#ffffff' }}>{money(totals.total, currency)}</span>
          </div>
        </div>

        {notes ? (
          <div style={{ marginTop: '36px', fontFamily: "'Inter', sans-serif", fontSize: '12px', lineHeight: 1.6, color: '#53627a', maxWidth: '460px' }}>{notes}</div>
        ) : null}
      </div>

      <div style={{ position: 'absolute', left: '56px', right: '56px', bottom: '48px', borderTop: '1px solid #dce6f4', paddingTop: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8795ad' }}>
          {footerParts.map((part, i) => (
            <span key={i} style={{ display: 'flex', gap: '12px' }}>
              {i > 0 ? <span>/</span> : null}
              <span>{part}</span>
            </span>
          ))}
          <span style={{ marginLeft: 'auto' }}>{meta.issuedDate}</span>
        </div>
      </div>
    </div>
  )
}
