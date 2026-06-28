/**
 * Komponen Sidebar
 * Berisi navigasi utama aplikasi SupplierHub yang adaptif terhadap Role.
 */
export const Sidebar = (activeTab = 'dashboard', role = 'user') => {
  // Daftar menu yang disesuaikan berdasarkan Role
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', roles: ['admin', 'user', 'umkm', 'distributor'] },
    { id: 'inventory', label: 'Gudang', icon: 'fa-warehouse', roles: ['admin', 'user', 'umkm', 'distributor'] },
    { id: 'catalog', label: role === 'admin' ? 'Etalase' : 'Katalog', icon: 'fa-box-open', roles: ['admin', 'user', 'umkm'] },
    { id: 'orders', label: 'Pesanan', icon: 'fa-shopping-bag', roles: ['admin', 'user', 'umkm'] },
    { id: 'tracking', label: 'Pelacakan', icon: 'fa-map-location-dot', roles: ['admin', 'user', 'umkm'] },
  ];

  // Filter menu berdasarkan role user yang aktif
  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return `
    <aside class="w-[280px] h-full bg-white/5 backdrop-blur-xl border-r border-white/10 text-slate-300 flex flex-col shrink-0 relative overflow-hidden z-20">
      <!-- Decorative gradient blob -->
      <div class="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>

      <div class="relative z-10 flex flex-col h-full">
        <!-- Logo Section -->
        <div class="p-8 pb-6 flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.2rem] flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] shadow-indigo-500/50 group-hover:rotate-12 transition-all">
            <i class="fab fa-hubspot text-white text-2xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-black text-white tracking-tight leading-none">SupplierHub</h1>
            <p class="text-[10px] text-indigo-300/80 font-bold tracking-widest uppercase mt-1">Enterprise</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar mt-4">
          <p class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Menu Utama</p>
          ${filteredMenu.map(item => {
            const isActive = activeTab === item.id;
            return `
              <button 
                onclick="window.switchTab('${item.id}')"
                class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive ? 'text-white' : 'hover:text-white hover:bg-white/5'}"
              >
                ${isActive ? '<div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent"></div><div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>' : ''}
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-800/50 group-hover:bg-slate-700'}">
                  <i class="fas ${item.icon} text-sm ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-300'}"></i>
                </div>
                <span class="font-bold text-sm tracking-wide z-10">${item.label}</span>
              </button>
            `;
          }).join('')}
        </nav>

        <!-- Profile & System Status -->
        <div class="p-4 mt-auto">
          <div class="p-4 bg-slate-800/40 rounded-[1.5rem] border border-slate-700/50 backdrop-blur-md mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300">
                <i class="fas fa-server text-xs"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-white">API Gateway</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="relative flex h-1.5 w-1.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span class="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">Connected</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onclick="window.handleLogout()"
            class="w-full flex items-center gap-3 px-5 py-4 rounded-[1.5rem] text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
          >
            <i class="fas fa-sign-out-alt w-5 text-lg group-hover:-translate-x-1 transition-transform"></i>
            <span class="font-bold text-sm">Keluar Sesi</span>
          </button>
        </div>
      </div>
    </aside>
  `;
};