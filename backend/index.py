"""Vercel entry point (project Root Directory: backend).

Vercel's Python runtime auto-detects a top-level `index.py` exposing `app` and routes
every request to it. The real application lives in app/main.py.
"""

from app.main import app

__all__ = ["app"]
