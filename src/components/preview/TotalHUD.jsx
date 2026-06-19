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
    <div className="total-hud">
      <span className="total-hud-label">Total</span>
      <span ref={ref} className="total-hud-value">
        {format(totals.total)}
      </span>
      <span className="total-hud-count">
        {lineItems.length} item{lineItems.length === 1 ? '' : 's'}
      </span>
    </div>
  )
}
