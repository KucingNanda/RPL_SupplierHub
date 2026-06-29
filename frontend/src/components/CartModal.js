export const CartModal = (isOpen, cart) => {
  if (!isOpen) return '';

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
      <div class="w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col border-l border-white/10 relative">
        
        <!-- Header -->
        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <h3 class="font-black text-white text-lg tracking-tight">Keranjang Belanja</h3>
          </div>
          <button onclick="window.toggleCart()" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          ${cart.length === 0 ? `
            <div class="flex flex-col items-center justify-center h-full text-center opacity-60">
              <i class="fas fa-box-open text-5xl text-slate-500 mb-4"></i>
              <p class="text-slate-300 font-medium">Keranjang Anda masih kosong</p>
              <p class="text-xs text-slate-500 mt-2">Silakan tambahkan produk dari Katalog.</p>
            </div>
          ` : cart.map(item => `
            <div class="glass-card p-4 flex items-center gap-4">
              <div class="w-16 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                <i class="fas fa-box text-2xl"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-white font-bold text-sm truncate">${item.name}</h4>
                <p class="text-indigo-400 font-black text-sm mt-1">Rp ${item.price.toLocaleString('id-ID')}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-[10px] uppercase font-bold tracking-widest text-slate-500">Qty:</span>
                  <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs font-bold">${item.quantity} ${item.unit}</span>
                </div>
              </div>
              <button onclick="window.removeFromCart(${item.product_id})" class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                <i class="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          `).join('')}
        </div>

        <!-- Footer / Checkout -->
        ${cart.length > 0 ? `
          <div class="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Belanja</span>
              <span class="text-2xl font-black text-white drop-shadow-md">Rp ${total.toLocaleString('id-ID')}</span>
            </div>
            
            <div class="mb-6">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Catatan Pesanan (Opsional)</label>
              <textarea id="order-notes" rows="2" class="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all placeholder-slate-600 resize-none custom-scrollbar" placeholder="Tambahkan instruksi khusus..."></textarea>
            </div>
            
            <button onclick="window.handleCheckout()" class="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm rounded-xl hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-3 group">
              <i class="fas fa-check-circle"></i> Proses Pembayaran <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};
