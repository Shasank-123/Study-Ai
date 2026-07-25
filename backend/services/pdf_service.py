"""
services/pdf_service.py

Handles PDF text extraction using PyMuPDF (fitz).
Extracts text page-by-page, skips blank pages, and returns
a single combined string ready to be used as AI context.
"""

from pathlib import Path
import fitz  # PyMuPDF


class PDFExtractionError(Exception):
    """Raised when the PDF cannot be opened or has no extractable text."""


def extract_text_from_pdf(pdf_path: Path) -> str:
    """
    Open the PDF at *pdf_path* and extract all text.

    - Iterates over every page.
    - Skips pages that are blank or contain only whitespace.
    - Joins non-empty pages with a double newline separator.

    Returns:
        str: The combined text from all non-empty pages.

    Raises:
        PDFExtractionError: If the file cannot be opened or yields no text.
    """
    if not pdf_path.exists():
        raise PDFExtractionError(f"File not found: {pdf_path}")

    try:
        doc = fitz.open(str(pdf_path))
    except Exception as exc:
        raise PDFExtractionError(f"Could not open PDF: {exc}") from exc

    pages_text: list[str] = []

    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text")  # plain-text extraction
        stripped = text.strip()
        if stripped:
            pages_text.append(stripped)

    doc.close()

    if not pages_text:
        raise PDFExtractionError(
            "The PDF appears to be empty or contains only images with no selectable text."
        )

    combined = "\n\n".join(pages_text)
    return combined
