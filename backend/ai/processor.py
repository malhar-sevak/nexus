import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import SessionLocal
from database.models import Article
from ai.summarizer import tag_and_summarize_batch

BATCH_SIZE = 10  # Process 10 articles per API call

async def process_untagged_articles():
    print("Starting AI batch processing...")
    db = SessionLocal()
    processed_count = 0

    try:
        untagged = db.query(Article).filter(
            Article.summary == None
        ).all()

        print(f"Found {len(untagged)} untagged articles...")

        # Split into batches of 10
        batches = [
            untagged[i:i + BATCH_SIZE]
            for i in range(0, len(untagged), BATCH_SIZE)
        ]

        print(f"Processing in {len(batches)} batches of {BATCH_SIZE}...")

        for batch_num, batch in enumerate(batches):

            # Stay safely under 200 calls/day
            if processed_count >= 180:
                print("Daily API limit reached. Will continue next run.")
                break

            print(f"Processing batch {batch_num + 1}/{len(batches)}...")

            results = await tag_and_summarize_batch(batch)

            for article, result in zip(batch, results):
                article.summary         = result["summary"]
                article.source_category = result["category"]
                print(f"✅ '{article.title[:50]}' → {result['category']}")

            db.commit()
            processed_count += len(batch)

            # Delay between batches to respect rate limits
            await asyncio.sleep(5)

        print(f"Done! Processed {processed_count} articles in {len(batches)} API calls.")

    except Exception as e:
        print(f"Fatal error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(process_untagged_articles())