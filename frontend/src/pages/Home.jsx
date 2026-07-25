/**
 * pages/Home.jsx
 *
 * The single page of the application.
 * Assembles the hero section and all three cards using the
 * useStudyAssistant hook for shared state.
 */

import { useStudyAssistant } from '../hooks/useStudyAssistant'
import UploadCard from '../components/UploadCard'
import QuestionCard from '../components/QuestionCard'
import AnswerCard from '../components/AnswerCard'

export default function Home() {
  const {
    // Upload
    selectedFile,
    uploadStatus,
    uploadMessage,
    uploadProgress,
    isUploading,
    isUploadSuccess,
    handleFileSelect,
    handleUpload,
    // Ask
    question,
    setQuestion,
    askStatus,
    answer,
    askError,
    sourceDocument,
    isAsking,
    handleAsk,
    // Global
    handleReset,
  } = useStudyAssistant()

  return (
    <main className="main-content">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ width: '100%', paddingTop: '1rem' }}>
        <div className="hero-badge">
          <span>✦</span>
          <span>Powered by Google Gemini</span>
        </div>

        <h1 className="hero-heading">
          Ask anything about<br />
          <span>your document</span>
        </h1>

        <p className="hero-sub">
          Upload a PDF and get instant, accurate answers grounded exclusively
          in its content. No hallucinations. No outside knowledge.
        </p>

        <div className="steps-row">
          {[
            { n: 1, label: 'Upload a PDF' },
            { n: 2, label: 'Ask a question' },
            { n: 3, label: 'Get a grounded answer' },
          ].map(({ n, label }) => (
            <div key={n} className="step-chip">
              <div className="step-chip__num">{n}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────────────────── */}
      <UploadCard
        selectedFile={selectedFile}
        uploadStatus={uploadStatus}
        uploadMessage={uploadMessage}
        uploadProgress={uploadProgress}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
      />

      <QuestionCard
        question={question}
        isUploadSuccess={isUploadSuccess}
        isAsking={isAsking}
        onQuestionChange={setQuestion}
        onAsk={handleAsk}
      />

      <AnswerCard
        askStatus={askStatus}
        answer={answer}
        askError={askError}
        sourceDocument={sourceDocument}
      />

      {/* ── Reset link ───────────────────────────────────────────────── */}
      {isUploadSuccess && (
        <button
          id="reset-btn"
          className="btn btn--ghost"
          onClick={handleReset}
          aria-label="Start over with a new PDF"
        >
          ↺ Start over
        </button>
      )}
    </main>
  )
}
