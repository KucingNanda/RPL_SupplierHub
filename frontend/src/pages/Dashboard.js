/**
 * Halaman Dashboard
 * Menerima data user dan statistik dinamis dari API.
 */
export const DashboardPage = (user, stats = null) => {
  const isAdmin = user.role === 'admin';

  // State loading jika stats belum ada
  if (!stats) {
    return `<div class="p-20 text-center animate-pulse text-slate-400">Menghubungkan ke API Gateway...</div>`;
  }

  const adminStats = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-boxes text-xl"></i>
        </div>
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Stok Gudang</p>
        <h3 class="text-3xl font-black text-slate-900 mt-1">${stats.total_stok || 0} <span class="text-slate-400 text-xs font-medium">Unit</span></h3>
      </div>
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-shipping-fast text-xl"></i>
        </div>
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pesanan Diproses</p>
        <h3 class="text-3xl font-black text-slate-900 mt-1">${stats.pesanan_proses || 0} <span class="text-slate-400 text-xs font-medium">Order</span></h3>
      </div>
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div class="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-chart-line text-xl"></i>
        </div>
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Margin (Fee 3%)</p>
        <h3 class="text-3xl font-black text-slate-900 mt-1">${stats.margin || 'Rp 0'}</h3>
      </div>
    </div>
  `;

  const userStats = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div class="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
        <p class="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Saldo Belanja (SmartBank)</p>
        <h3 class="text-3xl font-black mt-1">${stats.saldo || 'Rp 0'}</h3>
        <p class="text-xs text-blue-200 mt-2 italic">Terhubung dengan Ledger ID: SB-9921</p>
      </div>
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-shopping-cart text-xl"></i>
        </div>
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Barang Dipesan</p>
        <h3 class="text-3xl font-black text-slate-900 mt-1">${stats.barang_dipesan || 0} <span class="text-slate-400 text-xs font-medium">Unit</span></h3>
      </div>
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-clock text-xl"></i>
        </div>
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Status Restock</p>
        <h3 class="text-xl font-bold text-slate-900 mt-2">${stats.status || 'N/A'}</h3>
      </div>
    </div>
  `;

  return `
    <div class="space-y-8">
      <div class="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
            <i class="fas ${isAdmin ? 'fa-user-shield' : 'fa-store'}"></i>
          </div>
          <div>
            <h3 class="font-bold text-slate-900">Halo, ${user.name}!</h3>
            <p class="text-xs text-slate-500">Mode: <span class="font-bold text-blue-600 uppercase">${user.role}</span></p>
          </div>
        </div>
        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase animate-pulse">Live API</span>
      </div>

      ${isAdmin ? adminStats : userStats}

      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h4 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <i class="fas fa-history text-blue-500"></i> Aktivitas Sinkronisasi
        </h4>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-sm text-slate-600">Berhasil terhubung ke database <strong>supplierhub</strong> via alwaysdata.</p>
            <span class="text-[10px] font-bold text-slate-400 uppercase">Aktif</span>
          </div>
        </div>
      </div>
    </div>
  `;
};