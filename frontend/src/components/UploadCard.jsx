/**
 * components/UploadCard.jsx
 *
 * Handles PDF file selection (click or drag-and-drop) and triggers upload.
 * Shows upload progress, success message, and error message.
 */

import { useRef, useState } from 'react'

export default function UploadCard({
  selectedFile,
  uploadStatus,
  uploadMessage,
  uploadProgress,
  isUploading,
  onFileSelect,
  onUpload,
}) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // ── Drag and drop ──────────────────────────────────────────────────────
  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelect(file)
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      // Reset input so the same file can be re-selected after reset
      e.target.value = ''
    }
  }

  // ── Status indicator ───────────────────────────────────────────────────
  const isSuccess = uploadStatus === 'success'
  const isError = uploadStatus === 'error'

  return (
    <div className="card">
      <p className="card__label">
        <span className="card__label-icon">📄</span>
        Step 1 — Upload PDF
      </p>

      <h2 className="card__title">Upload your study document</h2>
      <p className="card__desc">
        Drag and drop a PDF or click to browse. Only PDF files are supported.
      </p>

      {/* Drop zone */}
      <div
        className={`upload-zone${isDragOver ? ' drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id="pdf-file-input"
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleInputChange}
          aria-label="Choose PDF file"
          onClick={(e) => e.stopPropagation()}
        />
        <span className="upload-zone__icon">
          {selectedFile ? '📋' : '☁️'}
        </span>
        <p className="upload-zone__text">
          {selectedFile ? (
            <>File selected: <strong>{selectedFile.name}</strong></>
          ) : (
            <><strong>Click to browse</strong> or drag and drop your PDF here</>
          )}
        </p>
        <p className="upload-zone__hint">
          {selectedFile
            ? `${(selectedFile.size / 1024).toFixed(1)} KB`
            : 'PDF files only · Max recommended size: 10 MB'}
        </p>
      </div>

      {/* Upload action row */}
      <div className="upload-actions">
        {selectedFile && (
          <div className="selected-file">
            <span>📎</span>
            <span className="selected-file__name">{selectedFile.name}</span>
          </div>
        )}

        <button
          id="upload-btn"
          className="btn btn--primary"
          onClick={onUpload}
          disabled={!selectedFile || isUploading}
          aria-busy={isUploading}
        >
          {isUploading ? (
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
              Uploading {uploadProgress > 0 ? `${uploadProgress}%` : '…'}
            </>
          ) : isSuccess ? (
            '✓ Re-upload'
          ) : (
            '↑ Upload PDF'
          )}
        </button>
      </div>

      {/* Status message */}
      {uploadMessage && (
        <div
          className={`status-message ${
            isSuccess
              ? 'status-message--success'
              : isError
              ? 'status-message--error'
              : 'status-message--info'
          }`}
          role="alert"
          aria-live="polite"
        >
          <span>{isSuccess ? '✓' : isError ? '✕' : 'ℹ'}</span>
          <span>{uploadMessage}</span>
        </div>
      )}
    </div>
  )
}
