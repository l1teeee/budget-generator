export default function StepHead({ number, name, hint }) {
  return (
    <div className="step-head" data-animate>
      <span className="step-kicker">
        {String(number).padStart(2, '0')} / 04
      </span>
      <h1 className="step-title">
        {name}
      </h1>
      {hint && (
        <p className="step-hint">
          {hint}
        </p>
      )}
    </div>
  )
}
