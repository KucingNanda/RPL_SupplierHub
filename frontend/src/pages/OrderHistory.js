/**
 * Halaman Riwayat Pesanan (User/UMKM)
 */
export const OrderHistoryPage = (orders = []) => {
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    return `
    <div class="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      
      <!-- Header -->
      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden group">
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
        <div class="relative z-10">
          <h2 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div class="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center text-sm shadow-inner">
              <i class="fas fa-history"></i>
            </div>
            Riwayat Pesanan
          </h2>
          <p class="text-slate-500 text-sm mt-2 ml-14 font-medium">Pantau status pengiriman, tagihan, dan riwayat transaksi stok barang Anda.</p>
        </div>
      </div>

      <!-- Orders List -->
      <div class="space-y-5">
        ${orders.length > 0 ? orders.reverse().map(order => `
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative group">
            
            <!-- Invoice Badge -->
            <div class="absolute top-0 right-8 transform -translate-y-1/2">
              <span class="bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md border-2 border-white">
                ${order.invoice_id || 'INV-OLD-DATA'}
              </span>
            </div>
            
            <div class="flex items-center gap-5 w-full md:w-auto mt-4 md:mt-0">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-500 rounded-[1.2rem] flex items-center justify-center text-2xl shadow-inner border border-indigo-100/50 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-box-open"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">${order.product_name}</h4>
                <div class="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <i class="far fa-calendar-alt"></i>
                  <span>${new Date(order.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                </div>
                ${order.notes ? `<p class="text-[11px] text-slate-500 font-medium italic mt-2 bg-slate-50 px-3 py-1.5 rounded-lg inline-block border border-slate-100"><i class="fas fa-quote-left text-slate-300 mr-1"></i> ${order.notes}</p>` : ''}
              </div>
            </div>

            <div class="grid grid-cols-2 md:flex gap-8 w-full md:w-auto text-center md:text-left bg-slate-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none">
              <div class="bg-white md:bg-transparent p-3 md:p-0 rounded-xl shadow-sm md:shadow-none border border-slate-100 md:border-transparent">
                <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Kuantitas</p>
                <p class="font-bold text-slate-700 text-sm">${order.quantity} <span class="text-[10px] text-slate-400">Unit</span></p>
              </div>
              <div class="bg-white md:bg-transparent p-3 md:p-0 rounded-xl shadow-sm md:shadow-none border border-slate-100 md:border-transparent">
                <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Tagihan</p>
                <p class="font-black text-indigo-600 text-sm">${formatRupiah(order.total_price)}</p>
              </div>
              <div class="col-span-2 md:col-span-1 bg-white md:bg-transparent p-3 md:p-0 rounded-xl shadow-sm md:shadow-none border border-slate-100 md:border-transparent text-center md:text-left">
                <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Pembayaran</p>
                <div class="inline-flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full ${order.payment_status === 'Lunas' ? 'bg-emerald-500' : 'bg-amber-500'}"></div>
                  <p class="font-black text-[10px] ${order.payment_status === 'Lunas' ? 'text-emerald-600' : 'text-amber-500'} uppercase tracking-wider">${order.payment_status || 'Menunggu'}</p>
                </div>
              </div>
            </div>

            <div class="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 md:min-w-[140px]">
              <div class="flex-1 text-center px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border
                ${order.status === 'Diproses' ? 'bg-blue-50 text-blue-600 border-blue-100' :
            order.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}">
                ${order.status}
              </div>
              
              ${order.payment_status !== 'Lunas' ? `
                <button onclick="window.showPaymentGateway(${order.id})" class="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl text-[10px] font-bold hover:from-rose-600 hover:to-red-700 transition-all shadow-md shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2">
                  <i class="fas fa-wallet"></i> Bayar
                </button>
              ` : ''}

              ${order.status === 'Selesai' && order.tracking_number ? `
                <button onclick="window.showLiveTracking('${order.tracking_number}', '${order.shipped_at}')" class="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                  <i class="fas fa-location-arrow"></i> Lacak
                </button>
              ` : ''}
            </div>
          </div>
        `).join('') : `
          <div class="py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-receipt text-4xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-700 mb-2">Riwayat Kosong</h3>
            <p class="text-slate-400 font-medium">Anda belum pernah melakukan transaksi pemesanan.</p>
          </div>
        `}
      </div>
    </div>
  `;
};