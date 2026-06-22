package controllers

import (
	"fmt"
	"time"

	"supplierhub-api/database"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
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

func CreateOrder(c *fiber.Ctx) error {
	var req CartCheckout
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
	}

	jwtUserID := int32(c.Locals("user_id").(float64))
	if req.UserID != jwtUserID {
		return c.Status(403).JSON(fiber.Map{"detail": "Akses dilarang. Token ID tidak cocok."})
	}

	if len(req.Items) == 0 {
		return c.Status(400).JSON(fiber.Map{"detail": "Keranjang kosong"})
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
			return c.Status(404).JSON(fiber.Map{"detail": "Product not found"})
		}

		if product.Stock < item.Quantity {
			tx.Rollback()
			return c.Status(400).JSON(fiber.Map{"detail": "Stok tidak mencukupi untuk " + product.Name})
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
			return c.Status(500).JSON(fiber.Map{"detail": "Failed to update stock"})
		}
		if err := tx.Create(&newOrder).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"detail": "Failed to create order"})
		}
	}
	tx.Commit()

	return c.JSON(fiber.Map{"message": "Keranjang berhasil di-checkout!"})
}

func GetOrders(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	jwtUserID := int32(c.Locals("user_id").(float64))

	var orders []models.Order
	query := database.DB.Model(&models.Order{})

	if jwtRole != "admin" {
		query = query.Where("user_id = ?", jwtUserID)
	}
	query.Find(&orders)

	var result []fiber.Map
	for _, o := range orders {
		var user models.User
		database.DB.First(&user, o.UserID)

		dateStr := o.CreatedAt.Format("02 Jan 2006, 15:04")

		result = append(result, fiber.Map{
			"id":              o.ID,
			"customer_name":   user.Name,
			"product_name":    o.ProductName,
			"quantity":        o.Quantity,
			"total_price":     o.TotalPrice,
			"status":          o.Status,
			"date":            dateStr,
			"invoice_id":      o.InvoiceID,
			"payment_status":  o.PaymentStatus,
			"tracking_number": o.TrackingNumber,
			"shipped_at":      o.ShippedAt,
			"notes":           o.Notes,
			"created_at":      o.CreatedAt,
		})
	}

	if result == nil {
		result = make([]fiber.Map, 0)
	}
	return c.JSON(result)
}

type OrderStatusUpdate struct {
	Status        string `json:"status"`
	PaymentStatus string `json:"payment_status"`
}

func UpdateOrderStatus(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	if jwtRole != "admin" {
		return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat mengubah status"})
	}

	orderID := c.Params("order_id")
	var req OrderStatusUpdate
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
	}

	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"detail": "Order not found"})
	}

	if req.Status != "" {
		order.Status = req.Status
		if req.Status == "Selesai" && order.TrackingNumber == "" {
			order.TrackingNumber = fmt.Sprintf("SH-TRK-%d", time.Now().Unix())
			now := time.Now()
			order.ShippedAt = &now
			
			var inv models.Inventory
			err := database.DB.Where("user_id = ? AND product_id = ?", order.UserID, order.ProductID).First(&inv).Error
			if err != nil {
				database.DB.Create(&models.Inventory{
					UserID:    uint(order.UserID),
					ProductID: uint(order.ProductID),
					Quantity:  order.Quantity,
				})
			} else {
				inv.Quantity += order.Quantity
				database.DB.Save(&inv)
			}
		}
	}
	if req.PaymentStatus != "" {
		order.PaymentStatus = req.PaymentStatus
	}
	
	database.DB.Save(&order)
	return c.JSON(fiber.Map{"message": "Updated"})
}

func PayOrder(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	if jwtRole != "umkm" {
		return c.Status(403).JSON(fiber.Map{"detail": "Hanya pembeli yang dapat membayar"})
	}
	
	orderID := c.Params("order_id")
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"detail": "Order not found"})
	}

	jwtUserID := int32(c.Locals("user_id").(float64))
	if order.UserID != jwtUserID {
		return c.Status(403).JSON(fiber.Map{"detail": "Bukan pesanan Anda"})
	}

	order.PaymentStatus = "Lunas"
	database.DB.Save(&order)

	return c.JSON(fiber.Map{"message": "Pembayaran Berhasil"})
}
