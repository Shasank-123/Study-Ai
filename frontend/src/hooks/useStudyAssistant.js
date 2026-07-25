/**
 * hooks/useStudyAssistant.js
 *
 * Custom hook that owns all application state:
 *   - PDF upload lifecycle (idle → uploading → success / error)
 *   - Question asking lifecycle (idle → loading → answered / error)
 *
 * Keeps all business-logic side-effects out of the UI components.
 */

import { useState, useCallback } from 'react'
import { uploadPDF, askQuestion } from '../services/api'

/** @typedef {'idle'|'uploading'|'success'|'error'} UploadStatus */
/** @typedef {'idle'|'loading'|'done'|'error'} AskStatus */

export function useStudyAssistant() {
  // ── Upload state ──────────────────────────────────────────────────────
  const [selectedFile, setSelectedFile] = useState(/** @type {File|null} */ (null))
  const [uploadStatus, setUploadStatus] = useState(/** @type {UploadStatus} */ ('idle'))
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadedFilename, setUploadedFilename] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  // ── Ask state ─────────────────────────────────────────────────────────
  const [question, setQuestion] = useState('')
  const [askStatus, setAskStatus] = useState(/** @type {AskStatus} */ ('idle'))
  const [answer, setAnswer] = useState('')
  const [askError, setAskError] = useState('')
  const [sourceDocument, setSourceDocument] = useState('')

  // ── Derived flags ─────────────────────────────────────────────────────
  const isUploadSuccess = uploadStatus === 'success'
  const isUploading = uploadStatus === 'uploading'
  const isAsking = askStatus === 'loading'

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleFileSelect = useCallback((file) => {
    if (!file) return
    // Reset previous state when a new file is chosen
    setSelectedFile(file)
    setUploadStatus('idle')
    setUploadMessage('')
    setAnswer('')
    setAskStatus('idle')
    setAskError('')
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    setUploadStatus('uploading')
    setUploadMessage('')
    setUploadProgress(0)
    // Reset answer state on new upload
    setAnswer('')
    setAskStatus('idle')
    setAskError('')

    try {
      const data = await uploadPDF(selectedFile, (evt) => {
        if (evt.total) {
          setUploadProgress(Math.round((evt.loaded / evt.total) * 100))
        }
      })
      setUploadStatus('success')
      setUploadedFilename(data.filename)
      setUploadMessage(
        `"${data.filename}" processed — ${data.word_count.toLocaleString()} words extracted.`
      )
    } catch (err) {
      setUploadStatus('error')
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Upload failed. Please try again.'
      setUploadMessage(detail)
    }
  }, [selectedFile])

  const handleAsk = useCallback(async () => {
    if (!question.trim() || !isUploadSuccess) return

    setAskStatus('loading')
    setAnswer('')
    setAskError('')

    try {
      const data = await askQuestion(question.trim())
      setAnswer(data.answer)
      setSourceDocument(data.source_document)
      setAskStatus('done')
    } catch (err) {
      setAskStatus('error')
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to get an answer. Please try again.'
      setAskError(detail)
    }
  }, [question, isUploadSuccess])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setUploadStatus('idle')
    setUploadMessage('')
    setUploadedFilename('')
    setUploadProgress(0)
    setQuestion('')
    setAnswer('')
    setAskStatus('idle')
    setAskError('')
    setSourceDocument('')
  }, [])

  return {
    // Upload
    selectedFile,
    uploadStatus,
    uploadMessage,
    uploadedFilename,
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
  }
}
