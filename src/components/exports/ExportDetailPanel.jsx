import { useRef, useEffect, useState } from 'react'
import DocLedger from '../preview/DocLedger'
import DocStatement from '../preview/DocStatement'
import './ExportDetailPanel.css'

const SYMBOLS = { USD: '$', EUR: '€', MXN: '$', GBP: '£' }
const fmtMoney = (n, code) => (SYMBOLS[code] || '$') + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

function buildDocData(snapshot, totals) {
  const services = [...(snapshot.services || []), ...(snapshot.customServices || [])]
  const lineItems = services.map((s) => ({
    name: s.name || s.label || '',
    price: s.price ?? s.unitPrice ?? 0,
    quantity: s.quantity ?? 1,
  }))
  return {
    brand: snapshot.brand || {},
    meta: snapshot.meta || {},
    client: snapshot.client || {},
    project: snapshot.project || {},
    totals: totals || snapshot.totals || {},
    lineItems,
    notes: snapshot.notes || '',
  }
}

const DOC_W = 794
const DOC_H = 1123
const PANEL_W = 720
const PANEL_HPAD = 28

export default function ExportDetailPanel({ entry, onClose, onEdit, onDuplicate }) {
  const overlayRef = useRef(null)
  const [scale, setScale] = useState(1)
  const previewRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const panelWidth = Math.min(PANEL_W, window.innerWidth)
      const available = panelWidth - PANEL_HPAD * 2
      setScale(available / DOC_W)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!entry) return null

  const { snapshot, totals, exportedAt, filename } = entry
  const template = snapshot?.template || 'ledger'
  const docData = buildDocData(snapshot || {}, totals)
  const currency = snapshot?.project?.currency || 'USD'
  const DocComponent = template === 'statement' ? DocStatement : DocLedger

  const scaledH = DOC_H * scale

  const fmtDate = (iso) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div className="exp-detail-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="exp-detail-panel">
        <div className="exp-detail-header">
          <span className="exp-detail-title">Quote detail</span>
          <button className="exp-detail-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#16161D" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="exp-detail-preview-wrap" ref={previewRef}>
          <div
            className="exp-detail-doc-scaler"
            style={{ transform: `scale(${scale})`, width: `${DOC_W}px`, height: `${DOC_H}px` }}
          >
            <DocComponent data={docData} />
          </div>
          <div style={{ height: `${scaledH}px` }} />
        </div>

        <div className="exp-detail-meta">
          <div className="exp-detail-meta-item">
            <div className="exp-detail-meta-label">Client</div>
            <div className="exp-detail-meta-value">{snapshot?.client?.name || '-'}</div>
          </div>
          <div className="exp-detail-meta-item">
            <div className="exp-detail-meta-label">Company</div>
            <div className="exp-detail-meta-value">{snapshot?.client?.company || '-'}</div>
          </div>
          <div className="exp-detail-meta-item">
            <div className="exp-detail-meta-label">Project</div>
            <div className="exp-detail-meta-value">{snapshot?.project?.title || '-'}</div>
          </div>
          <div className="exp-detail-meta-item">
            <div className="exp-detail-meta-label">Total</div>
            <div className="exp-detail-meta-value">{fmtMoney(totals?.total, currency)}</div>
          </div>
          <div className="exp-detail-meta-item">
            <div className="exp-detail-meta-label">Exported</div>
            <div className="exp-detail-meta-value">{fmtDate(exportedAt)}</div>
          </div>
          <div className="exp-detail-meta-item">
            <div className="exp-detail-meta-label">Template</div>
            <div className="exp-detail-meta-value exp-detail-template-badge">{template}</div>
          </div>
          {filename && (
            <div className="exp-detail-meta-item exp-detail-meta-full">
              <div className="exp-detail-meta-label">File</div>
              <div className="exp-detail-meta-value exp-detail-filename">{filename}</div>
            </div>
          )}
        </div>

        <div className="exp-detail-actions">
          <button className="exp-detail-btn-edit" onClick={() => onEdit(entry)}>Edit</button>
          {onDuplicate && (
            <button className="exp-detail-btn-dup" onClick={() => onDuplicate(entry)}>Duplicate</button>
          )}
        </div>
      </div>
    </div>
  )
}
