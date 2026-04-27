/**
 * Halaman Katalog Belanja UMKM
 * Tempat User UMKM mencari dan memesan barang.
 */
export const UserCatalogPage = () => {
  // Data dummy produk untuk User
  const products = [
    { id: 1, name: 'Beras Premium 5kg', price: 'Rp 65.000', category: 'Sembako' },
    { id: 2, name: 'Minyak Goreng 2L', price: 'Rp 32.000', category: 'Sembako' },
    { id: 3, name: 'Gula Pasir 1kg', price: 'Rp 14.500', category: 'Sembako' },
  ];

  return `
    <div class="space-y-8 animate-fade-in">
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div class="relative z-10">
          <h3 class="text-3xl font-black mb-2">Katalog Belanja UMKM</h3>
          <p class="opacity-90 max-w-md">Pesan stok barang grosir langsung dari supplier tangan pertama dengan harga terbaik.</p>
        </div>
        <i class="fas fa-shopping-bag absolute -right-10 -bottom-10 text-[12rem] opacity-10 rotate-12"></i>
      </div>

      <!-- Grid Produk -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${products.map(product => `
          <div class="bg-white p-6 rounded-[2rem] border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span class="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full">${product.category}</span>
                <i class="fas fa-heart text-slate-200 hover:text-red-400 cursor-pointer transition-colors"></i>
              </div>
              <h4 class="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">${product.name}</h4>
              <p class="text-blue-600 font-black text-2xl mt-2">${product.price}</p>
            </div>
            
            <button 
              onclick="console.log('Pesanan untuk ${product.name} dibuat')" 
              class="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <i class="fas fa-cart-plus text-sm"></i> Tambahkan ke Pesanan
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};