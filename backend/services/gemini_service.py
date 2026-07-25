"""
services/gemini_service.py

Wraps the Google Gemini API.
Builds the strict study-assistant system prompt, injects the PDF text as
context, sends the user's question, and returns the model's answer.
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Initialise the Gemini client once at module import time.
# If the key is missing we raise immediately so the error is caught at startup.
# ---------------------------------------------------------------------------
_api_key = os.getenv("GEMINI_API_KEY", "")
if not _api_key or _api_key == "YOUR_GEMINI_API_KEY_HERE":
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. "
        "Please add your key to backend/.env and restart the server."
    )

genai.configure(api_key=_api_key)

# Use the latest stable flash model — fast and cost-effective for an MVP.
_MODEL_NAME = "gemini-1.5-flash"

# ---------------------------------------------------------------------------
# System instruction injected into every conversation turn.
# It is intentionally strict to prevent hallucinations.
# ---------------------------------------------------------------------------
_SYSTEM_INSTRUCTION = (
    "You are a study assistant. "
    "Answer ONLY using the provided document. "
    'If the answer does not exist in the document, respond exactly: '
    '"I couldn\'t find that information in the uploaded document." '
    "Never invent facts. Never use outside knowledge."
)

_FALLBACK = "I couldn't find that information in the uploaded document."


class GeminiServiceError(Exception):
    """Raised when the Gemini API call fails."""


def ask_question(pdf_text: str, question: str) -> str:
    """
    Send *question* to Gemini with *pdf_text* as the sole knowledge source.

    Args:
        pdf_text: Full extracted text from the uploaded PDF.
        question: The student's question.

    Returns:
        str: Gemini's answer, or the standard fallback string.

    Raises:
        GeminiServiceError: On any API-level failure.
    """
    if not question.strip():
        return _FALLBACK

    # Build the prompt — document context comes first, then the question.
    user_message = (
        f"Document content:\n\"\"\"\n{pdf_text}\n\"\"\"\n\n"
        f"Question: {question}"
    )

    try:
        model = genai.GenerativeModel(
            model_name=_MODEL_NAME,
            system_instruction=_SYSTEM_INSTRUCTION,
        )
        response = model.generate_content(user_message)
        answer = response.text.strip() if response.text else _FALLBACK
        return answer
    except Exception as exc:
        raise GeminiServiceError(
            f"Gemini API request failed: {exc}"
        ) from exc
