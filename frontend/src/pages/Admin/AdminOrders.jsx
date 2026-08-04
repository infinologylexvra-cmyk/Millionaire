import { useState, useEffect } from 'react';
import { FiShoppingBag, FiX, FiSearch, FiRefreshCw, FiDollarSign, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const STATUS_COLORS = {
  pending: { bg: 'rgba(234,179,8,0.15)', color: '#facc15' },
  processing: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  delivered: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  paid: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  failed: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  refunded: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  approved: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  screenshot_uploaded: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  utr_submitted: { bg: 'rgba(234,179,8,0.15)', color: '#facc15' },
};

const ORDER_STATUSES = ['pending', 'processing', 'confirmed', 'delivered', 'cancelled'];

const Badge = ({ status }) => {
  const style = STATUS_COLORS[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize', background: style.bg, color: style.color }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ orderStatus: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data?.data || res.data || []);
    } catch {
      toast.error('Failed to load orders. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusForm({ orderStatus: order.orderStatus, note: '' });
    setShowModal(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, statusForm);
      toast.success('Order status updated!');
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyPayment = async (orderId, action) => {
    try {
      await api.put(`/orders/${orderId}/verify-payment`, { action });
      toast.success(`Payment ${action === 'approve' ? 'approved' : 'rejected'}!`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to verify payment');
    }
  };

  const filtered = orders.filter(o =>
    !search || (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.customerDetails?.fullName || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid' || o.paymentVerificationStatus === 'approved').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingPayments = orders.filter(o => o.paymentVerificationStatus === 'screenshot_uploaded' || o.paymentVerificationStatus === 'utr_submitted').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>📦 Orders Manager</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{filtered.length} orders total</p>
        </div>
        <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Orders', value: orders.length, icon: '📦', color: '#60a5fa' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: '#d4af37' },
          { label: 'Awaiting Verification', value: pendingPayments, icon: '⏳', color: '#facc15' },
          { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length, icon: '✅', color: '#4ade80' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '28px' }}>{s.icon}</span>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: '22px', fontWeight: 800, margin: 0 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input type="text" placeholder="Search by order number or customer name..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 14px 10px 40px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
      </div>

      {/* Table */}
      <div style={{ background: '#111', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No orders found.</div>
        ) : (
          filtered.map(order => (
            <div key={order._id} style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 0.8fr 1fr 1fr 1fr', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}>
                <div>
                  <p style={{ fontWeight: 700, color: '#d4af37', margin: 0, fontSize: '13px' }}>#{order.orderNumber}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: '13px' }}>{order.customerDetails?.fullName}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>{order.customerDetails?.phone}</p>
                </div>
                <div>
                  {order.items?.map((item, i) => <p key={i} style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#d4af37' }}>{item.phoneNumber}</p>)}
                </div>
                <p style={{ fontWeight: 700, color: '#d4af37', margin: 0 }}>₹{order.totalAmount?.toLocaleString()}</p>
                <Badge status={order.paymentVerificationStatus || order.paymentStatus} />
                <Badge status={order.orderStatus} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={(e) => { e.stopPropagation(); openStatusModal(order); }}
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    Update
                  </button>
                </div>
              </div>

              {/* Expanded payment verification */}
              {expandedId === order._id && (
                <div style={{ padding: '16px 24px 24px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                  <p style={{ color: '#d4af37', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>Payment Details</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>Payment Method</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{order.paymentMethod || 'UPI/QR'}</p>
                    </div>
                    {order.utrNumber && (
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>UTR Number</p>
                        <p style={{ margin: 0, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>{order.utrNumber}</p>
                      </div>
                    )}
                    {order.paymentScreenshot && (
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase' }}>Payment Screenshot</p>
                        <a href={order.paymentScreenshot} target="_blank" rel="noreferrer">
                          <img src={order.paymentScreenshot} alt="Screenshot" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)' }} />
                        </a>
                      </div>
                    )}
                    {(order.paymentVerificationStatus === 'screenshot_uploaded' || order.paymentVerificationStatus === 'utr_submitted') && (
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <button onClick={() => handleVerifyPayment(order._id, 'approve')}
                          style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700 }}>
                          ✅ Approve Payment
                        </button>
                        <button onClick={() => handleVerifyPayment(order._id, 'reject')}
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700 }}>
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Status Update Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.85)' }}>
          <div style={{ background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '440px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 style={{ margin: 0, color: '#d4af37', fontWeight: 700 }}>Update Order Status</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '20px' }}><FiX /></button>
            </div>
            <form onSubmit={handleStatusUpdate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Order #{selectedOrder?.orderNumber}</p>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Order Status</span>
                <select value={statusForm.orderStatus} onChange={e => setStatusForm(p => ({ ...p, orderStatus: e.target.value }))}
                  style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                  {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Note (optional)</span>
                <textarea value={statusForm.note} onChange={e => setStatusForm(p => ({ ...p, note: e.target.value }))} rows="3"
                  style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '12px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                  {submitting ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
