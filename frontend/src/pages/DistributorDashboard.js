export const DistributorDashboardPage = (restocks = []) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Menunggu Persetujuan': return 'bg-amber-100 text-amber-700';
            case 'Disetujui & Dikirim': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight">Dashboard Distributor Utama</h2>
          <p class="text-slate-500 text-sm mt-1">Kelola pesanan Purchase Order (PO) dari Gudang Supplier Hub.</p>
        </div>
        <div class="flex gap-3">
           <div class="bg-indigo-50 text-indigo-600 px-5 py-3 rounded-2xl font-bold flex items-center gap-2">
              <i class="fas fa-truck-loading"></i> ${restocks.length} Permintaan
           </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Gudang Pemesan / Tgl</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Produk & Qty</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            ${restocks.length > 0 ? restocks.map(r => `
              <tr class="hover:bg-slate-50/30 transition-colors">
                <td class="px-8 py-6">
                  <p class="font-black text-xs text-slate-400 mb-1">${r.invoice_id}</p>
                  <p class="font-bold text-slate-800">${r.admin_name}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">${r.created_at}</p>
                </td>
                <td class="px-8 py-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center text-xs">
                      <i class="fas fa-pallet"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-700 text-sm max-w-[150px] truncate">${r.product_name}</p>
                      <p class="text-xs text-slate-400 font-bold">${r.quantity} Unit</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusClass(r.status)}">
                    ${r.status}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <div class="flex justify-center gap-2">
                    ${r.status === 'Menunggu Persetujuan' ? `
                      <button onclick="window.handleApproveRestock(${r.id})" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm">Kirim Stok</button>
                    ` : `
                      <span class="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1 block"><i class="fas fa-check-circle"></i> Selesai Dikirim</span>
                    `}
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="4" class="px-8 py-20 text-center">
                  <i class="fas fa-truck text-4xl text-slate-100 mb-4 block"></i>
                  <p class="text-slate-400 font-medium">Belum ada permintaan restock dari gudang.</p>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
};
