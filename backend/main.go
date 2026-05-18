package main

import (
	"log"
	"strconv"

	"supplierhub-api/database"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Koneksi ke Database
	database.ConnectDB()

	app := fiber.New()

	// Setup CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
		AllowMethods: "*",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "SupplierHub Golang API Gateway Online 🚀"})
	})

	api := app.Group("/api")

	// =========================
	// AUTH
	// =========================
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	api.Post("/login", func(c *fiber.Ctx) error {
		var req LoginRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}

		var user models.User
		result := database.DB.Where("username = ?", req.Username).First(&user)
		if result.Error != nil || user.Password != req.Password {
			return c.Status(401).JSON(fiber.Map{"detail": "Kredensial salah"})
		}

		return c.JSON(fiber.Map{
			"status": "success",
			"user": fiber.Map{
				"id":       user.ID,
				"name":     user.Name,
				"role":     user.Role,
				"username": user.Username,
			},
		})
	})

	// =========================
	// PRODUCTS
	// =========================
	api.Get("/products", func(c *fiber.Ctx) error {
		var products []models.Product
		database.DB.Find(&products)
		if products == nil {
			products = make([]models.Product, 0)
		}
		return c.JSON(products)
	})

	api.Post("/products", func(c *fiber.Ctx) error {
		var product models.Product
		if err := c.BodyParser(&product); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}
		database.DB.Create(&product)
		return c.JSON(product)
	})

	// =========================
	// ORDERS
	// =========================
	type OrderCreate struct {
		UserID    int32 `json:"user_id"`
		ProductID int32 `json:"product_id"`
		Quantity  int   `json:"quantity"`
	}

	api.Post("/orders", func(c *fiber.Ctx) error {
		var req OrderCreate
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}

		var product models.Product
		if err := database.DB.First(&product, req.ProductID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"detail": "Product not found"})
		}

		if product.Stock < req.Quantity {
			return c.Status(400).JSON(fiber.Map{"detail": "Stok tidak mencukupi"})
		}

		total := product.Price * req.Quantity
		newOrder := models.Order{
			UserID:      req.UserID,
			ProductName: product.Name,
			Quantity:    req.Quantity,
			TotalPrice:  total,
			Status:      "Diproses",
		}

		tx := database.DB.Begin()
		product.Stock -= req.Quantity
		if err := tx.Save(&product).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"detail": "Failed to update stock"})
		}
		if err := tx.Create(&newOrder).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"detail": "Failed to create order"})
		}
		tx.Commit()

		return c.JSON(fiber.Map{"message": "Order created"})
	})

	api.Get("/orders", func(c *fiber.Ctx) error {
		userID := c.Query("user_id")
		role := c.Query("role", "admin")

		var orders []models.Order
		query := database.DB.Model(&models.Order{})
		
		if role != "admin" && userID != "" {
			query = query.Where("user_id = ?", userID)
		}
		query.Find(&orders)

		var result []fiber.Map
		for _, o := range orders {
			var user models.User
			database.DB.First(&user, o.UserID)
			
			dateStr := o.CreatedAt.Format("02 Jan 2006, 15:04")
			
			result = append(result, fiber.Map{
				"id":            o.ID,
				"customer_name": user.Name,
				"product_name":  o.ProductName,
				"quantity":      o.Quantity,
				"total_price":   o.TotalPrice,
				"status":        o.Status,
				"date":          dateStr,
			})
		}
		
		if result == nil {
			result = make([]fiber.Map, 0)
		}
		return c.JSON(result)
	})

	type OrderStatusUpdate struct {
		Status string `json:"status"`
	}

	api.Put("/orders/:order_id/status", func(c *fiber.Ctx) error {
		orderID := c.Params("order_id")
		var req OrderStatusUpdate
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}

		var order models.Order
		if err := database.DB.First(&order, orderID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"detail": "Order not found"})
		}

		order.Status = req.Status
		database.DB.Save(&order)
		return c.JSON(fiber.Map{"message": "Updated"})
	})

	// =========================
	// STATS
	// =========================
	api.Get("/stats/:role/:user_id", func(c *fiber.Ctx) error {
		role := c.Params("role")
		userID := c.Params("user_id")

		if role == "admin" {
			var totalStok int
			database.DB.Model(&models.Product{}).Select("COALESCE(SUM(stock), 0)").Scan(&totalStok)
			
			var orderCount int64
			database.DB.Model(&models.Order{}).Where("status = ?", "Diproses").Count(&orderCount)
			
			return c.JSON(fiber.Map{
				"total_stok": totalStok,
				"pesanan_proses": orderCount,
				"margin": "Rp 1.2M",
			})
		} else {
			uid, _ := strconv.Atoi(userID)
			var userOrders int64
			database.DB.Model(&models.Order{}).Where("user_id = ?", uid).Count(&userOrders)
			
			return c.JSON(fiber.Map{
				"saldo": "Rp 500.000",
				"barang_dipesan": userOrders,
				"status": "Aktif",
			})
		}
	})

	log.Println("Server berjalan di http://localhost:8000")
	log.Fatal(app.Listen(":8000"))
}
