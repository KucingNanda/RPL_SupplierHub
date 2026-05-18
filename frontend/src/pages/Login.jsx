import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Package, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(username, password);
      if (data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse pointer-events-none" />
      
      {/* Left Side - Brand & Graphics */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10 text-white border-r border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 font-bold text-2xl tracking-tight">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Package size={24} className="text-white" />
          </div>
          Supplier<span className="text-blue-400">Hub</span>
        </div>
        
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400">
            Ekosistem Supply Chain Masa Depan.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Platform B2B terintegrasi untuk manajemen stok, pemesanan, dan analitik bisnis bagi Supplier dan UMKM dalam satu pintu.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
          <ShieldCheck size={20} className="text-emerald-400" />
          Sistem Terenkripsi & Aman (Tersinkronisasi API Golang)
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md bg-slate-900/60 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang!</h2>
            <p className="text-slate-400">Masuk ke akun SupplierHub Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="Masukkan username Anda"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Lupa sandi?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-4 py-4 font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 text-sm">
            <p>Demo Kredensial:</p>
            <p className="mt-1 font-mono text-slate-400">Admin: admin/admin123 | User: umkm1/user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
