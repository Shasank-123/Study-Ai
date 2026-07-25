# 📚 AI Study Assistant

> Upload a PDF. Ask questions. Get answers grounded **exclusively** in your document — no hallucinations, no outside knowledge.

Powered by **Google Gemini**, **FastAPI**, and **React**.

---

## ✨ Features

- 📄 **PDF Upload** — drag-and-drop or click-to-browse
- 💬 **Grounded Q&A** — Gemini answers only from your document
- 🔍 **Clear fallback** — explicit message when the answer isn't in the PDF
- ⚡ **Fast local dev** — no database, no auth, no Docker
- 🎨 **Modern dark UI** — glassmorphism header, smooth animations

---

## 🗂 Project Structure

```
ai-assistant-study/
├── frontend/                   # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/         # UploadCard, QuestionCard, AnswerCard, Spinner
│       ├── pages/              # Home
│       ├── services/           # api.js (Axios)
│       └── hooks/              # useStudyAssistant.js
├── backend/                    # FastAPI
│   ├── routers/                # upload.py, ask.py
│   ├── services/               # pdf_service.py, gemini_service.py
│   ├── utils/                  # state.py (in-memory store)
│   ├── main.py
│   ├── requirements.txt
│   └── .env                    # ← your API key goes here
├── uploads/                    # saved PDFs (git-ignored)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.12+ |
| Node.js | 18+ |
| pip | latest |

---

### 1. Clone / open the project

```bash
cd ai-assistant-study
```

---

### 2. Set up your Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.
2. Open `backend/.env` and replace the placeholder:

```env
GEMINI_API_KEY=your_actual_key_here
```

> ⚠️ Never commit this file. It is already listed in `.gitignore`.

---

### 3. Run the Backend

```bash
# From the project root
pip install -r backend/requirements.txt

# Start the FastAPI server
python -m uvicorn backend.main:app --reload
```

The API will be available at **http://localhost:8000**

Swagger docs: **http://localhost:8000/docs**

---

### 4. Run the Frontend

Open a **second terminal**:

```bash
cd frontend
npm install        # only needed once
npm run dev
```

The app will open at **http://localhost:5173**

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/`      | Health check — returns `{"status":"running"}` |
| `POST` | `/upload`| Upload a PDF. Body: `multipart/form-data` with `file` field |
| `POST` | `/ask`   | Ask a question. Body: `{"question": "..."}` |

---

## 🖼 Screenshots

> _Add screenshots here after running the app._

---

## 🧪 Manual Test Checklist

- [ ] Upload a valid PDF → success message with word count appears
- [ ] Ask a question about the PDF → accurate grounded answer
- [ ] Ask an out-of-scope question → fallback: *"I couldn't find that information…"*
- [ ] Try uploading a `.docx` → user-friendly error
- [ ] Click "Ask" without uploading → button is disabled
- [ ] Click "Start over" → all state resets

---

## 🔮 Future Improvements

| Feature | Notes |
|---------|-------|
| Multi-PDF support | Allow a library of documents with per-doc sessions |
| Vector search (RAG) | Chunk + embed PDFs for better context on large files |
| Chat history | Remember previous Q&A turns in the session |
| Quiz generation | Auto-generate MCQs from the document |
| OCR support | Handle scanned/image PDFs via Tesseract |
| Streaming responses | Stream Gemini tokens for faster perceived response |
| Export answers | Save Q&A pairs as PDF or Markdown |

---

## 📄 License

MIT — free for personal and educational use.
