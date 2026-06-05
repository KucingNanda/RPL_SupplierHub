/**
 * Komponen Sidebar
 * Berisi navigasi utama aplikasi SupplierHub yang adaptif terhadap Role.
 */
export const Sidebar = (activeTab = 'dashboard', role = 'user') => {
  // Daftar menu yang disesuaikan berdasarkan Role
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line', roles: ['admin', 'user', 'umkm'] },
    { id: 'catalog', label: role === 'admin' ? 'Manajemen Stok' : 'Katalog Produk', icon: 'fa-boxes', roles: ['admin', 'user', 'umkm'] },
    { id: 'orders', label: role === 'admin' ? 'Pesanan Masuk' : 'Riwayat Pesanan', icon: 'fa-shopping-cart', roles: ['admin', 'user', 'umkm'] },
    { id: 'settings', label: 'Pengaturan', icon: 'fa-cog', roles: ['admin'] }, // Hanya untuk Admin
  ];

  // Filter menu berdasarkan role user yang aktif
  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return `
    <aside class="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 z-20 flex flex-col shadow-2xl">
      <!-- Logo Section -->
      <div class="flex items-center gap-3 mb-10 px-2">
        <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
          <i class="fab fa-hubspot text-xl"></i>
        </div>
        <h1 class="text-xl font-bold tracking-tight">SupplierHub</h1>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 space-y-1">
        ${filteredMenu.map(item => `
          <button 
            onclick="navigateTo('${item.id}')"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
          >
            <i class="fas ${item.icon} w-5 text-lg ${activeTab === item.id ? 'text-white' : 'group-hover:text-primary-400'}"></i>
            <span class="font-medium">${item.label}</span>
          </button>
        `).join('')}
      </nav>

      <!-- Logout Button -->
      <div class="mt-4 mb-6">
        <button 
          onclick="handleLogout()"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <i class="fas fa-sign-out-alt w-5 text-lg"></i>
          <span class="font-medium">Keluar</span>
        </button>
      </div>

      <!-- System Status Info -->
      <div class="mt-auto pt-6 border-t border-slate-800">
        <div class="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
          <p class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Node Status</p>
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-xs font-semibold text-slate-300 tracking-wide">Gateway Connected</span>
          </div>
        </div>
      </div>
    </aside>
  `;
};