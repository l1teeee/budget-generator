import { useRef, useState } from 'react'
import { FormProvider, useFormStore } from './hooks/useFormStore'
import StatusBar from './components/layout/StatusBar'
import StepProgress from './components/layout/StepProgress'
import FormStep1 from './components/form/FormStep1'
import FormStep2 from './components/form/FormStep2'
import FormStep3 from './components/form/FormStep3'
import FormStep4 from './components/form/FormStep4'
import TemplatePreview from './components/preview/TemplatePreview'
import JsonPanel from './components/form/JsonPanel'
import BrandDrawer from './components/form/BrandDrawer'

function Shell() {
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
      <StatusBar onOpenBrand={() => setBrandOpen(true)} onOpenJson={() => setJsonOpen(true)} />

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
  return (
    <FormProvider>
      <Shell />
    </FormProvider>
  )
}
