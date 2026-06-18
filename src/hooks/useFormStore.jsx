/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { NUMEN_SERVICES } from '../constants/services'
import { serializeQuote, parseQuoteJson } from '../lib/quoteJson'

const STORAGE_KEY = 'budgen.quote.v2'

const FormContext = createContext(null)

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function makeDefaults() {
  return {
    brand: {
      name: 'Your Brand',
      tagline: 'Add your tagline in the brand panel.',
      email: '',
      phone: '',
      website: '',
    },
    meta: {
      quoteId: '0001',
      issuedDate: todayISO(),
    },
    client: { name: '', email: '', company: '', phone: '' },
    project: { title: '', description: '', validUntil: '', currency: 'USD' },
    services: NUMEN_SERVICES.map(s => ({ ...s, selected: false })),
    customServices: [],
    template: 'ledger',
    notes: '',
    taxRate: 0,
    discount: 0,
  }
}

function mergeSection(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return base
  const out = { ...base }
  for (const key of Object.keys(base)) {
    if (incoming[key] !== undefined && incoming[key] !== '') out[key] = incoming[key]
  }
  return out
}

function hydrate(defaults, data) {
  if (!data) return defaults
  return {
    ...defaults,
    brand: mergeSection(defaults.brand, data.brand),
    meta: mergeSection(defaults.meta, data.meta),
    client: mergeSection(defaults.client, data.client),
    project: mergeSection(defaults.project, data.project),
    services: Array.isArray(data.services) && data.services.length
      ? data.services.map(s => ({ selected: false, ...s }))
      : defaults.services,
    customServices: Array.isArray(data.customServices) ? data.customServices : defaults.customServices,
    template: data.template === 'statement' ? 'statement' : 'ledger',
    notes: typeof data.notes === 'string' ? data.notes : defaults.notes,
    taxRate: Number(data.taxRate) || 0,
    discount: Number(data.discount) || 0,
  }
}

function loadInitial() {
  const defaults = makeDefaults()
  if (typeof localStorage === 'undefined') return defaults
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaults
  const parsed = parseQuoteJson(raw)
  if (!parsed.ok) return defaults
  return hydrate(defaults, parsed.data)
}

export function FormProvider({ children }) {
  const [state, setState] = useState(loadInitial)
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    const id = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeQuote(state)))
      setSaved(true)
      setTimeout(() => setSaved(false), 1200)
    }, 350)
    return () => clearTimeout(id)
  }, [state])

  const update = (path, value) => {
    setState(prev => {
      const keys = path.split('.')
      if (keys.length === 1) return { ...prev, [keys[0]]: value }
      const [a, b] = keys
      return { ...prev, [a]: { ...prev[a], [b]: value } }
    })
  }

  const toggleService = (id) => {
    setState(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, selected: !s.selected } : s),
    }))
  }

  const updateServiceQuantity = (id, quantity) => {
    setState(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, quantity: Math.max(1, quantity) } : s),
    }))
  }

  const addCustomService = () => {
    setState(prev => ({
      ...prev,
      customServices: [...prev.customServices, { id: `c${Date.now()}`, name: '', price: 0, quantity: 1 }],
    }))
  }

  const updateCustomService = (id, field, value) => {
    setState(prev => ({
      ...prev,
      customServices: prev.customServices.map(s => s.id === id ? { ...s, [field]: value } : s),
    }))
  }

  const removeCustomService = (id) => {
    setState(prev => ({
      ...prev,
      customServices: prev.customServices.filter(s => s.id !== id),
    }))
  }

  const setTemplate = (template) => setState(prev => ({ ...prev, template }))

  const replaceQuote = (data) => setState(hydrate(makeDefaults(), data))

  const resetQuote = () => {
    setState(makeDefaults())
    setStep(1)
  }

  const lineItems = useMemo(() => {
    const selected = state.services
      .filter(s => s.selected)
      .map(s => ({ name: s.name, price: Number(s.price) || 0, quantity: Number(s.quantity) || 1 }))
    const custom = state.customServices
      .filter(s => s.name && Number(s.price) > 0)
      .map(s => ({ name: s.name, price: Number(s.price) || 0, quantity: Number(s.quantity) || 1 }))
    return [...selected, ...custom]
  }, [state.services, state.customServices])

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, s) => sum + s.price * s.quantity, 0)
    const discountPct = Number(state.discount) || 0
    const discountAmount = subtotal * discountPct / 100
    const afterDiscount = subtotal - discountAmount
    const taxPct = Number(state.taxRate) || 0
    const taxAmount = afterDiscount * taxPct / 100
    const total = afterDiscount + taxAmount
    return { subtotal, discountPct, discountAmount, taxPct, taxAmount, total }
  }, [lineItems, state.discount, state.taxRate])

  const goNext = () => setStep(s => Math.min(s + 1, 4))
  const goPrev = () => setStep(s => Math.max(s - 1, 1))

  const value = {
    state,
    step,
    setStep,
    saved,
    update,
    toggleService,
    updateServiceQuantity,
    addCustomService,
    updateCustomService,
    removeCustomService,
    setTemplate,
    replaceQuote,
    resetQuote,
    lineItems,
    totals,
    goNext,
    goPrev,
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export function useFormStore() {
  return useContext(FormContext)
}
