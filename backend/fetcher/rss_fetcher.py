import feedparser
import sys
import os
from datetime import datetime
from rapidfuzz import fuzz

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import SessionLocal
from database.models import Article
from fetcher.sources import SOURCES
from fetcher.image_extractor import get_image_from_url

def is_duplicate(title, existing_titles, threshold=85):
    for existing in existing_titles:
        if fuzz.ratio(title.lower(), existing.lower()) > threshold:
            return True
    return False

def fetch_all_feeds():
    print(f"[{datetime.now()}] Starting RSS fetch...")
    db = SessionLocal()

    try:
        # Get all existing titles to check for duplicates
        existing_titles = [a.title for a in db.query(Article.title).all()]
        new_count = 0

        for source in SOURCES:
            print(f"Fetching: {source['name']}...")
            try:
                feed = feedparser.parse(source["url"])

                for entry in feed.entries[:10]:  # Max 10 articles per source
                    title = entry.get("title", "").strip()
                    url   = entry.get("link", "").strip()

                    if not title or not url:
                        continue

                    # Skip if duplicate
                    if is_duplicate(title, existing_titles):
                        continue

                    # Skip if URL already exists in DB
                    exists = db.query(Article).filter(Article.url == url).first()
                    if exists:
                        continue

                    # Get published date
                    published_at = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        published_at = datetime(*entry.published_parsed[:6])

                    # Get image — first try RSS feed itself
                    image_url = None
                    if hasattr(entry, "media_thumbnail"):
                        image_url = entry.media_thumbnail[0]["url"]
                    elif hasattr(entry, "media_content"):
                        image_url = entry.media_content[0].get("url")

                    # If no image in RSS, scrape OG image
                    if not image_url:
                        image_url = get_image_from_url(url, source["category"])

                    # Save to DB
                    article = Article(
                        title           = title,
                        url             = url,
                        source_name     = source["name"],
                        source_category = source["category"],
                        image_url       = image_url,
                        published_at    = published_at,
                    )
                    db.add(article)
                    existing_titles.append(title)
                    new_count += 1

            except Exception as e:
                print(f"Error fetching {source['name']}: {e}")
                continue

        db.commit()
        print(f"[{datetime.now()}] Fetch complete! {new_count} new articles saved.")

    except Exception as e:
        print(f"Fatal error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fetch_all_feeds()