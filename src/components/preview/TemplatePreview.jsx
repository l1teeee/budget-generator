import { useLayoutEffect, useRef, useState } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { usePreviewSwap } from '../../hooks/useAnimations'
import DocLedger from './DocLedger'
import DocStatement from './DocStatement'
import TotalHUD from './TotalHUD'

const A4_W = 794
const A4_H = 1123

function Doc({ template, data }) {
  return template === 'statement' ? <DocStatement data={data} /> : <DocLedger data={data} />
}

export default function TemplatePreview({ previewRef }) {
  const { state, lineItems, totals } = useFormStore()
  const stageRef = useRef(null)
  const swapRef = useRef(null)
  const [scale, setScale] = useState(0.6)

  const data = {
    brand: state.brand,
    meta: state.meta,
    client: state.client,
    project: state.project,
    lineItems,
    notes: state.notes,
    totals,
  }

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const availW = stage.clientWidth - 80
      const availH = stage.clientHeight - 80
      const s = Math.min(availW / A4_W, availH / A4_H)
      setScale(Math.max(0.2, Math.min(s, 1)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  usePreviewSwap(swapRef, state.template)

  return (
    <div
      ref={stageRef}
      className="preview-stage"
    >
      <div
        ref={swapRef}
        style={{
          width: `${A4_W * scale}px`,
          height: `${A4_H * scale}px`,
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: '0 34px 70px -28px rgba(2,8,23,0.7), 0 10px 24px -16px rgba(2,8,23,0.42)',
        }}
      >
        <div style={{
          width: `${A4_W}px`,
          height: `${A4_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}>
          <Doc template={state.template} data={data} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: '-20000px', top: 0, width: `${A4_W}px`, height: `${A4_H}px` }} aria-hidden>
        <div ref={previewRef} style={{ width: `${A4_W}px`, height: `${A4_H}px` }}>
          <Doc template={state.template} data={data} />
        </div>
      </div>

      <TotalHUD />
    </div>
  )
}
