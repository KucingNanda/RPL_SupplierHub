package controllers

import (
	"fmt"
	"time"

	"supplierhub-api/database"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
)

type RestockRequest struct {
	ProductID int32 `json:"product_id"`
	Quantity  int   `json:"quantity"`
}

func RequestRestock(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	if jwtRole != "admin" {
		return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat meminta restock"})
	}
	jwtUserID := int32(c.Locals("user_id").(float64))

	var req RestockRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
	}

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
}

func GetRestocks(c *fiber.Ctx) error {
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
			"id":           r.ID,
			"invoice_id":   r.InvoiceID,
			"admin_name":   admin.Name,
			"product_name": product.Name,
			"quantity":     r.Quantity,
			"status":       r.Status,
			"created_at":   r.CreatedAt.Format("02 Jan 2006"),
		})
	}
	if result == nil {
		result = make([]fiber.Map, 0)
	}
	return c.JSON(result)
}

func ApproveRestock(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	if jwtRole != "distributor" {
		return c.Status(403).JSON(fiber.Map{"detail": "Hanya distributor yang dapat menyetujui"})
	}
	distributorID := uint(c.Locals("user_id").(float64))

	id := c.Params("id")
	var restock models.RestockOrder
	if err := database.DB.First(&restock, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"detail": "Permintaan tidak ditemukan"})
	}

	if restock.Status == "Disetujui & Dikirim" {
		return c.Status(400).JSON(fiber.Map{"detail": "Sudah disetujui sebelumnya"})
	}

	tx := database.DB.Begin()

	var distInv models.Inventory
	if err := tx.Where("user_id = ? AND product_id = ?", distributorID, restock.ProductID).First(&distInv).Error; err != nil || distInv.Quantity < restock.Quantity {
		tx.Rollback()
		return c.Status(400).JSON(fiber.Map{"detail": "Stok gudang pabrik tidak mencukupi"})
	}

	distInv.Quantity -= restock.Quantity
	tx.Save(&distInv)

	var adminInv models.Inventory
	err := tx.Where("user_id = ? AND product_id = ?", restock.AdminID, restock.ProductID).First(&adminInv).Error
	if err != nil {
		adminInv = models.Inventory{
			UserID:    uint(restock.AdminID),
			ProductID: uint(restock.ProductID),
			Quantity:  restock.Quantity,
		}
		tx.Create(&adminInv)
	} else {
		adminInv.Quantity += restock.Quantity
		tx.Save(&adminInv)
	}

	restock.Status = "Disetujui & Dikirim"
	if err := tx.Save(&restock).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{"detail": "Gagal update status"})
	}

	tx.Commit()
	return c.JSON(fiber.Map{"message": "Berhasil menyetujui restock, barang dipindah ke Gudang Supplier Hub"})
}
