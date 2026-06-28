package services

import (
	"errors"
	"supplierhub-api/database"
	"supplierhub-api/models"
	"supplierhub-api/repositories"
)

type InventoryService struct{
	repo *repositories.InventoryRepository
}

func NewInventoryService() *InventoryService {
	return &InventoryService{
		repo: repositories.NewInventoryRepository(),
	}
}

type InventoryResponse struct {
	ID          uint   `json:"id"`
	ProductID   uint   `json:"product_id"`
	ProductName string `json:"product_name"`
	SKU         string `json:"sku"`
	Unit        string `json:"unit"`
	Quantity    int    `json:"quantity"`
	UpdatedAt   string `json:"updated_at"`
}

func (s *InventoryService) GetUserInventory(userID uint) ([]InventoryResponse, error) {
	inventories, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	var result []InventoryResponse
	for _, inv := range inventories {
		product, _ := s.repo.GetProduct(inv.ProductID)
		result = append(result, InventoryResponse{
			ID:          inv.ID,
			ProductID:   inv.ProductID,
			ProductName: product.Name,
			SKU:         product.SKU,
			Unit:        product.Unit,
			Quantity:    inv.Quantity,
			UpdatedAt:   inv.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	
	if result == nil {
		result = make([]InventoryResponse, 0)
	}
	return result, nil
}

func (s *InventoryService) TransferToCatalog(userID uint, productID uint, quantity int) error {
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var inv models.Inventory
	if err := tx.Where("user_id = ? AND product_id = ?", userID, productID).First(&inv).Error; err != nil {
		tx.Rollback()
		return errors.New("Barang tidak ada di gudang")
	}

	if inv.Quantity < quantity {
		tx.Rollback()
		return errors.New("Stok gudang tidak cukup")
	}

	var product models.Product
	if err := tx.First(&product, productID).Error; err != nil {
		tx.Rollback()
		return errors.New("Produk katalog tidak ditemukan")
	}

	inv.Quantity -= quantity
	product.Stock += quantity

	if err := tx.Save(&inv).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Save(&product).Error; err != nil {
		tx.Rollback()
		return err
	}
	
	if err := tx.Commit().Error; err != nil {
		return errors.New("Gagal commit transaksi")
	}
	
	return nil
}
