from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.db import get_db
from database.models import Article, DailyDigest

from scheduler.job import start_scheduler
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — start the scheduler
    scheduler = start_scheduler()
    yield
    # Shutdown — stop the scheduler cleanly
    scheduler.shutdown()

app = FastAPI(
    title="Nexus API",
    description="An AI that connects you to the AI world",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to Nexus API 🚀"}

@app.get("/api/articles")
def get_articles(
    category: str = Query(None),
    source:   str = Query(None),
    search:   str = Query(None),
    page:     int = Query(1, ge=1),
    limit:    int = Query(20, le=100),
    db:       Session = Depends(get_db)
):
    query = db.query(Article)

    if category and category != "All":
        query = query.filter(Article.source_category == category)

    if source and source != "All Sources":
        query = query.filter(Article.source_name == source)

    if search:
        query = query.filter(Article.title.ilike(f"%{search}%"))

    query = query.order_by(desc(Article.published_at))

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

@app.get("/api/articles/{article_id}")
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        return {"error": "Article not found"}
    return article

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Article.source_category).distinct().all()
    return {
        "categories": ["All"] + [c[0] for c in categories if c[0]]
    }

@app.get("/api/sources")
def get_sources(db: Session = Depends(get_db)):
    sources = db.query(Article.source_name).distinct().all()
    return {
        "sources": [s[0] for s in sources if s[0]]
    }

@app.get("/api/digest")
def get_digest(db: Session = Depends(get_db)):
    digest = db.query(DailyDigest).order_by(desc(DailyDigest.date)).first()
    if not digest:
        return {"message": "No digest available yet"}
    return digest

@app.post("/api/fetch")
async def trigger_fetch():
    from fetcher.rss_fetcher import fetch_all_feeds
    from ai.processor import process_untagged_articles
    fetch_all_feeds()
    await process_untagged_articles()
    return {"message": "Fetch and processing complete!"}

@app.post("/api/run-pipeline")
async def run_pipeline():
    from scheduler.job import run_full_pipeline
    import threading
    thread = threading.Thread(target=run_full_pipeline)
    thread.start()
    return {"message": "Pipeline started in background!"}