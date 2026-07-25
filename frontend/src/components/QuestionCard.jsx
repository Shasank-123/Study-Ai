/**
 * components/QuestionCard.jsx
 *
 * Text area for the student's question and the "Ask" button.
 * The button is disabled until a PDF has been successfully uploaded.
 */

export default function QuestionCard({
  question,
  isUploadSuccess,
  isAsking,
  onQuestionChange,
  onAsk,
}) {
  function handleKeyDown(e) {
    // Ctrl/Cmd + Enter submits the question
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!isAsking && isUploadSuccess && question.trim()) {
        onAsk()
      }
    }
  }

  const canAsk = isUploadSuccess && question.trim().length > 0 && !isAsking

  return (
    <div className="card">
      <p className="card__label">
        <span className="card__label-icon">💬</span>
        Step 2 — Ask a Question
      </p>

      <h2 className="card__title">What would you like to know?</h2>
      <p className="card__desc">
        {isUploadSuccess
          ? 'Type your question below. Answers are based solely on your uploaded document.'
          : 'Upload a PDF first to unlock this section.'}
      </p>

      <div className="question-input-wrap">
        <textarea
          id="question-input"
          className="question-input"
          placeholder={
            isUploadSuccess
              ? 'e.g. "What is the main topic of chapter 2?" or "Summarise the key findings."'
              : 'Upload a PDF first…'
          }
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isUploadSuccess || isAsking}
          rows={4}
          aria-label="Your question"
          aria-disabled={!isUploadSuccess}
        />
      </div>

      <div className="question-actions">
        <p className="question-hint">
          {isUploadSuccess ? (
            <>
              <span>⌨️</span>
              <span>Press <kbd style={{ opacity: 0.7, fontSize: '0.75rem' }}>Ctrl+Enter</kbd> to submit</span>
            </>
          ) : (
            <>
              <span>🔒</span>
              <span>Upload a PDF to enable</span>
            </>
          )}
        </p>

        <button
          id="ask-btn"
          className="btn btn--primary"
          onClick={onAsk}
          disabled={!canAsk}
          aria-busy={isAsking}
          aria-label="Ask question"
        >
          {isAsking ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.75s linear infinite',
                }}
              />
              Asking…
            </>
          ) : (
            '✦ Ask'
          )}
        </button>
      </div>
    </div>
  )
}
