/**
 * src/main.js
 * File ini mengelola alur Login, Role, dan Navigasi.
 * Menggunakan LocalStorage untuk persistensi sesi pengguna.
 * Diperbarui untuk mendukung layout full-width tanpa potongan.
 */

import './style.css'
import { Sidebar } from './layouts/Sidebar.js'
import { Header } from './layouts/Header.js'
import { LandingPage } from './pages/Landing.js'
import { LoginPage } from './pages/Login.js'
import { DashboardPage } from './pages/Dashboard.js'
import { CatalogPage } from './pages/Catalog.js'
import { UserCatalogPage } from './pages/UserCatalog.js'

// 1. State Aplikasi
const savedUser = JSON.parse(localStorage.getItem('sh_user'))

let state = {
  activeTab: localStorage.getItem('sh_active_tab') || 'landing',
  isLoggedIn: !!savedUser,
  user: savedUser || null
}

// 2. Mapping Judul Halaman
const pageTitles = {
  'landing': 'Selamat Datang',
  'login': 'Portal Masuk',
  'dashboard': 'Ringkasan Aktivitas',
  'catalog': 'Katalog Produk',
  'orders': 'Riwayat Transaksi',
  'settings': 'Konfigurasi Sistem'
}

const app = document.querySelector('#app')

/**
 * 3. Fungsi Pemilih Halaman
 */
const renderCurrentPage = () => {
  if (!state.isLoggedIn) {
    return state.activeTab === 'login' ? LoginPage() : LandingPage()
  }

  switch (state.activeTab) {
    case 'dashboard':
      return DashboardPage(state.user)
    case 'catalog':
      return state.user.role === 'admin' ? CatalogPage() : UserCatalogPage()
    default:
      return `
        <div class="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 animate-fade-in w-full">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <i class="fas fa-tools text-2xl text-slate-300"></i>
          </div>
          <h3 class="font-bold text-slate-900 text-lg">Halaman ${pageTitles[state.activeTab] || state.activeTab}</h3>
          <p class="text-slate-500 text-sm mt-1 text-center max-w-xs">Modul ini sedang dalam tahap sinkronisasi dengan API Gateway.</p>
          <button onclick="navigateTo('dashboard')" class="mt-6 text-indigo-600 font-medium text-sm hover:underline">
            Kembali ke Dashboard
          </button>
        </div>
      `
  }
}

/**
 * 4. Fungsi Render Utama
 * Perbaikan: Memastikan container menggunakan lebar penuh layar.
 */
const renderApp = () => {
  if (!state.isLoggedIn) {
    app.innerHTML = `<main class="w-full min-h-screen bg-slate-50 overflow-x-hidden">${renderCurrentPage()}</main>`
    window.scrollTo(0, 0)
    return
  }

  // Menggunakan 'w-full' dan 'max-w-none' untuk memastikan tidak ada potongan layout
  app.innerHTML = `
    <div class="flex w-full min-h-screen bg-slate-50">
      ${Sidebar(state.activeTab, state.user.role)}
      <main class="flex-1 ml-64 p-10 min-h-screen overflow-y-auto w-full max-w-none">
        <div class="w-full max-w-full mx-auto">
          ${Header(pageTitles[state.activeTab] || 'SupplierHub', state.user)}
          <div id="page-content" class="mt-8 w-full">${renderCurrentPage()}</div>
        </div>
      </main>
    </div>
  `
  window.scrollTo(0, 0)
}

/**
 * 5. Fungsi Global
 */
window.navigateTo = (tabId) => {
  state.activeTab = tabId
  localStorage.setItem('sh_active_tab', tabId)
  renderApp()
}

window.handleLogin = (role) => {
  const userData = {
    role: role,
    name: role === 'admin' ? 'Admin Supplier' : 'Toko UMKM Maju',
    loginTime: new Date().toISOString()
  }
  
  state.isLoggedIn = true
  state.user = userData
  state.activeTab = 'dashboard'
  
  localStorage.setItem('sh_user', JSON.stringify(userData))
  localStorage.setItem('sh_active_tab', 'dashboard')
  
  renderApp()
}

window.handleLogout = () => {
  state.isLoggedIn = false
  state.user = null
  state.activeTab = 'landing'
  
  localStorage.removeItem('sh_user')
  localStorage.removeItem('sh_active_tab')
  
  renderApp()
}

window.toggleModal = (show) => {
  const modal = document.querySelector('#modal-container')
  if (modal) {
    if (show) {
      modal.classList.remove('hidden')
      modal.classList.add('flex')
    } else {
      modal.classList.add('hidden')
      modal.classList.remove('flex')
    }
  }
}

document.addEventListener('DOMContentLoaded', renderApp)