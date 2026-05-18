# Dokumentasi Proyek SupplierHub

**Tanggal Dokumen Diperbarui:** 18 Mei 2026
**Proyek:** SupplierHub (B2B Supply Chain Platform - Frontend & Backend Terintegrasi)

---

## 1. Struktur Folder dan Fungsinya

Proyek SupplierHub kini telah mengadopsi arsitektur *Full-Stack* yang terdiri dari dua direktori utama: `frontend/` dan `backend/`.

### Folder `frontend/` (Vite + Vanilla JS)
- `node_modules/`: Dependensi eksternal dari NPM.
- `public/`: Aset statis.
- `src/`: Berisi kode sumber antarmuka pengguna (UI) dan *styling*.
  - `src/layouts/`: Komponen tata letak (*Header*, *Sidebar*).
  - `src/pages/`: Komponen untuk setiap halaman (*Landing*, *Login*, *Dashboard*, *Catalog*, *UserCatalog*, *IncomingOrders*, *OrderHistory*).
  - `main.js`: *Entry point* utama yang kini menangani *routing*, manajemen *state*, dan komunikasi API (Fetch) ke backend.
  - `style.css`: Konfigurasi gaya global dan Tailwind CSS.

### Folder `backend/` (FastAPI + Python)
- `main.py`: *File* utama server yang mendefinisikan *endpoint* API (Login, Products, Orders, Stats) serta konfigurasi CORS.
- `database.py`: Konfigurasi koneksi ke basis data SQLite menggunakan SQLAlchemy.
- `models.py`: Definisi struktur tabel (*schema*) basis data (seperti tabel `User`, `Product`, dan `Order`).
- `venv/`: Lingkungan virtual (*Virtual Environment*) Python.

---

## 2. Alur Aplikasi dan Integrasi API

Aplikasi kini tidak lagi menggunakan data *mock*, melainkan sudah terhubung secara penuh (*real-time*) dengan *backend*. Berikut adalah alur kerjanya:

1. **Inisialisasi & Persistensi (main.js)**: Sistem membaca sesi pengguna dari `localStorage`. Jika ada sesi aktif, fungsi `fetchData()` akan otomatis mengambil data terbaru dari API sebelum merender aplikasi.
2. **Halaman Login Terintegrasi**: Saat pengguna mencoba masuk, kredensial akan dikirim melalui `POST /api/login`. Jika valid, profil pengguna akan disimpan, dan tampilan beralih ke *Dashboard*.
3. **Sinkronisasi Data Dinamis**: Setelah login, fungsi `fetchData()` secara paralel memanggil 3 *endpoint* utama:
   - `GET /api/products`: Mengambil katalog produk.
   - `GET /api/stats/{role}/{user_id}`: Mengambil statistik spesifik peran (misal, stok untuk admin, total pesanan untuk pengguna).
   - `GET /api/orders`: Mengambil riwayat pesanan (tergantung *role* pengguna).
4. **Perenderan Halaman (*Routing*)**: Konten (*Dashboard*, *Catalog*, atau *Orders*) dirender secara dinamis dengan injeksi data yang ditarik dari *backend*.

---

## 3. Fitur Utama Terkini

Berdasarkan pembaruan terbaru, fitur-fitur ini telah beroperasi secara fungsional:

- **Autentikasi (API-Based Login)**
  Login tidak lagi simulasi. Kredensial divalidasi langsung oleh basis data SQLite, mengembalikan data profil pengguna untuk manajemen akses (Admin Supplier vs User UMKM).
- **Manajemen Pesanan (Order System)**
  - **User UMKM**: Dapat memesan produk dari katalog (`POST /api/orders`), yang otomatis akan memotong stok di basis data, dan memantau pesanan di halaman *Order History*.
  - **Admin Supplier**: Dapat memantau pesanan masuk (*Incoming Orders*) dan mengubah status pesanan (`PUT /api/orders/{order_id}/status`), misalnya dari "Diproses" menjadi "Dikirim".
- **Statistik Dinamis (*Dashboard Stats*)**
  Data statistik yang ditampilkan pada *Dashboard* kini diambil secara *real-time* dari *database*. Admin dapat memantau total stok keseluruhan dan pesanan yang sedang diproses, sedangkan pengguna UMKM dapat melihat rekap riwayat pesanan mereka.
- **Sistem Notifikasi (*Toast*)**
  Integrasi visual untuk setiap aksi (misalnya, pesanan sukses atau gagal divalidasi API) menggunakan komponen *Toast* di pojok kanan bawah antarmuka.

---

## 4. Teknologi yang Digunakan

Aplikasi telah bertransformasi menjadi platform yang komprehensif dengan *tech stack*:

**Frontend:**
- **Vite & Vanilla JS (ES6)**: Modul murni tanpa *framework* reaktif, memanfaatkan *Template Literals* untuk performa maksimal.
- **Tailwind CSS**: *Utility-first styling*.
- **Fetch API & LocalStorage**: Pengelolaan komunikasi data asinkronus ke server dan manajemen sesi lokal.

**Backend:**
- **FastAPI (Python)**: Kerangka kerja server asinkronus untuk performa tinggi.
- **SQLAlchemy & SQLite**: ORM untuk manajemen basis data relasional.

---

## 5. Rencana Pengembangan Kedepannya

- **Integrasi Pembayaran (Payment Gateway)**: Menambahkan modul pembayaran pihak ketiga untuk otomatisasi verifikasi.
- **Sistem Keamanan Berbasis Token (JWT)**: Menggantikan pengiriman data *plaintext* menjadi autentikasi token JWT guna keamanan *session*.
- **Fitur Keranjang (*Cart*)**: Memungkinkan pengguna untuk menambahkan beberapa produk berbeda sekaligus sebelum melakukan *checkout* pesanan.
- **WebSocket (Real-Time Updates)**: Memanfaatkan pembaruan *real-time* tanpa memuat ulang (*refresh*) halaman atau memanggil ulang `fetchData()` secara manual.
