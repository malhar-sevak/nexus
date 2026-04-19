from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.db import get_db
from database.models import Article, DailyDigest

app = FastAPI(
    title="Nexus API",
    description="An AI that connects you to the AI world",
    version="1.0.0"
)

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Health Check ────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Welcome to Nexus API 🚀"}

# ─── Get All Articles (with filters + search + pagination) ───
@app.get("/api/articles")
def get_articles(
    category: str = Query(None),
    search:   str = Query(None),
    page:     int = Query(1, ge=1),
    limit:    int = Query(20, le=100),
    db:       Session = Depends(get_db)
):
    query = db.query(Article)

    # Filter by category
    if category and category != "All":
        query = query.filter(Article.source_category == category)

    # Search by title
    if search:
        query = query.filter(Article.title.ilike(f"%{search}%"))

    # Order by latest first
    query = query.order_by(desc(Article.published_at))

    # Pagination
    total    = query.count()
    articles = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total":    total,
        "page":     page,
        "limit":    limit,
        "articles": [
            {
                "id":           a.id,
                "title":        a.title,
                "url":          a.url,
                "source_name":  a.source_name,
                "category":     a.source_category,
                "summary":      a.summary,
                "image_url":    a.image_url,
                "published_at": a.published_at,
                "fetched_at":   a.fetched_at,
            }
            for a in articles
        ]
    }

# ─── Get Single Article ──────────────────────────────────────
@app.get("/api/articles/{article_id}")
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        return {"error": "Article not found"}
    return article

# ─── Get All Categories ──────────────────────────────────────
@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Article.source_category).distinct().all()
    return {
        "categories": ["All"] + [c[0] for c in categories if c[0]]
    }

# ─── Get Daily Digest ────────────────────────────────────────
@app.get("/api/digest")
def get_digest(db: Session = Depends(get_db)):
    digest = db.query(DailyDigest).order_by(
        desc(DailyDigest.date)
    ).first()
    if not digest:
        return {"message": "No digest available yet"}
    return digest

# ─── Trigger Manual Fetch (for testing) ─────────────────────
@app.post("/api/fetch")
async def trigger_fetch():
    from fetcher.rss_fetcher import fetch_all_feeds
    from ai.processor import process_untagged_articles
    import asyncio
    fetch_all_feeds()
    await process_untagged_articles()
    return {"message": "Fetch and processing complete!"}