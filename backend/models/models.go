package models

import (
	"time"
)

type User struct {
	ID        int32     `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"type:varchar(100)"`
	Role      string    `json:"role" gorm:"type:varchar(50)"`
	Username  string    `json:"username" gorm:"type:varchar(100);unique"`
	Password  string    `json:"password" gorm:"type:varchar(255)"`
	Phone     string    `json:"phone" gorm:"type:varchar(20)"`
	Address   string    `json:"address" gorm:"type:text"`
	City      string    `json:"city" gorm:"type:varchar(100)"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

type Product struct {
	ID          int32  `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"type:varchar(255)"`
	Category    string `json:"category" gorm:"type:varchar(100);default:'Lainnya'"`
	SKU         string `json:"sku" gorm:"type:varchar(50)"`
	Description string `json:"description" gorm:"type:text"`
	Unit        string `json:"unit" gorm:"type:varchar(20);default:'pcs'"`
	Price       int    `json:"price"`
	Stock       int    `json:"stock"`
}

type Order struct {
	ID            int32     `json:"id" gorm:"primaryKey"`
	InvoiceID     string    `json:"invoice_id" gorm:"type:varchar(50)"`
	UserID        int32     `json:"user_id"`
	ProductName   string    `json:"product_name" gorm:"type:varchar(255)"`
	Quantity      int       `json:"quantity"`
	TotalPrice    int       `json:"total_price"`
	Status        string    `json:"status" gorm:"type:varchar(50)"`
	PaymentStatus  string     `json:"payment_status" gorm:"type:varchar(50);default:'Menunggu Pembayaran'"`
	TrackingNumber string     `json:"tracking_number" gorm:"type:varchar(50)"`
	ShippedAt      *time.Time `json:"shipped_at"`
	Notes          string     `json:"notes" gorm:"type:text"`
	CreatedAt      time.Time  `json:"created_at" gorm:"autoCreateTime"`
}

type RestockOrder struct {
	ID            int32     `json:"id" gorm:"primaryKey"`
	InvoiceID     string    `json:"invoice_id" gorm:"type:varchar(50)"`
	DistributorID int32     `json:"distributor_id"`
	AdminID       int32     `json:"admin_id"`
	ProductID     int32     `json:"product_id"`
	Quantity      int       `json:"quantity"`
	Status        string    `json:"status" gorm:"type:varchar(50);default:'Menunggu Persetujuan'"`
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`
}
