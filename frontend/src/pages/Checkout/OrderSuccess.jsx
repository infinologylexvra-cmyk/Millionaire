import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/Common/EmptyState';
import Button from '../../components/Buttons/Button';
import orderService from '../../services/orderService';
import { formatINR } from '../../utils/formatPrice';
import { ROUTES } from '../../constants/routes';

const formatPhone = (num = '') => String(num).replace(/(\d{5})(\d{5})/, '$1 $2');

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await orderService.getOrder(id);
        if (mounted) setOrder(res.data);
      } catch (err) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (error || !order) {
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-5 text-center">
        <SEO title="Order Confirmed" />
        <EmptyState
          title="Couldn't load this order"
          description="Please check My Orders to view your order details."
          action={<Button to={ROUTES.ACCOUNT_ORDERS}>View My Orders</Button>}
        />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-2xl mx-auto px-5 text-center">
      <SEO title="Order Confirmed" />

      <div className="mx-auto mb-6 w-20 h-20 rounded-full gold-gradient-bg flex items-center justify-center shadow-gold-lg">
        <FiCheck className="text-charcoal" size={36} />
      </div>

      <h1 className="font-display text-3xl text-cream mb-3">
        Order <span className="gold-gradient-text">Confirmed!</span>
      </h1>
      <p className="text-cream/60 text-sm">
        Your order {order.orderNumber} has been placed successfully.
      </p>

      <div className="card-surface rounded-2xl p-6 text-left my-8">
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div key={item._id || idx} className="flex items-center justify-between text-sm">
              <span className="text-cream/70">
                {formatPhone(item.number?.phoneNumber || item.phoneNumber)}
              </span>
              <span className="text-cream font-medium">{formatINR(item.price)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3">
          <span className="text-cream font-semibold">Total</span>
          <span className="text-gold-400 font-display text-xl">{formatINR(order.totalAmount)}</span>
        </div>
      </div>

      <p className="text-cream/50 text-sm mb-8">
        Our team will reach out within 24-48 hours to complete number porting/activation
        formalities. You can track this order anytime from My Orders.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Button to={ROUTES.ACCOUNT_ORDERS}>View My Orders</Button>
        <Button variant="outline" to={ROUTES.NUMBERS}>
          Continue Browsing
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
