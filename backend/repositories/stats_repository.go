package repositories

import (
	"supplierhub-api/database"
	"supplierhub-api/models"
)

type StatsRepository struct{}

func NewStatsRepository() *StatsRepository {
	return &StatsRepository{}
}

func (r *StatsRepository) CountProducts() int64 {
	var total int64
	database.DB.Model(&models.Product{}).Count(&total)
	return total
}

func (r *StatsRepository) CountAllOrders() int64 {
	var total int64
	database.DB.Model(&models.Order{}).Count(&total)
	return total
}

func (r *StatsRepository) FindAllOrders() []models.Order {
	var orders []models.Order
	database.DB.Find(&orders)
	return orders
}

func (r *StatsRepository) CountPendingRestocks() int64 {
	var total int64
	database.DB.Model(&models.RestockOrder{}).Where("status = ?", "Menunggu Persetujuan").Count(&total)
	return total
}

func (r *StatsRepository) CountUserOrders(userID int32) int64 {
	var total int64
	database.DB.Model(&models.Order{}).Where("user_id = ?", userID).Count(&total)
	return total
}

func (r *StatsRepository) FindUserOrders(userID int32) []models.Order {
	var orders []models.Order
	database.DB.Where("user_id = ?", userID).Find(&orders)
	return orders
}

func (r *StatsRepository) CountDistributorRestocks(distributorID int32) int64 {
	var total int64
	database.DB.Model(&models.RestockOrder{}).Where("distributor_id = ?", distributorID).Count(&total)
	return total
}

func (r *StatsRepository) CountPendingDistributorRestocks(distributorID int32) int64 {
	var total int64
	database.DB.Model(&models.RestockOrder{}).Where("distributor_id = ? AND status = ?", distributorID, "Menunggu Persetujuan").Count(&total)
	return total
}
