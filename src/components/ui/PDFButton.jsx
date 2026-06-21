import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { usePDFExport } from '../../hooks/usePDFExport'
import { usePDFButtonHover } from '../../hooks/useAnimations'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'

export default function PDFButton({ previewRef }) {
  const { state } = useFormStore()
  const { exportPDF, exporting } = usePDFExport()
  const completeness = getQuoteCompleteness(state)
  const blocked = !completeness.complete
  const btnRef = useRef(null)
  const fillRef = useRef(null)
  const labelRef = useRef(null)
  usePDFButtonHover(btnRef, fillRef, labelRef)

  return (
    <button
      ref={btnRef}
      onClick={() => exportPDF(previewRef, state.client.name)}
      disabled={exporting || blocked}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: exporting ? 'wait' : blocked ? 'not-allowed' : 'pointer',
        border: '1.5px solid #16161D',
        borderRadius: '999px',
        background: blocked ? '#E9E6DE' : '#16161D',
        padding: '15px 24px',
        width: '100%',
        opacity: blocked ? 0.72 : 1,
        boxShadow: blocked
          ? 'none'
          : '0 14px 28px -16px rgba(22,22,29,0.5), 0 1px 0 rgba(255,255,255,0.12) inset',
      }}
    >
      <span
        ref={fillRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#AEC2FF',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          pointerEvents: 'none',
        }}
      />
      <span
        ref={labelRef}
        style={{
          position: 'relative',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: blocked ? '#565563' : '#F1EFE9',
        }}
      >
        {exporting ? 'rendering...' : blocked ? 'complete required fields' : 'export pdf'}
      </span>
    </button>
  )
}
