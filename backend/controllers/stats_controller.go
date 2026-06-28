package controllers

import (
	"fmt"
	"supplierhub-api/services"

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

	statsService := services.NewStatsService()

	switch jwtRole {
	case "admin":
		return c.JSON(statsService.GetAdminStats())
	case "umkm":
		return c.JSON(statsService.GetUMKMStats(jwtUserID))
	case "distributor":
		return c.JSON(statsService.GetDistributorStats(jwtUserID))
	}

	return c.JSON(fiber.Map{})
}
