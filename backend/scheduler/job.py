import sys
import os
import asyncio
import logging

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apscheduler.schedulers.background import BackgroundScheduler
from fetcher.rss_fetcher import fetch_all_feeds
from ai.processor import process_untagged_articles

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_fetch():
    logger.info("Scheduler — starting RSS fetch...")
    fetch_all_feeds()
    logger.info("Scheduler — RSS fetch done!")

def run_ai_processing():
    logger.info("Scheduler — starting AI processing...")
    asyncio.run(process_untagged_articles())
    logger.info("Scheduler — AI processing done!")

def run_full_pipeline():
    logger.info("Scheduler — running full pipeline...")
    fetch_all_feeds()
    asyncio.run(process_untagged_articles())
    logger.info("Scheduler — full pipeline complete!")

def start_scheduler():
    scheduler = BackgroundScheduler()

    # Fetch + process every 1 hour
    scheduler.add_job(
        run_full_pipeline,
        'interval',
        hours=1,
        id='full_pipeline',
        name='Fetch and process all feeds'
    )

    scheduler.start()
    logger.info("Scheduler started — running every 1 hour!")
    return scheduler