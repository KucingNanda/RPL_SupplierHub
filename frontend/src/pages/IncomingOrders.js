export const IncomingOrdersPage = (orders = []) => {
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Diproses': return 'bg-amber-100 text-amber-700';
            case 'Selesai': return 'bg-green-100 text-green-700';
            case 'Dibatalkan': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight">Pesanan Masuk</h2>
          <p class="text-slate-500 text-sm mt-1">Pantau dan kelola permintaan stok dari UMKM mitra Anda.</p>
        </div>
        <div class="flex gap-3">
           <div class="bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl font-bold flex items-center gap-2">
              <i class="fas fa-receipt"></i> ${orders.length} Total
           </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Pembeli / Tanggal</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Produk & Qty</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Harga</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            ${orders.length > 0 ? orders.map(order => `
              <tr class="hover:bg-slate-50/30 transition-colors">
                <td class="px-8 py-6">
                  <p class="font-black text-xs text-slate-400 mb-1">${order.invoice_id || 'INV-OLD-DATA'}</p>
                  <p class="font-bold text-slate-800">${order.customer_name}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">${new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                  ${order.notes ? `<p class="text-[10px] text-slate-500 italic mt-2 max-w-[200px] truncate"><i class="fas fa-comment-dots text-slate-400"></i> ${order.notes}</p>` : ''}
                </td>
                <td class="px-8 py-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center text-xs">
                      <i class="fas fa-box"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-700 text-sm max-w-[150px] truncate">${order.product_name}</p>
                      <p class="text-xs text-slate-400">${order.quantity} Unit</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <p class="font-black text-slate-900">${formatRupiah(order.total_price)}</p>
                  <p class="text-[9px] font-bold uppercase mt-1 ${order.payment_status === 'Lunas' ? 'text-green-500' : 'text-amber-500'}">${order.payment_status || 'Menunggu'}</p>
                </td>
                <td class="px-8 py-6">
                  <span class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusClass(order.status)}">
                    ${order.status}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <div class="flex justify-center gap-2">
                    ${order.payment_status === 'Lunas' ? `
                      <span class="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1 block"><i class="fas fa-check-double"></i> Lunas</span>
                    ` : `
                      <span class="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1 block"><i class="fas fa-clock"></i> Belum Dibayar</span>
                    `}
                    
                    ${order.status === 'Diproses' ? `
                      ${order.payment_status === 'Lunas' ? `
                        <button onclick="window.handleUpdateOrderStatus(${order.id}, 'Selesai', null)" class="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold hover:bg-blue-700 transition-all shadow-sm">Kirim</button>
                      ` : `
                        <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-300 rounded-xl text-[10px] font-bold cursor-not-allowed tooltip" title="Tunggu pembayaran">Kirim</button>
                      `}
                      <button onclick="window.handleUpdateOrderStatus(${order.id}, 'Dibatalkan', null)" class="p-1.5 text-slate-400 hover:text-red-500 transition-colors tooltip" title="Batalkan"><i class="fas fa-times"></i></button>
                    ` : `
                      <span class="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1 block">Terkirim</span>
                    `}
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="5" class="px-8 py-20 text-center">
                  <i class="fas fa-inbox text-4xl text-slate-100 mb-4 block"></i>
                  <p class="text-slate-400 font-medium">Belum ada pesanan masuk hari ini.</p>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
};