/**
 * Halaman Dashboard
 * Menampilkan data berbeda berdasarkan Role User.
 */
export const DashboardPage = (user, stats = null) => {
  const isAdmin = user.role === 'admin';

  // State loading jika stats belum ada
  if (!stats) {
    return `
      <div class="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div class="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p class="text-indigo-200/60 font-medium">Menghubungkan ke API Gateway...</p>
      </div>
    `;
  }

  // Statistik Khusus Admin Supplier
  const adminStats = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div class="glass-card p-8">
        <div class="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-boxes text-xl"></i>
        </div>
        <p class="text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">Total Stok Gudang</p>
        <h3 class="text-3xl font-black text-white mt-1">${stats.total_products || 0} <span class="font-medium text-slate-500 text-xs">Unit</span></h3>
      </div>
      <div class="glass-card p-8">
        <div class="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-shipping-fast text-xl"></i>
        </div>
        <p class="text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">Pesanan Diproses</p>
        <h3 class="text-3xl font-black text-white mt-1">${stats.total_orders || 0} <span class="font-medium text-slate-500 text-xs">Order</span></h3>
      </div>
      <div class="glass-card p-8">
        <div class="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-chart-line text-xl"></i>
        </div>
        <p class="text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">Pendapatan Bersih</p>
        <h3 class="text-3xl font-black text-white mt-1">Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}</h3>
      </div>
    </div>
  `;

  // Statistik Khusus User UMKM
  const userStats = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div class="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/10">
        <p class="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Saldo Belanja (SmartBank)</p>
        <h3 class="text-3xl font-black mt-1">Rp 500.000</h3>
        <p class="text-xs text-indigo-300 mt-2 italic">Terhubung dengan Ledger ID: SB-9921</p>
      </div>
      <div class="glass-card p-8">
        <div class="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-shopping-cart text-xl"></i>
        </div>
        <p class="text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">Total Pesanan Selesai</p>
        <h3 class="text-3xl font-black text-white mt-1">${stats.total_orders || 0} <span class="font-medium text-slate-500 text-xs">Unit</span></h3>
      </div>
      <div class="glass-card p-8">
        <div class="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-wallet text-xl"></i>
        </div>
        <p class="text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">Total Pengeluaran</p>
        <h3 class="text-3xl font-black text-white mt-1">Rp ${(stats.total_belanja || 0).toLocaleString('id-ID')}</h3>
      </div>
    </div>
  `;

  return `
    <div class="space-y-8">
      <!-- Welcome Message Berbeda per Role -->
      <div class="glass-card p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
            <i class="fas ${isAdmin ? 'fa-user-shield' : 'fa-store'}"></i>
          </div>
          <div>
            <h3 class="font-bold text-white">Halo, ${user.name || user.username}!</h3>
            <p class="text-xs text-indigo-200/60">Anda masuk sebagai <span class="font-bold text-indigo-400 uppercase">${user.role}</span></p>
          </div>
        </div>
        <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase">Online</span>
      </div>

      <!-- Tampilkan Statistik Sesuai Role -->
      ${isAdmin ? adminStats : userStats}

      <!-- Aktivitas Terkini (Simulasi) -->
      <div class="glass-card p-8">
        <h4 class="font-bold text-white mb-6 flex items-center gap-2">
          <i class="fas fa-history text-indigo-400"></i> Aktivitas Terkini
        </h4>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <p class="text-sm text-slate-300">${isAdmin ? 'Data analitik terbaru telah disinkronisasi' : 'Katalog produk telah diperbarui'}</p>
            <span class="text-[10px] font-bold text-slate-500 uppercase">Baru Saja</span>
          </div>
        </div>
      </div>
    </div>
  `;
};