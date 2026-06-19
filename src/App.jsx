import { useRef, useState } from 'react'
import { FormProvider, useFormStore } from './hooks/useFormStore'
import HomePage from './components/home/HomePage'
import StatusBar from './components/layout/StatusBar'
import StepProgress from './components/layout/StepProgress'
import FormStep1 from './components/form/FormStep1'
import FormStep2 from './components/form/FormStep2'
import FormStep3 from './components/form/FormStep3'
import FormStep4 from './components/form/FormStep4'
import TemplatePreview from './components/preview/TemplatePreview'
import JsonPanel from './components/form/JsonPanel'
import BrandDrawer from './components/form/BrandDrawer'
import StartModeSelector from './components/intake/StartModeSelector'
import JsonIntake from './components/intake/JsonIntake'
import ContextIntake from './components/intake/ContextIntake'
import IntakeReview from './components/intake/IntakeReview'
import MissingQuestionsPanel from './components/intake/MissingQuestionsPanel'
import { getQuoteCompleteness } from './lib/quoteCompleteness'
import { mergeQuoteDraft } from './lib/intakeMapper'

function Shell({ onHome }) {
  const { step } = useFormStore()
  const previewRef = useRef(null)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [brandOpen, setBrandOpen] = useState(false)

  const steps = {
    1: <FormStep1 />,
    2: <FormStep2 />,
    3: <FormStep3 />,
    4: <FormStep4 previewRef={previewRef} onOpenJson={() => setJsonOpen(true)} />,
  }

  return (
    <div className="app-shell">
      <StatusBar onHome={onHome} onOpenBrand={() => setBrandOpen(true)} onOpenJson={() => setJsonOpen(true)} />

      <main className="app-main">
        <section className="workflow-column" aria-label="Budget wizard">
          <StepProgress />

          <div
            key={step}
            className="editor-panel scroll-thin"
          >
            <MissingQuestionsPanel />
            {steps[step]}
          </div>
        </section>

        <aside className="preview-panel" aria-label="Live budget preview">
          <div className="preview-panel-head">
            <strong>Preview</strong>
          </div>
          <TemplatePreview previewRef={previewRef} />
        </aside>
      </main>

      {jsonOpen && <JsonPanel open onClose={() => setJsonOpen(false)} />}
      {brandOpen && <BrandDrawer open onClose={() => setBrandOpen(false)} />}
    </div>
  )
}

function IntakeFlow({ onHome, onWizard }) {
  const { state, applyQuoteDraft, setStep } = useFormStore()
  const [screen, setScreen] = useState('choose')
  const [review, setReview] = useState(null)
  const [mode, setMode] = useState(null)

  const openWizardAt = (quote) => {
    const completeness = getQuoteCompleteness(quote)
    setStep(completeness.firstIncompleteStep?.number || 4)
    onWizard()
  }

  const applyReview = () => {
    if (!review) return
    const merged = mergeQuoteDraft(state, review.mappedData)
    applyQuoteDraft(review.mappedData)
    openWizardAt(merged)
  }

  if (screen === 'json') {
    return (
      <JsonIntake
        currentQuote={state}
        onBack={() => setScreen('choose')}
        onAnalyzed={(result, nextMode) => {
          setReview(result)
          setMode(nextMode)
          setScreen('review')
        }}
      />
    )
  }

  if (screen === 'context') {
    return (
      <ContextIntake
        currentQuote={state}
        onBack={() => setScreen('choose')}
        onAnalyzed={(result, nextMode) => {
          setReview(result)
          setMode(nextMode)
          setScreen('review')
        }}
      />
    )
  }

  if (screen === 'review') {
    return (
      <IntakeReview
        result={review}
        mode={mode}
        onBack={() => setScreen(mode || 'choose')}
        onApply={applyReview}
      />
    )
  }

  return (
    <StartModeSelector
      onHome={onHome}
      onManual={() => {
        setStep(1)
        onWizard()
      }}
      onJson={() => setScreen('json')}
      onContext={() => setScreen('context')}
    />
  )
}

function AppContent() {
  const [view, setView] = useState('home')

  if (view === 'home') {
    return <HomePage onStart={() => setView('intake')} />
  }

  if (view === 'intake') {
    return <IntakeFlow onHome={() => setView('home')} onWizard={() => setView('wizard')} />
  }

  return (
    <Shell onHome={() => setView('home')} />
  )
}

export default function App() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  )
}
