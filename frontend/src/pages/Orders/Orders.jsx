import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SEO from '../../components/Common/SEO';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/Common/EmptyState';
import Button from '../../components/Buttons/Button';
import orderService from '../../services/orderService';
import { getErrorMessage } from '../../services/api';
import { formatINR } from '../../utils/formatPrice';
import { formatDate, classNames } from '../../utils/helpers';
import { ROUTES } from '../../constants/routes';

const formatPhone = (num = '') => String(num).replace(/(\d{5})(\d{5})/, '$1 $2');

const STATUS_STYLES = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  processing: 'bg-blue-500/15 text-blue-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  delivered: 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getOrders();
      setOrders(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SEO title="My Orders" />
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SEO title="My Orders" />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Start browsing to find your perfect number."
          action={<Button to={ROUTES.NUMBERS}>Browse Numbers</Button>}
        />
      ) : (
        orders.map((order) => {
          const isExpanded = expandedId === order._id;
          const statusClass = STATUS_STYLES[order.orderStatus] || 'bg-white/10 text-cream/60';

          return (
            <div key={order._id} className="card-surface rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-cream font-display text-lg">{order.orderNumber}</p>
                  <p className="text-xs text-cream/50">{formatDate(order.createdAt)}</p>
                </div>
                <span
                  className={classNames(
                    'text-xs px-3 py-1 rounded-full uppercase tracking-wide',
                    statusClass
                  )}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-cream/60">{order.items?.length || 0} number(s)</span>
                <span className="text-gold-400 font-semibold">{formatINR(order.totalAmount)}</span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                >
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </Button>
                {order.orderStatus === 'pending' && order.paymentStatus !== 'paid' && (
                  <Button
                    size="sm"
                    variant="danger"
                    loading={cancellingId === order._id}
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>

              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-white/10 space-y-5">
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wide text-cream/40">Items</h4>
                    {order.items?.map((item, idx) => (
                      <div key={item._id || idx} className="flex items-center justify-between text-sm">
                        <span className="text-cream/70">
                          {formatPhone(item.number?.phoneNumber || item.phoneNumber)}
                        </span>
                        <span className="text-cream font-medium">{formatINR(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  {order.customerDetails && (
                    <div className="space-y-1">
                      <h4 className="text-xs uppercase tracking-wide text-cream/40 mb-2">
                        Delivery Details
                      </h4>
                      <p className="text-sm text-cream/70">{order.customerDetails.fullName}</p>
                      <p className="text-sm text-cream/70">{order.customerDetails.phone}</p>
                      <p className="text-sm text-cream/70">
                        {order.customerDetails.address}, {order.customerDetails.city},{' '}
                        {order.customerDetails.state} - {order.customerDetails.pincode}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
