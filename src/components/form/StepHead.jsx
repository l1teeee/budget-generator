export default function StepHead({ number, name, hint }) {
  return (
    <div data-animate style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '13px',
          color: '#0b2a5b',
          letterSpacing: '0.05em',
        }}>
          {String(number).padStart(2, '0')} /
        </span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '26px',
          fontWeight: 600,
          color: '#061124',
          letterSpacing: 0,
        }}>
          {name}
        </span>
      </div>
      {hint && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#53627a',
          marginTop: '8px',
          letterSpacing: '0.02em',
        }}>
          {hint}
        </div>
      )}
    </div>
  )
}
