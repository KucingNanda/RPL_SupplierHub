import './style.css'
import { Sidebar } from './layouts/Sidebar.js'
import { Header } from './layouts/Header.js'
import { LandingPage } from './pages/Landing.js'
import { LoginPage } from './pages/Login.js'
import { DashboardPage } from './pages/Dashboard.js'
import { CatalogPage } from './pages/Catalog.js'
import { UserCatalogPage } from './pages/UserCatalog.js'
import { IncomingOrdersPage } from './pages/IncomingOrders.js'
import { OrderHistoryPage } from './pages/OrderHistory.js'

const API_BASE_URL = "http://127.0.0.1:8000/api";

let state = {
  activeTab: localStorage.getItem('sh_active_tab') || 'landing',
  isLoggedIn: !!JSON.parse(localStorage.getItem('sh_user')),
  user: JSON.parse(localStorage.getItem('sh_user')) || null,
  products: [],
  orders: [],
  stats: null
}

const app = document.querySelector('#app')

// --- SYSTEM TOAST (NOTIFIKASI CANTIK) ---
window.showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-10 right-10 z-[10000] px-8 py-4 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-3 font-bold text-sm text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

const fetchData = async () => {
  if (!state.isLoggedIn) return;
  try {
    const [pRes, sRes, oRes] = await Promise.all([
      fetch(`${API_BASE_URL}/products`),
      fetch(`${API_BASE_URL}/stats/${state.user.role}/${state.user.id}`),
      fetch(`${API_BASE_URL}/orders?user_id=${state.user.id}&role=${state.user.role}`)
    ]);
    state.products = await pRes.json();
    state.stats = await sRes.json();
    state.orders = await oRes.json();
    renderApp();
  } catch (err) { console.error("Sync Error:", err); }
}

const renderApp = () => {
  if (!state.isLoggedIn) {
    app.innerHTML = `<main class="w-full min-h-screen bg-slate-50">${state.activeTab === 'login' ? LoginPage() : LandingPage()}</main>`;
    return;
  }

  let content = '';
  if (state.activeTab === 'dashboard') content = DashboardPage(state.user, state.stats);
  else if (state.activeTab === 'catalog') content = state.user.role === 'admin' ? CatalogPage(state.products) : UserCatalogPage(state.products);
  else if (state.activeTab === 'orders') content = state.user.role === 'admin' ? IncomingOrdersPage(state.orders) : OrderHistoryPage(state.orders);
  else content = `<div class="p-20 text-center text-slate-300 italic font-medium">Modul sedang disinkronkan...</div>`;

  app.innerHTML = `
    <div class="flex w-full min-h-screen bg-slate-50">
      ${Sidebar(state.activeTab, state.user.role)}
      <main class="flex-1 ml-64 p-10 min-h-screen overflow-y-auto">
        ${Header(state.activeTab, state.user)}
        <div id="page-content" class="mt-8">${content}</div>
      </main>
    </div>
  `;
}

// --- HANDLERS ---
window.handleOrder = async (productId) => {
  const qty = prompt("Jumlah pesanan (unit):", "1");
  if (!qty || isNaN(qty) || parseInt(qty) <= 0) return;
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: state.user.id, product_id: productId, quantity: parseInt(qty) })
    });
    if (res.ok) {
      window.showToast("Pesanan Berhasil!");
      await fetchData();
    } else { window.showToast("Gagal Memesan", "error"); }
  } catch (err) { window.showToast("Koneksi Error", "error"); }
}

window.handleUpdateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      window.showToast("Status Diperbarui");
      await fetchData();
    }
  } catch (err) { window.showToast("Gagal Update", "error"); }
}

window.handleLogin = async () => {
  const u = document.querySelector('#username').value;
  const p = document.querySelector('#password').value;
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    const d = await res.json();
    if (res.ok) {
      state.isLoggedIn = true; state.user = d.user; state.activeTab = 'dashboard';
      localStorage.setItem('sh_user', JSON.stringify(d.user));
      window.showToast(`Selamat datang, ${d.user.name}`);
      await fetchData();
    } else { window.showToast(d.detail, "error"); }
  } catch (err) { window.showToast("Backend Offline", "error"); }
}

window.handleLogout = () => { localStorage.clear(); location.reload(); }
window.navigateTo = (id) => { state.activeTab = id; localStorage.setItem('sh_active_tab', id); renderApp(); fetchData(); }
document.addEventListener('DOMContentLoaded', () => { if (state.isLoggedIn) fetchData(); renderApp(); });