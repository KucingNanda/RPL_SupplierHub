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
      subtitle = 'Total barang hasil produksi yang siap disalurkan ke Supplier Hub.';
    } else if (role === 'admin') {
      title = 'Gudang Simpanan (Transit)';
      subtitle = 'Barang dari pabrik yang diistirahatkan. Transfer ke Katalog agar UMKM bisa membelinya.';
    } else if (role === 'umkm') {
      title = 'Gudang Toko Kelontong';
      subtitle = 'Seluruh aset stok barang yang siap Anda jual ke konsumen akhir.';
    }

    return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3"><i class="fas fa-warehouse text-slate-400"></i> ${title}</h2>
          <p class="text-slate-500 text-sm mt-1">${subtitle}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${inventory.length > 0 ? inventory.map(inv => `
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-between gap-4 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-xl">
                <i class="fas fa-pallet"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900">${inv.product_name}</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">SKU: ${inv.sku}</p>
              </div>
            </div>
            
            <div class="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Stok Fisik</p>
                <p class="font-black text-2xl text-slate-800">${inv.quantity} <span class="text-sm font-medium text-slate-500">${inv.unit}</span></p>
              </div>
              <i class="fas fa-cubes text-3xl text-slate-200"></i>
            </div>

            ${role === 'admin' ? `
              <button onclick="window.handleTransferCatalog(${inv.product_id})" class="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all">
                <i class="fas fa-share mr-1"></i> Transfer ke Katalog
              </button>
            ` : ''}
          </div>
        `).join('') : `
          <div class="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-slate-300">
              <i class="fas fa-box-open"></i>
            </div>
            <p class="text-slate-400 font-medium">${emptyMsg}</p>
          </div>
        `}
      </div>
    </div>
  `;
}
