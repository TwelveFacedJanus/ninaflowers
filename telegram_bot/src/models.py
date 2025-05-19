from datetime import datetime

from db import base as Base
from sqlalchemy import Column, DateTime, Integer, String, BigInteger


class Users(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True)
    telegram_id = Column(String, default=None)
    phone_number = Column(String, default=None)
    role = Column(String, default='default')
    auth_token = Column(String, default=None)
    created = Column(DateTime, default=datetime.utcnow)


class Sells(Base):
    __tablename__ = 'Sells'

    id = Column(Integer, primary_key=True)
    florist_telegram_id = Column(String, default=None)
    buyer_telegram_id = Column(String, default=None)

    created = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    __tablename__ = 'Task'

    id = Column(Integer, primary_key=True)
    buyer_telegram_id = Column(String, default=None)
    florist_telegram_id = Column(String, default=None)

    status = Column(String, default=None)
    description = Column(String, default=None)

    created = Column(DateTime, default=datetime.utcnow)


class Bouquet(Base):
    __tablename__ = 'bouquets'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    price = Column(Integer)  # Стоимость в рублях
    created_at = Column(DateTime, default=datetime.now)
    photo_file_id = Column(String, default=None)  # ID файла в Telegram
    photo_base64 = Column(String, default=None)    # Изображение в base64 (опционально)
