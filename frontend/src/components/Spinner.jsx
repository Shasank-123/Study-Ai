/**
 * components/Spinner.jsx
 *
 * A simple animated loading spinner with an optional label.
 */

export default function Spinner({ label = 'Thinking…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-label={label}>
      <div className="spinner" />
      <span className="spinner-text">{label}</span>
    </div>
  )
}
