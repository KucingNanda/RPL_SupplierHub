# SupplierHub B2B - Supply Chain Management System

Aplikasi SupplierHub adalah prototipe sistem manajemen rantai pasok berbasis web dengan arsitektur Decoupled MVC (Backend Golang REST API & Frontend Web).

## 🚀 Cara Menjalankan Aplikasi (Construct)

Aplikasi ini dipisah menjadi dua bagian, Backend dan Frontend. Pastikan Anda telah menginstal **Go (Golang)** dan **Node.js** di komputer Anda.

### 1. Menjalankan Backend (Golang)
Buka terminal baru, arahkan ke folder `backend`, lalu jalankan:
```bash
cd backend
go mod tidy
go run main.go
```
Backend akan berjalan di port `8080`.

### 2. Menjalankan Frontend (Web)
Buka terminal baru lainnya, arahkan ke folder `frontend`, lalu jalankan:
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan dan menampilkan link lokal (biasanya di `http://localhost:5173`).

---

## 🗄️ Database

Aplikasi ini menggunakan **MySQL**. Konfigurasi koneksi database diatur di dalam file `backend/.env`.
Saat aplikasi pertama kali dijalankan (`go run main.go`), fitur **GORM AutoMigrate** akan secara otomatis membuat tabel-tabel yang dibutuhkan. 

Aplikasi ini juga dilengkapi dengan **Auto Seeder**. Jika database kosong, sistem akan secara otomatis mengisi data awal (produk, inventaris, dan pengguna).

---

## 🔑 Kredensial Login Default

Gunakan akun berikut untuk menguji aplikasi (dibuat otomatis oleh seeder):

| Peran (Role) | Username | Password |
| :--- | :--- | :--- |
| **Admin Pusat** | `admin` | `admin123` |
| **UMKM** | `umkm1` | `user123` |
| **Distributor** | `distributor` | `distributor123` |
