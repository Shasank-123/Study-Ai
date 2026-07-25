/**
 * components/AnswerCard.jsx
 *
 * Displays the AI's answer after the question is submitted.
 * Shows a full-card spinner while the request is in flight.
 * Shows a styled error message if the request fails.
 */

import Spinner from './Spinner'

const NOT_FOUND_TEXT = "I couldn't find that information in the uploaded document."

export default function AnswerCard({ askStatus, answer, askError, sourceDocument }) {
  // Don't render at all until the user has asked something
  if (askStatus === 'idle') return null

  const isLoading = askStatus === 'loading'
  const isError = askStatus === 'error'
  const isDone = askStatus === 'done'
  const isNotFound = isDone && answer === NOT_FOUND_TEXT

  return (
    <div className="card answer-card" role="region" aria-label="AI Answer" aria-live="polite">
      <p className="card__label">
        <span className="card__label-icon">✦</span>
        AI Answer
      </p>

      {/* Loading state */}
      {isLoading && <Spinner label="Analysing document…" />}

      {/* Error state */}
      {isError && (
        <div className="status-message status-message--error" role="alert">
          <span>✕</span>
          <span>{askError}</span>
        </div>
      )}

      {/* Answer state */}
      {isDone && (
        <>
          {sourceDocument && (
            <p className="answer-source">
              <span>📄</span>
              <span>Source: <em>{sourceDocument}</em></span>
            </p>
          )}
          <p className={`answer-body${isNotFound ? ' answer-body--not-found' : ''}`}>
            {isNotFound ? (
              <>
                <span style={{ marginRight: '0.4em' }}>🔍</span>
                {answer}
              </>
            ) : (
              answer
            )}
          </p>
        </>
      )}
    </div>
  )
}
