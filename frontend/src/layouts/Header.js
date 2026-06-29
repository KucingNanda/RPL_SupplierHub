/**
 * Komponen Header
 * Menampilkan salam, pencarian, dan profil pengguna.
 */
export const Header = (activeTab, user, cart) => {
  // Menentukan judul halaman berdasarkan tab aktif
  const titles = {
    dashboard: 'Ikhtisar Bisnis',
    catalog: 'Katalog Produk',
    orders: 'Manajemen Pesanan',
    tracking: 'Pusat Pelacakan',
    inventory: 'Manajemen Gudang'
  };
  
  const pageTitle = titles[activeTab] || 'SupplierHub';
  
  // Hitung total item di keranjang
  const cartItemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return `
    <header class="h-24 px-8 flex items-center justify-between bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
      
      <!-- Page Title & Greeting -->
      <div>
        <h2 class="text-2xl font-black text-white tracking-tight">${pageTitle}</h2>
        <p class="text-sm font-medium text-slate-400 mt-1">Selamat datang kembali, <span class="text-indigo-400 font-bold">${user ? user.username : 'Guest'}</span>!</p>
      </div>

      <!-- Actions & Profile -->
      <div class="flex items-center gap-6">
        
        <!-- Search Bar -->
        <div class="hidden md:flex items-center relative group">
          <i class="fas fa-search absolute left-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Cari transaksi, produk..." 
            class="w-64 pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:w-72 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-sm font-medium placeholder-slate-500"
          >
        </div>

        <div class="flex items-center gap-3">
          <!-- Notification Bell -->
          <button class="relative w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all shadow-sm group">
            <i class="fas fa-bell group-hover:animate-wiggle"></i>
            <span class="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>

          <!-- Cart Icon (Hanya untuk UMKM) -->
          ${(user && user.role === 'umkm') ? `
            <button onclick="window.toggleCart && window.toggleCart()" class="relative w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all shadow-sm group">
              <i class="fas fa-shopping-cart group-hover:scale-110 transition-transform"></i>
              ${cartItemCount > 0 ? `
                <span class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-indigo-500 text-white text-[10px] font-bold rounded-full border-2 border-slate-900 shadow-sm">
                  ${cartItemCount}
                </span>
              ` : ''}
            </button>
          ` : ''}
        </div>

        <div class="w-px h-8 bg-white/10 mx-2"></div>

        <!-- Profile Section -->
        <div class="flex items-center gap-3 cursor-pointer group">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">${user ? user.username : 'User'}</p>
            <p class="text-[10px] font-black tracking-widest uppercase text-slate-500">${user ? user.role : 'Guest'}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-blue-500 border-2 border-slate-800 rounded-[1.2rem] shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center text-white overflow-hidden relative transition-all group-hover:scale-105">
            <img src="https://ui-avatars.com/api/?name=${user ? user.username : 'U'}&background=4f46e5&color=fff&bold=true&rounded=true" alt="Avatar" class="w-full h-full object-cover">
          </div>
        </div>
        
      </div>
    </header>
  `;
};