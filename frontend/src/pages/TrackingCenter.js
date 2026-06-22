/**
 * Halaman Pusat Pelacakan (Tracking Center)
 */
export const TrackingCenterPage = (orders = []) => {
    // Cari daftar pesanan yang sedang/sudah dikirim
    const shippedOrders = orders.filter(o => o.status === 'Selesai' && o.tracking_number);

    return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-indigo-600 p-10 rounded-[2.5rem] border border-indigo-500 shadow-xl relative overflow-hidden text-white">
        <!-- Dekorasi Latar -->
        <i class="fas fa-globe-asia absolute -right-10 -bottom-10 text-9xl text-indigo-500/30"></i>
        <div class="relative z-10">
          <h2 class="text-3xl font-black tracking-tight mb-2">Tracking Center</h2>
          <p class="text-indigo-200 text-sm max-w-lg mb-8">Pusat pemantauan logistik real-time. Masukkan nomor resi (SH-TRK-xxx) atau pilih dari daftar perjalanan aktif Anda di bawah.</p>
          
          <div class="flex gap-3 max-w-xl">
            <div class="relative flex-1">
              <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" id="input-resi" placeholder="Masukkan Nomor Resi..." class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-400/50 shadow-inner" />
            </div>
            <button onclick="window.searchTracking()" class="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg whitespace-nowrap">
              Lacak
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-3"><i class="fas fa-truck-moving text-indigo-500"></i> Perjalanan Aktif Anda</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${shippedOrders.length > 0 ? shippedOrders.map(o => `
            <div onclick="window.showLiveTracking('${o.tracking_number}', '${o.shipped_at}')" class="p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group">
              <div class="flex justify-between items-start mb-4">
                <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <i class="fas fa-box"></i>
                </div>
                <span class="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">${o.tracking_number}</span>
              </div>
              <h4 class="font-bold text-slate-800 mb-1 truncate">${o.product_name}</h4>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">${new Date(o.shipped_at).toLocaleDateString('id-ID')}</p>
              
              <div class="pt-4 border-t border-slate-50 text-xs font-semibold text-indigo-500 flex justify-between items-center">
                Lihat Progres <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          `).join('') : `
            <div class="col-span-full py-16 text-center border-2 border-dashed border-slate-100 rounded-3xl">
              <i class="fas fa-sleep text-3xl text-slate-200 mb-3 block"></i>
              <p class="text-slate-400 font-medium">Tidak ada paket yang sedang dalam perjalanan.</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
