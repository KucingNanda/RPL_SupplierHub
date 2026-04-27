from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Format: mysql+mysqlconnector://[user]:[password]@[host]/[database_name]
# Di Laragon defaultnya adalah user 'root' tanpa password
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root@localhost/supplierhub"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency untuk mendapatkan session DB di tiap request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()