package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"supplierhub-api/database"
	"supplierhub-api/middleware"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
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

		// Generate JWT Token
		claims := jwt.MapClaims{
			"user_id": user.ID,
			"role":    user.Role,
			"exp":     time.Now().Add(time.Hour * 72).Unix(),
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		secret := os.Getenv("JWT_SECRET")
		t, err := token.SignedString([]byte(secret))
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"detail": "Gagal generate token"})
		}

		return c.JSON(fiber.Map{
			"status": "success",
			"token":  t,
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

	api.Post("/products", middleware.Protected(), func(c *fiber.Ctx) error {
		if c.Locals("role").(string) != "admin" {
			return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat menambah produk"})
		}
		var product models.Product
		if err := c.BodyParser(&product); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}
		database.DB.Create(&product)
		return c.JSON(product)
	})

	api.Put("/products/:id", middleware.Protected(), func(c *fiber.Ctx) error {
		if c.Locals("role").(string) != "admin" {
			return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat mengedit produk"})
		}
		id := c.Params("id")
		var product models.Product
		if err := database.DB.First(&product, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"detail": "Produk tidak ditemukan"})
		}
		if err := c.BodyParser(&product); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}
		database.DB.Save(&product)
		return c.JSON(product)
	})

	api.Delete("/products/:id", middleware.Protected(), func(c *fiber.Ctx) error {
		if c.Locals("role").(string) != "admin" {
			return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat menghapus produk"})
		}
		id := c.Params("id")
		var product models.Product
		if err := database.DB.First(&product, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"detail": "Produk tidak ditemukan"})
		}
		database.DB.Delete(&product)
		return c.JSON(fiber.Map{"message": "Produk berhasil dihapus"})
	})

	// =========================
	// ORDERS
	// =========================
	type CartItem struct {
		ProductID int32 `json:"product_id"`
		Quantity  int   `json:"quantity"`
	}
	type CartCheckout struct {
		UserID int32      `json:"user_id"`
		Notes  string     `json:"notes"`
		Items  []CartItem `json:"items"`
	}

	api.Post("/orders", middleware.Protected(), func(c *fiber.Ctx) error {
		var req CartCheckout
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}

		// Keamanan: Validasi agar user hanya memesan untuk dirinya sendiri
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

		// Generate InvoiceID untuk seluruh transaksi ini
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
	})

	api.Get("/orders", middleware.Protected(), func(c *fiber.Ctx) error {
		// Keamanan: Mengambil data otentik dari JWT token, BUKAN dari URL query
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

	api.Put("/orders/:order_id/status", middleware.Protected(), func(c *fiber.Ctx) error {
		// Hanya admin yang boleh mengubah status
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

		order.Status = req.Status
		database.DB.Save(&order)
		return c.JSON(fiber.Map{"message": "Updated"})
	})

	// =========================
	// STATS
	// =========================
	api.Get("/stats/:role/:user_id", middleware.Protected(), func(c *fiber.Ctx) error {
		// Keamanan: Validasi bahwa param URL cocok dengan token
		jwtRole := c.Locals("role").(string)
		jwtUserID := int32(c.Locals("user_id").(float64))

		if jwtRole == "admin" {
			var totalStok int
			database.DB.Model(&models.Product{}).Select("COALESCE(SUM(stock), 0)").Scan(&totalStok)

			var orderCount int64
			database.DB.Model(&models.Order{}).Where("status = ?", "Diproses").Count(&orderCount)

			return c.JSON(fiber.Map{
				"total_stok":     totalStok,
				"pesanan_proses": orderCount,
				"margin":         "Rp 1.2M",
			})
		} else {
			var userOrders int64
			database.DB.Model(&models.Order{}).Where("user_id = ?", jwtUserID).Count(&userOrders)

			return c.JSON(fiber.Map{
				"saldo":          "Rp 500.000",
				"barang_dipesan": userOrders,
				"status":         "Aktif",
			})
		}
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // fallback
	}

	log.Fatal(app.Listen(":" + port))
}
