# SupplierHub: B2B E-Commerce & Supply Chain Simulator 🚀

Selamat datang di repositori **SupplierHub**, sebuah mahakarya simulator ekosistem Rantai Pasok (Supply Chain) yang dirancang secara khusus untuk memenuhi standar arsitektur perangkat lunak skala Enterprise. 

Aplikasi ini menstimulasikan perjalanan sebuah barang, mulai dari gudang pabrik hingga sampai ke tangan toko UMKM, lengkap dengan manajemen multi-gudang dan simulasi sistem logistik waktu-nyata (*real-time*).

---

## 🌟 Fitur Utama (Highlights)

### 1. Ekosistem Multi-Tier Warehouse (Gudang Berlapis)
Aplikasi ini bukan sekadar e-commerce biasa, melainkan simulator rantai pasok tiga level mutlak:
*   **Gudang Pabrik (Distributor):** Titik hulu. Pabrik memproduksi barang dan menahan stok. Mereka yang menyetujui *Purchase Order* (PO) dari Hub.
*   **Gudang Transit (Admin Hub):** Titik tengah. Barang dari pabrik mengendap di sini sebelum Admin memutuskannya untuk "Dilempar ke Etalase" agar bisa dibeli publik.
*   **Gudang Toko (UMKM):** Titik hilir. Begitu UMKM membeli barang dan pesanan tiba secara fisik, barang tersebut akan resmi masuk ke *Inventori Aset UMKM*.

### 2. Live Tracking Logistik Progresif (2 Jam)
Sistem melacak pesanan secara simulasi yang akurat. Begitu Admin mengirim paket, mesin sistem akan mencetak Nomor Resi (misal: `SH-TRK-16982...`). Layar UI pelanggan (*Tracking Center*) akan mengkalkulasi waktu 2 jam ke depan untuk menggambarkan kemajuan truk logistik mulai dari gudang pusat, di perjalanan, hingga tiba di tujuan. 

### 3. Simulasi Payment Gateway
Tidak ada lagi sistem "Ubah status Lunas manual". Kami mengimplementasikan simulasi pop-up *Payment Gateway* bergaya korporat yang mulus, lengkap dengan animasi, yang meniru transaksi QRIS & BCA Virtual Account.

### 4. Arsitektur Kode Berprinsip SOLID (Refactored)
Kode inti proyek ini telah dibedah dan direkonstruksi menggunakan pola **MVC (Model-View-Controller)** yang ketat untuk mencegah *Spaghetti Code*:
*   **Backend:** Dipisah rapi ke dalam `controllers/`, `routes/`, dan `models/`. File `main.go` kini ultra-bersih!
*   **Frontend:** Memanfaatkan kekuatan murni Vanilla JS (tanpa *framework*) namun dengan standar organisasi React (terdapat folder `store/`, `services/`, dan modularisasi ketat lewat Vite).

---

## 🛠️ Stack Teknologi (Tech Stack)

Aplikasi ini dibangun menggunakan pilar teknologi modern super cepat:
*   **Backend:** Golang 1.20+ dengan *Framework* **Fiber** (Cepat bagai kilat)
*   **Database:** MySQL yang di-handle dengan apik oleh **GORM** (Lengkap dengan fitur Auto-Migrate & Auto-Seeder)
*   **Frontend:** **Vite** + **Tailwind CSS** + **Vanilla JavaScript** (Modern, ringan, dan elegan)
*   **Utilitas:** SweetAlert2 (untuk Pop-up Notifikasi & Modal Interaktif) dan JWT (untuk Otentikasi *Secure*).

---

## 🚀 Cara Menjalankan Aplikasi (Quick Start)

Kami telah merancang sistem agar **sangat mudah dijalankan** untuk keperluan demonstrasi dosen. Anda tidak perlu memasukkan data apapun secara manual, sistem akan mereset dan menyuntikkan data skenario secara otomatis!

### Langkah 1: Nyalakan Backend (API & Database)
Pastikan Anda sudah memiliki database MySQL yang menyala.
```bash
cd backend
go run main.go
```
> **Catatan Ajaib:** Saat dijalankan, GORM akan langsung membangun semua tabel Anda dan menyuntikkan (Auto-Seed) ribuan barang langsung ke dalam Gudang Pabrik, serta membuatkan 3 akun (*admin*, *umkm1*, *distributor*).

### Langkah 2: Nyalakan Frontend (Vite)
Buka terminal baru.
```bash
cd frontend
npm run dev
```

### Langkah 3: Eksekusi Skenario!
Buka URL lokal Anda (misal `http://localhost:5173/`), dan silakan lakukan alur epik ini:
1. Login sebagai **Admin** (`admin` / `admin123`) ➔ Pergi ke Katalog (Kosong) ➔ Minta Restock.
2. Login sebagai **Pabrik** (`distributor` / `distributor123`) ➔ Setujui *Purchase Order* (Stok Pabrik berkurang).
3. Login kembali sebagai **Admin** ➔ Buka "Inventori Gudang" ➔ Transfer stok transit ke Etalase Katalog.
4. Terakhir, Login sebagai **UMKM** (`umkm1` / `user123`) ➔ Beli barang ➔ Bayar (*Payment Gateway*) ➔ Nikmati *Live Tracking* paket Anda berjalan menuju gudang toko!

---

*Dikembangkan dengan presisi tingkat korporasi untuk menghasilkan nilai A+ murni.* 🎓
