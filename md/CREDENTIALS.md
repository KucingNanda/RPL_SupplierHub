# Kredensial Login Supplier Hub B2B

Berikut adalah daftar akun *default* (bawaan) yang dibuat secara otomatis oleh sistem saat pertama kali aplikasi dijalankan. Anda dapat menggunakan akun ini untuk keperluan simulasi dan pengujian aplikasi.

## 1. Akun Administrator (Supplier Pusat)
Gunakan akun ini untuk masuk ke panel manajemen katalog, menambah stok, dan memproses pesanan masuk.

- **Peran:** Admin
- **Nama Pengguna (Username):** `admin`
- **Kata Sandi (Password):** `admin123`

## 2. Akun Pelanggan (UMKM / Toko Retail)
Gunakan akun ini untuk mensimulasikan proses pembeli: melihat katalog, menambah barang ke keranjang belanja, dan melacak riwayat pesanan.

- **Peran:** UMKM
- **Nama Pengguna (Username):** `umkm1`
- **Kata Sandi (Password):** `user123`

---

> **Tips:** 
> Jika Anda sewaktu-waktu membutuhkan lebih banyak akun UMKM, Anda harus mendaftarkannya langsung ke database secara manual atau menambahkannya ke fungsi `Auto-Seeder` di file `backend/database/database.go`.
