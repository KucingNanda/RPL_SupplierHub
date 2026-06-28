export const IncomingOrdersPage = (orders = []) => {
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Diproses': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Dibatalkan': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return `
    <div class="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(49,46,129,0.2)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <!-- Abstract Decoration -->
        <div class="absolute -left-10 -top-10 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
        <div class="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full"></div>

        <div class="relative z-10">
          <h2 class="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <i class="fas fa-inbox text-indigo-300"></i> Pesanan Masuk
          </h2>
          <p class="text-indigo-200 text-sm mt-2 font-medium">Pantau dan kelola permintaan stok dari UMKM mitra Anda.</p>
        </div>
        
        <div class="relative z-10 flex gap-4">
           <div class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-2xl flex flex-col items-center sm:items-start shadow-inner">
              <span class="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Total Permintaan</span>
              <div class="flex items-center gap-2">
                <i class="fas fa-receipt text-indigo-300"></i>
                <span class="text-2xl font-black">${orders.length}</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-between items-center bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
        <div class="relative w-full max-w-sm group">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input type="text" placeholder="Cari invoice atau nama UMKM..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium">
        </div>
        <div class="flex gap-2">
           <select class="px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-bold text-slate-600 appearance-none cursor-pointer">
              <option>Semua Status</option>
              <option>Diproses</option>
              <option>Selesai</option>
           </select>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Pembeli / Tanggal</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Produk & Qty</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Harga & Bayar</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${orders.length > 0 ? orders.map(order => `
                <tr class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-8 py-6">
                    <p class="font-black text-[10px] text-indigo-500 uppercase tracking-widest mb-1.5">${order.invoice_id || 'INV-OLD-DATA'}</p>
                    <p class="font-bold text-slate-800 flex items-center gap-2">
                       <i class="fas fa-store text-slate-300"></i> ${order.customer_name}
                    </p>
                    <p class="text-[10px] text-slate-400 mt-1 font-medium"><i class="far fa-calendar-alt"></i> ${new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                    ${order.notes ? `<p class="text-[10px] text-slate-500 font-medium italic mt-2 bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100"><i class="fas fa-comment-dots text-slate-300 mr-1"></i> ${order.notes}</p>` : ''}
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-inner border border-indigo-100/50">
                        <i class="fas fa-box"></i>
                      </div>
                      <div>
                        <p class="font-bold text-slate-700 text-sm max-w-[150px] truncate group-hover:text-indigo-600 transition-colors">${order.product_name}</p>
                        <p class="text-xs text-slate-500 font-semibold mt-0.5">${order.quantity} Unit</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <p class="font-black text-slate-800 text-sm mb-1">${formatRupiah(order.total_price)}</p>
                    <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                       <div class="w-1.5 h-1.5 rounded-full ${order.payment_status === 'Lunas' ? 'bg-emerald-500' : 'bg-amber-500'}"></div>
                       <p class="text-[9px] font-black uppercase tracking-widest ${order.payment_status === 'Lunas' ? 'text-emerald-600' : 'text-amber-600'}">${order.payment_status || 'Menunggu'}</p>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusClass(order.status)}">
                      ${order.status}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex justify-center items-center gap-2">
                      ${order.status === 'Diproses' ? `
                        ${order.payment_status === 'Lunas' ? `
                          <button onclick="window.handleUpdateOrderStatus(${order.id}, 'Selesai', null)" class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-[10px] font-bold hover:from-indigo-500 hover:to-blue-500 transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-1.5">
                             Kirim <i class="fas fa-paper-plane"></i>
                          </button>
                        ` : `
                          <button disabled class="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-bold cursor-not-allowed border border-slate-200 flex items-center gap-1.5" title="Tunggu pembayaran UMKM">
                             Kirim <i class="fas fa-lock"></i>
                          </button>
                        `}
                        <button onclick="window.handleUpdateOrderStatus(${order.id}, 'Dibatalkan', null)" class="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all flex items-center justify-center shadow-sm tooltip" title="Batalkan Pesanan"><i class="fas fa-times text-xs"></i></button>
                      ` : `
                        <div class="flex items-center gap-1.5 text-[10px] ${order.status === 'Selesai' ? 'text-emerald-500' : 'text-rose-500'} font-bold uppercase tracking-widest px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                           <i class="fas ${order.status === 'Selesai' ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${order.status}
                        </div>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="px-8 py-24 text-center">
                    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                      <i class="fas fa-inbox text-3xl text-slate-300"></i>
                    </div>
                    <h4 class="font-bold text-slate-700 mb-1">Tidak Ada Pesanan</h4>
                    <p class="text-slate-400 text-sm font-medium">Belum ada pesanan masuk dari UMKM saat ini.</p>
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