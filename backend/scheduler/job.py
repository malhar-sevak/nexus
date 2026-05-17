import sys
import os
import asyncio
import logging

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apscheduler.schedulers.background import BackgroundScheduler
from fetcher.rss_fetcher import fetch_all_feeds
from ai.processor import process_untagged_articles
from ai.digest_generator import generate_daily_digest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_full_pipeline():
    logger.info("Scheduler — running full pipeline...")
    fetch_all_feeds()
    asyncio.run(process_untagged_articles())
    logger.info("Scheduler — full pipeline complete!")

def run_digest():
    logger.info("Scheduler — generating daily digest...")
    asyncio.run(generate_daily_digest())
    logger.info("Scheduler — digest generation complete!")

def start_scheduler():
    scheduler = BackgroundScheduler()

    # Full pipeline every 1 hour
    scheduler.add_job(
        run_full_pipeline,
        'interval',
        hours=1,
        id='full_pipeline',
        name='Fetch and process all feeds'
    )

    # Daily digest every day at midnight
    scheduler.add_job(
        run_digest,
        'cron',
        hour=0,
        minute=0,
        id='daily_digest',
        name='Generate daily digest'
    )

    scheduler.start()
    logger.info("Scheduler started!")
    logger.info("Pipeline — every 1 hour")
    logger.info("Digest   — every day at midnight")
    return scheduler