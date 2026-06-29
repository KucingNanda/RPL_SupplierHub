import './style.css'
import { Sidebar } from './layouts/Sidebar.js'
import { Header } from './layouts/Header.js'
import { DashboardPage } from './pages/Dashboard.js'
import { CatalogPage } from './pages/Catalog.js'
import { UserCatalogPage } from './pages/UserCatalog.js'
import { IncomingOrdersPage } from './pages/IncomingOrders.js'
import { OrderHistoryPage } from './pages/OrderHistory.js'
import { DistributorDashboardPage } from './pages/DistributorDashboard.js'
import { TrackingCenterPage } from './pages/TrackingCenter.js'
import { InventoryPage } from './pages/Inventory.js'
import { CartModal } from './components/CartModal.js'

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
    if (state.user.role === 'admin') content = DashboardPage(state.user, state.stats);
    else if (state.user.role === 'umkm') content = DashboardPage(state.user, state.stats);
    else if (state.user.role === 'distributor') content = DistributorDashboardPage(state.restocks, state.stats);
  }
  else if (state.activeTab === 'catalog') content = state.user.role === 'admin' ? CatalogPage(state.products) : UserCatalogPage(state.products, state.cart);
  else if (state.activeTab === 'orders') content = state.user.role === 'admin' ? IncomingOrdersPage(state.orders) : OrderHistoryPage(state.orders);
  else if (state.activeTab === 'tracking') content = TrackingCenterPage(state.orders);
  else if (state.activeTab === 'inventory') content = InventoryPage(state.inventory, state.user.role);
  else content = `<div class="p-20 text-center text-slate-300 italic font-medium">Modul sedang disinkronkan...</div>`;

  appDiv.innerHTML = `
    <div class="flex h-screen w-full overflow-hidden font-sans relative bg-slate-900">
      <!-- Mesh Gradient Background for the whole app -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-indigo-900/40 pointer-events-none z-0"></div>
      
      <div class="relative z-10 flex w-full h-full">
        ${Sidebar(state.activeTab, state.user.role)}
        <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
          ${Header(state.activeTab, state.user, state.cart)}
          <main class="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
            <div class="w-full pb-20">
              ${content}
            </div>
          </main>
        </div>
      </div>
      
      <!-- Render Cart Modal if open -->
      ${CartModal(state.isCartOpen, state.cart)}
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
      window.showToast("Gagal memuat data dari server.", "error");
      renderApp(); // Render aplikasi meskipun data gagal dimuat (agar tidak blank putih)
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
<div class="min-h-screen flex bg-slate-900">
  <!-- Left Panel: Branding (Hidden on Mobile) -->
  <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-slate-900 border-r border-white/10">
    <!-- Mesh Gradient Background -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/80 via-slate-900 to-blue-900/60"></div>
    <div class="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-indigo-500/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow"></div>
    <div class="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen"></div>
    
    <div class="relative z-10 p-12 w-full max-w-2xl animate-fade-in">
      <div class="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[2rem] flex items-center justify-center transform hover:rotate-12 transition-all duration-500 shadow-[0_0_50px_rgba(79,70,229,0.5)] mb-10">
        <i class="fas fa-cubes text-white text-5xl shadow-sm"></i>
      </div>
      <h1 class="text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">Masa Depan<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Rantai Pasok B2B.</span></h1>
      <p class="mt-6 text-xl text-indigo-100/80 font-medium tracking-wide max-w-lg leading-relaxed">Kelola gudang, etalase, dan pesanan dalam satu ekosistem yang dirancang untuk skala enterprise.</p>
      
      <div class="mt-12 flex gap-4">
        <div class="glass-card px-6 py-4 rounded-2xl flex items-center gap-4">
          <i class="fas fa-shield-alt text-emerald-400 text-2xl"></i>
          <div>
            <h4 class="text-white font-bold text-sm">Keamanan Enkripsi</h4>
            <p class="text-[10px] text-slate-400">Standar Industri</p>
          </div>
        </div>
        <div class="glass-card px-6 py-4 rounded-2xl flex items-center gap-4">
          <i class="fas fa-bolt text-amber-400 text-2xl"></i>
          <div>
            <h4 class="text-white font-bold text-sm">Real-time Data</h4>
            <p class="text-[10px] text-slate-400">Latensi Rendah</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right Panel: Login Form -->
  <div class="w-full lg:w-1/2 flex items-center justify-center relative overflow-hidden bg-slate-900 lg:bg-transparent">
    <!-- Background for Mobile Only -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-indigo-900/40 pointer-events-none z-0 lg:hidden"></div>
    
    <div class="relative z-10 w-full max-w-lg px-8 sm:px-16 py-12">
      <!-- Mobile Logo -->
      <div class="lg:hidden text-center mb-10 animate-fade-in">
        <div class="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
          <i class="fas fa-cubes text-white text-3xl"></i>
        </div>
        <h2 class="text-3xl font-black text-white tracking-tight">SupplierHub</h2>
      </div>

      <div class="text-left mb-10 animate-fade-in">
        <h2 class="text-4xl font-black text-white tracking-tight">Selamat Datang</h2>
        <p class="text-sm text-indigo-200/60 mt-3 font-medium">Masuk ke akun Anda untuk melanjutkan ke dashboard.</p>
      </div>

      <div class="space-y-6 animate-fade-in" style="animation-delay: 0.1s;">
        <div class="group">
          <label class="block text-[10px] uppercase tracking-widest font-bold text-indigo-200/80 mb-2 ml-1">Username</label>
          <div class="relative">
            <i class="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-white transition-colors"></i>
            <input id="username" type="text" class="block w-full appearance-none rounded-2xl bg-white/5 border border-white/10 px-5 py-4 pl-12 placeholder-slate-500 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium text-sm backdrop-blur-md" placeholder="admin / umkm1 / distributor">
          </div>
        </div>
        <div class="group">
          <label class="block text-[10px] uppercase tracking-widest font-bold text-indigo-200/80 mb-2 ml-1">Password</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-white transition-colors"></i>
            <input id="password" type="password" class="block w-full appearance-none rounded-2xl bg-white/5 border border-white/10 px-5 py-4 pl-12 placeholder-slate-500 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all font-medium text-sm backdrop-blur-md" placeholder="••••••••">
          </div>
        </div>
        <button onclick="handleLogin()" class="w-full flex items-center justify-center gap-3 py-4 mt-8 border border-transparent rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all active:scale-[0.98] group">
          Masuk Sekarang <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>

      <p class="mt-12 text-center text-[10px] uppercase tracking-widest font-bold text-slate-600 animate-fade-in" style="animation-delay: 0.2s;">
        Secured by SupplierHub Security
      </p>
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