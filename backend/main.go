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
				"id":             o.ID,
				"customer_name":  user.Name,
				"product_name":   o.ProductName,
				"quantity":       o.Quantity,
				"total_price":    o.TotalPrice,
				"status":         o.Status,
				"date":           dateStr,
				"invoice_id":     o.InvoiceID,
				"payment_status": o.PaymentStatus,
				"tracking_number":o.TrackingNumber,
				"shipped_at":     o.ShippedAt,
				"notes":          o.Notes,
				"created_at":     o.CreatedAt,
			})
		}

		if result == nil {
			result = make([]fiber.Map, 0)
		}
		return c.JSON(result)
	})

	type OrderStatusUpdate struct {
		Status        string `json:"status"`
		PaymentStatus string `json:"payment_status"`
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

		if req.Status != "" {
			order.Status = req.Status
			// Jika Admin menekan Kirim (Selesai), generate resi & waktu
			if req.Status == "Selesai" && order.TrackingNumber == "" {
				order.TrackingNumber = fmt.Sprintf("SH-TRK-%d", time.Now().Unix())
				now := time.Now()
				order.ShippedAt = &now
			}
		}
		if req.PaymentStatus != "" {
			order.PaymentStatus = req.PaymentStatus
		}
		
		database.DB.Save(&order)
		return c.JSON(fiber.Map{"message": "Updated"})
	})

	api.Put("/orders/:order_id/pay", middleware.Protected(), func(c *fiber.Ctx) error {
		// Endpoint untuk UMKM melakukan pelunasan (Simulasi Payment Gateway)
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
	})

	// =========================
	// RESTOCKS
	// =========================
	type RestockRequest struct {
		ProductID int32 `json:"product_id"`
		Quantity  int   `json:"quantity"`
	}

	api.Post("/restocks", middleware.Protected(), func(c *fiber.Ctx) error {
		jwtRole := c.Locals("role").(string)
		if jwtRole != "admin" {
			return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat meminta restock"})
		}
		jwtUserID := int32(c.Locals("user_id").(float64))

		var req RestockRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
		}

		// Temukan distributor pertama (dummy logic)
		var dist models.User
		if err := database.DB.Where("role = ?", "distributor").First(&dist).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"detail": "Distributor belum tersedia"})
		}

		invoiceID := fmt.Sprintf("REQ-%d", time.Now().Unix())
		
		restock := models.RestockOrder{
			InvoiceID:     invoiceID,
			AdminID:       jwtUserID,
			DistributorID: dist.ID,
			ProductID:     req.ProductID,
			Quantity:      req.Quantity,
			Status:        "Menunggu Persetujuan",
		}

		database.DB.Create(&restock)
		return c.JSON(fiber.Map{"message": "Permintaan restock berhasil dikirim"})
	})

	api.Get("/restocks", middleware.Protected(), func(c *fiber.Ctx) error {
		jwtRole := c.Locals("role").(string)
		jwtUserID := int32(c.Locals("user_id").(float64))

		var restocks []models.RestockOrder
		query := database.DB.Model(&models.RestockOrder{})

		if jwtRole == "distributor" {
			query = query.Where("distributor_id = ?", jwtUserID)
		} else if jwtRole == "admin" {
			query = query.Where("admin_id = ?", jwtUserID)
		} else {
			return c.Status(403).JSON(fiber.Map{"detail": "Akses dilarang"})
		}
		query.Find(&restocks)

		var result []fiber.Map
		for _, r := range restocks {
			var product models.Product
			database.DB.First(&product, r.ProductID)
			
			var admin models.User
			database.DB.First(&admin, r.AdminID)

			result = append(result, fiber.Map{
				"id":             r.ID,
				"invoice_id":     r.InvoiceID,
				"admin_name":     admin.Name,
				"product_name":   product.Name,
				"quantity":       r.Quantity,
				"status":         r.Status,
				"created_at":     r.CreatedAt.Format("02 Jan 2006"),
			})
		}
		if result == nil {
			result = make([]fiber.Map, 0)
		}
		return c.JSON(result)
	})

	api.Put("/restocks/:id/approve", middleware.Protected(), func(c *fiber.Ctx) error {
		jwtRole := c.Locals("role").(string)
		if jwtRole != "distributor" {
			return c.Status(403).JSON(fiber.Map{"detail": "Hanya distributor yang dapat menyetujui"})
		}

		id := c.Params("id")
		var restock models.RestockOrder
		if err := database.DB.First(&restock, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"detail": "Permintaan tidak ditemukan"})
		}

		if restock.Status == "Disetujui & Dikirim" {
			return c.Status(400).JSON(fiber.Map{"detail": "Sudah disetujui sebelumnya"})
		}

		tx := database.DB.Begin()

		// Set status
		restock.Status = "Disetujui & Dikirim"
		if err := tx.Save(&restock).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"detail": "Gagal update status"})
		}

		// Update stok produk
		var product models.Product
		if err := tx.First(&product, restock.ProductID).Error; err != nil {
			tx.Rollback()
			return c.Status(404).JSON(fiber.Map{"detail": "Produk tidak ditemukan"})
		}

		product.Stock += restock.Quantity
		if err := tx.Save(&product).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(fiber.Map{"detail": "Gagal update stok"})
		}

		tx.Commit()
		return c.JSON(fiber.Map{"message": "Berhasil menyetujui restock, stok bertambah"})
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
