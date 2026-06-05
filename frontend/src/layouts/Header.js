/**
 * Komponen Header
 * Menampilkan judul halaman dan profil pengguna secara dinamis.
 */
export const Header = (title, user = { name: 'Guest', role: 'user' }, cart = []) => {
  // Mendapatkan inisial dari nama (contoh: "Admin Supplier" -> "AS")
  const initials = user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return `
    <header class="flex justify-between items-center mb-10 animate-fade-in">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">${title}</h2>
        <p class="text-slate-500 text-sm">Kelola operasional B2B Anda di sini.</p>
      </div>
      
      <div class="flex items-center gap-6">
        <!-- Cart Icon (Hanya untuk non-admin) -->
        ${user.role !== 'admin' ? `
          <button onclick="window.toggleCart()" class="relative p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all group">
            <i class="fas fa-shopping-cart text-xl"></i>
            ${cart && cart.length > 0 ? `<span class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">${cart.length}</span>` : ''}
          </button>
        ` : ''}

        <!-- Notification Bell -->
        <button class="relative p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white hover:shadow-sm rounded-xl transition-all group">
          <i class="fas fa-bell text-xl"></i>
          <span class="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-status-danger rounded-full border-2 border-slate-50 group-hover:animate-ping"></span>
        </button>

        <!-- Profile Section -->
        <div class="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-slate-900 leading-tight">${user.name}</p>
            <p class="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">${user.role === 'admin' ? 'ID: SUP-9921' : 'ID: UMKM-4412'}</p>
          </div>
          <div class="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary-600 font-bold shadow-sm ring-4 ring-slate-100">
            ${initials}
          </div>
        </div>
      </div>
    </header>
  `;
};