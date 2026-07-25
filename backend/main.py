"""
main.py

FastAPI application entry point.

- Configures CORS so the React dev server (port 5173) can call the API.
- Mounts the upload and ask routers.
- Exposes a GET / health-check endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import ask, upload

app = FastAPI(
    title="AI Study Assistant API",
    description=(
        "Upload a PDF and ask questions about its content. "
        "Answers are grounded exclusively in the uploaded document."
    ),
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow requests from the Vite dev server and any localhost origin.
# Tighten this to a specific domain in a production deployment.
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(upload.router, tags=["PDF"])
app.include_router(ask.router, tags=["AI"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
async def health_check() -> dict:
    """Confirm the API is running."""
    return {"status": "running"}
