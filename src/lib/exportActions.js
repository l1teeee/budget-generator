function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function duplicateQuote(entry, { replaceQuote, setStep }) {
  const clone = JSON.parse(JSON.stringify(entry.snapshot))
  const qid = clone.meta?.quoteId
  if (qid !== undefined && qid !== null) {
    const n = Number(qid)
    if (!isNaN(n) && String(n) === String(qid).replace(/^0+/, '') || /^\d+$/.test(String(qid))) {
      const padded = String(n + 1).padStart(String(qid).length, '0')
      clone.meta.quoteId = padded
    } else {
      clone.meta.quoteId = String(qid) + '-copy'
    }
  }
  replaceQuote(clone)
  setStep(1)
}

export function exportAllToJSON(exportsList) {
  const date = new Date().toISOString().split('T')[0]
  downloadBlob(
    JSON.stringify(exportsList, null, 2),
    `budget-exports-${date}.json`,
    'application/json'
  )
}

function escapeCSV(value) {
  const str = value == null ? '' : String(value)
  return str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str
}

export function exportAllToCSV(exportsList) {
  const date = new Date().toISOString().split('T')[0]
  const header = 'Client,Company,Project,Total,Currency,Template,Date,Filename'
  const rows = exportsList.map(entry => {
    const s = entry.snapshot || {}
    const fields = [
      s.client?.name,
      s.client?.company,
      s.project?.title,
      entry.totals?.total,
      s.project?.currency,
      s.template,
      entry.exportedAt ? entry.exportedAt.split('T')[0] : '',
      entry.filename,
    ]
    return fields.map(escapeCSV).join(',')
  })
  downloadBlob(
    [header, ...rows].join('\n'),
    `budget-exports-${date}.csv`,
    'text/csv'
  )
}
