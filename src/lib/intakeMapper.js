import { NUMEN_SERVICES } from '../constants/services'
import { parseQuoteJson } from './quoteJson'
import { getQuoteCompleteness } from './quoteCompleteness'

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
const ISO_DATE_PATTERN = /\b(20\d{2})-(0[1-9]|1[0-2])-([0-2]\d|3[01])\b/
const US_DATE_PATTERN = /\b(0?[1-9]|1[0-2])\/([0-2]?\d|3[01])\/(20\d{2})\b/
const CURRENCIES = ['USD', 'EUR', 'MXN', 'GBP']

const SERVICE_HINTS = [
  { id: 's1', terms: ['full-stack', 'full stack', 'mvp', 'web app', 'web development'] },
  { id: 's2', terms: ['saas', 'platform', 'complete build'] },
  { id: 's3', terms: ['landing', 'landing page', 'corporate web', 'website', 'site'] },
  { id: 's4', terms: ['figma', 'design', 'product design', 'ui', 'ux'] },
  { id: 's5', terms: ['ai', 'openai', 'anthropic', 'rag', 'automation'] },
  { id: 's6', terms: ['devops', 'infrastructure', 'hosting', 'deploy'] },
  { id: 's7', terms: ['support', 'maintenance', 'scale', 'post-launch', 'post launch'] },
]

const FIELD_LABELS = {
  'client.name': 'Client name',
  'client.email': 'Client email',
  'project.title': 'Project title',
  'project.validUntil': 'Valid until',
  'project.currency': 'Currency',
  services: 'Services',
  template: 'Template',
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function cloneQuote(quote = {}) {
  return {
    ...quote,
    brand: { ...(quote.brand || {}) },
    meta: { ...(quote.meta || {}) },
    client: { ...(quote.client || {}) },
    project: { ...(quote.project || {}) },
    services: Array.isArray(quote.services) ? quote.services.map((service) => ({ ...service })) : [],
    customServices: Array.isArray(quote.customServices) ? quote.customServices.map((service) => ({ ...service })) : [],
  }
}

function mergeSection(base = {}, incoming = {}) {
  const out = { ...base }
  Object.entries(incoming || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') out[key] = value
  })
  return out
}

export function mergeQuoteDraft(currentQuote = {}, draft = {}) {
  const merged = cloneQuote(currentQuote)

  if (draft.brand) merged.brand = mergeSection(merged.brand, draft.brand)
  if (draft.meta) merged.meta = mergeSection(merged.meta, draft.meta)
  if (draft.client) merged.client = mergeSection(merged.client, draft.client)
  if (draft.project) merged.project = mergeSection(merged.project, draft.project)
  if (draft.notes) merged.notes = draft.notes
  if (draft.template) merged.template = draft.template
  if (draft.taxRate !== undefined) merged.taxRate = Number(draft.taxRate) || 0
  if (draft.discount !== undefined) merged.discount = Number(draft.discount) || 0
  if (Array.isArray(draft.services) && draft.services.length > 0) {
    const incomingById = new Map(draft.services.map((service) => [service.id, service]))
    merged.services = (merged.services || NUMEN_SERVICES).map((service) => ({
      ...service,
      ...(incomingById.get(service.id) || {}),
    }))
  }
  if (Array.isArray(draft.customServices) && draft.customServices.length > 0) {
    merged.customServices = draft.customServices
  }

  return merged
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1].trim().replace(/\s+/g, ' ')
  }
  return ''
}

function detectName(rawInput) {
  return firstMatch(rawInput, [
    /(?:client|cliente|for|para)\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ.'-]+(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ.'-]+){0,3})/i,
    /quote\s+for\s+([^,.\n]+)/i,
    /cotizaci[oó]n\s+para\s+([^,.\n]+)/i,
  ])
}

function detectProjectTitle(rawInput) {
  const explicit = firstMatch(rawInput, [
    /(?:project|proyecto)\s+([^,.\n]+)/i,
    /(?:for|para)\s+(?:a|an|una|un)\s+([^,.\n]+?)(?:\s+(?:budget|quote|presupuesto|cotizaci[oó]n)|$)/i,
  ])
  if (explicit) return explicit

  const lowered = rawInput.toLowerCase()
  if (lowered.includes('landing')) return 'Landing Page'
  if (lowered.includes('saas')) return 'SaaS Platform'
  if (lowered.includes('mvp')) return 'MVP Build'
  if (lowered.includes('website') || lowered.includes('sitio web')) return 'Website Project'
  return ''
}

function detectDate(rawInput) {
  const iso = rawInput.match(ISO_DATE_PATTERN)
  if (iso) return iso[0]

  const us = rawInput.match(US_DATE_PATTERN)
  if (!us) return ''
  const [, month, day, year] = us
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function detectCurrency(rawInput) {
  const upper = rawInput.toUpperCase()
  const code = CURRENCIES.find((currency) => upper.includes(currency))
  if (code) return code
  if (/\beuros?\b/i.test(rawInput)) return 'EUR'
  if (/\bpesos?\b|\bmxn\b/i.test(rawInput)) return 'MXN'
  if (/\bpounds?\b|\bgbp\b/i.test(rawInput)) return 'GBP'
  if (/\bdollars?\b|\busd\b|\$/i.test(rawInput)) return 'USD'
  return ''
}

function detectServices(rawInput, currentQuote = {}) {
  const lowered = rawInput.toLowerCase()
  const selectedIds = new Set()

  SERVICE_HINTS.forEach((hint) => {
    if (hint.terms.some((term) => lowered.includes(term))) selectedIds.add(hint.id)
  })

  if (selectedIds.size === 0) return []

  const services = Array.isArray(currentQuote.services) && currentQuote.services.length
    ? currentQuote.services
    : NUMEN_SERVICES

  return services.map((service) => ({
    ...service,
    selected: Boolean(service.selected || selectedIds.has(service.id)),
    quantity: Number(service.quantity) > 0 ? service.quantity : 1,
  }))
}

function detectAmountLineItems(rawInput) {
  const matches = [...rawInput.matchAll(/(?:\$|USD\s*)\s?([0-9][0-9,.]*)(?:\s+(?:for|por))?\s+([^,.\n]+)/gi)]
  return matches.slice(0, 6).map((match, index) => ({
    id: `ctx-${Date.now()}-${index}`,
    name: match[2].trim() || `Detected line item ${index + 1}`,
    price: Number(match[1].replace(/,/g, '')) || 0,
    quantity: 1,
  })).filter((service) => service.price > 0 && hasText(service.name))
}

export function mapContextToQuoteDraft(rawInput = '', currentQuote = {}) {
  const warnings = []
  const text = String(rawInput || '').trim()

  if (!text) {
    const completeness = getQuoteCompleteness(currentQuote)
    return {
      mappedData: {},
      missingFields: completeness.missingFields,
      suggestedQuestions: completeness.suggestedQuestions,
      warnings: ['Paste project context before analyzing.'],
      confidence: 0,
    }
  }

  const email = text.match(EMAIL_PATTERN)?.[0] || ''
  const name = detectName(text)
  const title = detectProjectTitle(text)
  const validUntil = detectDate(text)
  const currency = detectCurrency(text)
  const services = detectServices(text, currentQuote)
  const customServices = detectAmountLineItems(text)

  const mappedData = {
    client: { name, email },
    project: {
      title,
      description: text,
      validUntil,
      currency,
    },
    services,
    customServices,
  }

  if (!email) warnings.push('No client email was detected.')
  if (!name) warnings.push('No client name was detected.')
  if (!validUntil) warnings.push('No explicit valid-until date was detected.')
  if (!services.some((service) => service.selected) && customServices.length === 0) {
    warnings.push('No clear priced services were detected.')
  }

  const merged = mergeQuoteDraft(currentQuote, mappedData)
  const completeness = getQuoteCompleteness(merged)
  const detectedCount = [email, name, title, validUntil, currency, services.some((service) => service.selected) || customServices.length > 0]
    .filter(Boolean).length

  return {
    mappedData,
    missingFields: completeness.missingFields,
    suggestedQuestions: completeness.suggestedQuestions,
    warnings,
    confidence: Math.min(0.92, Math.round((detectedCount / 6) * 100) / 100),
  }
}

export function analyzeBudgetInput({ mode, rawInput, currentQuote = {} }) {
  if (mode === 'json') {
    const parsed = parseQuoteJson(String(rawInput || ''))
    if (!parsed.ok) {
      const completeness = getQuoteCompleteness(currentQuote)
      return {
        mappedData: {},
        missingFields: completeness.missingFields,
        suggestedQuestions: completeness.suggestedQuestions,
        warnings: [parsed.error],
        confidence: 0,
      }
    }

    const merged = mergeQuoteDraft(currentQuote, parsed.data)
    const completeness = getQuoteCompleteness(merged)
    return {
      mappedData: parsed.data,
      missingFields: completeness.missingFields,
      suggestedQuestions: completeness.suggestedQuestions,
      warnings: [],
      confidence: completeness.complete ? 1 : 0.82,
    }
  }

  if (mode === 'context') {
    return mapContextToQuoteDraft(rawInput, currentQuote)
  }

  const completeness = getQuoteCompleteness(currentQuote)
  return {
    mappedData: {},
    missingFields: completeness.missingFields,
    suggestedQuestions: completeness.suggestedQuestions,
    warnings: [`Unsupported input mode: ${mode}`],
    confidence: 0,
  }
}

export function describeMappedData(mappedData = {}) {
  const fields = []

  if (hasText(mappedData.client?.name)) fields.push({ label: 'Client detected', value: mappedData.client.name })
  if (hasText(mappedData.client?.email)) fields.push({ label: 'Email detected', value: mappedData.client.email })
  if (hasText(mappedData.project?.title)) fields.push({ label: 'Project detected', value: mappedData.project.title })
  if (hasText(mappedData.project?.currency)) fields.push({ label: 'Currency detected', value: mappedData.project.currency })
  if (hasText(mappedData.project?.validUntil)) fields.push({ label: 'Valid until', value: mappedData.project.validUntil })

  const selected = Array.isArray(mappedData.services)
    ? mappedData.services.filter((service) => service.selected)
    : []
  const custom = Array.isArray(mappedData.customServices) ? mappedData.customServices : []

  if (selected.length || custom.length) {
    fields.push({
      label: 'Services detected',
      value: `${selected.length + custom.length} line item${selected.length + custom.length === 1 ? '' : 's'}`,
    })
  }

  return fields.length
    ? fields
    : [{ label: 'No fields detected yet', value: 'Add context or import a valid quote JSON.' }]
}

export function fieldPathToLabel(path) {
  return FIELD_LABELS[path] || path
}
