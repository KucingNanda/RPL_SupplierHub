# BAB XIV
# PENGUJIAN AKHIR (SETELAH REFACTORING)

Setelah melakukan perubahan arsitektur aplikasi menjadi *Layered Architecture* (pemisahan logika ke dalam *Service* dan *Repository*), dilakukan pengujian secara komprehensif dari sisi antarmuka pengguna (UI) dan proses *backend* untuk memastikan seluruh fungsionalitas berjalan normal tanpa ada regresi. 

Berikut adalah dokumentasi tangkapan layar pengujian yang membuktikan integritas aplikasi:

### 1. Tampilan Dashboard Admin Sesuai Desain Baru
*(Sistem menampilkan metrik yang akurat hasil kalkulasi dari StatsService di backend)*
**[TEMPATKAN SCREENSHOT DASHBOARD ADMIN DI SINI]**

### 2. Pengujian Alur Transaksi (Checkout UMKM)
*(Proses checkout berhasil dilakukan, stok berkurang melalui transaksi yang aman di InventoryService)*
**[TEMPATKAN SCREENSHOT CHECKOUT BERHASIL DI SINI]**

### 3. Pengujian Persetujuan Restock (Distributor ke Gudang)
*(Approval PO oleh admin berhasil mengubah status dan mentransfer stok dari Distributor ke Gudang)*
**[TEMPATKAN SCREENSHOT APPROVE RESTOCK BERHASIL DI SINI]**

### 4. Bukti Backend Berjalan Tanpa Error (Terminal)
*(Hasil `go build` dan `go run main.go` berjalan lancar tanpa peringatan error atau konflik port)*
**[TEMPATKAN SCREENSHOT TERMINAL BACKEND DI SINI]**

---

# BAB XV
# KESIMPULAN REFACTORING

Dari hasil perombakan *codebase* dan restrukturisasi *SupplierHub*, dapat ditarik beberapa kesimpulan sebagai berikut:

1. **Pemisahan Tanggung Jawab (*Separation of Concerns*):** 
   Kode yang awalnya menumpuk (kueri database, logika bisnis, dan respons HTTP) di dalam satu fungsi Controller, kini telah didistribusikan secara rapi. *Controller* murni hanya mengatur lalu lintas data masuk/keluar, *Service* mengelola aturan bisnis (*Business Logic*), dan *Repository* bertanggung jawab penuh atas seluruh transaksi *Database* menggunakan GORM.
   
2. **Skalabilitas & Kemudahan Pemeliharaan (*Maintainability*):**
   Penggunaan *Layered Architecture* membuat kode jauh lebih bersih dan terstruktur. Jika ke depannya ada perubahan *database* atau penambahan fitur bisnis baru, *programmer* hanya perlu memodifikasi bagian *Repository* atau *Service* tanpa khawatir merusak alur API di *Controller*.

3. **Keandalan Sistem:**
   Logika perpindahan data penting, seperti transfer *Inventory* dan sinkronisasi pembayaran *Order*, kini telah dibungkus ke dalam *Database Transactions* (`tx.Begin()`, `tx.Commit()`, `tx.Rollback()`) di tingkat *Repository*. Hal ini menjamin konsistensi data absolut agar tidak terjadi masalah kelebihan/pengurangan stok yang tidak valid.

---

# BAB XVI
# LAMPIRAN & REFERENSI REPOSITORI

Segala bentuk *source code*, sejarah perubahan (*commit history*), dan berkas *refactoring* dapat diakses secara publik melalui tautan repositori GitHub berikut:

**Link Repositori Utama:**
`https://github.com/KucingNanda/RPL_Praktikum`

*(Catatan: Repositori sebelumnya telah dipindahkan ke RPL_Praktikum sesuai dengan instruksi yang berlaku).*

**Status Branch:**
- Seluruh kode final hasil *refactoring* (termasuk *Service* dan *Repository* baru) telah berhasil di-*merge* dan tersedia pada *branch* **`main`**.

Demikian laporan implementasi arsitektur perangkat lunak ini dibuat dengan sebenar-benarnya sebagai bukti pengerjaan Tugas Besar.
