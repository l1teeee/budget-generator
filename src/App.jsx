import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { FormProvider, useFormStore } from './hooks/useFormStore'
import { usePageNav } from './hooks/usePageNav'
import HomePage from './components/home/HomePage'
import PageTransition from './components/layout/PageTransition'
import FullScreenWizard from './components/form/FullScreenWizard'
import StartModeSelector from './components/intake/StartModeSelector'
import JsonIntake from './components/intake/JsonIntake'
import ContextIntake from './components/intake/ContextIntake'
import IntakeReview from './components/intake/IntakeReview'
import ExportsPage from './components/exports/ExportsPage'
import { getQuoteCompleteness } from './lib/quoteCompleteness'
import { mergeQuoteDraft } from './lib/intakeMapper'

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

function AppRoutes() {
  const { goTo } = usePageNav()
  const location = useLocation()

  return (
    <PageTransition key={location.pathname}>
      <Routes>
        <Route path="/" element={<HomePage onStart={() => goTo('/exports')} onJson={() => goTo('/intake')} />} />
        <Route path="/intake" element={<IntakeFlow onHome={() => goTo('/')} onWizard={() => goTo('/wizard')} />} />
        <Route path="/wizard" element={<FullScreenWizard onHome={() => goTo('/')} />} />
        <Route path="/exports" element={<ExportsPage onHome={() => goTo('/')} onNewQuote={() => goTo('/intake')} />} />
      </Routes>
    </PageTransition>
  )
}

export default function App() {
  return (
    <FormProvider>
      <AppRoutes />
    </FormProvider>
  )
}
