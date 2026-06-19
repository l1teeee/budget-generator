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

      <div className="app-main">
        <StepProgress />

        <div
          key={step}
          className="editor-panel scroll-thin"
        >
          {steps[step]}
        </div>

        <TemplatePreview previewRef={previewRef} />
      </div>

      {jsonOpen && <JsonPanel open onClose={() => setJsonOpen(false)} />}
      {brandOpen && <BrandDrawer open onClose={() => setBrandOpen(false)} />}
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('home')

  if (view === 'home') {
    return <HomePage onStart={() => setView('generator')} />
  }

  return (
    <FormProvider>
      <Shell onHome={() => setView('home')} />
    </FormProvider>
  )
}
