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

	err = DB.AutoMigrate(&models.User{}, &models.Product{}, &models.Order{}, &models.RestockOrder{}, &models.Inventory{})
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
		distributor := models.User{Name: "Pabrik Utama Indofood", Username: "distributor", Password: "distributor123", Role: "distributor", Phone: "0219988776", Address: "Kawasan Industri", City: "Cikarang"}
		
		DB.Create(&admin)
		DB.Create(&umkm1)
		DB.Create(&distributor)

		// Seed Products (Stock awal Etalase = 0)
		products := []models.Product{
			{Name: "Beras Premium 5Kg", Category: "Sembako", SKU: "BRS-PRM-001", Description: "Beras pulen kualitas super", Unit: "sak", Price: 65000, Stock: 0},
			{Name: "Minyak Goreng 2L", Category: "Sembako", SKU: "MNY-GRG-002", Description: "Minyak sawit murni 2 Liter", Unit: "pouch", Price: 35000, Stock: 0},
			{Name: "Gula Pasir 1Kg", Category: "Sembako", SKU: "GLA-PSR-003", Description: "Gula pasir putih lokal", Unit: "kg", Price: 15000, Stock: 0},
			{Name: "Tepung Terigu 1Kg", Category: "Sembako", SKU: "TPG-TRG-004", Description: "Tepung protein sedang", Unit: "kg", Price: 12000, Stock: 0},
		}
		for _, p := range products {
			DB.Create(&p)
		}

		// Modal Awal: Pabrik / Distributor punya 1000 pcs per produk di Gudangnya
		for i := 1; i <= 4; i++ {
			DB.Create(&models.Inventory{UserID: uint(distributor.ID), ProductID: uint(i), Quantity: 1000})
		}

		log.Println("Seeder selesai. (Produk di katalog = 0, Gudang Distributor = 1000pcs)")
	}

	log.Println("Koneksi Database MySQL (Online) & Migrasi Berhasil")
}
