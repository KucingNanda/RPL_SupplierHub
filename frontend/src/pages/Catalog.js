/**
 * Halaman Katalog Produk
 * Menampilkan daftar barang grosir dan manajemen stok.
 */
export const CatalogPage = () => {
  // Data dummy untuk visualisasi desain
  const products = [
    { id: 1, name: 'Beras Premium 5kg', price: 'Rp 65.000', stock: 450, category: 'Sembako' },
    { id: 2, name: 'Minyak Goreng 2L', price: 'Rp 32.000', stock: 120, category: 'Sembako' },
    { id: 3, name: 'Gula Pasir 1kg', price: 'Rp 14.500', stock: 15, category: 'Sembako' }, // Stok rendah
    { id: 4, name: 'Garam Dapur 500g', price: 'Rp 5.000', stock: 800, category: 'Bumbu' },
    { id: 5, name: 'Tepung Terigu 1kg', price: 'Rp 12.000', stock: 300, category: 'Bahan Kue' },
  ];

  return `
    <div class="space-y-6 animate-fade-in">
      <!-- Toolbar: Search & Add Button -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="relative w-full md:w-96">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" placeholder="Cari nama produk atau SKU..." class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all shadow-sm">
        </div>
        
        <button onclick="openModal()" class="w-full md:w-auto bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
          <i class="fas fa-plus"></i> Tambah Produk Baru
        </button>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${products.map(product => `
          <div class="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <!-- Image Placeholder -->
            <div class="h-40 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-200 transition-colors">
              <i class="fas fa-image text-4xl"></i>
            </div>

            <!-- Content -->
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate pr-2">${product.name}</h4>
              <span class="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">B2B</span>
            </div>
            
            <p class="text-slate-500 text-xs mb-4">${product.category}</p>

            <div class="flex items-center gap-2 mb-6">
              <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full ${product.stock < 50 ? 'bg-status-danger' : 'bg-primary-600'} rounded-full" style="width: ${Math.min((product.stock/500)*100, 100)}%"></div>
              </div>
              <span class="text-[11px] font-bold ${product.stock < 50 ? 'text-status-danger' : 'text-slate-700'}">${product.stock} Tersedia</span>
            </div>

            <!-- Price & Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-50">
              <span class="text-primary-600 font-black text-lg">${product.price}</span>
              <div class="flex gap-1">
                <button title="Edit" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><i class="fas fa-edit text-xs"></i></button>
                <button title="Hapus" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-status-danger hover:bg-red-50 rounded-lg transition-all"><i class="fas fa-trash text-xs"></i></button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};