import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { useCountUp } from '../../hooks/useAnimations'

const SYMBOLS = { USD: '$', EUR: '\u20ac', MXN: '$', GBP: '\u00a3' }

export default function TotalHUD() {
  const { state, totals, lineItems } = useFormStore()
  const ref = useRef(null)
  const symbol = SYMBOLS[state.project.currency] || '$'
  const format = (v) => symbol + Math.round(v).toLocaleString('en-US')
  useCountUp(ref, totals.total, format)

  return (
    <div style={{
      position: 'absolute',
      left: '28px',
      bottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      pointerEvents: 'none',
      background: '#ffffff',
      border: '1px solid rgba(255,255,255,0.54)',
      borderRadius: '999px',
      padding: '10px 18px',
      boxShadow: '0 18px 34px -24px rgba(2,8,23,0.78)',
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#53627a',
      }}>
        total
      </span>
      <span
        ref={ref}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '20px',
          fontWeight: 500,
          color: '#061b3d',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.01em',
        }}
      >
        {format(totals.total)}
      </span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.08em',
        color: '#8795ad',
      }}>
        {lineItems.length} item{lineItems.length === 1 ? '' : 's'}
      </span>
    </div>
  )
}
