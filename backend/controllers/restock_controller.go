package controllers

import (
	"supplierhub-api/repositories"
	"supplierhub-api/services"

	"github.com/gofiber/fiber/v2"
)

func RequestRestock(c *fiber.Ctx) error {
	type RestockRequest struct {
		ProductID int32 `json:"product_id"`
		Quantity  int   `json:"quantity"`
	}

	jwtRole := c.Locals("role").(string)
	if jwtRole != "admin" {
		return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat meminta restock"})
	}
	jwtUserID := int32(c.Locals("user_id").(float64))

	var req RestockRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
	}

	restockService := services.NewRestockService()
	if err := restockService.RequestRestock(jwtUserID, req.ProductID, req.Quantity); err != nil {
		if err.Error() == "Distributor belum tersedia" {
			return c.Status(500).JSON(fiber.Map{"detail": err.Error()})
		}
		return c.Status(500).JSON(fiber.Map{"detail": "Gagal membuat permintaan"})
	}

	return c.JSON(fiber.Map{"message": "Permintaan restock berhasil dikirim"})
}

func GetRestocks(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	jwtUserID := int32(c.Locals("user_id").(float64))

	if jwtRole != "distributor" && jwtRole != "admin" {
		return c.Status(403).JSON(fiber.Map{"detail": "Akses dilarang"})
	}

	repo := repositories.NewRestockRepository()
	restocks, err := repo.FindByRole(jwtRole, jwtUserID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"detail": "Gagal mengambil data restock"})
	}

	var result []fiber.Map
	for _, r := range restocks {
		product, admin, _ := repo.GetRelatedData(r.ProductID, r.AdminID)

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
	
	restockService := services.NewRestockService()
	err := restockService.ApproveRestock(distributorID, id)
	if err != nil {
		if err.Error() == "Permintaan tidak ditemukan" {
			return c.Status(404).JSON(fiber.Map{"detail": err.Error()})
		}
		if err.Error() == "Sudah disetujui sebelumnya" || err.Error() == "Stok gudang pabrik tidak mencukupi" {
			return c.Status(400).JSON(fiber.Map{"detail": err.Error()})
		}
		return c.Status(500).JSON(fiber.Map{"detail": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Berhasil menyetujui restock, barang dipindah ke Gudang Supplier Hub"})
}
