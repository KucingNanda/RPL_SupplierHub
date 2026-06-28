/**
 * Halaman Katalog Produk (Admin)
 */
export const CatalogPage = (products = []) => {
  const formatRupiah = (n) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n);

  return `
    <div class="space-y-8 animate-fade-in relative max-w-7xl mx-auto">
      <!-- Header Page -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out z-0"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-2">
            <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-boxes"></i>
            </div>
            <h2 class="text-3xl font-black text-slate-800 tracking-tight">Manajemen Stok & Etalase</h2>
          </div>
          <p class="text-slate-500 text-sm font-medium ml-14">Kelola data inventaris, harga B2B, dan ketersediaan barang secara real-time.</p>
        </div>
        <button onclick="window.toggleModal(true)" class="mt-6 md:mt-0 relative z-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:from-indigo-500 hover:to-blue-500 transition-all shadow-lg shadow-indigo-500/30 active:scale-95 group">
          <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform">
            <i class="fas fa-plus text-xs"></i>
          </div>
          Tambah Produk Baru
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="flex items-center justify-between gap-4">
        <div class="relative w-full max-w-md group">
          <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input type="text" placeholder="Cari nama produk, SKU, atau kategori..." class="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium shadow-sm">
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Urutkan:</span>
          <select class="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 shadow-sm appearance-none cursor-pointer pr-10 relative">
            <option>Terbaru Ditambahkan</option>
            <option>Stok Terbanyak</option>
            <option>Stok Menipis</option>
          </select>
        </div>
      </div>

      <!-- Grid Produk -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${products.length > 0 ? products.map(p => `
          <div class="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all group relative flex flex-col">
            
            <!-- Category Badge -->
            <div class="absolute top-8 right-8 z-10">
              <span class="bg-white/90 backdrop-blur shadow-sm text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                ${p.category}
              </span>
            </div>

            <!-- Product Image / Icon Area -->
            <div class="h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[1.5rem] mb-5 flex flex-col items-center justify-center text-slate-300 group-hover:from-indigo-50 group-hover:to-blue-50 group-hover:text-indigo-400 transition-colors relative overflow-hidden">
              <i class="fas fa-box-open text-5xl mb-2 group-hover:scale-110 transition-transform duration-500"></i>
              <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-200/50 text-slate-500">${p.sku || 'NO-SKU'}</span>
            </div>
            
            <div class="px-2 flex-1 flex flex-col">
              <h4 class="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-indigo-600 transition-colors">${p.name}</h4>
              
              <div class="mt-auto space-y-4">
                <!-- Price & Stock -->
                <div class="flex items-end justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Harga B2B</p>
                    <p class="text-indigo-600 font-black text-lg leading-none">${formatRupiah(p.price)}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Stok</p>
                    <p class="font-black text-slate-700 leading-none">${p.stock} <span class="text-[10px] text-slate-400 font-semibold">${p.unit || 'pcs'}</span></p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                  <button onclick="window.handleRequestRestock(${p.id})" class="flex-1 bg-amber-50 text-amber-600 py-3 rounded-xl text-xs font-bold hover:bg-amber-100 hover:text-amber-700 transition-colors flex items-center justify-center gap-2 border border-amber-100 shadow-sm" title="Minta restock ke Pabrik">
                    <i class="fas fa-truck-loading"></i> PO Pabrik
                  </button>
                  <button onclick="window.showEditModal(${p.id})" class="w-11 h-11 bg-slate-50 text-slate-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center border border-slate-100 shadow-sm">
                    <i class="fas fa-edit text-sm"></i>
                  </button>
                  <button onclick="window.handleDeleteProduct(${p.id})" class="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center border border-slate-100 shadow-sm">
                    <i class="fas fa-trash-alt text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('') : `
          <div class="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <i class="fas fa-box-open text-4xl text-slate-300"></i>
             </div>
             <h3 class="text-xl font-bold text-slate-700 mb-2">Belum Ada Produk</h3>
             <p class="text-slate-400 font-medium">Gudang kosong. Silakan tambah produk baru untuk memulai.</p>
          </div>
        `}
      </div>

      <!-- MODAL FORM -->
      <div id="product-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center p-4">
        
        <!-- Glassmorphism Backdrop -->
        <div onclick="window.toggleModal(false)" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"></div>
        
        <!-- Konten Modal -->
        <div class="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden animate-fade-in">
          
          <!-- Header Modal -->
          <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                <i class="fas fa-box-open"></i>
              </div>
              <div>
                <h3 id="modal-title" class="text-xl font-black text-slate-800 tracking-tight">Formulir Produk</h3>
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">Tambah / Edit Data</p>
              </div>
            </div>
            <button onclick="window.toggleModal(false)" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all shadow-sm">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- Body Modal -->
          <form id="product-form" class="p-8 space-y-6" onsubmit="event.preventDefault(); window.handleSaveProduct();">
            
            <div class="group">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Detail Nama Barang</label>
              <div class="relative">
                <i class="fas fa-tag absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                <input type="text" id="prod-name" placeholder="Contoh: Gula Pasir 1kg" required class="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div class="group">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Harga B2B (Rp)</label>
                <div class="relative">
                  <i class="fas fa-coins absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                  <input type="number" id="prod-price" placeholder="0" required class="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="group">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Stok</label>
                  <input type="number" id="prod-stock" placeholder="0" required class="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700 text-center">
                </div>
                <div class="group">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Satuan</label>
                  <input type="text" id="prod-unit" placeholder="pcs" required class="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700 text-center">
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div class="group">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Kategori Produk</label>
                <div class="relative">
                  <i class="fas fa-th-large absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 z-10 group-focus-within:text-indigo-500 transition-colors"></i>
                  <select id="prod-category" required class="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer relative z-0">
                    <option value="Sembako">Sembako</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Bumbu">Bumbu</option>
                    <option value="Material">Material</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs z-10"></i>
                </div>
              </div>
              <div class="group">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Kode SKU</label>
                <div class="relative">
                  <i class="fas fa-barcode absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                  <input type="text" id="prod-sku" placeholder="Contoh: BRS-5KG" required class="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700 uppercase">
                </div>
              </div>
            </div>

            <div class="group">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Deskripsi Tambahan</label>
              <textarea id="prod-desc" rows="2" placeholder="Tuliskan spesifikasi produk di sini..." class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700 resize-none"></textarea>
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4.5 rounded-[1.5rem] font-bold hover:from-indigo-500 hover:to-blue-500 shadow-[0_8px_20px_rgba(79,70,229,0.25)] transition-all flex items-center justify-center gap-3 text-lg active:scale-95">
                <i class="fas fa-save"></i> Simpan ke Database
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};