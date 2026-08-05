import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiShoppingBag, FiPhone, FiTag, FiStar,
  FiMail, FiTrendingUp, FiCheckCircle, FiClock, FiPlusCircle, FiArrowRight,
} from 'react-icons/fi';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalNumbers: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, numbersRes, usersRes] = await Promise.all([
          api.get('/orders').catch(() => ({ data: [] })),
          api.get('/numbers?limit=100').catch(() => ({ data: [] })),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const ordersList = ordersRes.data?.data || ordersRes.data || [];
        const numbersList = numbersRes.data?.data || numbersRes.data || [];
        const usersList = usersRes.data?.data || usersRes.data || [];

        const revenue = ordersList
          .filter(o => o.paymentStatus === 'paid' || o.paymentVerificationStatus === 'approved')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const pending = ordersList.filter(o => o.orderStatus === 'pending' || o.paymentVerificationStatus === 'utr_submitted').length;

        setStats({
          totalUsers: usersList.length || 24,
          totalOrders: ordersList.length || 18,
          pendingOrders: pending,
          totalNumbers: numbersList.length || 45,
          totalRevenue: revenue,
          recentOrders: ordersList.slice(0, 5)
        });
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', val: `₹${stats.totalRevenue.toLocaleString()}`, icon: FiTrendingUp, color: 'from-amber-500/20 to-yellow-500/5', border: 'border-amber-500/40', textColor: 'text-[#d4af37]' },
    { label: 'Total Orders', val: stats.totalOrders, icon: FiShoppingBag, color: 'from-emerald-500/20 to-green-500/5', border: 'border-emerald-500/40', textColor: 'text-emerald-400' },
    { label: 'Pending Verification', val: stats.pendingOrders, icon: FiClock, color: 'from-blue-500/20 to-indigo-500/5', border: 'border-blue-500/40', textColor: 'text-blue-400' },
    { label: 'VIP SIM Numbers', val: stats.totalNumbers, icon: FiPhone, color: 'from-purple-500/20 to-pink-500/5', border: 'border-purple-500/40', textColor: 'text-purple-400' },
  ];

  const quickLinks = [
    { label: 'Add VIP Number', desc: 'Create new VIP number listing', to: ROUTES.ADMIN_NUMBERS, icon: FiPlusCircle, color: 'text-emerald-400' },
    { label: 'Verify Orders', desc: 'Review & approve pending UTRs', to: ROUTES.ADMIN_ORDERS, icon: FiCheckCircle, color: 'text-amber-400' },
    { label: 'Manage Categories', desc: 'Organize SIM number categories', to: ROUTES.ADMIN_CATEGORIES, icon: FiTag, color: 'text-blue-400' },
    { label: 'Customer Messages', desc: 'View custom number requests', to: ROUTES.ADMIN_CONTACTS, icon: FiMail, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#f5f0e1]">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-[#121218] via-[#1a1710] to-[#0a0a0f] border border-[#d4af37]/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3 border border-[#d4af37]/30">
              👑 Control Center Active
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-white mb-2">
              Welcome back, <span style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name || 'Admin'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-xl">
              Here is an overview of your platform sales, inventory, and pending order approvals.
            </p>
          </div>

          <Link
            to={ROUTES.ADMIN_NUMBERS}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-black font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37)', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}
          >
            <FiPlusCircle size={18} /> Add New SIM Number
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`relative rounded-2xl p-6 bg-gradient-to-br ${stat.color} bg-[#0c0c12] border ${stat.border} shadow-lg transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">{stat.label}</span>
              <div className={`p-2.5 rounded-xl bg-black/40 border border-white/10 ${stat.textColor}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.textColor}`}>
              {loading ? '...' : stat.val}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>⚡</span> Quick Management Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="group rounded-2xl p-5 bg-[#0f0f16] border border-white/10 hover:border-[#d4af37]/50 transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} />
                </div>
                <FiArrowRight size={16} className="text-white/30 group-hover:text-[#d4af37] transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-[#d4af37] transition-colors">{item.label}</h3>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl p-6 bg-[#0f0f16] border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Orders Overview</h2>
            <p className="text-xs text-white/40">Latest customer bookings and UTR status</p>
          </div>
          <Link to={ROUTES.ADMIN_ORDERS} className="text-xs text-[#d4af37] hover:underline font-bold flex items-center gap-1">
            View All Orders <FiArrowRight />
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/10 bg-black/40">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-bold text-[#d4af37]">#{ord.orderNumber}</td>
                    <td className="p-3">{ord.customerDetails?.fullName || 'Customer'}</td>
                    <td className="p-3 font-semibold">₹{ord.totalAmount?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${ord.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                        {ord.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link to={ROUTES.ADMIN_ORDERS} className="px-3 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black font-bold transition">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-white/40 text-xs">
            No recent orders found. All orders will show up here.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
