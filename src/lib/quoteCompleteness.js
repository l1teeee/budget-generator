const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const SUPPORTED_CURRENCIES = new Set(['USD', 'EUR', 'MXN', 'GBP'])
const SUPPORTED_TEMPLATES = new Set(['ledger', 'statement'])

const hasText = (value) => typeof value === 'string' && value.trim().length > 0

const toNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

const readPath = (source, path) => (
  path.split('.').reduce((current, key) => {
    if (!current || typeof current !== 'object') return undefined
    return current[key]
  }, source)
)

const isValidIsoDate = (value) => {
  if (!hasText(value) || !ISO_DATE_PATTERN.test(value.trim())) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

const getSelectedLineItems = (quote = {}) => {
  const services = Array.isArray(quote.services) ? quote.services : []
  const customServices = Array.isArray(quote.customServices) ? quote.customServices : []

  const selectedServices = services.filter((service) => (
    service &&
    service.selected &&
    hasText(service.name) &&
    toNumber(service.price) > 0 &&
    toNumber(service.quantity || 1) > 0
  ))

  const validCustomServices = customServices.filter((service) => (
    service &&
    hasText(service.name) &&
    toNumber(service.price) > 0 &&
    toNumber(service.quantity || 1) > 0
  ))

  return [...selectedServices, ...validCustomServices]
}

const STEP_DEFINITIONS = [
  {
    id: 'client',
    number: 1,
    label: 'Client',
    fields: [
      {
        path: 'client.name',
        label: 'Client name',
        reason: 'Add the person or company receiving this quote.',
        question: 'Who should the quote be addressed to?',
        isMissing: (quote) => !hasText(readPath(quote, 'client.name')),
      },
      {
        path: 'client.email',
        label: 'Client email',
        reason: 'Add a valid email address for the quote recipient.',
        question: 'What email should appear on the quote?',
        isMissing: (quote) => !EMAIL_PATTERN.test(String(readPath(quote, 'client.email') || '').trim()),
      },
    ],
  },
  {
    id: 'project',
    number: 2,
    label: 'Project',
    fields: [
      {
        path: 'project.title',
        label: 'Project title',
        reason: 'Name the scope this quote covers.',
        question: 'What should this project be called?',
        isMissing: (quote) => !hasText(readPath(quote, 'project.title')),
      },
      {
        path: 'project.validUntil',
        label: 'Valid until',
        reason: 'Add an explicit quote expiration date.',
        question: 'What date should this quote remain valid until?',
        isMissing: (quote) => !isValidIsoDate(String(readPath(quote, 'project.validUntil') || '')),
      },
      {
        path: 'project.currency',
        label: 'Currency',
        reason: 'Choose the currency used for pricing.',
        question: 'Which currency should pricing use?',
        isMissing: (quote) => !SUPPORTED_CURRENCIES.has(String(readPath(quote, 'project.currency') || '').trim().toUpperCase()),
      },
    ],
  },
  {
    id: 'services',
    number: 3,
    label: 'Services',
    fields: [
      {
        path: 'services',
        label: 'At least one service',
        reason: 'Select or add one priced line item.',
        question: 'Which services or custom line items should be included?',
        isMissing: (quote) => getSelectedLineItems(quote).length === 0,
      },
    ],
  },
  {
    id: 'export',
    number: 4,
    label: 'Export',
    fields: [
      {
        path: 'template',
        label: 'Export template',
        reason: 'Choose the PDF layout for the final quote.',
        question: 'Should the export use the ledger or statement layout?',
        isMissing: (quote) => !SUPPORTED_TEMPLATES.has(String(quote.template || '').trim()),
      },
    ],
  },
]

const makeMissingField = (step, field) => ({
  step: step.id,
  stepNumber: step.number,
  stepLabel: step.label,
  path: field.path,
  label: field.label,
  reason: field.reason,
  question: field.question,
})

const getStepStatus = (percent) => {
  if (percent === 100) return 'complete'
  if (percent > 0) return 'partial'
  return 'missing'
}

export const getSuggestedQuestions = (missingFields = []) => {
  const questions = missingFields
    .map((field) => field.question)
    .filter(Boolean)

  return [...new Set(questions)]
}

export function getQuoteCompleteness(quote = {}) {
  const steps = STEP_DEFINITIONS.map((step) => {
    const missingFields = step.fields
      .filter((field) => field.isMissing(quote))
      .map((field) => makeMissingField(step, field))

    const totalFields = step.fields.length
    const completedFields = totalFields - missingFields.length
    const percent = totalFields === 0 ? 100 : Math.round((completedFields / totalFields) * 100)
    const status = getStepStatus(percent)

    return {
      id: step.id,
      number: step.number,
      label: step.label,
      status,
      complete: status === 'complete',
      percent,
      completedFields,
      totalFields,
      missingFields,
      requiredFields: step.fields.map((field) => ({
        path: field.path,
        label: field.label,
        reason: field.reason,
        question: field.question,
      })),
    }
  })

  const missingFields = steps.flatMap((step) => step.missingFields)
  const totalFields = steps.reduce((sum, step) => sum + step.totalFields, 0)
  const completedFields = steps.reduce((sum, step) => sum + step.completedFields, 0)
  const percent = totalFields === 0 ? 100 : Math.round((completedFields / totalFields) * 100)
  const firstIncomplete = steps.find((step) => !step.complete)
  const status = steps.reduce((result, step) => {
    result[step.id] = step.status
    return result
  }, {})

  return {
    steps,
    missingFields,
    suggestedQuestions: getSuggestedQuestions(missingFields),
    firstIncompleteStep: firstIncomplete
      ? {
          id: firstIncomplete.id,
          number: firstIncomplete.number,
          label: firstIncomplete.label,
          status: firstIncomplete.status,
        }
      : null,
    percent,
    status,
    complete: missingFields.length === 0,
  }
}
