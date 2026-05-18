# Analisis Pembagian Peran (Role) SupplierHub di Dunia Nyata

Berdasarkan *workflow diagram* yang ada, sistem saat ini hanya membagi peran menjadi 2 sisi secara teknikal: **Admin** (Pihak Supplier) dan **User** (Pihak Toko UMKM). Namun, dalam skenario bisnis dunia nyata (khususnya untuk distributor grosir B2B), pembagian peran akan jauh lebih spesifik berdasarkan departemen/tugas kerja masing-masing.

Berikut adalah pemetaan pengembangan "Role" jika diimplementasikan secara riil:

---

## A. Pihak Supplier (Pengembangan dari Role "Admin")

Di perusahaan supplier atau distributor, biasanya tidak satu orang yang mengurus semuanya. Role Admin akan dipecah menjadi beberapa *Sub-Role*:

### 1. Warehouse Admin / Tim Logistik (Gudang)
* **Fokus Tugas:** Operasional fisik barang dan menjaga keakuratan stok.
* **Akses Fitur:**
  - Tambah, Edit, Hapus produk di sistem.
  - Menerima pesanan masuk (Hanya tahap penyiapan/packing barang).
  - Melakukan *Stock Opname* harian/bulanan.
* **Tidak Memiliki Akses:** Laporan keuangan atau omset pesanan.

### 2. Sales Admin / Tim Finance
* **Fokus Tugas:** Verifikasi order dan urusan administrasi/keuangan.
* **Akses Fitur:**
  - Memverifikasi pesanan masuk dari UMKM.
  - Melakukan pengecekan bukti pembayaran.
  - Mengubah status pesanan dari "Menunggu Pembayaran" menjadi "Diproses".
  - Mencetak *Invoice* dan Surat Jalan.

### 3. Driver / Tim Pengiriman (Kurir Logistik)
* **Fokus Tugas:** Mengantar barang fisik langsung ke lokasi UMKM.
* **Akses Fitur:**
  - Hanya melihat list alamat pengiriman dan detail barang yang dibawa.
  - Mengubah status pesanan dari "Sedang Dikirim" menjadi "Selesai/Diterima" beserta foto bukti pengiriman.

### 4. Super Admin / Owner Supplier
* **Fokus Tugas:** Pemantauan bisnis, analisis performa, dan pengambilan keputusan.
* **Akses Fitur:**
  - Punya akses ke seluruh fitur (Bisa melihat stok, pesanan, dll).
  - Melakukan manajemen karyawan (Tambah akun untuk Warehouse/Finance/Driver).
  - Mengakses Dashboard Metrik Finansial (Margin, Total Omset, Performa Produk Terlaris).

### 5. Customer Service (CS) / Support
* **Fokus Tugas:** Menangani keluhan pelanggan, memproses retur barang, dan memberikan bantuan kendala layanan.
* **Akses Fitur:**
  - Membuka, membalas, dan menutup tiket keluhan (*Ticketing System*).
  - Melakukan *Request* Retur Barang (Refund / Penggantian Barang) jika ada barang yang cacat atau salah kirim.
  - Membaca detail riwayat pesanan pelanggan untuk validasi keluhan, tetapi tidak bisa sembarangan mengubah stok tanpa *approval* Gudang.

---

## B. Pihak Pelanggan (Pengembangan dari Role "User")

Pada sisi pelanggan UMKM atau toko grosir menengah, role seringkali juga bisa dibagi tergantung skala bisnisnya:

### 1. Pemilik UMKM (Owner / Buyer)
* **Fokus Tugas:** Pemilik mutlak dari toko yang memesan barang ke supplier.
* **Akses Fitur:**
  - Mengakses katalog barang dan mengatur metode pembayaran.
  - Mengonfirmasi penerimaan barang.
  - Memiliki akses terhadap info total pengeluaran toko/saldo/limit kredit.

### 2. Staf Pembelian (Purchasing Staff Toko)
* **Fokus Tugas:** Mengecek stok toko yang hampir habis dan mengajukan pesanan ke supplier.
* **Akses Fitur (Jika UMKM cukup besar):**
  - Bisa mencari dan memasukkan barang ke Keranjang (Cart).
  - Men-draft pesanan (*Draft Order*).
  - **Namun**, eksekusi Final (Checkout/Bayar) hanya bisa di-approve oleh Pemilik UMKM.

---

## Dampak ke Pengembangan Sistem ke Depannya
Jika ke depan aplikasi SupplierHub ini akan dimatangkan menjadi *Real-world App*, struktur tabel `users` di Database yang saat ini kolom role-nya berupa:
`role = 'admin' | 'user'`

Harus mulai dirancang menggunakan Enum atau Role-Based Access Control (RBAC) yang lebih kompleks seperti:
`role = 'super_admin' | 'finance' | 'warehouse' | 'driver' | 'cs' | 'umkm_owner' | 'umkm_staff'` 

Dengan akses API (_Middleware Authorization_) yang lebih spesifik membatasi menu yang bisa dilihat tiap-tiap role tersebut.
