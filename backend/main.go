package main

import (
	"log"

	"supplierhub-api/database"
	"supplierhub-api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// @title SupplierHub B2B API
// @version 1.0
// @description REST API for SupplierHub Supply Chain Management System.
// @host localhost:8080
// @BasePath /api
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

	// Setup Routes dari module terpisah
	routes.SetupRoutes(app)

	log.Println("Server berjalan di port 8080...")
	log.Fatal(app.Listen(":8080"))
}
