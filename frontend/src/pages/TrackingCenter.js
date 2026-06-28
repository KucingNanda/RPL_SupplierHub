/**
 * Halaman Pusat Pelacakan (Tracking Center)
 */
export const TrackingCenterPage = (orders = []) => {
    // Cari daftar pesanan yang sedang/sudah dikirim
    const shippedOrders = orders.filter(o => o.status === 'Selesai' && o.tracking_number);

    return `
    <div class="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(67,56,202,0.3)] relative overflow-hidden group">
        <!-- Background Decorations -->
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>
        <div class="absolute left-10 -bottom-20 w-64 h-64 bg-blue-400/20 blur-3xl rounded-full"></div>
        <i class="fas fa-globe-asia absolute -right-10 -bottom-10 text-[12rem] text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000"></i>
        
        <div class="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-center">
          <div class="text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-100 border border-white/10 mb-4 shadow-sm">
               <i class="fas fa-satellite-dish text-blue-300 animate-pulse"></i> Real-time GPS Tracking
            </div>
            <h2 class="text-4xl font-black tracking-tight mb-3 text-white drop-shadow-md">Tracking Center</h2>
            <p class="text-indigo-100 text-sm max-w-lg leading-relaxed">Pusat pemantauan logistik. Masukkan nomor resi (SH-TRK-xxx) atau pilih dari daftar perjalanan aktif Anda di bawah.</p>
          </div>
          
          <div class="w-full md:w-auto max-w-md flex-1">
            <div class="bg-white/10 backdrop-blur-lg p-3 rounded-3xl border border-white/20 shadow-xl">
              <div class="flex gap-2 relative">
                <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-indigo-200"></i>
                <input type="text" id="input-resi" placeholder="Masukkan Nomor Resi..." class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/20 text-white placeholder:text-indigo-200 font-bold focus:outline-none focus:bg-white/30 transition-all border border-transparent focus:border-white/30" />
                <button onclick="window.searchTracking()" class="px-6 py-3.5 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all shadow-md active:scale-95 flex items-center gap-2">
                  Lacak <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Shipments -->
      <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div class="flex items-center justify-between mb-8">
           <h3 class="text-xl font-black text-slate-800 flex items-center gap-3">
             <div class="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center text-sm">
                <i class="fas fa-truck-fast"></i>
             </div>
             Perjalanan Aktif
           </h3>
           <span class="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-100">${shippedOrders.length} Paket</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${shippedOrders.length > 0 ? shippedOrders.map(o => `
            <div onclick="window.showLiveTracking('${o.tracking_number}', '${o.shipped_at}')" class="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden">
              
              <!-- Map Decoration -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10 rounded-bl-full"></div>
              
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-6">
                  <div class="w-12 h-12 bg-white text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <i class="fas fa-box-open"></i>
                  </div>
                  <span class="text-[9px] font-black uppercase tracking-widest bg-white text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-700 transition-colors shadow-sm">
                    ${o.tracking_number}
                  </span>
                </div>
                
                <h4 class="font-bold text-slate-800 text-lg mb-1 truncate group-hover:text-indigo-700 transition-colors">${o.product_name}</h4>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                   <i class="far fa-calendar-check"></i> Dikirim: ${new Date(o.shipped_at).toLocaleDateString('id-ID')}
                </div>
                
                <div class="pt-4 border-t border-slate-200/60 text-xs font-bold text-indigo-500 flex justify-between items-center group-hover:text-indigo-600">
                  <span>Lihat Progres Real-time</span> 
                  <div class="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <i class="fas fa-arrow-right group-hover:translate-x-0.5 transition-transform"></i>
                  </div>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                 <i class="fas fa-box-tissue text-3xl text-slate-300"></i>
              </div>
              <h4 class="font-bold text-slate-700 mb-1">Tidak Ada Pengiriman Aktif</h4>
              <p class="text-slate-400 text-sm font-medium">Belum ada paket yang sedang dalam perjalanan menuju Anda.</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
