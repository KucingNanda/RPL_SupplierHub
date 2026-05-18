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
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

type Product struct {
	ID    int32  `json:"id" gorm:"primaryKey"`
	Name  string `json:"name" gorm:"type:varchar(255)"`
	Price int    `json:"price"`
	Stock int    `json:"stock"`
}

type Order struct {
	ID          int32     `json:"id" gorm:"primaryKey"`
	UserID      int32     `json:"user_id"`
	ProductName string    `json:"product_name" gorm:"type:varchar(255)"`
	Quantity    int       `json:"quantity"`
	TotalPrice  int       `json:"total_price"`
	Status      string    `json:"status" gorm:"type:varchar(50)"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
}
