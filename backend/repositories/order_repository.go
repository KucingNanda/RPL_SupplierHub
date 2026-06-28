package repositories

import (
	"supplierhub-api/database"
	"supplierhub-api/models"
)

type OrderRepository struct{}

func NewOrderRepository() *OrderRepository {
	return &OrderRepository{}
}

func (r *OrderRepository) FindOrdersByRole(role string, userID int32) ([]models.Order, error) {
	var orders []models.Order
	query := database.DB.Preload("User")

	if role != "admin" {
		query = query.Where("user_id = ?", userID)
	}

	err := query.Find(&orders).Error
	return orders, err
}
