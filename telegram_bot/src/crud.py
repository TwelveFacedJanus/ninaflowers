from db import engine, create_database
from models import *
from sqlalchemy.exc import NoResultFound
from datetime import datetime
from typing import List, Union
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
create_database()

Session = sessionmaker(bind=engine)

class Pipeline:
    def __init__(self: object) -> None:
        self.pipeline: List[object] = []
    
    def add_task(self: object, f: object = None) -> None:
        if f is None: return
        self.pipeline.append(f)

    def run_pipeline(self: object) -> None:
        for task in self.pipeline:
            try:
                task()
            except Exception as ex:
                print(ex)


class ManageUsers:
    @staticmethod
    async def set_user(user: Users) -> None:
        with Session() as session:
            session.add(user)
            session.commit()

    @staticmethod
    async def set_default_users(users: List[Users]) -> None:
        with Session() as session:
            for user in users:
                session.add(user)
            session.commit()

    @staticmethod
    async def find_user_by_id(user_id: Union[str, int]) -> object:
        user_id = str(user_id)
        
        with Session() as session:
            stmt = select(Users).where(Users.telegram_id == user_id)
            return session.execute(stmt).scalar_one_or_none()

    @staticmethod
    async def check_token_by_user_id(user_id: Union[str, int], token: str) -> object:
        with Session() as session:
            stmt = select(Users).where(Users.auth_token == token)
            return session.execute(stmt).scalar_one_or_none()
            
class ManageBouquets:
    @staticmethod
    async def add_bouquet(bouquet_data: dict):
        with Session() as session:
            bouquet = Bouquet(
                photo_base64=bouquet_data.get('photo_base64'),
                photo_file_id=bouquet_data.get('photo_file_id'),
                name=bouquet_data['name'],
                description=bouquet_data['description'],
                price=bouquet_data['price'],
            )
            session.add(bouquet)
            session.commit()
            return bouquet

    @staticmethod
    async def remove_bouquet(bouquet_name: str):
        with Session() as session:
            bouquet = session.query(Bouquet).filter(Bouquet.name == bouquet_name).first()
            if bouquet:
                session.delete(bouquet)
                session.commit()
                return True
            return False

    @staticmethod
    async def get_all_bouquets() -> list[dict]:
        with Session() as session:
            bouquets = session.query(Bouquet).all()
            return [
                {
                    'id': bouquet.id,
                    'photo_base64': bouquet.photo_base64,
                    'photo_file_id': bouquet.photo_file_id,
                    'name': bouquet.name,
                    'description': bouquet.description,
                    'price': bouquet.price,
                    'created_at': bouquet.created_at.isoformat() if bouquet.created_at else None
                }
                for bouquet in bouquets
            ]

    @staticmethod
    async def get_bouquet_by_id(bouquet_id: int) -> dict | None:
        with Session() as session:
            bouquet = session.query(Bouquet).filter(Bouquet.id == bouquet_id).first()
            if bouquet:
                return {
                    'id': bouquet.id,
                    'photo_base64': bouquet.photo_base64,
                    'photo_file_id': bouquet.photo_file_id,
                    'name': bouquet.name,
                    'description': bouquet.description,
                    'price': bouquet.price,
                    'created_at': bouquet.created_at.isoformat() if bouquet.created_at else None
                }
            return None

    @staticmethod
    async def update_bouquet(bouquet_id: int, update_data: dict) -> bool:
        with Session() as session:
            bouquet = session.query(Bouquet).filter(Bouquet.id == bouquet_id).first()
            if bouquet:
                for key, value in update_data.items():
                    if hasattr(bouquet, key):
                        setattr(bouquet, key, value)
                session.commit()
                return True
            return False
