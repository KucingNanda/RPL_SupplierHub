package services

import (
	"errors"
	"fmt"
	"supplierhub-api/database"
	"supplierhub-api/models"
	"time"
)

type RestockService struct{}

func NewRestockService() *RestockService {
	return &RestockService{}
}

func (s *RestockService) RequestRestock(adminID int32, productID int32, quantity int) error {
	var dist models.User
	if err := database.DB.Where("role = ?", "distributor").First(&dist).Error; err != nil {
		return errors.New("Distributor belum tersedia")
	}

	invoiceID := fmt.Sprintf("REQ-%d", time.Now().Unix())

	restock := models.RestockOrder{
		InvoiceID:     invoiceID,
		AdminID:       adminID,
		DistributorID: dist.ID,
		ProductID:     productID,
		Quantity:      quantity,
		Status:        "Menunggu Persetujuan",
	}

	return database.DB.Create(&restock).Error
}

func (s *RestockService) ApproveRestock(distributorID uint, restockID string) error {
	var restock models.RestockOrder
	if err := database.DB.First(&restock, restockID).Error; err != nil {
		return errors.New("Permintaan tidak ditemukan")
	}

	if restock.Status == "Disetujui & Dikirim" {
		return errors.New("Sudah disetujui sebelumnya")
	}

	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var distInv models.Inventory
	if err := tx.Where("user_id = ? AND product_id = ?", distributorID, restock.ProductID).First(&distInv).Error; err != nil || distInv.Quantity < restock.Quantity {
		tx.Rollback()
		return errors.New("Stok gudang pabrik tidak mencukupi")
	}

	distInv.Quantity -= restock.Quantity
	if err := tx.Save(&distInv).Error; err != nil {
		tx.Rollback()
		return errors.New("Gagal memotong stok distributor")
	}

	var adminInv models.Inventory
	err := tx.Where("user_id = ? AND product_id = ?", restock.AdminID, restock.ProductID).First(&adminInv).Error
	if err != nil {
		adminInv = models.Inventory{
			UserID:    uint(restock.AdminID),
			ProductID: uint(restock.ProductID),
			Quantity:  restock.Quantity,
		}
		if err := tx.Create(&adminInv).Error; err != nil {
			tx.Rollback()
			return errors.New("Gagal menambah stok admin")
		}
	} else {
		adminInv.Quantity += restock.Quantity
		if err := tx.Save(&adminInv).Error; err != nil {
			tx.Rollback()
			return errors.New("Gagal update stok admin")
		}
	}

	restock.Status = "Disetujui & Dikirim"
	if err := tx.Save(&restock).Error; err != nil {
		tx.Rollback()
		return errors.New("Gagal update status PO")
	}

	if err := tx.Commit().Error; err != nil {
		return errors.New("Gagal menyimpan transaksi")
	}
	
	return nil
}
