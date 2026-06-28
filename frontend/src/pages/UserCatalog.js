/**
 * Halaman Katalog Belanja UMKM
 */
export const UserCatalogPage = (products = [], cart = []) => {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return `
    <div class="space-y-8 animate-fade-in relative pb-32 max-w-7xl mx-auto">
      
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-[0_10px_40px_rgba(79,70,229,0.3)] relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div class="absolute right-10 bottom-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-50 border border-white/20 shadow-sm">Special B2B</span>
              <span class="flex items-center gap-1 text-xs font-semibold text-blue-200"><i class="fas fa-certificate text-amber-300"></i> Verified Supplier</span>
            </div>
            <h3 class="text-4xl font-black mb-2 tracking-tight text-white drop-shadow-md">Katalog Grosir UMKM</h3>
            <p class="text-blue-100/90 max-w-md text-sm font-medium">Temukan produk berkualitas langsung dari gudang supplier utama dengan jaminan harga tangan pertama.</p>
          </div>
          
          <div class="hidden md:block">
            <i class="fas fa-shopping-basket text-[8rem] opacity-20 rotate-12 drop-shadow-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full max-w-md group">
          <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
          <input type="text" placeholder="Cari produk impianmu..." class="w-full pl-12 pr-5 py-4 bg-white border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        </div>
        
        <div class="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <button class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 whitespace-nowrap">Semua Kategori</button>
          <button class="px-5 py-2.5 bg-white text-slate-500 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-50 transition-colors whitespace-nowrap">Sembako</button>
          <button class="px-5 py-2.5 bg-white text-slate-500 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-50 transition-colors whitespace-nowrap">Minuman</button>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${products.length > 0 ? products.map(product => `
          <div class="bg-white p-5 rounded-[2rem] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
            
            <!-- Wishlist Button -->
            <button class="absolute top-8 right-8 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
              <i class="fas fa-heart text-xs"></i>
            </button>
            
            <!-- Category Tag -->
            <div class="absolute top-8 left-8 z-10">
              <span class="bg-white/90 backdrop-blur shadow-sm text-blue-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
                ${product.category || 'PRODUK'}
              </span>
            </div>

            <!-- Product Image Area -->
            <div class="h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[1.5rem] mb-5 flex items-center justify-center text-slate-300 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-400 transition-colors relative overflow-hidden">
              <i class="fas fa-box-open text-6xl group-hover:scale-110 transition-transform duration-500"></i>
            </div>
            
            <!-- Content -->
            <div class="flex-1 flex flex-col px-1">
              <h4 class="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">${product.name}</h4>
              <p class="text-[10px] text-slate-400 font-medium mb-4">SKU: ${product.sku || 'N/A'}</p>
              
              <div class="mt-auto">
                <div class="flex items-baseline gap-1.5 mb-3">
                   <p class="text-blue-600 font-black text-2xl tracking-tight">${formatRupiah(product.price)}</p>
                   <span class="text-slate-400 text-xs font-semibold">/${product.unit || 'unit'}</span>
                </div>
                
                <!-- Stock Bar -->
                <div class="space-y-1.5 mb-5">
                  <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span class="text-slate-500">Tersedia: ${product.stock}</span>
                    <span class="${product.stock < 50 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}">${product.stock < 50 ? 'Sisa Sedikit' : 'Stok Aman'}</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full ${product.stock < 50 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'} rounded-full transition-all duration-1000" style="width: ${Math.min((product.stock / 500) * 100, 100)}%"></div>
                  </div>
                </div>

                <button 
                  onclick="window.addToCart(${product.id})" 
                  class="w-full bg-slate-900 text-white py-3.5 rounded-[1.2rem] text-sm font-bold hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
                >
                  <i class="fas fa-cart-plus group-hover/btn:animate-bounce"></i> <span>Tambah Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        `).join('') : `
          <div class="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <i class="fas fa-store-slash text-4xl text-slate-300"></i>
             </div>
             <h3 class="text-xl font-bold text-slate-700 mb-2">Gudang Kosong</h3>
             <p class="text-slate-400 font-medium">Belum ada produk yang tersedia. Silakan hubungi admin.</p>
          </div>
        `}
      </div>
    </div>
  `;
};