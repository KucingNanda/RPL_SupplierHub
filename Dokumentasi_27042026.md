# Dokumentasi Proyek Frontend SupplierHub

**Tanggal Dokumen:** 27 April 2026
**Proyek:** SupplierHub (B2B Supply Chain Platform)

---

## 1. Struktur Folder dan Fungsinya

Proyek frontend ini memiliki struktur direktori dasar yang dibangun menggunakan alat *build* Vite. Berikut adalah rincian struktur folder utama beserta fungsinya:

- `node_modules/`: Berisi semua dependensi atau pustaka eksternal yang diinstal melalui NPM (Node Package Manager) untuk mendukung jalannya proyek.
- `public/`: Folder ini digunakan untuk menyimpan aset statis yang tidak perlu diproses oleh bundler Vite (misalnya `favicon` atau gambar statis yang diakses secara langsung).
- `src/`: Merupakan folder utama (source) yang berisi semua kode sumber aplikasi, tempat pengembang menulis logika program, antarmuka pengguna (UI), dan *styling*.
  - `src/assets/`: Digunakan untuk menyimpan aset statis yang akan diproses oleh Vite, seperti gambar, *font*, atau ikon pendukung.
  - `src/layouts/`: Berisi komponen-komponen tata letak (layout) yang digunakan kembali (reusable) di berbagai halaman, seperti struktur dasar *header* dan navigasi samping (*sidebar*).
  - `src/pages/`: Menyimpan *file-file* komponen untuk setiap halaman penuh yang akan dirender di aplikasi.
  - `src/utils/`: Disiapkan sebagai tempat fungsi-fungsi pembantu (*helper functions*) atau utilitas yang dapat digunakan secara modular di berbagai bagian kode.

---

## 2. Fungsi Tiap File dalam Folder `src`

Secara spesifik, file-file di dalam direktori `src` memiliki peran dan tanggung jawabnya masing-masing untuk menjalankan aplikasi secara utuh:

- **`main.js`**: Merupakan titik masuk utama (*entry point*) aplikasi. File ini bertugas mengelola:
  - Manajemen status aplikasi (*state management*), mencakup status autentikasi (*isLoggedIn*), peran pengguna (*user role*), dan tab/halaman yang aktif.
  - Sistem perutean (*routing*) sederhana.
  - Persistensi sesi pengguna menggunakan mekanisme `localStorage`.
  - Fungsi-fungsi navigasi global (`navigateTo`, `handleLogin`, `handleLogout`).
- **`style.css`**: Berisi pengaturan gaya (*style*) global untuk aplikasi, yang pada utamanya dimanfaatkan untuk mengimpor direktif inti dan utilitas dari Tailwind CSS.
- **`counter.js`**: Skrip bawaan (*boilerplate*) dari instalasi Vite untuk demonstrasi fungsionalitas JavaScript dasar, biasanya dapat dihapus jika tidak lagi diperlukan.
- **`layouts/Header.js`**: Mengembalikan fungsi untuk merender komponen *Header* (bagian atas antarmuka) yang dapat disesuaikan dengan judul halaman atau profil pengguna yang sedang masuk.
- **`layouts/Sidebar.js`**: Mengembalikan fungsi untuk merender menu navigasi samping yang tautannya berubah secara dinamis berdasarkan peran (*role*) pengguna yang sedang aktif (misalnya *Admin* atau *User*).
- **`pages/Landing.js`**: Merender Halaman Landing publik yang memberikan informasi produk, keunggulan platform, serta akses tautan menuju ke Halaman Login.
- **`pages/Login.js`**: Merender antarmuka halaman portal masuk yang memungkinkan pengguna memilih perannya secara *mockup*, baik sebagai Admin Supplier maupun User UMKM.
- **`pages/Dashboard.js`**: Merender halaman ringkasan (*Dashboard*) pasca-login yang menampilkan statistik berbeda dan disesuaikan dengan setiap *role*.
- **`pages/Catalog.js`**: Menyediakan halaman Katalog Produk spesifik untuk Admin Supplier, dengan kemampuan visibilitas detail stok barang dan fungsi manajemen.
- **`pages/UserCatalog.js`**: Menyediakan antarmuka katalog belanja barang bagi User UMKM, berfokus pada informasi harga dan fasilitas menambahkan barang ke pesanan.

---

## 3. Alur Aplikasi dari Landing sampai Dashboard

Alur kerja (*user flow*) yang direpresentasikan oleh aplikasi dari mulai pengguna membuka situs hingga melihat Dashboard adalah sebagai berikut:

1. **Inisialisasi (main.js)**: Aplikasi akan dimuat pertama kali melalui `main.js`. Sistem akan membaca status apakah pengguna masih memiliki sesi aktif di dalam `localStorage` (`sh_user` dan `sh_active_tab`).
2. **Halaman Landing**: Jika tidak ada sesi pengguna (pengguna belum login), aplikasi akan memeriksa apakah tab yang aktif adalah 'login'. Jika bukan (biasanya *default* 'landing'), maka akan memanggil komponen `LandingPage()`. Halaman ini berisi deskripsi proyek dan tombol **"Masuk Sekarang"**.
3. **Navigasi ke Login**: Ketika tombol "Masuk Sekarang" diklik pada Halaman Landing, fungsi `navigateTo('login')` dipicu. Layar akan bertransisi ke Halaman Login.
4. **Halaman Login**: Halaman ini akan memanggil `LoginPage()` yang menampilkan dua buah tombol (Login sebagai Admin atau Login sebagai User). Di sini sistem melakukan proses otentikasi buatan (*mock authentication*).
5. **Proses Login**: Apabila salah satu opsi peran diklik, fungsi global `handleLogin(role)` akan dijalankan. Fungsi ini akan membuat objek profil pengguna (berisi nama, peran, dan waktu login), menyimpannya di `localStorage` agar persisten, mengubah status *state.isLoggedIn* menjadi `true`, mengatur tab aktif menjadi 'dashboard', dan kembali memanggil render utama.
6. **Halaman Dashboard**: Aplikasi akan memuat struktur utama (terdiri dari *Sidebar*, *Header*, dan area konten utama). Untuk bagian konten utama, fungsi *routing* di `main.js` mengeksekusi `DashboardPage(state.user)`. Informasi yang ditampilkan di dalam dasbor berbeda berdasarkan status peran (seperti metrik total stok untuk admin, dan saldo belanja untuk UMKM).

---

## 4. Penjelasan Fitur Utama

Beberapa fitur kunci pada platform purwarupa SupplierHub:

- **Login (Role-Based Mock Auth)**
  Sistem ini menerapkan fitur *login* semu dengan fungsionalitas *Role-Based Access Control* (RBAC). Meskipun tidak ada pengecekan kredensial di *backend* (pada versi ini), fungsi ini secara efektif mampu mensimulasikan alur pengguna yang terbagi dalam dua otorisasi, yaitu *Admin Supplier* dan *User UMKM*.
  
- **Katalog Manajemen Admin (`Catalog.js`)**
  Fitur yang dikhususkan bagi Admin Supplier. Pada halaman ini, admin dapat melihat inventaris dan rincian produk secara spesifik (nama, harga grosir, kategori). Terdapat fitur visualisasi level stok barang (*progress bar*) yang akan menjadi merah jika stok berada di bawah ambang batas (di bawah 50 unit). Halaman ini juga memiliki komponen *mockup* untuk opsi pencarian dan tombol penambahan produk baru.
  
- **Katalog Belanja UMKM (`UserCatalog.js`)**
  Di sisi User UMKM, tampilan katalog disesuaikan agar lebih *user-friendly* dalam konteks pembeli. Fitur ini menonjolkan harga, kategori produk, serta tombol aksi "Tambahkan ke Pesanan" untuk setiap item, ditujukan guna menunjang kelancaran transaksional.

---

## 5. Teknologi yang Digunakan

Aplikasi frontend SupplierHub ini dikembangkan dengan memanfaatkan tumpukan teknologi modern, antara lain:

- **Vite**: Digunakan sebagai *build tool* atau pemaket aset (*bundler*) super cepat.
- **Vanilla JavaScript (ES6 Modules)**: Aplikasi ditulis tanpa *framework* khusus (seperti React, Vue, atau Angular). Untuk proses perenderan antarmuka, aplikasi memanfaatkan fitur *Template Literals* JavaScript dasar guna merangkai string HTML dan komponen logika secara dinamis.
- **Tailwind CSS**: Sebuah utilitas kerangka kerja CSS yang dikonfigurasi melalui `tailwind.config.js`. Digunakan sebagai sistem *styling* fungsional dengan kelas-*utility* yang secara langsung diterapkan pada struktur HTML komponen.
- **LocalStorage**: Sebuah antarmuka *Web Storage API* bawaan peramban yang dimanfaatkan guna menyimpan data sesi profil pengguna dan *state* navigasi terkini. Teknologi ini memungkinkan pengalaman pengguna yang persisten ketika halaman disegarkan ulang.

---

## 6. Rencana Pengembangan Kedepannya

Untuk tahap pengembangan selanjutnya, proyek ini direncanakan akan mencakup beberapa peningkatan fitur dan fungsionalitas, antara lain:

- **Integrasi Backend & API Gateway**: Menghubungkan antarmuka *frontend* yang saat ini berbentuk purwarupa (*mock*) dengan *backend server* nyata untuk mengelola data operasional dan otentikasi (misalnya melalui token JWT).
- **Sistem Keranjang dan Transaksi Checkout (Pesanan)**: Membangun fungsionalitas penuh untuk menambah/mengurangi keranjang belanja (UMKM) dan memproses alur pembayaran transaksi.
- **Integrasi Modul Pembayaran (SmartBank)**: Menggabungkan API *payment gateway* (mengadopsi konsep awal ekosistem SmartBank) guna memfasilitasi rekonsiliasi dan verifikasi pembayaran otomatis.
- **Notifikasi Waktu Nyata (Real-time)**: Memberikan informasi terbaru seketika terkait perubahan status pesanan, stok kritis barang (untuk Admin), dan pengumuman sistem via WebSocket.
- **Fitur Pencarian Lanjutan & Filter**: Memberikan fitur penyaringan (*filter*) tingkat lanjut berdasarkan kategori, harga, dan ketersediaan, disertai dukungan penomoran halaman (*pagination*) untuk performa katalog yang optimal.
- **Pengembangan UI/UX Lanjutan**: Menyempurnakan interaksi melalui animasi transisi, dukungan spesifik aplikasi seluler (*Progressive Web App*), serta memperhalus tampilan agar lebih *engaging*.
