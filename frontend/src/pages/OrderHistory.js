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
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
            <div class="flex items-center gap-5 w-full md:w-auto">
              <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                <i class="fas fa-box"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900">${order.product_name}</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${order.date}</p>
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
            </div>

            <div class="w-full md:w-auto">
              <span class="block text-center px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest 
                ${order.status === 'Diproses' ? 'bg-amber-100 text-amber-700' :
            order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}">
                ${order.status}
              </span>
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