const KEY = 'budgen.exports.v1'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    // ignore
  }
}

export function updateExportTemplate(id, template) {
  const entries = read()
  const index = entries.findIndex(e => e.id === id)
  if (index === -1) return null
  entries[index] = {
    ...entries[index],
    snapshot: { ...entries[index].snapshot, template },
  }
  write(entries)
  return entries[index]
}
