package controllers

import (
	"fmt"
	"supplierhub-api/database"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
)

func GetStats(c *fiber.Ctx) error {
	jwtRole := c.Locals("role").(string)
	jwtUserID := int32(c.Locals("user_id").(float64))

	roleParam := c.Params("role")
	userIDParam := c.Params("user_id")

	if jwtRole != roleParam || fmt.Sprint(jwtUserID) != userIDParam {
		return c.Status(403).JSON(fiber.Map{"detail": "Akses dilarang. Token tidak cocok dengan parameter."})
	}

	var totalProducts int64
	var totalOrders int64
	var totalRevenue int64
	var pendingRestocks int64

	database.DB.Model(&models.Product{}).Count(&totalProducts)

	switch jwtRole {
	case "admin":
		database.DB.Model(&models.Order{}).Count(&totalOrders)
		var orders []models.Order
		database.DB.Find(&orders)
		for _, o := range orders {
			if o.PaymentStatus == "Lunas" {
				totalRevenue += int64(o.TotalPrice)
			}
		}
		database.DB.Model(&models.RestockOrder{}).Where("status = ?", "Menunggu Persetujuan").Count(&pendingRestocks)

		return c.JSON(fiber.Map{
			"total_products":   totalProducts,
			"total_orders":     totalOrders,
			"total_revenue":    totalRevenue,
			"pending_restocks": pendingRestocks,
		})
	case "umkm":
		database.DB.Model(&models.Order{}).Where("user_id = ?", jwtUserID).Count(&totalOrders)
		var orders []models.Order
		database.DB.Where("user_id = ?", jwtUserID).Find(&orders)
		var totalBelanja int64
		for _, o := range orders {
			totalBelanja += int64(o.TotalPrice)
		}

		return c.JSON(fiber.Map{
			"total_orders":  totalOrders,
			"total_belanja": totalBelanja,
		})
	case "distributor":
		database.DB.Model(&models.RestockOrder{}).Where("distributor_id = ?", jwtUserID).Count(&totalOrders)
		database.DB.Model(&models.RestockOrder{}).Where("distributor_id = ? AND status = ?", jwtUserID, "Menunggu Persetujuan").Count(&pendingRestocks)
		
		return c.JSON(fiber.Map{
			"total_po_masuk":   totalOrders,
			"pending_requests": pendingRestocks,
		})
	}

	return c.JSON(fiber.Map{})
}
