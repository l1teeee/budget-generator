import { useRef } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { usePDFExport } from '../../hooks/usePDFExport'
import { usePDFButtonHover } from '../../hooks/useAnimations'

export default function PDFButton({ previewRef }) {
  const { state } = useFormStore()
  const { exportPDF, exporting } = usePDFExport()
  const btnRef = useRef(null)
  const fillRef = useRef(null)
  const labelRef = useRef(null)
  usePDFButtonHover(btnRef, fillRef, labelRef)

  return (
    <button
      ref={btnRef}
      onClick={() => exportPDF(previewRef, state.client.name)}
      disabled={exporting}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: exporting ? 'wait' : 'pointer',
        border: '1px solid #061b3d',
        borderRadius: '999px',
        background: '#061b3d',
        padding: '15px 24px',
        width: '100%',
        boxShadow: '0 16px 34px -24px rgba(2,8,23,0.76)',
      }}
    >
      <span
        ref={fillRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          pointerEvents: 'none',
        }}
      />
      <span
        ref={labelRef}
        style={{
          position: 'relative',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#ffffff',
        }}
      >
        {exporting ? 'rendering...' : 'export pdf'}
      </span>
    </button>
  )
}
