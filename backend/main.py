# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="SupplierHub API Gateway",
    description="Backend API untuk manajemen stok dan pesanan UMKM",
    version="1.0.0"
)

# 1. Konfigurasi CORS
# Mengizinkan Frontend mengakses API ini meski berjalan di port/domain berbeda
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan URL frontend (misal: http://localhost:5173) saat deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Model Data (Schemas)
class Product(BaseModel):
    id: int
    name: str
    price: str
    stock: int
    category: str

class LoginRequest(BaseModel):
    username: str
    password: str

# 3. Database Simulasi (In-Memory)
db_products = [
    {"id": 1, "name": "Beras Premium 5kg", "price": "Rp 65.000", "stock": 450, "category": "Sembako"},
    {"id": 2, "name": "Minyak Goreng 2L", "price": "Rp 32.000", "stock": 120, "category": "Sembako"},
    {"id": 3, "name": "Gula Pasir 1kg", "price": "Rp 14.500", "stock": 15, "category": "Sembako"},
    {"id": 4, "name": "Garam Dapur 500g", "price": "Rp 5.000", "stock": 800, "category": "Bumbu"},
    {"id": 5, "name": "Tepung Terigu 1kg", "price": "Rp 12.000", "stock": 300, "category": "Bahan Kue"},
]

# 4. Endpoints API
@app.get("/")
async def root():
    return {
        "message": "SupplierHub API Gateway is Online",
        "docs": "/docs" # Dokumentasi Swagger otomatis
    }

@app.get("/api/products", response_model=List[Product])
async def get_products():
    """Mengambil semua daftar produk untuk katalog"""
    return db_products

@app.post("/api/login")
async def login(request: LoginRequest):
    """Proses otentikasi user/admin"""
    # Simulasi cek login
    if request.username == "admin" and request.password == "admin123":
        return {
            "status": "success",
            "user": {"name": "Admin Supplier", "role": "admin", "id": "SUP-9921"}
        }
    elif request.username == "user" and request.password == "user123":
        return {
            "status": "success",
            "user": {"name": "Toko UMKM Maju", "role": "user", "id": "UMKM-4412"}
        }
    
    raise HTTPException(status_code=401, detail="Kredensial tidak valid")

@app.get("/api/stats/{role}")
async def get_dashboard_stats(role: str):
    """Data statistik untuk dashboard berdasarkan peran"""
    if role == "admin":
        return {
            "total_stok": 4250,
            "pesanan_proses": 18,
            "margin": "Rp 1.2M"
        }
    elif role == "user":
        return {
            "saldo": "Rp 500.000",
            "barang_dipesan": 12,
            "status": "Menunggu Kurir"
        }
    
    raise HTTPException(status_code=404, detail="Role tidak ditemukan")

# Cara menjalankan: 
# 1. Install dependensi: pip install -r requirements.txt
# 2. Jalankan server: uvicorn main:app --reload