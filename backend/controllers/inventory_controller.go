package controllers

import (
	"supplierhub-api/database"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
)

func GetInventory(c *fiber.Ctx) error {
	jwtUserID := uint(c.Locals("user_id").(float64))

	var inventories []models.Inventory
	database.DB.Where("user_id = ?", jwtUserID).Find(&inventories)

	var result []fiber.Map
	for _, inv := range inventories {
		var product models.Product
		database.DB.First(&product, inv.ProductID)
		result = append(result, fiber.Map{
			"id":           inv.ID,
			"product_id":   inv.ProductID,
			"product_name": product.Name,
			"sku":          product.SKU,
			"unit":         product.Unit,
			"quantity":     inv.Quantity,
			"updated_at":   inv.UpdatedAt,
		})
	}
	if result == nil {
		result = make([]fiber.Map, 0)
	}
	return c.JSON(result)
}

type TransferReq struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

func TransferInventory(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	if jwtRole != "admin" {
		return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang bisa transfer stok"})
	}
	jwtUserID := uint(c.Locals("user_id").(float64))

	var req TransferReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
	}

	tx := database.DB.Begin()

	var inv models.Inventory
	if err := tx.Where("user_id = ? AND product_id = ?", jwtUserID, req.ProductID).First(&inv).Error; err != nil {
		tx.Rollback()
		return c.Status(404).JSON(fiber.Map{"detail": "Barang tidak ada di gudang"})
	}

	if inv.Quantity < req.Quantity {
		tx.Rollback()
		return c.Status(400).JSON(fiber.Map{"detail": "Stok gudang tidak cukup"})
	}

	var product models.Product
	if err := tx.First(&product, req.ProductID).Error; err != nil {
		tx.Rollback()
		return c.Status(404).JSON(fiber.Map{"detail": "Produk katalog tidak ditemukan"})
	}

	inv.Quantity -= req.Quantity
	product.Stock += req.Quantity

	tx.Save(&inv)
	tx.Save(&product)
	tx.Commit()

	return c.JSON(fiber.Map{"message": "Berhasil transfer ke Katalog"})
}
