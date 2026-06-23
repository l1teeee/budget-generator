import './ExportFilters.css'

const TEMPLATES = [
  { value: 'all', label: 'All' },
  { value: 'ledger', label: 'Ledger' },
  { value: 'statement', label: 'Statement' },
]

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'total_desc', label: 'Total ↓' },
  { value: 'total_asc', label: 'Total ↑' },
  { value: 'client_asc', label: 'Client A-Z' },
]

export function ExportFilters({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterTemplate,
  setFilterTemplate,
  totalCount,
  filteredCount,
}) {
  const countLabel =
    filteredCount < totalCount
      ? `${filteredCount} of ${totalCount}`
      : `${totalCount} export${totalCount === 1 ? '' : 's'}`

  return (
    <div className="exp-filters">
      <div className="exp-filters-search">
        <span className="exp-filters-search-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className="exp-filters-input"
          type="text"
          placeholder="Search by client or project..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="exp-filters-pills">
        {TEMPLATES.map(t => (
          <button
            key={t.value}
            className={`exp-filters-pill${filterTemplate === t.value ? ' is-active' : ''}`}
            onClick={() => setFilterTemplate(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <select
        className="exp-filters-select"
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <span className="exp-filters-count">{countLabel}</span>
    </div>
  )
}
