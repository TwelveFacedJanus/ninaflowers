import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import *

SQLALCHEMY_DB_URL: str = os.environ.get(
    'DATABASE_URL',
    f'postgresql://{DB_USERNAME}:{DB_PASSWORD}@127.0.0.1:5432/{DB_NAME}'
)

engine: object = create_engine(SQLALCHEMY_DB_URL)
local_session: object = sessionmaker(autocommit=False, autoflush=False, bind=engine)
base = declarative_base()

def create_database() -> object:
    base.metadata.create_all(bind=engine)
    return local_session
