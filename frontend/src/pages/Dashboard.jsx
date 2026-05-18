import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Package, LayoutDashboard, ShoppingCart, LogOut, TrendingUp, Users, Box } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    fetchData(parsed);
  }, [navigate]);

  const fetchData = async (userData) => {
    try {
      const [statsData, ordersData] = await Promise.all([
        api.getStats(userData.role, userData.id),
        api.getOrders(userData.role, userData.id)
      ]);
      setStats(statsData);
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col transition-all">
        <div className="p-6 flex items-center gap-3 font-bold text-xl border-b border-white/10">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Package size={20} />
          </div>
          Supplier<span className="text-blue-400">Hub</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500/10 text-blue-400 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Box size={20} />
            {isAdmin ? 'Manajemen Produk' : 'Katalog Produk'}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <ShoppingCart size={20} />
            Riwayat Pesanan
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl font-medium transition-colors"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm z-10">
          <h1 className="text-2xl font-bold text-slate-800">Overview Dashboard</h1>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {isAdmin ? 'Total Stok Keseluruhan' : 'Saldo Tersedia'}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats ? (isAdmin ? stats.total_stok : stats.saldo) : '...'}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Box size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {isAdmin ? 'Pesanan Diproses' : 'Barang Dipesan'}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats ? (isAdmin ? stats.pesanan_proses : stats.barang_dipesan) : '...'}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ShoppingCart size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {isAdmin ? 'Total Margin' : 'Status Akun'}
                  </p>
                  <h3 className="text-3xl font-bold text-emerald-600">
                    {stats ? (isAdmin ? stats.margin : stats.status) : '...'}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  {isAdmin ? <TrendingUp size={24} /> : <Users size={24} />}
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Riwayat Pesanan Terbaru</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="py-4 px-6 font-semibold">ID</th>
                    {isAdmin && <th className="py-4 px-6 font-semibold">Pelanggan</th>}
                    <th className="py-4 px-6 font-semibold">Produk</th>
                    <th className="py-4 px-6 font-semibold">Jumlah</th>
                    <th className="py-4 px-6 font-semibold">Total Harga</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-slate-900">#{o.id}</td>
                      {isAdmin && <td className="py-4 px-6 text-sm text-slate-600">{o.customer_name}</td>}
                      <td className="py-4 px-6 text-sm text-slate-900 font-medium">{o.product_name}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{o.quantity} Unit</td>
                      <td className="py-4 px-6 text-sm text-slate-900 font-medium">Rp {o.total_price.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          o.status === 'Diproses' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          o.status === 'Dikirim' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">{o.date}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-slate-500">
                        Belum ada data pesanan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
