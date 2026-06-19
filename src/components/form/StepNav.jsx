export default function StepNav({
  onNext,
  onPrev,
  showPrev = true,
  showNext = true,
  nextDisabled = false,
  nextLabel = 'next',
}) {
  return (
    <div className="step-nav" data-animate>
      {showPrev && (
        <button
          className="step-nav-button step-nav-button-secondary"
          onClick={onPrev}
        >
          Back
        </button>
      )}
      {showNext && (
        <button
          className="step-nav-button step-nav-button-primary"
          onClick={nextDisabled ? undefined : onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}
