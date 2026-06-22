package controllers

import (
	"supplierhub-api/database"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
)

func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	database.DB.Find(&products)
	if products == nil {
		products = make([]models.Product, 0)
	}
	return c.JSON(products)
}

func CreateProduct(c *fiber.Ctx) error {
	if c.Locals("role").(string) != "admin" {
		return c.Status(403).JSON(fiber.Map{"detail": "Hanya admin yang dapat menambah produk"})
	}
	var product models.Product
	if err := c.BodyParser(&product); err != nil {
		return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
	}
	database.DB.Create(&product)
	return c.JSON(product)
}

func UpdateProduct(c *fiber.Ctx) error {
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
}

func DeleteProduct(c *fiber.Ctx) error {
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
}
