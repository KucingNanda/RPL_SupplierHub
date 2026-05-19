/**
 * Halaman Login
 * Diperbarui dengan Form untuk integrasi Backend.
 */
export const LoginPage = () => {
  return `
    <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 animate-fade-in">
      <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <div class="text-center mb-8">
           <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary-200">
              <i class="fas fa-hubspot text-2xl"></i>
           </div>
           <h2 class="text-2xl font-black text-slate-900">Selamat Datang</h2>
           <p class="text-slate-500 text-sm mt-1">Masuk ke akun SupplierHub Anda</p>
        </div>

        <form id="login-form" class="space-y-5" onsubmit="event.preventDefault(); window.handleLogin();">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
            <div class="relative">
              <i class="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" id="username" required placeholder="Masukkan username" class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600 transition-all">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div class="relative">
              <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="password" id="password" required placeholder="••••••••" class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600 transition-all">
            </div>
          </div>

          <button type="submit" class="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200 transition-all mt-4">
            Masuk Sekarang
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 text-center">
           <p class="text-xs text-slate-400">Belum punya akun? <a href="#" class="text-primary-600 font-bold hover:underline">Hubungi Admin</a></p>
        </div>
      </div>
    </div>
  `;
};