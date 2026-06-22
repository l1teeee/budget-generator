const STORAGE_KEY = 'budgen.exports.v1'

const clone = (value) => JSON.parse(JSON.stringify(value || {}))

const toNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

const normalizeTotals = (totals = {}) => ({
  subtotal: toNumber(totals.subtotal),
  total: toNumber(totals.total),
  taxAmount: toNumber(totals.taxAmount),
  discountAmount: toNumber(totals.discountAmount),
  taxPct: toNumber(totals.taxPct),
  discountPct: toNumber(totals.discountPct),
})

const sortNewestFirst = (entries) => entries
  .filter(entry => entry && typeof entry === 'object')
  .sort((a, b) => new Date(b.exportedAt).getTime() - new Date(a.exportedAt).getTime())

function readStored() {
  if (typeof localStorage === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? sortNewestFirst(parsed) : []
  } catch {
    return []
  }
}

function writeStored(entries) {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortNewestFirst(entries)))
  } catch {
    // Ignore storage failures so PDF export success is not undone by history persistence.
  }
}

export function saveExport(snapshot, totals, filename) {
  const entry = {
    id: `exp_${Date.now()}`,
    exportedAt: new Date().toISOString(),
    filename: String(filename || ''),
    snapshot: clone(snapshot),
    totals: normalizeTotals(totals),
  }

  writeStored([entry, ...readStored()])
  return entry
}

export function loadExports() {
  return readStored()
}

export function deleteExport(id) {
  writeStored(readStored().filter(entry => entry.id !== id))
}

export function clearExports() {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}
