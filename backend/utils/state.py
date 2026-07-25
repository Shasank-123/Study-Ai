"""
utils/state.py

In-memory store for the extracted PDF text.
Using a module-level dict so the state is shared across all request handlers
within the same process without needing a database.
"""

# Single source of truth for the current session's PDF context.
# Keys:
#   "text"     -> str   : full extracted text from the uploaded PDF
#   "filename" -> str   : original filename of the uploaded PDF
pdf_store: dict = {
    "text": "",
    "filename": "",
}


def set_pdf_content(filename: str, text: str) -> None:
    """Replace the current PDF context with new content."""
    pdf_store["text"] = text
    pdf_store["filename"] = filename


def get_pdf_text() -> str:
    """Return the stored PDF text (empty string if nothing uploaded yet)."""
    return pdf_store["text"]


def get_pdf_filename() -> str:
    """Return the stored PDF filename."""
    return pdf_store["filename"]


def has_pdf() -> bool:
    """Return True if a PDF has been uploaded and extracted."""
    return bool(pdf_store["text"].strip())
