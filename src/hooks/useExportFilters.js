import { useState, useMemo } from 'react'

export function useExportFilters(exportsList) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [filterTemplate, setFilterTemplate] = useState('all')

  const filtered = useMemo(() => {
    let result = [...exportsList]

    if (filterTemplate !== 'all') {
      result = result.filter(e => e.snapshot?.template === filterTemplate)
    }

    const term = searchTerm.trim().toLowerCase()
    if (term) {
      result = result.filter(e => {
        const name = e.snapshot?.client?.name?.toLowerCase() ?? ''
        const title = e.snapshot?.project?.title?.toLowerCase() ?? ''
        const company = e.snapshot?.client?.company?.toLowerCase() ?? ''
        return name.includes(term) || title.includes(term) || company.includes(term)
      })
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.exportedAt) - new Date(b.exportedAt)
        case 'total_desc':
          return (b.totals?.total ?? 0) - (a.totals?.total ?? 0)
        case 'total_asc':
          return (a.totals?.total ?? 0) - (b.totals?.total ?? 0)
        case 'client_asc':
          return (a.snapshot?.client?.name ?? '').localeCompare(b.snapshot?.client?.name ?? '')
        case 'date_desc':
        default:
          return new Date(b.exportedAt) - new Date(a.exportedAt)
      }
    })

    return result
  }, [exportsList, searchTerm, sortBy, filterTemplate])

  return { filtered, searchTerm, setSearchTerm, sortBy, setSortBy, filterTemplate, setFilterTemplate }
}
