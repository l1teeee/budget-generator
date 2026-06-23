const KEY = 'budgen.brands.v1'

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function write(brands) {
  try { localStorage.setItem(KEY, JSON.stringify(brands)) } catch {}
}

export function loadBrands() { return read() }

export function saveBrand(brand) {
  const entry = {
    id: `br_${Date.now()}`,
    savedAt: new Date().toISOString(),
    brand: { ...brand },
  }
  write([entry, ...read()])
  return entry
}

export function deleteBrand(id) {
  write(read().filter(b => b.id !== id))
}
