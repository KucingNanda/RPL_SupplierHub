package database

import (
	"fmt"
	"log"
	"os"
	"supplierhub-api/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	// Memuat file .env
	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: Tidak ada file .env ditemukan, menggunakan environment default")
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)
	
	// Mematikan log GORM yang panjang
	db, errDb := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if errDb != nil {
		log.Fatal("Gagal koneksi ke database: ", errDb)
	}

	DB = db

	err = DB.AutoMigrate(&models.User{}, &models.Product{}, &models.Order{})
	if err != nil {
		log.Fatal("Gagal migrasi database: ", err)
	}

	// === AUTO SEEDER ===
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count == 0 {
		log.Println("Database kosong. Menjalankan auto-seeder...")
		
		// Seed Users
		admin := models.User{Name: "Admin Pusat", Username: "admin", Password: "admin123", Role: "admin", Phone: "081122334455", Address: "Gudang Pusat SupplierHub", City: "Jakarta"}
		umkm1 := models.User{Name: "Toko Sinar Jaya", Username: "umkm1", Password: "user123", Role: "umkm", Phone: "089988776655", Address: "Jl. Merdeka No. 45", City: "Bandung"}
		DB.Create(&admin)
		DB.Create(&umkm1)

		// Seed Products
		products := []models.Product{
			{Name: "Beras Premium 5kg", Category: "Sembako", SKU: "BRS-PRM-5KG", Description: "Beras pulen kualitas super.", Unit: "sak", Price: 65000, Stock: 100},
			{Name: "Minyak Goreng 2L", Category: "Sembako", SKU: "MYK-GRG-2L", Description: "Minyak goreng bening sawit murni.", Unit: "pouch", Price: 32000, Stock: 50},
			{Name: "Gula Pasir 1kg", Category: "Sembako", SKU: "GLA-PSR-1KG", Description: "Gula kristal putih.", Unit: "pcs", Price: 15000, Stock: 200},
			{Name: "Telur Ayam 1kg", Category: "Sembako", SKU: "TLR-AYM-1KG", Description: "Telur ayam ras segar isi 16 butir.", Unit: "kg", Price: 28000, Stock: 30},
		}
		for _, p := range products {
			DB.Create(&p)
		}
		log.Println("Auto-seeder berhasil.")
	}

	log.Println("Koneksi Database MySQL (Online) & Migrasi Berhasil")
}
