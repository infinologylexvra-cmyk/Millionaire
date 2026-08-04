import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiGrid, FiPackage } from 'react-icons/fi';
import Logo from '../Common/Logo';
import Button from '../Buttons/Button';
import { ROUTES } from '../../constants/routes';
import { classNames, initials } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const navLinks = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'VIP Numbers', to: ROUTES.NUMBERS },
  { label: 'Generate', to: ROUTES.NUMEROLOGY },
  { label: 'About Us', to: ROUTES.ABOUT },
  { label: 'Contact', to: ROUTES.CONTACT },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate(ROUTES.HOME);
  };

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || mobileOpen ? 'bg-charcoal/95 backdrop-blur-xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-5 lg:px-8 h-[60px] sm:h-[68px] lg:h-[72px]">
        {/* Logo – smaller on mobile */}
        <Logo size="sm" className="shrink-0" />

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                classNames(
                  'text-sm tracking-wide transition-colors',
                  isActive ? 'text-gold-400' : 'text-cream/70 hover:text-gold-400'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <Link
            to={ROUTES.SEARCH}
            className="hidden sm:flex w-9 h-9 lg:w-10 lg:h-10 items-center justify-center rounded-full text-cream/70 hover:text-gold-400 hover:bg-white/5 transition-colors"
            aria-label="Search numbers"
          >
            <FiSearch size={17} />
          </Link>

          {isAuthenticated && (
            <Link
              to={ROUTES.ACCOUNT_WISHLIST}
              className="hidden sm:flex w-9 h-9 lg:w-10 lg:h-10 items-center justify-center rounded-full text-cream/70 hover:text-gold-400 hover:bg-white/5 transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={17} />
            </Link>
          )}

          <Link
            to={ROUTES.CART}
            className="relative flex w-9 h-9 lg:w-10 lg:h-10 items-center justify-center rounded-full text-cream/70 hover:text-gold-400 hover:bg-white/5 transition-colors"
            aria-label="Cart"
          >
            <FiShoppingBag size={17} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 min-w-[16px] px-0.5 rounded-full bg-gold-500 text-charcoal text-[9px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full gold-gradient-bg text-charcoal font-bold text-xs lg:text-sm flex items-center justify-center"
              >
                {initials(user?.name) || <FiUser />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl card-surface shadow-gold-lg p-2 animate-[fadeIn_0.15s_ease]">
                  <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                    <p className="text-sm text-cream font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-cream/40 truncate">{user?.email}</p>
                  </div>
                  <Link to={ROUTES.ACCOUNT_PROFILE} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-cream/80 hover:bg-white/5 hover:text-gold-400">
                    <FiUser size={15} /> My Profile
                  </Link>
                  <Link to={ROUTES.ACCOUNT_ORDERS} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-cream/80 hover:bg-white/5 hover:text-gold-400">
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <Link to={ROUTES.ACCOUNT_WISHLIST} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-cream/80 hover:bg-white/5 hover:text-gold-400">
                    <FiHeart size={15} /> Wishlist
                  </Link>
                  {isAdmin && (
                    <Link to={ROUTES.ADMIN} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-cream/80 hover:bg-white/5 hover:text-gold-400">
                      <FiGrid size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 mt-1">
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button to={ROUTES.LOGIN} size="sm" className="hidden sm:inline-flex text-xs px-3 py-1.5">
              Login / Signup
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-cream rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        className={classNames(
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-[calc(100vh-60px)] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-charcoal/98 backdrop-blur-xl border-t border-white/5 px-5 py-5 space-y-1">
          {/* Nav links */}
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors',
                  isActive
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-cream/80 hover:text-gold-400 hover:bg-white/5'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Search on mobile */}
          <Link
            to={ROUTES.SEARCH}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-cream/80 hover:text-gold-400 hover:bg-white/5 transition-colors"
          >
            <FiSearch size={16} /> Search Numbers
          </Link>

          <div className="h-px bg-white/8 my-2" />

          {/* Auth section */}
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2">
                <p className="text-sm text-cream font-medium truncate">{user?.name}</p>
                <p className="text-xs text-cream/40 truncate">{user?.email}</p>
              </div>
              <Link to={ROUTES.ACCOUNT_PROFILE} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-cream/80 hover:bg-white/5">
                <FiUser size={16} /> My Profile
              </Link>
              <Link to={ROUTES.ACCOUNT_ORDERS} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-cream/80 hover:bg-white/5">
                <FiPackage size={16} /> My Orders
              </Link>
              <Link to={ROUTES.ACCOUNT_WISHLIST} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-cream/80 hover:bg-white/5">
                <FiHeart size={16} /> Wishlist
              </Link>
              {isAdmin && (
                <Link to={ROUTES.ADMIN} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-cream/80 hover:bg-white/5">
                  <FiGrid size={16} /> Admin Dashboard
                </Link>
              )}
              <div className="h-px bg-white/8 my-2" />
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-red-400 hover:bg-red-500/10 w-full">
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3 px-4 pt-2 pb-1">
              <Button to={ROUTES.LOGIN} variant="outline" className="flex-1 text-sm" onClick={() => setMobileOpen(false)}>Log in</Button>
              <Button to={ROUTES.REGISTER} className="flex-1 text-sm" onClick={() => setMobileOpen(false)}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
