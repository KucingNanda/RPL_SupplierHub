from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import OperationalError

# Konfigurasi MySQL Laragon (User: root, Password: kosong)
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root@localhost/supplierhub"

# pool_pre_ping=True berguna untuk mengecek apakah koneksi masih hidup sebelum dipakai
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# Dependency untuk mendapatkan session DB di tiap request API
def get_db():
    db = SessionLocal()
    try:
        # Mencoba ping database sederhana untuk memastikan MySQL sudah nyala
        db.execute(text("SELECT 1"))
        yield db
    except OperationalError:
        print("⚠️ Database tidak terhubung. Pastikan MySQL di Laragon sudah menyala.")
        yield None
    finally:
        db.close()