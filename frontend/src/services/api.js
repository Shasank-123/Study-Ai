/**
 * services/api.js
 *
 * Centralised Axios instance for all backend communication.
 * All API functions are async and throw on non-2xx responses so callers
 * can catch a single error type.
 */

import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 s — Gemini can be slow on first call
})

/**
 * Upload a PDF file.
 * @param {File} file - The PDF File object from the file input.
 * @param {function} onUploadProgress - Optional progress callback.
 * @returns {Promise<{message: string, filename: string, word_count: number}>}
 */
export async function uploadPDF(file, onUploadProgress) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
  return response.data
}

/**
 * Ask a question about the currently uploaded PDF.
 * @param {string} question - The student's question.
 * @returns {Promise<{answer: string, source_document: string}>}
 */
export async function askQuestion(question) {
  const response = await api.post('/ask', { question })
  return response.data
}

/**
 * Check if the backend is reachable.
 * @returns {Promise<{status: string}>}
 */
export async function checkHealth() {
  const response = await api.get('/')
  return response.data
}

export default api
