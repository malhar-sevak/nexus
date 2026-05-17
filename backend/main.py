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
    allow_origins=["http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to Nexus API 🚀"}

def format_dt(dt):
    if dt is None:
        return None
    # Always return as UTC ISO string with Z suffix
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

@app.get("/api/articles")
def get_articles(
    category:  str = Query(None),
    source:    str = Query(None),
    search:    str = Query(None),
    sort_by:   str = Query("latest"),
    page:      int = Query(1, ge=1),
    limit:     int = Query(20, le=100),
    db:        Session = Depends(get_db)
):
    query = db.query(Article)

    if category and category != "All":
        query = query.filter(Article.source_category == category)
    if source and source != "All Sources":
        query = query.filter(Article.source_name == source)
    if search:
        query = query.filter(Article.title.ilike(f"%{search}%"))

    if sort_by == "oldest":
        query = query.order_by(Article.published_at)
    else:
        query = query.order_by(desc(Article.published_at))

    total    = query.count()
    articles = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page":  page,
        "limit": limit,
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
    # Get latest digest
    digest = db.query(DailyDigest).order_by(
        desc(DailyDigest.date)
    ).first()

    if not digest:
        return {"message": "No digest available yet"}

    # Get top articles for this digest
    top_articles = []
    if digest.top_article_ids:
        ids = [int(i) for i in digest.top_article_ids.split(",") if i]
        articles = db.query(Article).filter(Article.id.in_(ids)).all()
        top_articles = [
            {
                "id":          a.id,
                "title":       a.title,
                "url":         a.url,
                "source_name": a.source_name,
                "category":    a.source_category,
                "summary":     a.summary,
                "image_url":   a.image_url,
                "published_at": format_dt(a.published_at),
                "fetched_at":   format_dt(a.fetched_at),
            }
            for a in articles
        ]

    return {
        "id":           digest.id,
        "date":         digest.date,
        "content":      digest.content,
        "top_articles": top_articles,
    }

# Also add digest archive endpoint
@app.get("/api/digest/archive")
def get_digest_archive(db: Session = Depends(get_db)):
    digests = db.query(DailyDigest).order_by(
        desc(DailyDigest.date)
    ).limit(30).all()

    return {
        "digests": [
            {
                "id":   d.id,
                "date": d.date,
            }
            for d in digests
        ]
    }

@app.post("/api/digest/generate")
async def trigger_digest():
    from ai.digest_generator import generate_daily_digest
    await generate_daily_digest()
    return {"message": "Digest generated!"} 

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


@app.get("/api/sources/detail")
def get_sources_detail(db: Session = Depends(get_db)):
    from sqlalchemy import func

    # Get article count per source name (regardless of category)
    sources = db.query(
        Article.source_name,
        func.count(Article.id).label("article_count")
    ).group_by(Article.source_name).all()

    # Get the MOST COMMON category per source
    from sqlalchemy import desc
    result = []
    for s in sources:
        most_common_cat = db.query(
            Article.source_category,
            func.count(Article.id).label("cnt")
        ).filter(
            Article.source_name == s.source_name,
            Article.source_category != None
        ).group_by(
            Article.source_category
        ).order_by(desc("cnt")).first()

        result.append({
            "name":          s.source_name,
            "category":      most_common_cat[0] if most_common_cat else "Industry",
            "article_count": s.article_count,
        })

    return {"sources": result}

@app.get("/api/categories/counts")
def get_category_counts(db: Session = Depends(get_db)):
    from sqlalchemy import func
    counts = db.query(
        Article.source_category,
        func.count(Article.id).label("count")
    ).group_by(Article.source_category).all()

    total = db.query(Article).count()
    result = {"All": total}
    for c in counts:
        if c.source_category:
            result[c.source_category] = c.count
    return {"counts": result}