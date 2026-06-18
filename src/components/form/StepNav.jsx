export default function StepNav({
  onNext,
  onPrev,
  showPrev = true,
  showNext = true,
  nextDisabled = false,
  nextLabel = 'next',
}) {
  return (
    <div data-animate style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {showPrev && (
        <button
          onClick={onPrev}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#061b3d',
            background: '#ffffff',
            border: '1px solid #d7e1ee',
            borderRadius: '999px',
            padding: '12px 20px',
            boxShadow: '0 12px 26px -22px rgba(2,8,23,0.5)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f7fbff'
            e.currentTarget.style.borderColor = '#aebed2'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff'
            e.currentTarget.style.borderColor = '#d7e1ee'
          }}
        >
          back
        </button>
      )}
      {showNext && (
        <button
          onClick={nextDisabled ? undefined : onNext}
          disabled={nextDisabled}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: nextDisabled ? '#8795ad' : '#ffffff',
            background: nextDisabled ? '#eaf1fb' : '#061b3d',
            border: '1px solid transparent',
            borderRadius: '999px',
            padding: '12px 24px',
            flex: 1,
            boxShadow: nextDisabled ? 'none' : '0 14px 30px -22px rgba(2,8,23,0.7)',
          }}
          onMouseEnter={e => { if (!nextDisabled) e.currentTarget.style.background = '#0b2a5b' }}
          onMouseLeave={e => { if (!nextDisabled) e.currentTarget.style.background = '#061b3d' }}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}
