export const LoginPage = () => {
  return `
    <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 animate-fade-in">
      <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 text-center">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Pilih Role Login</h2>
        <div class="space-y-4">
          <button onclick="handleLogin('admin')" class="w-full p-5 border-2 border-slate-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center gap-4">
            <i class="fas fa-user-shield text-blue-600 text-xl"></i>
            <span class="font-bold">Login sebagai Admin Supplier</span>
          </button>
          <button onclick="handleLogin('user')" class="w-full p-5 border-2 border-slate-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center gap-4">
            <i class="fas fa-store text-blue-600 text-xl"></i>
            <span class="font-bold">Login sebagai User UMKM</span>
          </button>
        </div>
      </div>
    </div>
  `;
};
