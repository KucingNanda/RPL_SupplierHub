package main

import (
	"log"
	"supplierhub-api/database"
	"supplierhub-api/models"
)

func main() {
	database.ConnectDB()
	
	result := database.DB.Model(&models.Product{}).Where("stock = ?", 0).Update("stock", 100)
	if result.Error != nil {
		log.Fatal("Gagal update stock:", result.Error)
	}
	
	log.Printf("Berhasil mengupdate %d produk menjadi stok 100\n", result.RowsAffected)
}
