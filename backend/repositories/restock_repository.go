package repositories

import (
	"supplierhub-api/database"
	"supplierhub-api/models"
)

type RestockRepository struct{}

func NewRestockRepository() *RestockRepository {
	return &RestockRepository{}
}

func (r *RestockRepository) FindByRole(role string, userID int32) ([]models.RestockOrder, error) {
	var restocks []models.RestockOrder
	query := database.DB.Model(&models.RestockOrder{})

	switch role {
	case "distributor":
		query = query.Where("distributor_id = ?", userID)
	case "admin":
		query = query.Where("admin_id = ?", userID)
	}
	
	err := query.Find(&restocks).Error
	return restocks, err
}

func (r *RestockRepository) GetRelatedData(productID int32, adminID int32) (models.Product, models.User, error) {
	var product models.Product
	errP := database.DB.First(&product, productID).Error
	
	var admin models.User
	errA := database.DB.First(&admin, adminID).Error
	
	if errP != nil {
		return product, admin, errP
	}
	return product, admin, errA
}
