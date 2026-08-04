import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiPhone, FiSettings, FiGrid } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '1,245', icon: FiUsers, color: 'text-blue-500' },
    { label: 'Total Orders', value: '384', icon: FiShoppingBag, color: 'text-green-500' },
    { label: 'VIP Numbers', value: '156', icon: FiPhone, color: 'text-yellow-500' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#050505] text-[#f5f0e1]">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-[#d4af37] mb-2">Admin Dashboard</h1>
        <p className="text-white/60">Welcome back, {user?.name || 'Admin'}! Here is what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111] border border-[#d4af37]/20 rounded-xl p-6 flex items-center gap-6">
            <div className={`w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center ${stat.color}`}>
              <stat.icon className="text-2xl" />
            </div>
            <div>
              <p className="text-white/50 text-sm uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/numbers" className="group block bg-[#111] hover:bg-[#1a1a1a] border border-[#d4af37]/20 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiPhone className="text-[#d4af37] text-xl" />
            </div>
            <FiGrid className="text-white/20 text-xl" />
          </div>
          <h3 className="text-xl font-bold text-[#d4af37] mb-2">Manage Numbers</h3>
          <p className="text-white/50 text-sm">Add, update, or delete VIP SIM numbers from the inventory.</p>
        </Link>
        
        <div className="group block bg-[#111] opacity-50 cursor-not-allowed border border-[#d4af37]/20 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <FiSettings className="text-white/40 text-xl" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white/50 mb-2">Settings (Coming Soon)</h3>
          <p className="text-white/30 text-sm">Configure platform settings, categories, and payment gateways.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
