package repositories

import (
	"supplierhub-api/database"
	"supplierhub-api/models"
)

type InventoryRepository struct{}

func NewInventoryRepository() *InventoryRepository {
	return &InventoryRepository{}
}

func (r *InventoryRepository) FindByUserID(userID uint) ([]models.Inventory, error) {
	var inventories []models.Inventory
	err := database.DB.Where("user_id = ?", userID).Find(&inventories).Error
	return inventories, err
}

func (r *InventoryRepository) GetProduct(productID uint) (models.Product, error) {
	var product models.Product
	err := database.DB.First(&product, productID).Error
	return product, err
}
