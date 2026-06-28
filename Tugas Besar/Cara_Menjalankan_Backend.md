# Cara Menjalankan Backend Python (FastAPI)

Dokumen ini berisi panduan singkat untuk mengaktifkan Virtual Environment (venv) dan menjalankan server backend Python menggunakan FastAPI.

## 1. Masuk ke Folder Backend
Pastikan Anda sudah berada di dalam direktori `backend` sebelum menjalankan perintah lainnya.
```bash
cd backend
```

## 2. Mengaktifkan Virtual Environment (Venv)
Jalankan perintah berikut pada terminal Git Bash untuk mengaktifkan lingkungan virtual:
```bash
source venv/Scripts/activate
```
> **Catatan:** Jika berhasil, akan muncul tulisan `(venv)` di sebelah kiri prompt terminal Anda.

*(Jika Anda menggunakan Command Prompt bawaan Windows, gunakan `venv\Scripts\activate.bat`. Jika PowerShell, gunakan `.\venv\Scripts\Activate.ps1`)*

## 3. Menjalankan Server Backend
Setelah virtual environment aktif, jalankan server FastAPI menggunakan `uvicorn` dengan perintah:
```bash
uvicorn main:app --reload
```

- `main` merujuk pada nama file `main.py`.
- `app` merujuk pada instansiasi FastAPI di dalam file tersebut (`app = FastAPI()`).
- `--reload` berfungsi agar server otomatis di-restart ketika ada perubahan pada file source code.

Server akan berjalan dan bisa diakses melalui browser atau tools pengujian API (seperti Postman) pada: **http://localhost:8000**
