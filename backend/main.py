from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Import komponen internal
from .database import engine, get_db, Base
from . import models

# Membuat tabel otomatis di MySQL saat server dijalankan
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SupplierHub API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SupplierHub API is connected to MySQL via Laragon"}

@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    """Mengambil data produk langsung dari tabel MySQL"""
    products = db.query(models.Product).all()
    return products

@app.get("/api/stats/{role}")
def get_stats(role: str, db: Session = Depends(get_db)):
    """Data statistik dinamis (simulasi query agregat)"""
    if role == "admin":
        total_stok = db.query(models.Product).with_entities(models.Product.stock).all()
        sum_stok = sum([s[0] for s in total_stok])
        return {
            "total_stok": sum_stok,
            "pesanan_proses": 18,
            "margin": "Rp 1.2M"
        }
    else:
        return {
            "saldo": "Rp 500.000",
            "barang_dipesan": 12,
            "status": "Menunggu Kurir"
        }

# Endpoint untuk seeding data awal (Opsional: Jalankan sekali lewat Swagger)
@app.post("/api/seed")
def seed_data(db: Session = Depends(get_db)):
    # Cek jika sudah ada produk
    if db.query(models.Product).count() == 0:
        sample_products = [
            models.Product(name="Beras Premium 5kg", price="Rp 65.000", stock=450, category="Sembako"),
            models.Product(name="Minyak Goreng 2L", price="Rp 32.000", stock=120, category="Sembako")
        ]
        db.add_all(sample_products)
        db.commit()
        return {"message": "Database seeded successfully"}
    return {"message": "Database already has data"}