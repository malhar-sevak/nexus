import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import Base, engine
from models import Article, DailyDigest

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()