import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiX } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import EmptyState from '../../components/Common/EmptyState';
import Button from '../../components/Buttons/Button';
import useCart from '../../hooks/useCart';
import { formatINR } from '../../utils/formatPrice';
import { ROUTES } from '../../constants/routes';

const formatPhone = (num = '') => String(num).replace(/(\d{5})(\d{5})/, '$1 $2');

const Cart = () => {
  const { items, count, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeFromCart(id);
    toast('Removed from cart');
  };

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-5 lg:px-8">
      <SEO title="Your Cart" />

      {items.length === 0 ? (
        <EmptyState
          icon={<FiShoppingBag />}
          title="Your cart is empty"
          description="Browse our exclusive collection of premium numbers."
          action={<Button to={ROUTES.NUMBERS}>Browse Numbers</Button>}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="card-surface rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="shrink-0 rounded-full border border-gold-500/30 text-gold-400 text-[11px] px-3 py-1 uppercase tracking-wide">
                    {item.pattern || 'Premium'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg text-cream truncate">
                      {formatPhone(item.phoneNumber)}
                    </p>
                    <p className="text-xs text-cream/50">
                      {item.operator} &middot; {item.circle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-gold-400 font-semibold">{formatINR(item.price)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item._id)}
                    className="text-cream/40 hover:text-red-400 transition-colors"
                    aria-label="Remove from cart"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card-surface rounded-2xl p-6 sticky top-28 space-y-5">
              <h2 className="font-display text-xl text-cream">Order Summary</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream/60">Subtotal ({count} numbers)</span>
                <span className="text-cream font-semibold">{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-cream/40">Coupons can be applied at checkout</p>
              <div className="space-y-3 pt-2">
                <Button className="w-full" onClick={() => navigate(ROUTES.CHECKOUT)}>
                  Proceed to Checkout
                </Button>
                <Button variant="ghost" className="w-full" to={ROUTES.NUMBERS}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
