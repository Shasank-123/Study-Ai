"""
routers/ask.py

POST /ask  — receives the student's question, validates that a PDF has been
uploaded, then calls the Gemini service and returns the answer.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

from backend.services.gemini_service import GeminiServiceError, ask_question
from backend.utils.state import get_pdf_text, get_pdf_filename, has_pdf

router = APIRouter()


class AskRequest(BaseModel):
    question: str

    @field_validator("question")
    @classmethod
    def question_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Question must not be empty.")
        return v.strip()


@router.post("/ask")
async def ask(payload: AskRequest) -> JSONResponse:
    """
    Answer a question using the currently uploaded PDF as the sole source.

    - Returns 400 if no PDF has been uploaded yet.
    - Returns 502 if the Gemini API call fails.
    - Returns 200 with the answer on success.
    """
    if not has_pdf():
        raise HTTPException(
            status_code=400,
            detail=(
                "No PDF has been uploaded yet. "
                "Please upload a PDF before asking questions."
            ),
        )

    pdf_text = get_pdf_text()
    filename = get_pdf_filename()

    try:
        answer = ask_question(pdf_text=pdf_text, question=payload.question)
    except GeminiServiceError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {exc}",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {exc}",
        ) from exc

    return JSONResponse(
        content={
            "answer": answer,
            "source_document": filename,
        }
    )
