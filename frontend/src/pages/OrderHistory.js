/**
 * Halaman Riwayat Pesanan (User/UMKM)
 */
export const OrderHistoryPage = (orders = []) => {
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 class="text-2xl font-black text-slate-800 tracking-tight">Riwayat Pesanan</h2>
        <p class="text-slate-500 text-sm mt-1">Pantau status pengiriman stok barang Anda.</p>
      </div>

      <div class="grid grid-cols-1 gap-4">
        ${orders.length > 0 ? orders.reverse().map(order => `
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all relative">
            <div class="absolute top-4 right-6 text-[9px] font-black uppercase text-slate-300 tracking-widest">${order.invoice_id || 'INV-OLD-DATA'}</div>
            
            <div class="flex items-center gap-5 w-full md:w-auto mt-4 md:mt-0">
              <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                <i class="fas fa-box"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900">${order.product_name}</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">${new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                ${order.notes ? `<p class="text-[10px] text-slate-500 italic mt-1 max-w-xs truncate"><i class="fas fa-comment-dots"></i> ${order.notes}</p>` : ''}
              </div>
            </div>

            <div class="grid grid-cols-2 md:flex gap-8 w-full md:w-auto text-center md:text-left">
              <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Jumlah</p>
                <p class="font-bold text-slate-700">${order.quantity} Unit</p>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Bayar</p>
                <p class="font-black text-blue-600">${formatRupiah(order.total_price)}</p>
              </div>
              <div class="col-span-2 md:col-span-1">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pembayaran</p>
                <p class="font-bold text-[11px] ${order.payment_status === 'Lunas' ? 'text-green-600' : 'text-amber-500'} uppercase">${order.payment_status || 'Menunggu'}</p>
              </div>
            </div>

            <div class="w-full md:w-auto mt-2 md:mt-0 flex flex-col gap-2">
              <span class="block text-center px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest 
                ${order.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
            order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}">
                ${order.status}
              </span>
              
              ${order.payment_status !== 'Lunas' ? `
                <button onclick="window.showPaymentGateway(${order.id})" class="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                  <i class="fas fa-wallet mr-1"></i> Bayar Sekarang
                </button>
              ` : ''}

              ${order.status === 'Selesai' && order.tracking_number ? `
                <button onclick="window.showLiveTracking('${order.tracking_number}', '${order.shipped_at}')" class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  <i class="fas fa-map-marker-alt mr-1"></i> Lacak Paket
                </button>
              ` : ''}
            </div>
          </div>
        `).join('') : `
          <div class="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <p class="text-slate-400">Anda belum pernah melakukan pemesanan.</p>
          </div>
        `}
      </div>
    </div>
  `;
};