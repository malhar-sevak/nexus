from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database.db import Base

class Article(Base):
    __tablename__ = "articles"

    id                 = Column(Integer, primary_key=True, index=True)
    title              = Column(String(500), nullable=False)
    url                = Column(String(1000), unique=True, nullable=False)
    source_name        = Column(String(100), nullable=False)
    source_category    = Column(String(50), nullable=True)
    summary            = Column(Text, nullable=True)
    image_url          = Column(String(1000), nullable=True)
    published_at       = Column(DateTime, nullable=True)
    fetched_at         = Column(DateTime, server_default=func.now())
    duplicate_group_id = Column(String(100), nullable=True)


class DailyDigest(Base):
    __tablename__ = "daily_digest"

    id              = Column(Integer, primary_key=True, index=True)
    date            = Column(DateTime, unique=True, nullable=False)
    content         = Column(Text, nullable=False)
    top_article_ids = Column(String(500), nullable=True)
    created_at      = Column(DateTime, server_default=func.now())