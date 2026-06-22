/**
 * Halaman Katalog Produk (Admin)
 * Perbaikan: Mengganti overlay hitam dengan Glassmorphism dan merapikan visual modal.
 */
export const CatalogPage = (products = []) => {
  const formatRupiah = (n) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n);

  return `
    <div class="space-y-6 animate-fade-in relative">
      <!-- Header Page -->
      <div class="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight">Manajemen Stok</h2>
          <p class="text-slate-500 text-xs mt-1">Kelola data inventaris real-time di sini.</p>
        </div>
        <button onclick="window.toggleModal(true)" class="bg-primary-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95">
          <i class="fas fa-plus"></i> Tambah Produk
        </button>
      </div>

      <!-- Grid Produk -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${products.length > 0 ? products.map(p => `
          <div class="bg-white border border-slate-200 rounded-[2.5rem] p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
            <div class="h-32 bg-slate-50 rounded-3xl mb-4 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-300 transition-colors">
              <i class="fas fa-box-open text-4xl"></i>
            </div>
            
            <div class="px-2">
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors max-w-[70%]">${p.name}</h4>
                <span class="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">${p.sku || 'NO-SKU'}</span>
              </div>
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">${p.category}</p>
              
              <div class="mt-4 flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase">Harga B2B</p>
                  <p class="text-primary-600 font-black text-lg">${formatRupiah(p.price)}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-slate-400 font-bold uppercase">Stok Gudang</p>
                  <p class="font-bold text-slate-700">${p.stock} <span class="text-[10px] text-slate-400 font-normal italic">${p.unit || 'pcs'}</span></p>
                </div>
              </div>

              <div class="flex gap-2 mt-6 pt-4 border-t border-slate-50">
                <button onclick="window.handleRequestRestock(${p.id})" class="flex-1 bg-indigo-50 text-indigo-600 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 tooltip" title="Minta restock ke Pabrik">
                  <i class="fas fa-truck-loading"></i> Restock
                </button>
                <button onclick="window.showEditModal(${p.id})" class="w-11 h-11 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all flex items-center justify-center tooltip" title="Edit Produk">
                  <i class="fas fa-edit text-xs"></i>
                </button>
                <button onclick="window.handleDeleteProduct(${p.id})" class="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-status-danger transition-all flex items-center justify-center tooltip" title="Hapus Produk">
                  <i class="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('') : `
          <div class="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <p class="text-slate-400 font-medium">Gudang kosong. Mulai dengan menambah produk baru.</p>
          </div>
        `}
      </div>

      <!-- MODAL FORM (REFINED UI: NO DARK OVERLAY) -->
      <div id="product-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center p-4">
        
        <!-- ALTERNATIF: Glassmorphism Backdrop (Putih Transparan + Blur) -->
        <div onclick="window.toggleModal(false)" class="absolute inset-0 bg-white/40 backdrop-blur-xl transition-opacity duration-300"></div>
        
        <!-- Konten Modal -->
        <div class="relative bg-white w-full max-w-md rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-fade-in">
          
          <!-- Header Modal -->
          <div class="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div>
              <h3 id="modal-title" class="text-xl font-black text-slate-900 tracking-tight">Formulir Produk</h3>
              <p class="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Sinkronisasi MySQL Aktif</p>
            </div>
            <button onclick="window.toggleModal(false)" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-md text-slate-400 hover:text-slate-600 transition-all">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- Body Modal -->
          <form id="product-form" class="p-10 space-y-6" onsubmit="event.preventDefault(); window.handleSaveProduct();">
            
            <div class="group">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Detail Nama Barang</label>
              <div class="relative">
                <i class="fas fa-tag absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors"></i>
                <input type="text" id="prod-name" placeholder="Contoh: Gula Pasir 1kg" required class="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-700">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div class="group">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Harga B2B</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Rp</span>
                  <input type="number" id="prod-price" placeholder="0" required class="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-700">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="group">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Stok</label>
                  <div class="relative">
                    <input type="number" id="prod-stock" placeholder="0" required class="w-full pl-4 pr-3 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-700">
                  </div>
                </div>
                <div class="group">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Satuan</label>
                  <div class="relative">
                    <input type="text" id="prod-unit" placeholder="pcs" required class="w-full px-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 text-center">
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div class="group">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Kategori Produk</label>
                <div class="relative">
                  <i class="fas fa-th-large absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                  <select id="prod-category" required class="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer">
                    <option value="Sembako">Sembako</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Bumbu">Bumbu</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
                </div>
              </div>
              <div class="group">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Kode SKU</label>
                <div class="relative">
                  <i class="fas fa-barcode absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors"></i>
                  <input type="text" id="prod-sku" placeholder="Contoh: BRS-PRM-5KG" required class="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 uppercase">
                </div>
              </div>
            </div>

            <div class="group">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Deskripsi Tambahan</label>
              <textarea id="prod-desc" rows="2" placeholder="Detail produk..." class="w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 resize-none"></textarea>
            </div>

            <button type="submit" class="w-full bg-primary-600 text-white py-4.5 rounded-[1.5rem] font-bold hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all flex items-center justify-center gap-3 mt-4 text-lg">
              <i class="fas fa-check-circle"></i> Simpan Data
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
};