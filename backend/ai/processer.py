import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import SessionLocal
from database.models import Article
from ai.summarizer import tag_and_summarize

async def process_untagged_articles():
    print("Starting AI processing...")
    db = SessionLocal()
    processed_count = 0

    try:
        # Fetch all articles that have no summary yet
        untagged = db.query(Article).filter(
            Article.summary == None
        ).all()

        print(f"Found {len(untagged)} untagged articles...")

        for article in untagged:

            # Stop after 180 to stay safely under daily API limit
            if processed_count >= 180:
                print("Daily API limit reached. Will continue next run.")
                break

            print(f"Processing: {article.title[:60]}...")

            result = await tag_and_summarize(article.title, article.url)

            article.summary         = result["summary"]
            article.source_category = result["category"]

            db.commit()
            print(f"✅ Tagged as '{result['category']}'")

            processed_count += 1

            # 3 second delay between each to avoid rate limits
            await asyncio.sleep(3)

        print(f"AI processing complete! Processed {processed_count} articles.")

    except Exception as e:
        print(f"Fatal error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(process_untagged_articles())