import { Sidebar } from './layouts/Sidebar.js'
import { Navbar } from './layouts/Navbar.js'
import { DashboardPage } from './pages/Dashboard.js'
import { CatalogPage } from './pages/Catalog.js'
import { UserCatalogPage } from './pages/UserCatalog.js'
import { IncomingOrdersPage } from './pages/IncomingOrders.js'
import { OrderHistoryPage } from './pages/OrderHistory.js'
import { DistributorDashboardPage } from './pages/DistributorDashboard.js'
import { TrackingCenterPage } from './pages/TrackingCenter.js'
import { InventoryPage } from './pages/Inventory.js'

import { state, setState } from './store/state.js'
import { api } from './services/api.js'
import { showPaymentGatewayModal, showLiveTrackingModal } from './utils/modals.js'
import Swal from 'sweetalert2'

window.showToast = (message, icon = 'success') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
  });
};

const renderApp = () => {
  const appDiv = document.querySelector('#app');
  if (!state.user) {
    appDiv.innerHTML = renderLogin();
    return;
  }

  let content = '';
  if (state.activeTab === 'dashboard') {
    if (state.user.role === 'admin') content = DashboardPage(state.stats);
    else if (state.user.role === 'umkm') content = DashboardPage(state.stats, 'umkm');
    else if (state.user.role === 'distributor') content = DistributorDashboardPage(state.restocks, state.stats);
  }
  else if (state.activeTab === 'catalog') content = state.user.role === 'admin' ? CatalogPage(state.products) : UserCatalogPage(state.products, state.cart);
  else if (state.activeTab === 'orders') content = state.user.role === 'admin' ? IncomingOrdersPage(state.orders) : OrderHistoryPage(state.orders);
  else if (state.activeTab === 'tracking') content = TrackingCenterPage(state.orders);
  else if (state.activeTab === 'inventory') content = InventoryPage(state.inventory, state.user.role);
  else content = `<div class="p-20 text-center text-slate-300 italic font-medium">Modul sedang disinkronkan...</div>`;

  appDiv.innerHTML = `
    <div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
      ${Sidebar(state.activeTab, state.user.role)}
      <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
        ${Navbar(state.user)}
        <main class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div class="max-w-7xl mx-auto pb-20">
            ${content}
          </div>
        </main>
      </div>
    </div>
  `;
}

window.fetchData = async () => {
  if (!state.user) return;
  try {
    const data = await api.fetchAllData(state.user.role, state.user.id);
    setState('products', data.products);
    setState('stats', data.stats);
    setState('orders', data.orders);
    setState('inventory', data.inventory);
    if (data.restocks) setState('restocks', data.restocks);
    renderApp();
  } catch (error) {
    if (error.message === "Unauthorized") {
      window.handleLogout();
    } else {
      console.error("Gagal load data:", error);
    }
  }
};

window.handleLogin = async () => {
  const u = document.querySelector('#username').value;
  const p = document.querySelector('#password').value;
  try {
    const { ok, data } = await api.login(u, p);
    if (ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setState('user', data.user);
      setState('activeTab', 'dashboard');
      window.showToast(`Selamat datang, ${data.user.name}!`);
      await window.fetchData();
    } else {
      window.showToast(data.detail, 'error');
    }
  } catch (e) {
    window.showToast("Server tidak merespon.", 'error');
  }
};

window.handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setState('user', null);
  renderApp();
};

window.switchTab = (tab) => {
  setState('activeTab', tab);
  renderApp();
};

window.addToCart = (productId) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  const cartItem = state.cart.find(c => c.product_id === productId);
  if (cartItem) {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity++;
      window.showToast("Kuantitas ditambahkan!");
    } else {
      window.showToast("Stok tidak mencukupi!", "error");
    }
  } else {
    state.cart.push({ product_id: productId, quantity: 1 });
    window.showToast(`${product.name} dimasukkan ke keranjang`);
  }
  renderApp();
};

window.removeFromCart = (productId) => {
  setState('cart', state.cart.filter(c => c.product_id !== productId));
  renderApp();
};

window.toggleCart = () => {
  setState('isCartOpen', !state.isCartOpen);
  renderApp();
};

window.handleCheckout = async () => {
  const notes = document.querySelector('#order-notes')?.value || '';
  if (state.cart.length === 0) return window.showToast("Keranjang kosong!", "error");

  const { isConfirmed } = await Swal.fire({
    title: 'Proses Checkout',
    text: "Anda yakin ingin memesan semua barang ini?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Pesan!',
    cancelButtonText: 'Batal',
    customClass: { popup: 'rounded-3xl', confirmButton: 'bg-indigo-600 rounded-xl px-6 py-2', cancelButton: 'bg-slate-200 rounded-xl px-6 py-2 text-slate-700' }
  });

  if (isConfirmed) {
    const { ok, data } = await api.checkoutCart(state.user.id, state.cart, notes);
    if (ok) {
      setState('cart', []);
      setState('isCartOpen', false);
      window.showToast("Pesanan berhasil dibuat!");
      await window.fetchData();
      window.switchTab('orders');
    } else {
      window.showToast(data.detail, 'error');
    }
  }
};

window.updateOrderStatus = async (orderId, newStatus) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Update Status?',
    text: `Ubah status menjadi: ${newStatus}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Ubah',
    cancelButtonText: 'Batal',
    customClass: { popup: 'rounded-3xl', confirmButton: 'bg-indigo-600 rounded-xl px-6 py-2', cancelButton: 'bg-slate-200 rounded-xl px-6 py-2 text-slate-700' }
  });

  if (isConfirmed) {
    const { ok, data } = await api.updateOrderStatus(orderId, newStatus);
    if (ok) {
      window.showToast(`Status diperbarui menjadi: ${newStatus}`);
      await window.fetchData();
    } else {
      window.showToast(data.detail, 'error');
    }
  }
};

window.handleRequestRestock = async (productId) => {
  const { value: quantity } = await Swal.fire({
    title: 'Minta Restock ke Pabrik',
    input: 'number',
    inputLabel: 'Jumlah stok yang diminta',
    inputPlaceholder: 'Misal: 100',
    showCancelButton: true,
    confirmButtonText: 'Kirim Permintaan PO',
    inputValidator: (val) => {
      if (!val || val <= 0) return 'Masukkan jumlah yang valid!'
    },
    customClass: { popup: 'rounded-3xl', confirmButton: 'bg-indigo-600 rounded-xl px-6 py-2' }
  });

  if (quantity) {
    const { ok, data } = await api.requestRestock(productId, parseInt(quantity));
    if (ok) {
      window.showToast("Permintaan PO dikirim ke Pabrik!");
    } else {
      window.showToast(data.detail, "error");
    }
  }
};

window.handleApproveRestock = async (id) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Setujui PO?',
    text: "Barang akan dikirim ke Gudang Supplier Hub.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Kirim Barang',
    cancelButtonText: 'Batal',
    customClass: { popup: 'rounded-3xl', confirmButton: 'bg-indigo-600 rounded-xl px-6 py-2' }
  });

  if (isConfirmed) {
    const { ok, data } = await api.approveRestock(id);
    if (ok) {
      window.showToast("Barang berhasil dipindah ke Supplier Hub!");
      await window.fetchData();
    } else {
      window.showToast(data.detail || "Gagal", "error");
    }
  }
};

window.handleTransferCatalog = async (productId) => {
  const { value: quantity } = await Swal.fire({
    title: 'Transfer ke Katalog',
    input: 'number',
    inputLabel: 'Berapa banyak stok yang ingin dipajang?',
    inputPlaceholder: 'Misal: 50',
    showCancelButton: true,
    confirmButtonText: 'Transfer',
    cancelButtonText: 'Batal',
    inputValidator: (val) => {
      if (!val || val <= 0) return 'Masukkan jumlah yang valid!'
    },
    customClass: { popup: 'rounded-3xl', confirmButton: 'bg-indigo-600 rounded-xl px-6 py-2' }
  });

  if (quantity) {
    const { ok, data } = await api.transferInventory(productId, parseInt(quantity));
    if (ok) {
      window.showToast("Stok berhasil ditransfer ke Katalog!");
      await window.fetchData();
    } else {
      window.showToast(data.detail || "Gagal transfer", "error");
    }
  }
};

window.showPaymentGateway = async (orderId, amount) => {
  await showPaymentGatewayModal(orderId, amount, async () => {
    const { ok } = await api.payOrder(orderId);
    if (ok) {
      window.showToast("Pembayaran Berhasil! Mengubah status ke Lunas...");
      await window.fetchData();
    }
  });
};

window.showLiveTracking = (resi, timestamp) => {
  showLiveTrackingModal(resi, timestamp);
};

window.searchTracking = () => {
  const input = document.getElementById('tracking-input').value;
  if (!input) return window.showToast("Masukkan nomor resi terlebih dahulu!", "error");
  const order = state.orders.find(o => o.tracking_number === input);
  if (order) {
    window.showLiveTracking(order.tracking_number, order.shipped_at);
  } else {
    window.showToast("Resi tidak ditemukan", "error");
  }
};

const renderLogin = () => `
<div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-xl">
      <i class="fas fa-cubes text-white text-3xl -rotate-12"></i>
    </div>
    <h2 class="mt-6 text-center text-3xl font-black text-slate-900">SupplierHub</h2>
    <p class="mt-2 text-center text-sm text-slate-500 font-medium">Silakan masuk ke ekosistem logistik</p>
  </div>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-10 px-8 shadow-2xl shadow-indigo-100 rounded-[2.5rem] border border-slate-100 mx-4 sm:mx-0">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700">Username</label>
          <div class="mt-2">
            <input id="username" type="text" class="block w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium" placeholder="admin / umkm1 / distributor">
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700">Password</label>
          <div class="mt-2">
            <input id="password" type="password" class="block w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium" placeholder="••••••••">
          </div>
        </div>
        <button onclick="handleLogin()" class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all active:scale-[0.98]">
          Masuk ke Sistem
        </button>
      </div>
    </div>
  </div>
</div>
`;

window.addEventListener('DOMContentLoaded', () => {
  if (state.user) {
    window.fetchData();
  } else {
    renderApp();
  }
});