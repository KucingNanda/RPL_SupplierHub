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
import { DistributorDashboardPage } from './pages/DistributorDashboard.js'
import Swal from 'sweetalert2'

const API_BASE_URL = "http://127.0.0.1:8080/api";

let state = {
  activeTab: localStorage.getItem('sh_active_tab') || 'landing',
  isLoggedIn: !!JSON.parse(localStorage.getItem('sh_user')),
  user: JSON.parse(localStorage.getItem('sh_user')) || null,
  products: [],
  orders: [],
  restocks: [],
  stats: null,
  cart: [],
  isCartOpen: false,
  editingProductId: null
}

const app = document.querySelector('#app')

// --- SYSTEM TOAST (NOTIFIKASI CANTIK) ---
window.showToast = (message, type = 'success') => {
  Swal.fire({
    toast: true,
    position: 'bottom-end',
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-slate-100',
      title: 'text-sm font-bold text-slate-800 font-sans'
    }
  });
}

const authHeaders = () => {
  const token = localStorage.getItem('sh_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

const fetchData = async () => {
  if (!state.isLoggedIn) return;
  try {
    const opts = { headers: authHeaders() };
    const reqs = [
      fetch(`${API_BASE_URL}/products`, opts),
      fetch(`${API_BASE_URL}/stats/${state.user.role}/${state.user.id}`, opts),
      fetch(`${API_BASE_URL}/orders?user_id=${state.user.id}&role=${state.user.role}`, opts)
    ];

    if (state.user.role === 'admin' || state.user.role === 'distributor') {
      reqs.push(fetch(`${API_BASE_URL}/restocks`, opts));
    }

    const responses = await Promise.all(reqs);
    
    state.products = await responses[0].json();
    state.stats = await responses[1].json();
    state.orders = await responses[2].json();
    
    if (state.user.role === 'admin' || state.user.role === 'distributor') {
      state.restocks = await responses[3].json();
    }

    renderApp();
  } catch (err) { console.error("Sync Error:", err); }
}

const renderApp = () => {
  if (!state.isLoggedIn) {
    app.innerHTML = `<main class="w-full min-h-screen bg-slate-50">${state.activeTab === 'login' ? LoginPage() : LandingPage()}</main>`;
    return;
  }

  let content = '';
  if (state.activeTab === 'dashboard') {
    if (state.user.role === 'distributor') content = DistributorDashboardPage(state.restocks);
    else content = DashboardPage(state.user, state.stats);
  }
  else if (state.activeTab === 'catalog') content = state.user.role === 'admin' ? CatalogPage(state.products) : UserCatalogPage(state.products, state.cart);
  else if (state.activeTab === 'orders') content = state.user.role === 'admin' ? IncomingOrdersPage(state.orders) : OrderHistoryPage(state.orders);
  else content = `<div class="p-20 text-center text-slate-300 italic font-medium">Modul sedang disinkronkan...</div>`;

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  const cartTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const CartModal = `
    <div class="fixed inset-0 bg-slate-900/50 z-[100] flex justify-center items-center animate-fade-in backdrop-blur-sm" onclick="if(event.target===this) window.toggleCart()">
      <div class="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md border border-slate-100">
        <div class="flex justify-between items-center mb-6">
          <h4 class="font-black text-2xl text-slate-900"><i class="fas fa-shopping-cart text-blue-600 mr-2"></i> Keranjang</h4>
          <button onclick="window.toggleCart()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><i class="fas fa-times"></i></button>
        </div>
        ${state.cart.length === 0 ? `<p class="text-slate-400 text-center py-8">Keranjang Anda kosong</p>` : `
        <div class="max-h-64 overflow-y-auto mb-6 space-y-4 pr-2">
          ${state.cart.map((c, i) => `
            <div class="flex justify-between items-center border-b border-slate-50 pb-4">
              <div>
                <p class="font-bold text-slate-800 text-lg">${c.name}</p>
                <p class="text-slate-500 font-medium">${c.quantity}x @ ${formatRupiah(c.price)}</p>
              </div>
              <button onclick="window.removeFromCart(${i})" class="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shadow-sm">
                <i class="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-between items-center mb-6 bg-slate-50 p-5 rounded-2xl">
          <span class="font-bold text-slate-500 uppercase tracking-wider">Total Harga</span>
          <span class="font-black text-2xl text-blue-600">${formatRupiah(cartTotal)}</span>
        </div>
        <div class="mb-6">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Catatan untuk Supplier</label>
          <textarea id="cart-notes" rows="2" placeholder="Cth: Tolong dikirim hari ini sebelum jam 3 sore." class="w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 resize-none"></textarea>
        </div>
        <button onclick="window.checkoutCart()" class="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider flex justify-center items-center gap-2">
          <i class="fas fa-check-circle"></i> Checkout Sekarang
        </button>
        `}
      </div>
    </div>
  `;

  app.innerHTML = `
    <div class="flex w-full min-h-screen bg-slate-50">
      ${Sidebar(state.activeTab, state.user.role)}
      <main class="flex-1 ml-64 p-10 min-h-screen overflow-y-auto">
        ${Header(state.activeTab, state.user, state.cart)}
        <div id="page-content" class="mt-8">${content}</div>
      </main>
      ${state.isCartOpen ? CartModal : ''}
    </div>
  `;
}

// --- HANDLERS ---
window.toggleCart = () => {
  state.isCartOpen = !state.isCartOpen;
  renderApp();
}

window.toggleModal = (show) => {
  const modal = document.getElementById('product-modal');
  if (show) {
    state.editingProductId = null;
    document.getElementById('modal-title').innerText = "Tambah Produk Baru";
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-stock').value = '';
    document.getElementById('prod-category').value = 'Sembako';
    document.getElementById('prod-sku').value = '';
    document.getElementById('prod-unit').value = 'pcs';
    document.getElementById('prod-desc').value = '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

window.showEditModal = (id) => {
  const product = state.products.find(p => p.id === id);
  if (!product) return;
  state.editingProductId = id;
  document.getElementById('modal-title').innerText = "Edit Produk";
  document.getElementById('prod-name').value = product.name;
  document.getElementById('prod-price').value = product.price;
  document.getElementById('prod-stock').value = product.stock;
  document.getElementById('prod-category').value = product.category || 'Sembako';
  document.getElementById('prod-sku').value = product.sku || '';
  document.getElementById('prod-unit').value = product.unit || 'pcs';
  document.getElementById('prod-desc').value = product.description || '';
  const modal = document.getElementById('product-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

window.handleSaveProduct = async () => {
  const name = document.getElementById('prod-name').value;
  const price = parseInt(document.getElementById('prod-price').value);
  const stock = parseInt(document.getElementById('prod-stock').value);
  const category = document.getElementById('prod-category').value;
  const sku = document.getElementById('prod-sku').value;
  const unit = document.getElementById('prod-unit').value;
  const description = document.getElementById('prod-desc').value;

  const payload = { name, price, stock, category, sku, unit, description };
  const method = state.editingProductId ? 'PUT' : 'POST';
  const url = state.editingProductId ? `${API_BASE_URL}/products/${state.editingProductId}` : `${API_BASE_URL}/products`;

  try {
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      window.showToast(state.editingProductId ? "Produk diperbarui" : "Produk ditambahkan");
      window.toggleModal(false);
      await fetchData();
    } else {
      const d = await res.json();
      window.showToast(d.detail || "Gagal menyimpan produk", "error");
    }
  } catch (err) {
    window.showToast("Koneksi Error", "error");
  }
}

window.handleDeleteProduct = async (id) => {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  const result = await Swal.fire({
    title: 'Hapus Produk?',
    text: `Anda yakin ingin menghapus ${product.name} dari sistem?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'rounded-3xl shadow-2xl',
      confirmButton: 'bg-red-600 rounded-xl px-6 py-2 font-bold text-white',
      cancelButton: 'bg-slate-200 rounded-xl px-6 py-2 font-bold text-slate-700'
    }
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (res.ok) {
        window.showToast("Produk berhasil dihapus");
        await fetchData();
      } else {
        window.showToast("Gagal menghapus produk", "error");
      }
    } catch (err) {
      window.showToast("Koneksi Error", "error");
    }
  }
}
window.addToCart = async (productId) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const { value: qtyStr } = await Swal.fire({
    title: `Tambah ${product.name}`,
    text: `Stok Tersedia: ${product.stock}`,
    input: 'number',
    inputLabel: 'Jumlah yang dipesan',
    inputValue: 1,
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-cart-plus"></i> Tambah',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      if (!value || isNaN(value) || parseInt(value) <= 0) {
        return 'Masukkan jumlah yang valid!'
      }
      if (parseInt(value) > product.stock) {
        return 'Stok tidak mencukupi!'
      }
    },
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'bg-blue-600 rounded-xl px-6 py-3 font-bold text-white outline-none',
      cancelButton: 'bg-slate-100 rounded-xl px-6 py-3 font-bold text-slate-600 outline-none',
      input: 'rounded-xl border-slate-200 text-center font-bold text-lg'
    }
  });

  if (!qtyStr) return;
  
  const qty = parseInt(qtyStr);
  const existingIndex = state.cart.findIndex(item => item.product_id === productId);
  
  if (existingIndex > -1) {
    if (state.cart[existingIndex].quantity + qty > product.stock) {
       window.showToast("Total barang di keranjang melebihi stok!", "error");
       return;
    }
    state.cart[existingIndex].quantity += qty;
  } else {
    state.cart.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty
    });
  }
  window.showToast(`${product.name} dimasukkan ke keranjang`);
  renderApp();
}

window.removeFromCart = (index) => {
  state.cart.splice(index, 1);
  renderApp();
}

window.checkoutCart = async () => {
  if (state.cart.length === 0) return;
  const notes = document.getElementById('cart-notes')?.value || '';
  try {
    const payload = {
      user_id: state.user.id,
      notes: notes,
      items: state.cart.map(c => ({ product_id: c.product_id, quantity: c.quantity }))
    };
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      window.showToast("Keranjang berhasil di-checkout!");
      state.cart = []; // kosongkan keranjang
      state.isCartOpen = false; // tutup modal
      await fetchData(); // refresh data pesanan dan stok
    } else {
      window.showToast(data.detail || "Gagal memproses keranjang", "error");
    }
  } catch (err) {
    window.showToast("Koneksi Error", "error");
  }
}

window.handleUpdateOrderStatus = async (orderId, newStatus, newPaymentStatus) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Aksi',
    text: `Anda yakin ingin memproses aksi pada pesanan ini?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'bg-blue-600 rounded-xl px-6 py-2 font-bold text-white',
      cancelButton: 'bg-slate-100 rounded-xl px-6 py-2 font-bold text-slate-600'
    }
  });

  if (result.isConfirmed) {
    try {
      const payload = {};
      if (newStatus) payload.status = newStatus;
      if (newPaymentStatus) payload.payment_status = newPaymentStatus;

      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        window.showToast("Pesanan Diperbarui");
        await fetchData();
      } else {
        window.showToast("Gagal memperbarui pesanan", "error");
      }
    } catch (err) {
      window.showToast("Koneksi Error", "error");
    }
  }
}

window.handleRequestRestock = async (productId) => {
  const { value: quantity } = await Swal.fire({
    title: 'Minta Restock',
    input: 'number',
    inputLabel: 'Jumlah Unit (Pcs/Kg)',
    inputPlaceholder: 'Misal: 100',
    showCancelButton: true,
    confirmButtonText: 'Kirim Permintaan',
    cancelButtonText: 'Batal',
    inputValidator: (val) => {
      if (!val || val <= 0) return 'Masukkan jumlah yang valid!'
    },
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'bg-indigo-600 rounded-xl px-6 py-2 font-bold text-white',
      cancelButton: 'bg-slate-100 rounded-xl px-6 py-2 font-bold text-slate-600'
    }
  });

  if (quantity) {
    try {
      const res = await fetch(`${API_BASE_URL}/restocks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ product_id: parseInt(productId), quantity: parseInt(quantity) })
      });
      if (res.ok) {
        window.showToast("Purchase Order dikirim ke Distributor!");
        await fetchData();
      } else {
        window.showToast("Gagal mengirim permintaan restock", "error");
      }
    } catch (err) {
      window.showToast("Koneksi Error", "error");
    }
  }
}

window.handleApproveRestock = async (restockId) => {
  const result = await Swal.fire({
    title: 'Kirim Barang?',
    text: `Anda akan mengirim stok barang ini ke gudang Supplier Hub.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Kirim Sekarang',
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'bg-indigo-600 rounded-xl px-6 py-2 font-bold text-white',
      cancelButton: 'bg-slate-100 rounded-xl px-6 py-2 font-bold text-slate-600'
    }
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${API_BASE_URL}/restocks/${restockId}/approve`, {
        method: 'PUT',
        headers: authHeaders()
      });
      if (res.ok) {
        window.showToast("Barang dikirim! Stok Supplier Hub otomatis bertambah.");
        await fetchData();
      } else {
        window.showToast("Gagal menyetujui", "error");
      }
    } catch (err) {
      window.showToast("Koneksi Error", "error");
    }
  }
}

window.showPaymentGateway = async (orderId) => {
  const result = await Swal.fire({
    title: 'Pilih Metode Pembayaran',
    html: `
      <div class="flex flex-col gap-3 mt-4 text-left">
        <button id="btn-pay-bca" class="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all">
          <div class="flex items-center gap-3">
            <i class="fas fa-university text-blue-600 text-xl"></i>
            <span class="font-bold text-slate-700">BCA Virtual Account</span>
          </div>
          <i class="fas fa-chevron-right text-slate-400"></i>
        </button>
        <button id="btn-pay-qris" class="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-pink-500 hover:bg-pink-50 transition-all">
          <div class="flex items-center gap-3">
            <i class="fas fa-qrcode text-pink-600 text-xl"></i>
            <span class="font-bold text-slate-700">QRIS (Gopay/OVO/Dana)</span>
          </div>
          <i class="fas fa-chevron-right text-slate-400"></i>
        </button>
      </div>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'rounded-[2rem] shadow-2xl border border-slate-100',
      cancelButton: 'bg-slate-100 rounded-xl px-6 py-2 font-bold text-slate-600 w-full mt-4'
    },
    didOpen: () => {
      const processPayment = async () => {
        Swal.showLoading();
        try {
          const res = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
            method: 'PUT',
            headers: authHeaders()
          });
          if (res.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Pembayaran Berhasil!',
              text: 'Pesanan Anda telah lunas dan siap diproses.',
              customClass: { popup: 'rounded-3xl shadow-2xl border border-slate-100' }
            }).then(() => fetchData());
          }
        } catch (e) {
          window.showToast("Koneksi Error", "error");
        }
      };

      document.getElementById('btn-pay-bca').addEventListener('click', processPayment);
      document.getElementById('btn-pay-qris').addEventListener('click', processPayment);
    }
  });
}

window.showLiveTracking = (trackingNumber, shippedAtIso) => {
  if (!shippedAtIso) return;

  const shippedAt = new Date(shippedAtIso);
  const now = new Date();
  const diffMinutes = Math.floor((now - shippedAt) / (1000 * 60));

  let steps = [
    { label: 'Pesanan dikemas & disiapkan Gudang', icon: 'fa-box', time: shippedAt.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}), active: true },
    { label: 'Paket diserahkan ke Kurir Ekspedisi', icon: 'fa-truck-loading', time: '', active: false },
    { label: 'Sedang dalam perjalanan menuju alamat UMKM', icon: 'fa-truck-fast', time: '', active: false },
    { label: 'Paket tiba dan diterima', icon: 'fa-home', time: '', active: false }
  ];

  if (diffMinutes >= 30) {
    steps[1].active = true;
    steps[1].time = new Date(shippedAt.getTime() + 30 * 60000).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
  }
  if (diffMinutes >= 60) {
    steps[2].active = true;
    steps[2].time = new Date(shippedAt.getTime() + 60 * 60000).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
  }
  if (diffMinutes >= 120) {
    steps[3].active = true;
    steps[3].time = new Date(shippedAt.getTime() + 120 * 60000).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
  }

  const timelineHtml = steps.map((s, i) => `
    <div class="flex gap-4 relative ${!s.active ? 'opacity-40 grayscale' : ''}">
      ${i !== steps.length - 1 ? `<div class="absolute left-[15px] top-8 bottom-[-16px] w-[2px] ${s.active && steps[i+1]?.active ? 'bg-indigo-500' : 'bg-slate-200'}"></div>` : ''}
      <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${s.active ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200' : 'bg-slate-200 text-slate-400'}">
        <i class="fas ${s.icon} text-xs"></i>
      </div>
      <div class="pb-6 text-left w-full">
        <p class="font-bold text-slate-800 text-sm">${s.label}</p>
        ${s.time ? `<p class="text-xs font-bold text-indigo-500 mt-0.5">${s.time}</p>` : `<p class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Menunggu...</p>`}
      </div>
    </div>
  `).join('');

  Swal.fire({
    title: `<div class="flex justify-between items-center w-full"><span class="text-lg font-black tracking-tight"><i class="fas fa-search-location text-indigo-500 mr-2"></i> ${trackingNumber}</span><span class="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1.5 uppercase rounded-full tracking-widest"><i class="fas fa-clock"></i> ${diffMinutes} mnt berlalu</span></div>`,
    html: `<div class="mt-8 px-4 border-t border-slate-50 pt-8">${timelineHtml}</div>`,
    showConfirmButton: true,
    confirmButtonText: 'Tutup Tracking',
    customClass: {
      popup: 'rounded-[2.5rem] shadow-2xl border border-slate-100',
      confirmButton: 'bg-slate-800 rounded-xl px-6 py-3 font-bold text-white w-full mt-4'
    }
  });
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
      localStorage.setItem('sh_token', d.token);
      window.showToast(`Selamat datang, ${d.user.name}`);
      await fetchData();
    } else { window.showToast(d.detail, "error"); }
  } catch (err) { window.showToast("Backend Offline", "error"); }
}

window.handleLogout = () => { localStorage.clear(); location.reload(); }
window.navigateTo = (id) => { state.activeTab = id; localStorage.setItem('sh_active_tab', id); renderApp(); fetchData(); }
document.addEventListener('DOMContentLoaded', () => { if (state.isLoggedIn) fetchData(); renderApp(); });