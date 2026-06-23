import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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

const INTAKE_SCREEN_ORDER = {
  choose: 0,
  json: 1,
  context: 1,
  review: 2,
}

const INTAKE_TRANSITION_EASE = [0.22, 1, 0.36, 1]

function IntakeScreenTransition({ screen, direction, children }) {
  const prefersReducedMotion = useReducedMotion()
  const enterY = prefersReducedMotion ? 0 : direction >= 0 ? 22 : -18
  const exitY = prefersReducedMotion ? 0 : direction >= 0 ? -14 : 18

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={screen}
        className="intake-screen-frame"
        initial={{
          opacity: 0,
          y: enterY,
          filter: prefersReducedMotion ? 'none' : 'blur(6px)',
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        exit={{
          opacity: 0,
          y: exitY,
          filter: prefersReducedMotion ? 'none' : 'blur(4px)',
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.22,
          ease: INTAKE_TRANSITION_EASE,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function IntakeFlow({ onHome, onWizard }) {
  const { state, applyQuoteDraft, setStep } = useFormStore()
  const [screen, setScreen] = useState('choose')
  const [direction, setDirection] = useState(1)
  const [review, setReview] = useState(null)
  const [mode, setMode] = useState(null)

  const transitionTo = (nextScreen, forcedDirection) => {
    if (nextScreen === screen) return

    const currentOrder = INTAKE_SCREEN_ORDER[screen] ?? 0
    const nextOrder = INTAKE_SCREEN_ORDER[nextScreen] ?? 0
    setDirection(forcedDirection ?? (nextOrder >= currentOrder ? 1 : -1))
    setScreen(nextScreen)
  }

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

  let content

  if (screen === 'json') {
    content = (
      <JsonIntake
        currentQuote={state}
        onBack={() => transitionTo('choose', -1)}
        onAnalyzed={(result, nextMode) => {
          setReview(result)
          setMode(nextMode)
          transitionTo('review', 1)
        }}
      />
    )
  } else if (screen === 'context') {
    content = (
      <ContextIntake
        currentQuote={state}
        onBack={() => transitionTo('choose', -1)}
        onAnalyzed={(result, nextMode) => {
          setReview(result)
          setMode(nextMode)
          transitionTo('review', 1)
        }}
      />
    )
  } else if (screen === 'review') {
    content = (
      <IntakeReview
        result={review}
        mode={mode}
        onBack={() => transitionTo(mode || 'choose', -1)}
        onApply={applyReview}
      />
    )
  } else {
    content = (
      <StartModeSelector
        onHome={onHome}
        onManual={() => {
          setStep(1)
          onWizard()
        }}
        onJson={() => transitionTo('json', 1)}
        onContext={() => transitionTo('context', 1)}
      />
    )
  }

  return (
    <IntakeScreenTransition screen={screen} direction={direction}>
      {content}
    </IntakeScreenTransition>
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
