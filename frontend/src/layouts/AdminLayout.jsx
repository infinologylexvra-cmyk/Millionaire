import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FiGrid, FiHash, FiFolder, FiShoppingBag, FiTag, FiStar,
  FiMail, FiUsers, FiImage, FiSettings, FiMenu, FiX,
} from 'react-icons/fi';
import Logo from '../components/Common/Logo';
import { ROUTES } from '../constants/routes';
import { classNames } from '../utils/helpers';

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

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-white/5">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors',
                isActive ? 'bg-gold-500/10 text-gold-400' : 'text-cream/60 hover:bg-white/5 hover:text-cream'
              )
            }
          >
            <item.icon size={16} /> {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <NavLink to={ROUTES.HOME} className="text-xs text-cream/40 hover:text-gold-400">
          ← Back to site
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal flex">
      <aside className="hidden lg:block w-64 shrink-0 border-r border-white/5 fixed inset-y-0">{SidebarContent}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-charcoal border-r border-white/5">{SidebarContent}</aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="lg:hidden flex items-center justify-between px-5 h-16 border-b border-white/5">
          <Logo size="sm" />
          <button onClick={() => setOpen(true)} className="text-cream">
            <FiMenu size={22} />
          </button>
        </header>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
