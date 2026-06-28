package services

import (
	"errors"
	"fmt"
	"supplierhub-api/database"
	"supplierhub-api/models"
	"time"
)

type CartItem struct {
	ProductID int32 `json:"product_id"`
	Quantity  int   `json:"quantity"`
}

type CartCheckout struct {
	UserID int32      `json:"user_id"`
	Notes  string     `json:"notes"`
	Items  []CartItem `json:"items"`
}

type OrderService struct{}

func NewOrderService() *OrderService {
	return &OrderService{}
}

func (s *OrderService) CheckoutCart(jwtUserID int32, req CartCheckout) error {
	if req.UserID != jwtUserID {
		return errors.New("Akses dilarang. Token ID tidak cocok.")
	}
	if len(req.Items) == 0 {
		return errors.New("Keranjang kosong")
	}

	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	invoiceID := fmt.Sprintf("INV-%d-%d", time.Now().Unix(), req.UserID)

	for _, item := range req.Items {
		var product models.Product
		if err := tx.First(&product, item.ProductID).Error; err != nil {
			tx.Rollback()
			return errors.New("Product not found")
		}

		if product.Stock < item.Quantity {
			tx.Rollback()
			return fmt.Errorf("Stok tidak mencukupi untuk %s", product.Name)
		}

		total := product.Price * item.Quantity
		newOrder := models.Order{
			InvoiceID:     invoiceID,
			UserID:        req.UserID,
			ProductID:     item.ProductID,
			ProductName:   product.Name,
			Quantity:      item.Quantity,
			TotalPrice:    total,
			Status:        "Diproses",
			PaymentStatus: "Menunggu Pembayaran",
			Notes:         req.Notes,
		}

		product.Stock -= item.Quantity
		if err := tx.Save(&product).Error; err != nil {
			tx.Rollback()
			return errors.New("Failed to update stock")
		}
		if err := tx.Create(&newOrder).Error; err != nil {
			tx.Rollback()
			return errors.New("Failed to create order")
		}
	}
	
	if err := tx.Commit().Error; err != nil {
		return errors.New("Failed to commit transaction")
	}
	return nil
}
