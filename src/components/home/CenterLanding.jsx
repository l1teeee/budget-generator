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

export default function CenterLanding({ onStart }) {
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
      {/* ============ NAVBAR (unchanged) ============ */}
      <header className="lk-nav-wrap">
        <nav className="lk-nav">
          <button type="button" className="lk-logo" onClick={scrollTo('top')}>
            BudgetFlow AI
          </button>
          <div className="lk-nav-actions">
            <button type="button" className="lk-btn lk-btn-ghost lk-nav-json" onClick={onStart}>JSON</button>
            <button type="button" className="lk-btn lk-btn-primary lk-nav-start" onClick={onStart}>Start</button>
          </div>
        </nav>
      </header>

      {/* ============ HERO (unchanged) ============ */}
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

        {/* ---- hero mockup (unchanged) ---- */}
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

      {/* ============ MINIMAL FOOTER (brand signature) ============ */}
      <footer className="lk-foot lk-foot--min">
        <span className="lk-foot-brand">Delta Numen</span>
        <span className="lk-foot-sep">·</span>
        <a href="https://delta-numen.com" target="_blank" rel="noreferrer">delta-numen.com</a>
      </footer>
    </div>
  )
}
