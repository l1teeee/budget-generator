import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { saveExport } from '../lib/exportHistory'

export function useReExportPDF() {
  const docRef = useRef(null)
  const [reExportEntry, setReExportEntry] = useState(null)
  const [reExporting, setReExporting] = useState(false)

  useEffect(() => {
    if (!reExportEntry) return

    let cancelled = false

    const run = async () => {
      requestAnimationFrame(async () => {
        if (cancelled) return
        try {
          const el = docRef.current
          if (!el) throw new Error('docRef not mounted')

          const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: 794,
            height: 1123,
            windowWidth: 794,
            windowHeight: 1123,
          })

          const imgData = canvas.toDataURL('image/png')
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4', hotfixes: ['px_scaling'] })
          const pageW = pdf.internal.pageSize.getWidth()
          const pageH = pdf.internal.pageSize.getHeight()
          pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH, undefined, 'FAST')

          const { snapshot, totals } = reExportEntry
          const date = new Date().toISOString().split('T')[0]
          const raw = snapshot?.client?.name || 'cliente'
          const clientNameSafe = raw.trim().replace(/\s+/g, '-').toLowerCase() || 'cliente'
          const filename = `presupuesto-${clientNameSafe}-${date}.pdf`

          pdf.save(filename)
          saveExport(snapshot, totals, filename)
        } catch {
          // fall through to finally cleanup
        } finally {
          if (!cancelled) {
            setReExportEntry(null)
            setReExporting(false)
          }
        }
      })
    }

    run()

    return () => {
      cancelled = true
    }
  }, [reExportEntry])

  function triggerReExport(entry) {
    if (reExporting) return
    setReExportEntry(entry)
    setReExporting(true)
  }

  return { docRef, reExportEntry, reExporting, triggerReExport }
}
