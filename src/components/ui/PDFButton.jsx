import { useState } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { usePDFExport } from '../../hooks/usePDFExport'
import { usePageNav } from '../../hooks/usePageNav'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'
import { OriginButton } from './origin-button'

export default function PDFButton({ previewRef }) {
  const { state, totals } = useFormStore()
  const { exportPDF, exporting } = usePDFExport()
  const { goTo } = usePageNav()
  const [exported, setExported] = useState(false)
  const completeness = getQuoteCompleteness(state)
  const blocked = !completeness.complete

  const onClick = async () => {
    if (blocked || exporting || exported) return
    const entry = await exportPDF(previewRef, state.client.name, state, totals)
    if (!entry) return
    setExported(true)
    setTimeout(() => goTo('/exports'), 900)
  }

  const vars = blocked
    ? {
        '--ob-bg': '#E9E6DE',
        '--ob-text': '#565563',
        '--ob-fill': '#16161D',
        '--ob-text-filled': '#AEC2FF',
        '--ob-border': 'rgba(92,99,122,0.24)',
      }
    : exported
    ? {
        '--ob-bg': '#DCFCE7',
        '--ob-text': '#15803D',
        '--ob-fill': '#166534',
        '--ob-text-filled': '#F1EFE9',
        '--ob-border': '#86EFAC',
      }
    : {
        '--ob-bg': '#F0FDF4',
        '--ob-text': '#15803D',
        '--ob-fill': '#166534',
        '--ob-text-filled': '#F1EFE9',
        '--ob-border': '#86EFAC',
      }

  return (
    <OriginButton
      onClick={onClick}
      disabled={exporting || blocked}
      style={vars}
    >
      {exported ? '✓ exported' : exporting ? 'rendering...' : blocked ? 'complete required fields' : 'export pdf'}
    </OriginButton>
  )
}
