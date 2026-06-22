import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormStore } from '../../hooks/useFormStore'
import { deleteExport, loadExports } from '../../lib/exportHistory'
import DocLedger from '../preview/DocLedger'
import DocStatement from '../preview/DocStatement'
import './ExportsPage.css'

const CURRENCIES = { USD: '$', EUR: '€', MXN: '$', GBP: '£' }

const formatAmount = (x) => Number(x).toLocaleString('en-US', { maximumFractionDigits: 0 })

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
})

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

function ExportCard({ entry, onEdit, onDelete }) {
  const snapshot = entry.snapshot || {}
  const client = snapshot.client || {}
  const project = snapshot.project || {}
  const totals = entry.totals || {}
  const currency = project.currency || 'USD'
  const template = snapshot.template === 'statement' ? 'Statement' : 'Ledger'

  const previewData = {
    brand: snapshot.brand || {},
    meta: snapshot.meta || {},
    client,
    project,
    totals,
    lineItems: buildLineItems(snapshot),
    notes: snapshot.notes || '',
  }

  return (
    <div className="exp-card">
      <div className="exp-preview-wrap">
        <div className="exp-preview-doc">
          {template === 'Statement' ? (
            <DocStatement data={previewData} />
          ) : (
            <DocLedger data={previewData} />
          )}
        </div>
      </div>

      <div className="exp-card-body">
        <div className="exp-card-client">{client.name || 'Unnamed'}</div>
        {client.company && <div className="exp-card-co">{client.company}</div>}
        <div className="exp-card-project">{project.title || 'Untitled project'}</div>
        <div className="exp-card-row">
          <span className="exp-card-total">{money(totals.total, currency)}</span>
          <span className="exp-card-badge">{template}</span>
          <span className="exp-card-date">{formatDate(entry.exportedAt)}</span>
        </div>
      </div>

      <div className="exp-card-actions">
        <button className="exp-btn-edit" onClick={() => onEdit(entry)}>Edit</button>
        <button className="exp-btn-del" onClick={() => onDelete(entry.id)}>Delete</button>
      </div>
    </div>
  )
}

export default function ExportsPage({ onHome, onNewQuote }) {
  const [exportsList, setExportsList] = useState(() => loadExports())
  const { replaceQuote } = useFormStore()
  const navigate = useNavigate()
  const count = exportsList.length

  const editEntry = (entry) => {
    replaceQuote(entry.snapshot)
    navigate('/wizard')
  }

  const removeExport = (id) => {
    deleteExport(id)
    setExportsList(prev => prev.filter(entry => entry.id !== id))
  }

  return (
    <div className="exp-page">
      <aside className="exp-sidebar">
        <button className="exp-sidebar-logo" onClick={onHome}>BudgetFlow</button>
        <button className="exp-btn-primary" onClick={onNewQuote}>+ New quote</button>
      </aside>

      <main className="exp-main scroll-thin">
        <header className="exp-header">
          <h1 className="exp-title">Exports</h1>
          <div className="exp-subtitle">
            {count} export{count === 1 ? '' : 's'}
          </div>
        </header>

        {count === 0 ? (
          <div className="exp-empty">
            <div className="exp-empty-icon">—</div>
            <div className="exp-empty-title">No exports yet</div>
            <div className="exp-empty-sub">Export a quote to see it here.</div>
            <button className="exp-btn-primary" onClick={onNewQuote}>Start a quote</button>
          </div>
        ) : (
          <div className="exp-grid">
            {exportsList.map(entry => (
              <ExportCard
                key={entry.id}
                entry={entry}
                onEdit={editEntry}
                onDelete={removeExport}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
