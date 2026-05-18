# Laporan Screening Proyek SupplierHub
**Tanggal Screening:** 18 Mei 2026
**Tujuan:** Evaluasi status proyek (Frontend & Backend) sebelum melakukan perubahan besar (refactoring/penambahan fitur skala besar).

---

## 1. Arsitektur Utama
Aplikasi saat ini menggunakan arsitektur **Full-Stack** yang terpisah antara *Client-Side* (Frontend) dan *Server-Side* (Backend). Komunikasi antar sisi menggunakan REST API (JSON).

## 2. Analisis Sisi Frontend (`/frontend`)
*   **Tech Stack:** Vite, Vanilla JavaScript (ES6), dan Tailwind CSS.
*   **Struktur Kode:**
    *   Menggunakan pendekatan *Single Page Application (SPA)* namun dibangun secara manual (tanpa *framework* seperti React/Vue).
    *   Pengaturan *routing* dan injeksi data dilakukan terpusat di `main.js`.
    *   Antarmuka dibangun menggunakan *Template Literals* JS untuk menyisipkan HTML secara dinamis.
*   **Manajemen State & Data:**
    *   Koneksi ke backend menggunakan API `fetch()` asli bawaan *browser*.
    *   Sesi autentikasi (login) disimpan sementara menggunakan `localStorage` di sisi peramban.
*   **Catatan Screening:** 
    *   Pendekatan Vanilla JS untuk SPA akan semakin sulit dirawat (*maintainability issue*) jika skala aplikasi bertambah besar, terutama untuk reaktivitas antar komponen (misal, *state* stok barang dan keranjang).
    *   Tailwind CSS terkonfigurasi dengan baik melalui `postcss.config.js`.

## 3. Analisis Sisi Backend (`/backend`)
*   **Tech Stack:** Python 3, FastAPI, SQLAlchemy, Uvicorn.
*   **Database:** MySQL (Laragon) menggunakan *driver* `mysql-connector-python`. Koneksi diatur di `database.py`.
*   **Struktur Kode:**
    *   `main.py`: Tempat deklarasi *endpoint* API (Auth, Products, Orders, Stats). Terdapat *middleware* CORS yang terbuka untuk seluruh *origin* (`allow_origins=["*"]`).
    *   `models.py`: Model ORM untuk tabel `User`, `Product`, dan `Order`.
*   **Catatan Screening:**
    *   Sistem autentikasi saat ini masih memvalidasi kredensial (password) secara polos (*plaintext*). **Risiko keamanan tinggi**. Belum ada implementasi token JWT.
    *   Alur *Order* sudah cukup logis, dengan pengurangan otomatis stok saat pesanan dibuat.

## 4. Fitur yang Telah Berfungsi (Berdasarkan *Codebase*)
1.  **Autentikasi:** API login memvalidasi *username* dan *password*, lalu mengembalikan *role* (Admin/User).
2.  **Manajemen Katalog:** Endpoint GET/POST produk berjalan.
3.  **Proses Transaksi:** Pengguna UMKM bisa memesan barang, stok otomatis berkurang.
4.  **Role-Based Access (Order & Dashboard):** Admin bisa mengubah status pesanan (`Diproses` -> `Dikirim`, dll), dan melihat statistik global. Pengguna biasa hanya melihat pesanan miliknya sendiri.

## 5. Kesimpulan & Rekomendasi (Persiapan Refactoring)
Mengingat akan ada **perubahan yang cukup besar**, berikut adalah area utama yang direkomendasikan untuk segera direfaktor / diperbaiki:
1.  **Keamanan (Backend):** Implementasi *hashing* untuk password (misal: `bcrypt`) dan penggunaan **JWT (JSON Web Token)** untuk otorisasi endpoint, menggantikan metode *session* polos.
2.  **Skalabilitas Frontend:** Jika perubahan skala besar melibatkan banyak halaman dan komponen interaktif, pertimbangkan untuk migrasi ke pustaka/kerangka kerja seperti **React, Vue, atau Svelte**. Jika tetap di Vanilla JS, modul harus dipecah (*modularisasi*) agar `main.js` tidak terlalu bengkak.
3.  **Validasi Data:** Tambahkan pydantic *schema* yang lebih ketat di FastAPI untuk menghindari data *corrupt* atau input jahat.
4.  **Manajemen Error:** Frontend perlu mekanisme penanganan *error* jaringan yang lebih responsif (misal saat server MySQL mati).
