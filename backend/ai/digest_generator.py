import httpx
import asyncio
import sys
import os
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

MODELS = [
    "openrouter/auto",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-3-4b-it:free",
    "qwen/qwen2.5-7b-instruct:free",
]

async def generate_digest_content(articles: list) -> str:
    # Build article list for prompt
    articles_text = "\n".join([
        f"{i+1}. [{a.source_category}] {a.title} — {a.summary or 'No summary'}"
        for i, a in enumerate(articles)
    ])

    prompt = f"""You are the chief editor of Nexus, an AI-powered news platform.
Today's date is {datetime.now().strftime('%B %d, %Y')}.

Based on these top AI and ML news stories from today, write a cohesive, 
engaging daily digest in 3-4 paragraphs. Write it like a knowledgeable 
editor summarizing the day for a tech-savvy audience. 
Do NOT use bullet points. Write in flowing paragraphs only.
Start directly with "Today in AI —" followed by the date.

Today's top stories:
{articles_text}

Write the digest now:"""

    for model in MODELS:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": 800,
                    },
                    timeout=60.0
                )
            data = response.json()
            if "error" in data:
                print(f"Model {model} failed: {data['error']['message']}")
                continue
            return data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"Model {model} error: {e}")
            continue

    return f"Today in AI — {datetime.now().strftime('%B %d, %Y')}\n\nOur AI editor is taking a short break today. Please check back soon for your daily digest. In the meantime, browse the live feed for all the latest AI and ML news."


async def generate_daily_digest():
    from database.db import SessionLocal
    from database.models import Article, DailyDigest

    print(f"[{datetime.now()}] Generating daily digest...")
    db = SessionLocal()

    try:
        # Check if digest already exists for today
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        existing = db.query(DailyDigest).filter(
            DailyDigest.date >= today_start
        ).first()

        if existing:
            print("Digest already exists for today — skipping.")
            return

        # Get top 10 articles from last 24 hours
        since = datetime.now() - timedelta(hours=24)
        articles = db.query(Article).filter(
            Article.fetched_at >= since,
            Article.summary != None
        ).order_by(Article.fetched_at.desc()).limit(10).all()

        if not articles:
            # Fallback — get latest 10 articles regardless of time
            articles = db.query(Article).filter(
                Article.summary != None
            ).order_by(Article.fetched_at.desc()).limit(10).all()

        if not articles:
            print("No articles found for digest generation.")
            return

        print(f"Generating digest from {len(articles)} articles...")

        # Generate digest content
        content = await generate_digest_content(articles)

        # Save top article IDs
        top_ids = ",".join([str(a.id) for a in articles])

        # Save to DB
        digest = DailyDigest(
            date=datetime.now(),
            content=content,
            top_article_ids=top_ids,
        )
        db.add(digest)
        db.commit()

        print(f"[{datetime.now()}] Daily digest generated successfully!")

    except Exception as e:
        print(f"Digest generation error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(generate_daily_digest())