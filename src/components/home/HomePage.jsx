import { useEffect, useRef, useState } from 'react'

const LEDGER = [
  ['Rent & Location', '$1,200'],
  ['Equipment', '$3,800'],
  ['Marketing', '$750'],
  ['Staff', '$2,400'],
  ['Emergency Fund', '$900'],
]

const INFO = [
  {
    idx: '01',
    title: 'How it works',
    sub: 'Client, project, services, export — four guided steps.',
    body: 'Fill in the client and project details, add your services with quantities and rates, apply discount or tax, then export. Your draft is saved locally as you type, so you can pick it up later.',
  },
  {
    idx: '02',
    title: 'Two document templates',
    sub: 'A tabular ledger or an editorial statement.',
    body: 'Ledger lays your figures out as a clean financial sheet. Statement is a typographic, black-band quote. Pick either at the export step — both render pixel-for-pixel into the PDF.',
  },
  {
    idx: '03',
    title: 'Export PDF & JSON',
    sub: 'Print-ready file, or structured data to reuse.',
    body: 'Download a polished, 1:1 PDF for the client, or export the quote as JSON to re-import, version, or pipe into another system. No spreadsheet setup, no formulas.',
  },
  {
    idx: '04',
    title: 'Numen Agency',
    sub: 'Built in-house at delta-numen.com.',
    body: 'This generator is an internal Numen tool, fully editable to your own brand — name, tagline, contact and quote ID all live in the brand drawer. Reach us at delta-numen.com.',
  },
]

function InfoRow({ item, open, onToggle }) {
  const buttonId = `home-info-button-${item.idx}`
  const panelId = `home-info-panel-${item.idx}`

  return (
    <div className="link-cell" style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        type="button"
        className="link-row"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        style={{ borderBottom: 'none' }}
      >
        <span className="link-idx">{item.idx}</span>
        <span className="link-main">
          <span className="link-title">{item.title}</span>
          <span className="link-sub">{item.sub}</span>
        </span>
        <svg
          className="link-arr"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{ transform: open ? 'rotate(90deg)' : 'none' }}
        >
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={panelId}
        className="link-panel"
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
        }}
      >
        <div className="link-panel-inner">
          <p
            style={{
              margin: 0,
              padding: '0 4px 20px 46px',
              fontSize: '14.5px',
              lineHeight: 1.6,
              color: 'var(--muted)',
              maxWidth: '52ch',
            }}
          >
            {item.body}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage({ onStart }) {
  const ref = useRef(null)
  const [openIdx, setOpenIdx] = useState(-1)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const id = requestAnimationFrame(() => node.classList.add('is-in'))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="home" ref={ref}>
      <div className="home-col">
        <header className="home-mast reveal">
          <div className="home-word">
            <b>BudgetFlow</b>
            <span className="home-tag">AI</span>
          </div>
          <span className="home-est">Numen · Est. 2026</span>
        </header>

        <section className="home-hero reveal">
          <h1 className="home-h1">
            Create accurate budgets in minutes, <em>not hours.</em>
          </h1>
          <p className="home-lede">
            Describe a project and turn it into a clean, editable quote — categories,
            estimates, totals and an export-ready document.
          </p>
        </section>

        <div className="home-cta reveal">
          <button type="button" className="btn btn-primary" onClick={onStart}>
            Start your budget
            <span className="arr" aria-hidden="true">→</span>
          </button>
          <p className="home-note">
            No account, no spreadsheet setup.<br />
            Your draft saves automatically as you go.
          </p>
        </div>

        <section className="ledger reveal" aria-label="Example generated budget">
          <div className="ledger-head">
            <b>Coffee Shop Launch</b>
            <span>Draft</span>
          </div>
          <div className="ledger-body">
            {LEDGER.map(([name, amount]) => (
              <div className="ledger-row" key={name}>
                <span>{name}</span>
                <span>{amount}</span>
              </div>
            ))}
            <div className="ledger-total">
              <span className="lbl">Estimated total</span>
              <span className="val">$9,050</span>
            </div>
          </div>
        </section>

        <section className="home-links reveal" aria-label="About this tool">
          {INFO.map((item, i) => (
            <InfoRow
              key={item.idx}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx((cur) => (cur === i ? -1 : i))}
            />
          ))}
        </section>

        <footer className="home-foot reveal">
          <span>© 2026 BudgetFlow · Numen Agency</span>
          <a href="https://delta-numen.com" target="_blank" rel="noreferrer">
            delta-numen.com
          </a>
        </footer>
      </div>
    </div>
  )
}
