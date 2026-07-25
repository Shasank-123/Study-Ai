"""
routers/upload.py

POST /upload  — accepts a PDF file, saves it to uploads/, extracts text,
and stores the result in the in-memory state so /ask can use it.
"""

import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from backend.services.pdf_service import PDFExtractionError, extract_text_from_pdf
from backend.utils.state import set_pdf_content

router = APIRouter()

# Absolute path to the uploads directory at the project root.
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_CONTENT_TYPES = {"application/pdf"}


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)) -> JSONResponse:
    """
    Accept a PDF file upload.

    - Validates that the file is a PDF.
    - Saves the file to uploads/.
    - Extracts text using PyMuPDF.
    - Stores extracted text in memory for subsequent /ask calls.

    Returns:
        200 JSON with success message and page-count info.

    Raises:
        400: Non-PDF file or empty/image-only PDF.
        500: Unexpected server error during extraction.
    """
    # --- Validate content type ---
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type '{file.content_type}'. "
                "Please upload a PDF file (.pdf)."
            ),
        )

    # --- Save to disk ---
    save_path = UPLOADS_DIR / file.filename
    try:
        with save_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save the uploaded file: {exc}",
        ) from exc
    finally:
        await file.close()

    # --- Extract text ---
    try:
        pdf_text = extract_text_from_pdf(save_path)
    except PDFExtractionError as exc:
        # Remove the saved file so we don't keep unusable PDFs
        save_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        save_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred while processing the PDF: {exc}",
        ) from exc

    # --- Store in memory ---
    set_pdf_content(filename=file.filename, text=pdf_text)

    # Give the frontend a rough sense of content size (useful for debugging)
    word_count = len(pdf_text.split())

    return JSONResponse(
        content={
            "message": "PDF uploaded and processed successfully.",
            "filename": file.filename,
            "word_count": word_count,
        }
    )
