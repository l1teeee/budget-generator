import { useEffect, useRef } from 'react'
import { scrollToLandingSection, useHomeAnimations } from '../../hooks/useHomeAnimations'

const MOCK_FIELDS = [
  ['Client', 'John Carter'],
  ['Project', 'Landing Page'],
  ['Services', '3'],
  ['Total', '$2,700'],
  ['Template', 'Ledger'],
  ['Status', 'Ready'],
]

const MOCK_LINES = [
  ['Design', '$500'],
  ['Landing Page', '$800'],
  ['AI Integration', '$1,500'],
]

const STEPS = [
  { n: '1', name: 'Client', status: 'Add details' },
  { n: '2', name: 'Project', status: 'Scope it' },
  { n: '3', name: 'Services', status: 'Price it' },
  { n: '4', name: 'Export', status: 'PDF / JSON' },
]

export default function HomePage({ onStart }) {
  const root = useRef(null)
  useHomeAnimations(root)

  useEffect(() => {
    document.body.classList.add('lk-active')
    return () => document.body.classList.remove('lk-active')
  }, [])

  const scrollTo = (id) => () => {
    scrollToLandingSection(id)
  }

  return (
    <div className="lk" ref={root}>
      {/* ============ NAVBAR ============ */}
      <header className="lk-nav-wrap">
        <nav className="lk-nav">
          <button type="button" className="lk-logo" onClick={scrollTo('top')}>
            BudgetFlow AI
          </button>
          <div className="lk-nav-links">
            <button type="button" className="lk-nav-link" onClick={scrollTo('create')}>Create</button>
            <button type="button" className="lk-nav-link" onClick={scrollTo('import-json')}>Import JSON</button>
            <button type="button" className="lk-nav-link" onClick={scrollTo('preview')}>Preview</button>
            <button type="button" className="lk-nav-link" onClick={scrollTo('export')}>Export</button>
          </div>
          <div className="lk-nav-actions">
            <button type="button" className="lk-btn lk-btn-ghost lk-nav-json" onClick={onStart}>JSON</button>
            <button type="button" className="lk-btn lk-btn-primary lk-nav-start" onClick={onStart}>Start</button>
          </div>
        </nav>
      </header>

      {/* ============ HERO ============ */}
      <section className="lk-hero" id="top">
        <div className="lk-hero-inner">
          <p className="lk-eyebrow">Budget generator</p>
          <h1 className="lk-h1">Start your budget in seconds.</h1>
          <p className="lk-sub">
            Create a clean quote, preview it live, and export it as PDF or JSON.
          </p>
          <div className="lk-cta-row" id="import-json">
            <button type="button" className="lk-btn lk-btn-primary lk-btn-hero" onClick={onStart}>
              Start your budget
            </button>
            <button type="button" className="lk-btn lk-btn-ghost lk-btn-lg" onClick={onStart}>
              Import JSON
            </button>
          </div>
          <p className="lk-microcopy">No account. No backend. Local-first.</p>
        </div>

        {/* ---- hero mockup ---- */}
        <div className="lk-mock" aria-label="Example budget document">
          <div className="lk-mock-head">
            <span className="lk-mock-title">Coffee Shop Launch</span>
            <span className="lk-mock-badge">Ready</span>
          </div>
          <div className="lk-mock-fields">
            {MOCK_FIELDS.map(([label, value]) => (
              <div className="lk-mock-field" key={label}>
                <span className="lk-mock-label">{label}</span>
                <span className="lk-mock-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="lk-mock-table">
            {MOCK_LINES.map(([name, amount]) => (
              <div className="lk-mock-line" key={name}>
                <span>{name}</span>
                <span>{amount}</span>
              </div>
            ))}
          </div>
          <div className="lk-mock-foot">Export PDF</div>
        </div>
      </section>

      {/* ============ LIVE CREATION FLOW ============ */}
      <section className="lk-steps js-reveal" id="create">
        <div className="lk-steps-head">
          <h2 className="lk-h2">Four steps. One clean budget.</h2>
          <p className="lk-steps-sub">Fill it, preview it, export it.</p>
        </div>
        <div className="lk-steps-row">
          {STEPS.map((s) => (
            <div className="lk-step" key={s.n}>
              <span className="lk-step-n">{s.n}</span>
              <span className="lk-step-name">{s.name}</span>
              <span className="lk-step-status">{s.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PREVIEW + EXPORT (dark) ============ */}
      <section className="lk-preview js-reveal" id="preview">
        <div className="lk-preview-inner">
          <h2 className="lk-h2 lk-h2--light">Preview live. Export clean.</h2>
          <p className="lk-preview-sub">Your A4 document updates as you build.</p>
          <div className="lk-cta-row lk-cta-row--center" id="export">
            <button type="button" className="lk-btn lk-btn-primary lk-btn-lg" onClick={onStart}>
              Create budget
            </button>
            <button type="button" className="lk-btn lk-btn-ghost-light lk-btn-lg" onClick={onStart}>
              Open JSON panel
            </button>
          </div>
          <div className="lk-templates">
            <div className="lk-template">Ledger</div>
            <div className="lk-template">Statement</div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA (green) ============ */}
      <section className="lk-final js-reveal">
        <h2 className="lk-h2 lk-final-title">Ready to create your budget?</h2>
        <button type="button" className="lk-btn lk-btn-primary lk-btn-hero" onClick={onStart}>
          Start your budget
        </button>
        <p className="lk-final-note">PDF and JSON export included.</p>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lk-foot">
        <span className="lk-foot-brand">BudgetFlow AI</span>
        <span className="lk-foot-sep">·</span>
        <span>Numen Agency</span>
        <span className="lk-foot-sep">·</span>
        <a href="https://delta-numen.com" target="_blank" rel="noreferrer">delta-numen.com</a>
      </footer>
    </div>
  )
}
