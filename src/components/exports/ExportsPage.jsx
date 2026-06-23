import { useState } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useFormStore } from '../../hooks/useFormStore'
import { deleteExport, loadExports } from '../../lib/exportHistory'
import { updateExportTemplate } from '../../lib/exportHistoryUpdates'
import { loadBrands, saveBrand, deleteBrand } from '../../lib/brandPresets'
import { duplicateQuote, exportAllToJSON, exportAllToCSV } from '../../lib/exportActions'
import { useReExportPDF } from '../../hooks/useReExportPDF'
import { useExportFilters } from '../../hooks/useExportFilters'
import { ExportFilters } from './ExportFilters'
import ExportDetailPanel from './ExportDetailPanel'
import DocLedger from '../preview/DocLedger'
import DocStatement from '../preview/DocStatement'
import FullScreenWizard from '../form/FullScreenWizard'
import './ExportsPage.css'

const CURRENCIES = { USD: '$', EUR: '€', MXN: '$', GBP: '£' }
const formatAmount = (x) => Number(x).toLocaleString('en-US', { maximumFractionDigits: 0 })
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const money = (amount, currency) => `${CURRENCIES[currency] || '$'}${formatAmount(amount || 0)}`

function buildLineItems(snapshot) {
  const selected = (snapshot.services || [])
    .filter(s => s.selected)
    .map(s => ({ name: s.name, price: Number(s.price) || 0, quantity: Number(s.quantity) || 1 }))
  const custom = (snapshot.customServices || [])
    .filter(s => s.name && Number(s.price) > 0)
    .map(s => ({ name: s.name, price: Number(s.price) || 0, quantity: Number(s.quantity) || 1 }))
  return [...selected, ...custom]
}

function buildPreviewData(entry) {
  const snapshot = entry.snapshot || {}
  return {
    brand: snapshot.brand || {},
    meta: snapshot.meta || {},
    client: snapshot.client || {},
    project: snapshot.project || {},
    totals: entry.totals || {},
    lineItems: buildLineItems(snapshot),
    notes: snapshot.notes || '',
  }
}

function ExportCard({ entry, onEdit, onDelete, onDetail, onReExport, reExportingEntry, onDuplicate, onTemplateChange }) {
  const snapshot = entry.snapshot || {}
  const client = snapshot.client || {}
  const project = snapshot.project || {}
  const totals = entry.totals || {}
  const currency = project.currency || 'USD'
  const template = snapshot.template === 'statement' ? 'statement' : 'ledger'
  const previewData = buildPreviewData(entry)
  const isThisReExporting = reExportingEntry?.id === entry.id

  return (
    <div className="exp-card">
      <div
        className="exp-preview-wrap"
        onClick={() => onDetail(entry)}
        style={{ cursor: 'pointer' }}
        title="View full detail"
      >
        <div className="exp-preview-doc">
          {template === 'statement' ? (
            <DocStatement data={previewData} />
          ) : (
            <DocLedger data={previewData} />
          )}
        </div>
        <div className="exp-preview-hint">View detail</div>
      </div>

      <div className="exp-card-body">
        <div className="exp-card-client">{client.name || 'Unnamed'}</div>
        {client.company && <div className="exp-card-co">{client.company}</div>}
        <div className="exp-card-project">{project.title || 'Untitled project'}</div>
        <div className="exp-card-row">
          <span className="exp-card-total">{money(totals.total, currency)}</span>
          <span className="exp-card-date">{formatDate(entry.exportedAt)}</span>
        </div>
        <div className="exp-card-template-row">
          {['ledger', 'statement'].map(t => (
            <button
              key={t}
              className={`exp-card-tpl-pill${template === t ? ' is-active' : ''}`}
              onClick={() => onTemplateChange(entry.id, t)}
            >
              {t === 'ledger' ? 'Ledger' : 'Statement'}
            </button>
          ))}
        </div>
      </div>

      <div className="exp-card-actions">
        <button className="exp-btn-edit" onClick={() => onEdit(entry)}>Edit</button>
        <button
          className="exp-btn-pdf"
          onClick={() => onReExport(entry)}
          disabled={!!reExportingEntry}
          title="Download PDF"
        >
          {isThisReExporting ? '···' : 'PDF'}
        </button>
        <button className="exp-btn-dup" onClick={() => onDuplicate(entry)} title="Duplicate quote">
          Copy
        </button>
        <button className="exp-btn-del" onClick={() => onDelete(entry.id)}>Del</button>
      </div>
    </div>
  )
}

function BrandsSection({ formState, onApply }) {
  const [brands, setBrands] = useState(loadBrands)

  const handleSave = () => {
    const entry = saveBrand(formState.brand)
    setBrands(prev => [entry, ...prev])
  }

  const handleDelete = (id) => {
    deleteBrand(id)
    setBrands(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="exp-brands">
      <div className="exp-brands-label">Brands</div>
      <button className="exp-brands-save" onClick={handleSave}>+ Save current</button>
      {brands.length > 0 && (
        <ul className="exp-brands-list">
          {brands.map(entry => (
            <li key={entry.id} className="exp-brands-item">
              <button className="exp-brands-apply" onClick={() => onApply(entry.brand)} title="Apply brand">
                {entry.brand.name || 'Unnamed'}
              </button>
              <button className="exp-brands-del" onClick={() => handleDelete(entry.id)} aria-label="Delete brand">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ExportsPage({ onHome }) {
  const [exportsList, setExportsList] = useState(() => loadExports())
  const [wizardOpen, setWizardOpen] = useState(false)
  const [detailEntry, setDetailEntry] = useState(null)
  const { state, replaceQuote, setStep, resetQuote, update } = useFormStore()
  const navigate = useNavigate()

  const { docRef, reExportEntry, reExporting, triggerReExport } = useReExportPDF()
  const { filtered, searchTerm, setSearchTerm, sortBy, setSortBy, filterTemplate, setFilterTemplate } = useExportFilters(exportsList)

  const count = exportsList.length

  const editEntry = (entry) => {
    flushSync(() => {
      replaceQuote(entry.snapshot)
      setStep(1)
    })
    navigate('/wizard')
  }

  const removeExport = (id) => {
    deleteExport(id)
    setExportsList(prev => prev.filter(e => e.id !== id))
    if (detailEntry?.id === id) setDetailEntry(null)
  }

  const handleDuplicate = (entry) => {
    duplicateQuote(entry, { replaceQuote, setStep })
    setWizardOpen(true)
  }

  const handleTemplateChange = (id, template) => {
    updateExportTemplate(id, template)
    setExportsList(prev =>
      prev.map(e => e.id === id ? { ...e, snapshot: { ...e.snapshot, template } } : e)
    )
    if (detailEntry?.id === id) {
      setDetailEntry(prev => ({ ...prev, snapshot: { ...prev.snapshot, template } }))
    }
  }

  const openNewQuote = () => {
    resetQuote()
    setStep(1)
    setWizardOpen(true)
  }

  const closeWizard = () => {
    setWizardOpen(false)
    setExportsList(loadExports())
  }

  const applyBrand = (brand) => {
    Object.entries(brand).forEach(([key, val]) => update(`brand.${key}`, val))
  }

  const reExportPreviewData = reExportEntry ? buildPreviewData(reExportEntry) : null
  const ReExportDoc = reExportEntry?.snapshot?.template === 'statement' ? DocStatement : DocLedger

  return (
    <div className="exp-page">
      <aside className="exp-sidebar">
        <button className="exp-sidebar-logo" onClick={onHome}>BudgetFlow</button>
        <button className="exp-btn-primary" onClick={openNewQuote}>+ New quote</button>

        <div className="exp-sidebar-divider" />

        <button
          className="exp-btn-ghost"
          onClick={() => exportAllToJSON(exportsList)}
          disabled={count === 0}
        >
          Export JSON
        </button>
        <button
          className="exp-btn-ghost"
          onClick={() => exportAllToCSV(exportsList)}
          disabled={count === 0}
        >
          Export CSV
        </button>

        <BrandsSection formState={state} onApply={applyBrand} />
      </aside>

      <main className="exp-main scroll-thin">
        <header className="exp-header">
          <h1 className="exp-title">Exports</h1>
          <div className="exp-subtitle">{count} export{count === 1 ? '' : 's'}</div>
        </header>

        {count > 0 && (
          <ExportFilters
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            sortBy={sortBy} setSortBy={setSortBy}
            filterTemplate={filterTemplate} setFilterTemplate={setFilterTemplate}
            totalCount={count}
            filteredCount={filtered.length}
          />
        )}

        {count === 0 ? (
          <div className="exp-empty">
            <div className="exp-empty-icon">—</div>
            <div className="exp-empty-title">No exports yet</div>
            <div className="exp-empty-sub">Export a quote to see it here.</div>
            <button className="exp-btn-primary" onClick={openNewQuote}>Start a quote</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="exp-empty">
            <div className="exp-empty-icon">—</div>
            <div className="exp-empty-title">No results</div>
            <div className="exp-empty-sub">Try a different search or filter.</div>
          </div>
        ) : (
          <div className="exp-grid">
            {filtered.map(entry => (
              <ExportCard
                key={entry.id}
                entry={entry}
                onEdit={editEntry}
                onDelete={removeExport}
                onDetail={setDetailEntry}
                onReExport={triggerReExport}
                reExportingEntry={reExportEntry}
                onDuplicate={handleDuplicate}
                onTemplateChange={handleTemplateChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Hidden offscreen container for re-export PDF capture */}
      <div
        ref={docRef}
        style={{ position: 'fixed', left: -20000, top: 0, width: 794, pointerEvents: 'none', zIndex: -1 }}
        aria-hidden="true"
      >
        {reExportEntry && reExportPreviewData && <ReExportDoc data={reExportPreviewData} />}
      </div>

      {detailEntry && (
        <ExportDetailPanel
          entry={detailEntry}
          onClose={() => setDetailEntry(null)}
          onEdit={(e) => { setDetailEntry(null); editEntry(e) }}
          onDuplicate={(e) => { setDetailEntry(null); handleDuplicate(e) }}
        />
      )}

      {wizardOpen && (
        <div className="exp-wizard-overlay" role="dialog" aria-modal="true" aria-label="New quote">
          <button className="exp-wizard-close" onClick={closeWizard} aria-label="Close wizard">×</button>
          <FullScreenWizard onHome={closeWizard} />
        </div>
      )}
    </div>
  )
}
