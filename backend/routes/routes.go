package routes

import (
	"supplierhub-api/controllers"
	"supplierhub-api/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/login", controllers.Login)

	// Products
	api.Get("/products", controllers.GetProducts)
	api.Post("/products", middleware.Protected(), controllers.CreateProduct)
	api.Put("/products/:id", middleware.Protected(), controllers.UpdateProduct)
	api.Delete("/products/:id", middleware.Protected(), controllers.DeleteProduct)

	// Orders
	api.Post("/orders", middleware.Protected(), controllers.CreateOrder)
	api.Get("/orders", middleware.Protected(), controllers.GetOrders)
	api.Put("/orders/:order_id/status", middleware.Protected(), controllers.UpdateOrderStatus)
	api.Put("/orders/:order_id/pay", middleware.Protected(), controllers.PayOrder)

	// Restocks
	api.Post("/restocks", middleware.Protected(), controllers.RequestRestock)
	api.Get("/restocks", middleware.Protected(), controllers.GetRestocks)
	api.Put("/restocks/:id/approve", middleware.Protected(), controllers.ApproveRestock)

	// Inventory
	api.Get("/inventory", middleware.Protected(), controllers.GetInventory)
	api.Post("/inventory/transfer", middleware.Protected(), controllers.TransferInventory)

	// Stats
	api.Get("/stats/:role/:user_id", middleware.Protected(), controllers.GetStats)
}
