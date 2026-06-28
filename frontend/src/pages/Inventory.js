/**
 * Halaman Inventori Gudang (Warehouse Inventory)
 * Dinamis berdasarkan Role (Distributor, Admin, UMKM)
 */
export const InventoryPage = (inventory = [], role = '') => {
    let title = 'Inventori Gudang';
    let subtitle = 'Aset fisik barang yang Anda miliki saat ini.';
    let emptyMsg = 'Gudang Anda masih kosong.';

    if (role === 'distributor') {
      title = 'Gudang Produksi Pabrik';
      subtitle = 'Total barang hasil produksi yang siap disalurkan ke SupplierHub.';
    } else if (role === 'admin') {
      title = 'Gudang Simpanan (Transit)';
      subtitle = 'Barang dari pabrik yang diistirahatkan. Transfer ke Katalog agar UMKM bisa membelinya.';
    } else if (role === 'umkm') {
      title = 'Gudang Toko Kelontong';
      subtitle = 'Seluruh aset stok barang yang siap Anda jual ke konsumen akhir.';
    }

    return `
    <div class="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(49,46,129,0.2)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <!-- Abstract Decoration -->
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
        <div class="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full"></div>

        <div class="relative z-10">
          <h2 class="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <i class="fas fa-warehouse text-indigo-300"></i> ${title}
          </h2>
          <p class="text-indigo-200 text-sm mt-2 font-medium">${subtitle}</p>
        </div>
        
        <div class="relative z-10">
           <div class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-2xl flex flex-col items-center sm:items-start shadow-inner">
              <span class="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Total SKU Tersimpan</span>
              <div class="flex items-center gap-2">
                <i class="fas fa-boxes text-indigo-300"></i>
                <span class="text-2xl font-black">${inventory.length}</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-between items-center bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
        <div class="relative w-full max-w-xs group">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input type="text" placeholder="Cari di gudang..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium">
        </div>
        <div class="flex gap-2">
          <button class="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors tooltip" title="Tampilan Grid"><i class="fas fa-th-large"></i></button>
          <button class="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors tooltip" title="Tampilan List"><i class="fas fa-list"></i></button>
        </div>
      </div>

      <!-- Inventory Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${inventory.length > 0 ? inventory.map(inv => `
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-between gap-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-slate-100 group-hover:from-indigo-50 group-hover:to-blue-50 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-colors">
                  <i class="fas fa-pallet"></i>
                </div>
                <div>
                  <h4 class="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">${inv.product_name}</h4>
                  <div class="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">
                    <i class="fas fa-barcode"></i> ${inv.sku}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-slate-50 p-5 rounded-[1.5rem] flex justify-between items-center border border-slate-100/50 group-hover:bg-indigo-50/30 transition-colors relative overflow-hidden">
              <i class="fas fa-cubes absolute -right-4 -bottom-4 text-[5rem] text-slate-200/50 group-hover:text-indigo-200/50 transition-colors rotate-12"></i>
              <div class="relative z-10">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover:text-indigo-400">Total Stok Fisik</p>
                <p class="font-black text-3xl text-slate-800 group-hover:text-indigo-700 transition-colors">${inv.quantity} <span class="text-sm font-semibold text-slate-500 group-hover:text-indigo-500">${inv.unit}</span></p>
              </div>
            </div>

            ${role === 'admin' ? `
              <button onclick="window.handleTransferCatalog(${inv.product_id})" class="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                <i class="fas fa-share"></i> Transfer ke Etalase Katalog
              </button>
            ` : ''}
          </div>
        `).join('') : `
          <div class="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
              <i class="fas fa-box-open text-4xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-700 mb-2">Penyimpanan Kosong</h3>
            <p class="text-slate-400 font-medium">${emptyMsg}</p>
          </div>
        `}
      </div>
    </div>
  `;
}
