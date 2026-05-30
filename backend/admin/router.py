"""
Admin API router — all /api/admin/* endpoints.
Protected by HMAC token auth; PIN is set via ADMIN_PIN env var.
"""
import os
import sys
import hmac
import hashlib
import asyncio
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database.db import get_db
from database.models import Article, DailyDigest
from admin.log_handler import log_event_generator, get_recent_logs

router = APIRouter(prefix="/api/admin", tags=["admin"])

# ── Auth ──────────────────────────────────────────────────────────────────────

ADMIN_PIN = os.getenv("ADMIN_PIN", "000000")
_SECRET   = os.getenv("ADMIN_SECRET", "nexus-secret-key")


def _make_token(pin: str) -> str:
    h = hmac.new(_SECRET.encode(), pin.encode(), hashlib.sha256)
    return h.hexdigest()


def _verify_token(token: str) -> bool:
    expected = _make_token(ADMIN_PIN)
    return hmac.compare_digest(expected, token)


def require_auth(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth.removeprefix("Bearer ").strip()
    if not _verify_token(token):
        raise HTTPException(status_code=403, detail="Invalid token")


class AuthRequest(BaseModel):
    pin: str


@router.post("/auth")
def auth(body: AuthRequest):
    if body.pin != ADMIN_PIN:
        raise HTTPException(status_code=403, detail="Wrong PIN")
    token = _make_token(body.pin)
    return {"token": token}


# ── Stats ─────────────────────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _=Depends(require_auth)):
    total_articles  = db.query(Article).count()
    untagged        = db.query(Article).filter(Article.summary == None).count()
    total_digests   = db.query(DailyDigest).count()
    total_sources   = db.query(Article.source_name).distinct().count()

    latest_article  = db.query(Article).order_by(desc(Article.fetched_at)).first()
    last_fetch      = latest_article.fetched_at.isoformat() if latest_article and latest_article.fetched_at else None

    # Category breakdown
    cat_counts = db.query(
        Article.source_category,
        func.count(Article.id).label("count")
    ).group_by(Article.source_category).all()

    return {
        "total_articles":  total_articles,
        "untagged":        untagged,
        "total_digests":   total_digests,
        "total_sources":   total_sources,
        "last_fetch":      last_fetch,
        "category_counts": {c.source_category: c.count for c in cat_counts if c.source_category},
    }


# ── Sources ───────────────────────────────────────────────────────────────────

@router.get("/sources")
def get_sources_admin(db: Session = Depends(get_db), _=Depends(require_auth)):
    sources = db.query(
        Article.source_name,
        Article.source_category,
        func.count(Article.id).label("article_count"),
        func.max(Article.fetched_at).label("last_fetched"),
    ).group_by(Article.source_name, Article.source_category).all()

    return {
        "sources": [
            {
                "name":          s.source_name,
                "category":      s.source_category,
                "article_count": s.article_count,
                "last_fetched":  s.last_fetched.isoformat() if s.last_fetched else None,
            }
            for s in sources
        ]
    }


# ── Pipeline triggers ─────────────────────────────────────────────────────────

@router.post("/pipeline/run")
async def pipeline_run(_=Depends(require_auth)):
    from scheduler.job import run_full_pipeline
    import threading
    threading.Thread(target=run_full_pipeline, daemon=True).start()
    return {"message": "Full pipeline started in background"}


@router.post("/pipeline/fetch")
async def pipeline_fetch(_=Depends(require_auth)):
    from fetcher.rss_fetcher import fetch_all_feeds
    import threading
    threading.Thread(target=fetch_all_feeds, daemon=True).start()
    return {"message": "RSS fetch started in background"}


@router.post("/pipeline/process")
async def pipeline_process(_=Depends(require_auth)):
    from ai.processor import process_untagged_articles
    async def _run():
        await process_untagged_articles()
    asyncio.create_task(_run())
    return {"message": "AI processing started in background"}


@router.post("/pipeline/digest")
async def pipeline_digest(_=Depends(require_auth)):
    from ai.digest_generator import generate_daily_digest
    async def _run():
        await generate_daily_digest()
    asyncio.create_task(_run())
    return {"message": "Digest generation started in background"}


# ── Live log stream (SSE) ─────────────────────────────────────────────────────

@router.get("/logs/stream")
async def logs_stream(request: Request, token: str = ""):
    """
    SSE endpoint — streams live log entries.
    Token passed as query param ?token=<token> since EventSource API
    does not support custom headers.
    """
    if not token or not _verify_token(token):
        raise HTTPException(status_code=403, detail="Invalid token")

    return EventSourceResponse(log_event_generator(request))
