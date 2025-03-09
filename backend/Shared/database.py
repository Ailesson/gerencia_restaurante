from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

user = os.getenv('DATABASE_USER')
host = os.getenv('DATABASE_HOST')
password = os.getenv('DATABASE_PASSWORD')
name = os.getenv('DATABASE_NAME')
port = os.getenv('DATABASE_PORT')

DATABASE_URL = f'mysql+pymysql://{user}:{password}@{host}:{port}/{name}'

engine = create_engine(DATABASE_URL, echo=True) 

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
