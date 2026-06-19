const MODES = [
  {
    id: 'manual',
    title: 'Start manually',
    body: 'Use the guided 4-step flow when you already know the client, project and services.',
    meta: 'Best for clean entry',
  },
  {
    id: 'json',
    title: 'Import JSON',
    body: 'Paste or load a quote JSON and review what fields still need attention.',
    meta: 'Fastest from existing data',
  },
  {
    id: 'context',
    title: 'Paste project context',
    body: 'Drop rough notes and prepare a structured draft for a future AI connection.',
    meta: 'AI-ready local parser',
  },
]

export default function StartModeSelector({ onManual, onJson, onContext, onHome }) {
  const actions = { manual: onManual, json: onJson, context: onContext }

  return (
    <main className="intake-page">
      <header className="intake-nav">
        <button type="button" className="intake-logo" onClick={onHome}>
          BudgetFlow AI
        </button>
        <button type="button" className="intake-ghost" onClick={onHome}>
          home
        </button>
      </header>

      <section className="intake-hero">
        <p className="intake-eyebrow">Choose how to start</p>
        <h1 className="intake-title">Bring in what you already have.</h1>
        <p className="intake-lede">
          Start with a blank quote, import structured JSON, or paste rough context and let the local mapper prepare a draft.
        </p>
      </section>

      <section className="intake-mode-grid" aria-label="Budget start modes">
        {MODES.map((mode, index) => (
          <button
            type="button"
            key={mode.id}
            className={`intake-card${index === 0 ? ' intake-card-primary' : ''}`}
            onClick={actions[mode.id]}
          >
            <span className="intake-card-meta">{mode.meta}</span>
            <span className="intake-card-title">{mode.title}</span>
            <span className="intake-card-body">{mode.body}</span>
          </button>
        ))}
      </section>
    </main>
  )
}
