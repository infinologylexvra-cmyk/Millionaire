import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiHeart,
  FiShoppingBag,
  FiShield,
  FiLock,
  FiTruck,
  FiSmartphone,
  FiMapPin,
  FiTag,
  FiHash,
  FiGrid,
  FiAlertCircle,
} from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/Common/EmptyState';
import Button from '../../components/Buttons/Button';
import NumberCard from '../../components/Cards/NumberCard';
import numberService from '../../services/numberService';
import { getErrorMessage } from '../../services/api';
import { formatINR } from '../../utils/formatPrice';
import { classNames } from '../../utils/helpers';
import { ROUTES } from '../../constants/routes';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import useAuth from '../../hooks/useAuth';

const patternStyles = {
  VIP: 'text-gold-300 border-gold-400/40 bg-gold-400/10',
  Platinum: 'text-gold-200 border-gold-300/40 bg-gold-300/10',
  Gold: 'text-gold-400 border-gold-500/40 bg-gold-500/10',
  Fancy: 'text-pink-300 border-pink-400/30 bg-pink-400/10',
  Silver: 'text-slate-300 border-slate-400/30 bg-slate-400/10',
  Business: 'text-blue-300 border-blue-400/30 bg-blue-400/10',
  Wedding: 'text-rose-300 border-rose-400/30 bg-rose-400/10',
  Trending: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
};

const formatPhone = (num = '') => num.replace(/(\d{5})(\d{5})/, '$1 $2');

const SpecRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm py-1">
    <span className="flex items-center gap-2 text-cream/50">
      <span className="text-gold-400">{icon}</span>
      {label}
    </span>
    <span className="text-cream font-medium">{value ?? '—'}</span>
  </div>
);

const TrustBadge = ({ icon, label }) => (
  <div className="flex flex-col items-center text-center gap-2 card-surface rounded-xl p-4">
    <span className="text-gold-400 text-lg">{icon}</span>
    <span className="text-[11px] text-cream/60 leading-tight">{label}</span>
  </div>
);

const NumberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [number, setNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    setNumber(null);
    setRelated([]);

    numberService
      .getNumber(id)
      .then((res) => {
        if (!ignore) setNumber(res.data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err, 'Number not found'));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (!number) return;
    let ignore = false;
    const categoryParam =
      (typeof number.category === 'object' ? number.category?.slug || number.category?._id : number.category) || undefined;

    numberService
      .getNumbers({ category: categoryParam, limit: 5 })
      .then((res) => {
        if (!ignore) {
          const filtered = (res.data || []).filter((n) => n._id !== number._id).slice(0, 4);
          setRelated(filtered);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [number]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-28">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !number) {
    return (
      <div className="max-w-3xl mx-auto px-5 pt-32 pb-20">
        <EmptyState
          icon={<FiAlertCircle />}
          title="Number not found"
          description="This number may have been sold or removed from the marketplace."
          action={<Button to={ROUTES.NUMBERS}>Browse Numbers</Button>}
        />
      </div>
    );
  }

  const inCart = isInCart(number._id);
  const wishlisted = isWishlisted(number._id);
  const hasDiscount = number.originalPrice > number.price;
  const discountPercent = hasDiscount
    ? Math.round(((number.originalPrice - number.price) / number.originalPrice) * 100)
    : 0;
  const categoryName = typeof number.category === 'object' ? number.category?.name : number.category;
  const isLocked = number.isSold || (number.isReserved && number.reservedBy && number.reservedBy !== user?._id);

  const handleCartAction = () => {
    if (isLocked) {
      toast.error('This number is currently locked/reserved by another customer');
      return;
    }
    if (inCart) {
      navigate(ROUTES.CART);
      return;
    }
    addToCart(number);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (isLocked) {
      toast.error('This number is currently locked/reserved by another customer');
      return;
    }
    if (!inCart) addToCart(number);
    navigate(ROUTES.CHECKOUT);
  };

  const handleWishlist = async () => {
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
    <>
      <SEO title={`${formatPhone(number.phoneNumber)} - Premium ${number.pattern} Number`} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-28 pb-20">
        {isLocked && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold flex items-center gap-3">
            <FiLock size={20} className="shrink-0" />
            <span>This number is currently locked/reserved by another customer who is completing their purchase.</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Showcase */}
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative card-surface dotted-bg rounded-3xl p-10 overflow-hidden">
              <span
                className={classNames(
                  'inline-block text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full border mb-8',
                  patternStyles[number.pattern] || 'text-cream/60 border-white/15 bg-white/5'
                )}
              >
                {number.pattern}
              </span>
              <p className="font-display gold-gradient-text text-4xl sm:text-5xl tracking-wide mb-8 break-all">
                {formatPhone(number.phoneNumber)}
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-cream/60">
                <div className="flex items-center gap-2">
                  <FiSmartphone className="text-gold-400" />
                  <span>{number.operator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gold-400" />
                  <span>{number.circle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                {hasDiscount && (
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-cream/40 line-through text-sm">{formatINR(number.originalPrice)}</span>
                    <span className="text-xs text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  </div>
                )}
                <p className="font-display text-gold-400 text-3xl">{formatINR(number.price)}</p>
              </div>
              <button
                onClick={handleWishlist}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-gold-500/10 text-cream/60 hover:text-gold-400 transition-colors shrink-0"
                aria-label="Wishlist"
              >
                <FiHeart size={20} className={wishlisted ? 'fill-gold-500 text-gold-500' : ''} />
              </button>
            </div>

            <div className="card-surface rounded-2xl p-6 mb-6 space-y-3 divide-y divide-white/5">
              <SpecRow icon={<FiGrid />} label="Category" value={categoryName} />
              <SpecRow icon={<FiSmartphone />} label="Operator" value={number.operator} />
              <SpecRow icon={<FiMapPin />} label="Circle" value={number.circle} />
              <SpecRow icon={<FiTag />} label="Pattern" value={number.pattern} />
              <SpecRow icon={<FiHash />} label="Digit Sum" value={number.digitSum} />
            </div>

            {number.description && (
              <p className="text-cream/60 text-sm leading-relaxed mb-6">{number.description}</p>
            )}

            <div className="grid grid-cols-3 gap-3 mb-8">
              <TrustBadge icon={<FiShield />} label="Verified Seller" />
              <TrustBadge icon={<FiLock />} label="Secure Payment" />
              <TrustBadge icon={<FiTruck />} label="Free Porting Assistance" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="dark" size="lg" onClick={handleCartAction} disabled={isLocked} className="flex-1">
                <FiShoppingBag /> {isLocked ? 'Locked 🔒' : inCart ? 'Go to Cart' : 'Add to Cart'}
              </Button>
              <Button variant="primary" size="lg" onClick={handleBuyNow} disabled={isLocked} className="flex-1">
                {isLocked ? 'Reserved' : 'Buy Now'}
              </Button>
            </div>
          </div>
        </motion.div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl text-cream mb-6">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((n, i) => (
                <NumberCard key={n._id} number={n} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NumberDetails;
