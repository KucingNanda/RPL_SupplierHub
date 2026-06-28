export const DistributorDashboardPage = (restocks = []) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Menunggu Persetujuan': return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'Disetujui & Dikirim': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border border-slate-200';
        }
    };

    return `
    <div class="space-y-8 max-w-7xl mx-auto animate-fade-in">
      
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(49,46,129,0.2)] relative overflow-hidden flex items-center justify-between">
        <!-- Abstract Decoration -->
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
        <div class="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full"></div>

        <div class="relative z-10">
          <h2 class="text-3xl font-black text-white tracking-tight">Dashboard Distributor Utama</h2>
          <p class="text-indigo-200 text-sm mt-2 font-medium">Kelola permintaan Purchase Order (PO) dari Gudang SupplierHub</p>
        </div>
        
        <div class="relative z-10 flex gap-4">
           <div class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-2xl flex flex-col items-center shadow-inner">
              <span class="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Permintaan Aktif</span>
              <div class="flex items-center gap-2">
                <i class="fas fa-inbox text-indigo-300"></i>
                <span class="text-2xl font-black">${restocks.length}</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-slate-800 text-lg">Daftar Purchase Order</h3>
          <button class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors">
            <i class="fas fa-filter"></i>
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Gudang Pemesan / Tgl</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Produk & Qty</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status Pengiriman</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${restocks.length > 0 ? restocks.map(r => `
                <tr class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-8 py-6">
                    <p class="font-black text-[10px] text-indigo-500 uppercase tracking-widest mb-1.5">${r.invoice_id}</p>
                    <p class="font-bold text-slate-800 flex items-center gap-2">
                      <i class="fas fa-building text-slate-300"></i> ${r.admin_name}
                    </p>
                    <p class="text-[10px] text-slate-400 mt-1 font-medium"><i class="far fa-clock"></i> ${r.created_at}</p>
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner border border-indigo-100/50">
                        <i class="fas fa-box-open"></i>
                      </div>
                      <div>
                        <p class="font-bold text-slate-700 text-sm max-w-[200px] truncate">${r.product_name}</p>
                        <p class="text-xs text-slate-500 font-semibold mt-0.5">${r.quantity} Unit</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusClass(r.status)}">
                      ${r.status}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex justify-center">
                      ${r.status === 'Menunggu Persetujuan' ? `
                        <button onclick="window.handleApproveRestock(${r.id})" class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-xs font-bold hover:from-indigo-500 hover:to-blue-500 transition-all shadow-[0_4px_14px_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 flex items-center gap-2">
                          Kirim Stok <i class="fas fa-arrow-right"></i>
                        </button>
                      ` : `
                        <div class="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
                          <i class="fas fa-check-circle"></i> Selesai
                        </div>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4" class="px-8 py-24 text-center">
                    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                      <i class="fas fa-inbox text-3xl text-slate-300"></i>
                    </div>
                    <h4 class="font-bold text-slate-700 mb-1">Kotak Masuk Kosong</h4>
                    <p class="text-slate-400 text-sm font-medium">Belum ada permintaan Purchase Order dari gudang saat ini.</p>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};
