import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { PDF_CONFIG } from '../constants/pdfConfig'

export function usePDFExport() {
  const [exporting, setExporting] = useState(false)

  const exportPDF = async (elementRef, clientName) => {
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
      pdf.save(`presupuesto-${safe}-${date}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return { exportPDF, exporting }
}
