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

**Dokumentasi API (Swagger):**
Aplikasi ini sudah dilengkapi dengan dokumentasi interaktif Swagger. Saat backend berjalan, Anda dapat mengakses dokumentasinya dengan membuka browser dan mengunjungi:
👉 `http://localhost:8080/swagger/index.html`

### 2. Menjalankan Frontend (Web)
Buka terminal baru lainnya, arahkan ke folder `frontend`, lalu jalankan:
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan dan menampilkan link lokal (biasanya di `http://localhost:5173`).

---

## 🗄️ Konfigurasi Database (MySQL)

Aplikasi ini menggunakan **MySQL**. Anda tidak perlu melakukan konfigurasi yang rumit!

1. Pastikan server MySQL (misalnya XAMPP atau Docker) sedang menyala di laptop Anda.
2. Buat sebuah database kosong bernama `supplier_hub`.
3. Jalankan *backend* dengan `go run main.go`. Fitur **GORM AutoMigrate** akan secara otomatis membuat tabel-tabel yang dibutuhkan. 
4. Aplikasi dilengkapi dengan **Auto Seeder**. Karena database Anda masih kosong, sistem akan secara otomatis menyuntikkan (mengisi) data awal seperti produk, inventaris, dan kredensial pengguna, sehingga aplikasi bisa langsung diuji coba.

> **Catatan Konfigurasi:** Sistem akan mencoba terhubung menggunakan kredensial bawaan XAMPP (`root`, tanpa password, host `127.0.0.1:3306`). Jika Anda menggunakan *password* untuk MySQL Anda, silakan ubah nama file `backend/.env.example` menjadi `backend/.env` dan sesuaikan nilainya.

---

## 🔑 Kredensial Login Default

Gunakan akun berikut untuk menguji aplikasi (dibuat otomatis oleh seeder):

| Peran (Role) | Username | Password |
| :--- | :--- | :--- |
| **Admin Pusat** | `admin` | `admin123` |
| **UMKM** | `umkm1` | `user123` |
| **Distributor** | `distributor` | `distributor123` |
