package controllers

import (
	"supplierhub-api/services"

	"github.com/gofiber/fiber/v2"
)

func GetInventory(c *fiber.Ctx) error {
	jwtUserID := uint(c.Locals("user_id").(float64))

	invService := services.NewInventoryService()
	result, err := invService.GetUserInventory(jwtUserID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"detail": "Gagal mengambil data inventaris"})
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

	invService := services.NewInventoryService()
	err := invService.TransferToCatalog(jwtUserID, req.ProductID, req.Quantity)
	if err != nil {
		if err.Error() == "Barang tidak ada di gudang" {
			return c.Status(404).JSON(fiber.Map{"detail": err.Error()})
		}
		if err.Error() == "Produk katalog tidak ditemukan" {
			return c.Status(404).JSON(fiber.Map{"detail": err.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"detail": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Berhasil transfer ke Katalog"})
}
