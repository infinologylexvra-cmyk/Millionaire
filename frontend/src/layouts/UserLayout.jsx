import { NavLink, Outlet } from 'react-router-dom';
import { FiUser, FiPackage, FiHeart, FiMapPin } from 'react-icons/fi';
import { ROUTES } from '../constants/routes';
import { classNames } from '../utils/helpers';
import useAuth from '../hooks/useAuth';
import { initials } from '../utils/helpers';

const tabs = [
  { label: 'Profile', to: ROUTES.ACCOUNT_PROFILE, icon: FiUser },
  { label: 'Orders', to: ROUTES.ACCOUNT_ORDERS, icon: FiPackage },
  { label: 'Wishlist', to: ROUTES.ACCOUNT_WISHLIST, icon: FiHeart },
  { label: 'Addresses', to: ROUTES.ACCOUNT_ADDRESSES, icon: FiMapPin },
];

const UserLayout = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-32 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-full gold-gradient-bg text-charcoal font-bold text-lg flex items-center justify-center shrink-0">
          {initials(user?.name)}
        </div>
        <div>
          <h1 className="font-display text-2xl text-cream">{user?.name}</h1>
          <p className="text-sm text-cream/40">{user?.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm whitespace-nowrap transition-colors',
                  isActive ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'text-cream/60 hover:bg-white/5 border border-transparent'
                )
              }
            >
              <tab.icon size={16} /> {tab.label}
            </NavLink>
          ))}
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
