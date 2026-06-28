export const LandingPage = () => {
  return `
    <div class="min-h-screen flex flex-col animate-fade-in">
      <nav class="p-6 flex justify-between items-center bg-white border-b border-slate-100">
        <div class="flex items-center gap-2">
           <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <i class="fas fa-hubspot"></i>
           </div>
           <span class="font-bold text-xl tracking-tight">SupplierHub</span>
        </div>
        <button onclick="switchTab('login')" class="bg-primary-600 text-white px-6 py-2 rounded-full font-bold hover:bg-primary-700 transition-all">
          Masuk Sekarang
        </button>
      </nav>

      <main class="flex-1 flex flex-col items-center justify-center p-10 text-center max-w-4xl mx-auto">
        <span class="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">B2B Supply Chain Platform</span>
        <h1 class="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
          Solusi Pengadaan Stok <span class="text-primary-600">UMKM</span> Lebih Mudah
        </h1>
        <p class="text-slate-500 text-lg mb-10 max-w-2xl leading-relaxed">
          Hubungkan bisnis Anda dengan supplier tangan pertama. Kelola stok, pantau harga grosir, dan lakukan restock otomatis dengan integrasi SmartBank.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
          <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <i class="fas fa-bolt text-amber-500 text-2xl mb-4"></i>
            <h4 class="font-bold mb-2">Cepat & Tepat</h4>
            <p class="text-slate-500 text-sm">Proses restock instan via API Gateway.</p>
          </div>
          <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <i class="fas fa-shield-alt text-blue-500 text-2xl mb-4"></i>
            <h4 class="font-bold mb-2">Aman & Terjamin</h4>
            <p class="text-slate-500 text-sm">Transaksi diawasi oleh otoritas SmartBank.</p>
          </div>
          <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <i class="fas fa-percentage text-green-500 text-2xl mb-4"></i>
            <h4 class="font-bold mb-2">Fee Kompetitif</h4>
            <p class="text-slate-500 text-sm">Hanya 3% fee untuk keberlanjutan ekosistem.</p>
          </div>
        </div>
      </main>
    </div>
  `;
};
