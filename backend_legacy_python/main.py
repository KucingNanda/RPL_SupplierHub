from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import database
import models

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SupplierHub API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrderStatusUpdate(BaseModel):
    status: str

class OrderCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int

class LoginRequest(BaseModel):
    username: str
    password: str

@app.get("/")
async def root():
    return {"message": "API SupplierHub Online 🚀"}

# =========================
# AUTH
# =========================
@app.post("/api/login")
def login(request: LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user or user.password != request.password:
        raise HTTPException(status_code=401, detail="Kredensial salah")
    return {"status": "success", "user": {"id": user.id, "name": user.name, "role": user.role, "username": user.username}}

# =========================
# PRODUCTS
# =========================
@app.get("/api/products")
def get_products(db: Session = Depends(database.get_db)):
    return db.query(models.Product).all()

@app.post("/api/products")
def create_product(product: dict, db: Session = Depends(database.get_db)):
    new_prod = models.Product(**product)
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return new_prod

# =========================
# ORDERS (DIPERBARUI)
# =========================
@app.post("/api/orders")
def create_order(order: OrderCreate, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()
    if not product or product.stock < order.quantity:
        raise HTTPException(status_code=400, detail="Stok tidak mencukupi")
    
    total = product.price * order.quantity
    new_order = models.Order(
        user_id=order.user_id,
        product_name=product.name,
        quantity=order.quantity,
        total_price=total,
        status="Diproses"
    )
    product.stock -= order.quantity
    db.add(new_order)
    db.commit()
    return {"message": "Order created"}

@app.get("/api/orders")
def get_orders(user_id: Optional[int] = None, role: Optional[str] = "admin", db: Session = Depends(database.get_db)):
    query = db.query(models.Order)
    
    # Jika bukan admin, filter berdasarkan user_id
    if role != "admin" and user_id:
        query = query.filter(models.Order.user_id == user_id)
    
    orders = query.all()
    result = []
    for o in orders:
        user = db.query(models.User).filter(models.User.id == o.user_id).first()
        result.append({
            "id": o.id,
            "customer_name": user.name if user else "Unknown",
            "product_name": o.product_name,
            "quantity": o.quantity,
            "total_price": o.total_price,
            "status": o.status,
            "date": o.created_at.strftime("%d %b %Y, %H:%M")
        })
    return result

@app.put("/api/orders/{order_id}/status")
def update_status(order_id: int, request: OrderStatusUpdate, db: Session = Depends(database.get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order: raise HTTPException(status_code=404)
    order.status = request.status
    db.commit()
    return {"message": "Updated"}

# =========================
# STATS
# =========================
@app.get("/api/stats/{role}/{user_id}")
def get_stats(role: str, user_id: int, db: Session = Depends(database.get_db)):
    if role == "admin":
        stok = db.query(models.Product.stock).all()
        sum_stok = sum([s[0] for s in stok]) if stok else 0
        order_count = db.query(models.Order).filter(models.Order.status == "Diproses").count()
        return {"total_stok": sum_stok, "pesanan_proses": order_count, "margin": "Rp 1.2M"}
    else:
        # Statistik dinamis untuk User
        user_orders = db.query(models.Order).filter(models.Order.user_id == user_id).count()
        return {"saldo": "Rp 500.000", "barang_dipesan": user_orders, "status": "Aktif"}