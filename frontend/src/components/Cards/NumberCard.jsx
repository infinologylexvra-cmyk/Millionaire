import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/formatPrice';
import { classNames } from '../../utils/helpers';
import { ROUTES } from '../../constants/routes';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import useAuth from '../../hooks/useAuth';

const patternColors = {
  VIP: 'text-gold-300 border-gold-400/40',
  Platinum: 'text-gold-200 border-gold-300/40',
  Gold: 'text-gold-400 border-gold-500/40',
  Fancy: 'text-pink-300 border-pink-400/30',
  Silver: 'text-slate-300 border-slate-400/30',
  Business: 'text-blue-300 border-blue-400/30',
  Wedding: 'text-rose-300 border-rose-400/30',
  Trending: 'text-emerald-300 border-emerald-400/30',
};

const formatPhone = (num = '') => num.replace(/(\d{5})(\d{5})/, '$1 $2');

const NumberCard = ({ number, index = 0 }) => {
  const { addToCart, isInCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const userIdStr = user?._id || user?.id || '';
  const reservedByStr = typeof number.reservedBy === 'object' ? (number.reservedBy?._id || number.reservedBy?.id || '') : (number.reservedBy || '');

  const isSold = number.isSold;
  const isReserved = number.isReserved && reservedByStr && reservedByStr !== userIdStr;
  const isLocked = isSold || isReserved;
  const inCart = isInCart(number._id);

  const handleCardClick = (e) => {
    if (isSold) {
      e.preventDefault();
      toast.error('This VIP number is sold out');
      return;
    }
    if (isReserved) {
      e.preventDefault();
      toast.error('This VIP number is currently locked/reserved by another customer');
      return;
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isSold) {
      toast.error('This VIP number is sold out');
      return;
    }
    if (isReserved) {
      toast.error('This VIP number is locked/reserved by another customer');
      return;
    }
    if (inCart) {
      navigate(ROUTES.CART);
      return;
    }
    addToCart(number);
    toast.success('Added to cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to save numbers');
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      await toggleWishlist(number._id);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
    >
      <Link
        to={ROUTES.NUMBER_DETAILS(number._id)}
        onClick={handleCardClick}
        className={classNames(
          'group block card-surface rounded-2xl p-5 transition-all duration-300 relative overflow-hidden',
          isSold ? 'opacity-60 border-red-500/30' : isReserved ? 'opacity-75 border-amber-500/30' : 'hover:border-gold-500/40 hover:-translate-y-1'
        )}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={classNames('text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border', patternColors[number.pattern] || 'text-cream/60 border-white/15')}>
              {number.pattern}
            </span>
            {isSold ? (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
                SOLD OUT 🚫
              </span>
            ) : isReserved ? (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                LOCKED 🔒
              </span>
            ) : null}
          </div>
          <button onClick={handleWishlist} className="text-cream/40 hover:text-gold-400 transition-colors" aria-label="Wishlist">
            <FiHeart size={17} className={isWishlisted(number._id) ? 'fill-gold-500 text-gold-500' : ''} />
          </button>
        </div>

        <p className="font-display text-2xl sm:text-[26px] tracking-wide text-cream mb-1 group-hover:text-gold-300 transition-colors">
          {formatPhone(number.phoneNumber)}
        </p>
        <p className="text-xs text-cream/40 mb-4">
          {number.operator} &middot; {number.circle}
        </p>

        <div className="flex items-end justify-between">
          <div>
            {number.originalPrice > number.price && (
              <p className="text-xs text-cream/35 line-through">{formatINR(number.originalPrice)}</p>
            )}
            <p className="text-lg font-semibold text-gold-400">{formatINR(number.price)}</p>
          </div>
          {isSold ? (
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1 cursor-not-allowed"
            >
              Sold Out 🚫
            </button>
          ) : isReserved ? (
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1 cursor-not-allowed"
            >
              Locked 🔒
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={classNames(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                inCart ? 'gold-gradient-bg text-charcoal' : 'bg-white/5 text-cream/70 hover:bg-gold-500/20 hover:text-gold-300'
              )}
              aria-label="Add to cart"
            >
              {inCart ? <FiEye size={16} /> : <FiShoppingBag size={16} />}
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default NumberCard;
