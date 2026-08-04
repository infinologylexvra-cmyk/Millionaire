import { useState, useEffect } from 'react';
import { FiStar, FiCheck, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Stars = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1,2,3,4,5].map(i => (
      <FiStar key={i} style={{ color: i <= rating ? '#d4af37' : 'rgba(255,255,255,0.15)', fill: i <= rating ? '#d4af37' : 'none', fontSize: '14px' }} />
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews?all=true');
      setReviews(res.data?.data || res.data || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const approve = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`);
      toast.success('Review approved!');
      fetchReviews();
    } catch { toast.error('Failed to approve'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch { toast.error('Failed to delete'); }
  };

  const pending = reviews.filter(r => !r.isApproved);
  const approved = reviews.filter(r => r.isApproved);
  const shown = tab === 'pending' ? pending : approved;

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>⭐ Reviews Manager</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Approve or delete customer testimonials</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[['pending', `Pending (${pending.length})`], ['approved', `Approved (${approved.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              background: tab === key ? '#d4af37' : 'rgba(255,255,255,0.05)',
              color: tab === key ? '#000' : 'rgba(255,255,255,0.6)' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '48px' }}>Loading reviews...</p> :
        shown.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '48px' }}>No {tab} reviews.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {shown.map(review => (
              <div key={review._id} style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 700, margin: 0, fontSize: '15px' }}>{review.name}</p>
                      <Stars rating={review.rating} />
                      {review.isApproved && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontWeight: 700 }}>✓ Approved</span>}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!review.isApproved && (
                      <button onClick={() => approve(review._id)}
                        style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiCheck /> Approve
                      </button>
                    )}
                    <button onClick={() => remove(review._id)}
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: '1.6', margin: 0, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default AdminReviews;
