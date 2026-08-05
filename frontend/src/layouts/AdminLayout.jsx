import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiHash, FiFolder, FiShoppingBag, FiTag, FiStar,
  FiMail, FiUsers, FiImage, FiSettings, FiMenu, FiX, FiLogOut, FiExternalLink, FiShield,
} from 'react-icons/fi';
import Logo from '../components/Common/Logo';
import { ROUTES } from '../constants/routes';
import { classNames, initials } from '../utils/helpers';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', to: ROUTES.ADMIN, icon: FiGrid, end: true },
  { label: 'Numbers', to: ROUTES.ADMIN_NUMBERS, icon: FiHash },
  { label: 'Categories', to: ROUTES.ADMIN_CATEGORIES, icon: FiFolder },
  { label: 'Orders', to: ROUTES.ADMIN_ORDERS, icon: FiShoppingBag },
  { label: 'Coupons', to: ROUTES.ADMIN_COUPONS, icon: FiTag },
  { label: 'Reviews', to: ROUTES.ADMIN_REVIEWS, icon: FiStar },
  { label: 'Messages', to: ROUTES.ADMIN_CONTACTS, icon: FiMail },
  { label: 'Users', to: ROUTES.ADMIN_USERS, icon: FiUsers },
  { label: 'Banners', to: ROUTES.ADMIN_BANNERS, icon: FiImage },
  { label: 'Settings', to: ROUTES.ADMIN_SETTINGS, icon: FiSettings },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    await logout();
    toast.success('Admin Logged Out');
    navigate(ROUTES.ADMIN_LOGIN);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#09090d] text-[#f5f0e1] border-r border-[#d4af37]/20">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <Logo size="sm" />
          <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
            Control Center
          </span>
        </div>
        {open && (
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/50 hover:text-white">
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all',
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 text-[#d4af37] border-l-4 border-[#d4af37] shadow-[0_4px_15px_rgba(212,175,55,0.15)]'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <item.icon size={18} /> {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info & Admin Logout */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-black/40">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold text-xs flex items-center justify-center shrink-0">
            {initials(user?.name) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
          </div>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition"
        >
          <FiExternalLink size={14} /> Open Storefront
        </a>

        <button
          onClick={handleAdminLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition border border-red-500/20"
        >
          <FiLogOut size={14} /> Admin Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050507] text-[#f5f0e1] flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 z-30">{SidebarContent}</aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 max-w-[80vw] h-full z-10">{SidebarContent}</aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#09090d]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 text-white/70 hover:text-white rounded-lg bg-white/5">
              <FiMenu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
              <FiShield className="text-[#d4af37]" />
              <span>Admin Panel</span>
              <span>/</span>
              <span className="text-[#d4af37] font-semibold">Control Center</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Server Connected
            </div>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition"
            >
              <FiLogOut size={14} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
