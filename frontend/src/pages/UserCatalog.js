/**
 * Halaman Katalog Belanja UMKM
 * Diperbarui: Tombol sekarang memanggil fungsi handleOrder dengan ID produk yang benar.
 */
export const UserCatalogPage = (products = []) => {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  return `
    <div class="space-y-8 animate-fade-in">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div class="relative z-10">
          <h3 class="text-3xl font-black mb-2 uppercase tracking-tighter text-white">Katalog Grosir UMKM</h3>
          <p class="opacity-90 max-w-md text-blue-50">Stok barang segar langsung dari gudang supplier dengan harga tangan pertama.</p>
        </div>
        <i class="fas fa-shopping-basket absolute -right-10 -bottom-10 text-[15rem] opacity-10 rotate-12 text-white"></i>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${products.length > 0 ? products.map(product => `
          <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all flex flex-col justify-between group border-b-4 border-b-slate-200 hover:border-b-blue-500">
            <div>
              <div class="flex justify-between items-start mb-6">
                <span class="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest">${product.category}</span>
                <div class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-red-400 transition-colors cursor-pointer">
                  <i class="fas fa-heart text-sm"></i>
                </div>
              </div>
              
              <div class="h-32 bg-slate-50 rounded-3xl mb-6 flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-200 transition-all">
                <i class="fas fa-box-open text-5xl"></i>
              </div>

              <h4 class="font-bold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">${product.name}</h4>
              <div class="mt-4 flex items-baseline gap-2">
                 <p class="text-blue-600 font-black text-3xl">${formatRupiah(product.price)}</p>
                 <span class="text-slate-400 text-xs font-medium">/ unit</span>
              </div>
              
              <div class="mt-4 flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" style="width: ${Math.min((product.stock / 500) * 100, 100)}%"></div>
                </div>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">${product.stock} Tersedia</p>
              </div>
            </div>
            
            <!-- FIXED: Memanggil window.handleOrder dengan ID produk -->
            <button 
              onclick="window.handleOrder(${product.id})" 
              class="w-full mt-8 bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <i class="fas fa-cart-arrow-down"></i> Pesan Sekarang
            </button>
          </div>
        `).join('') : `
          <div class="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <i class="fas fa-store-slash text-5xl text-slate-100 mb-4 block"></i>
             <p class="text-slate-400 font-medium">Gudang sedang kosong, hubungi admin untuk restock.</p>
          </div>
        `}
      </div>
    </div>
  `;
};