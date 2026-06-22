import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { PDF_CONFIG } from '../constants/pdfConfig'
import { saveExport } from '../lib/exportHistory'

export function usePDFExport() {
  const [exporting, setExporting] = useState(false)
  const [lastExport, setLastExport] = useState(null)

  const exportPDF = async (elementRef, clientName, state, totals) => {
    const el = elementRef.current
    if (!el || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(el, {
        scale: PDF_CONFIG.scale,
        useCORS: PDF_CONFIG.useCORS,
        backgroundColor: PDF_CONFIG.backgroundColor,
        width: PDF_CONFIG.width,
        height: PDF_CONFIG.height,
        windowWidth: PDF_CONFIG.width,
        windowHeight: PDF_CONFIG.height,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4', hotfixes: ['px_scaling'] })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH, undefined, 'FAST')

      const date = new Date().toISOString().split('T')[0]
      const safe = (clientName || 'cliente').trim().replace(/\s+/g, '-').toLowerCase() || 'cliente'
      const filename = `presupuesto-${safe}-${date}.pdf`
      pdf.save(filename)
      const entry = saveExport(state, totals, filename)
      setLastExport(entry)
      return entry
    } finally {
      setExporting(false)
    }
  }

  return { exportPDF, exporting, lastExport }
}
