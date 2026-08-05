import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const OPERATORS = ['Jio', 'Airtel', 'Vi', 'BSNL'];
const PATTERNS = ['VIP', 'Fancy', 'Gold', 'Silver', 'Platinum', 'Business', 'Wedding', 'Trending'];

const defaultForm = {
  phoneNumber: '',
  price: '',
  originalPrice: '',
  operator: 'Jio',
  pattern: 'VIP',
  category: '',
  circle: 'All India',
  description: '',
  isFeatured: false,
};

const AdminNumbers = () => {
  const [numbers, setNumbers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [numRes, catRes] = await Promise.all([
        api.get('/numbers?limit=200&includesSold=true'),
        api.get('/categories'),
      ]);
      const nums = numRes.data?.data || numRes.data || [];
      const cats = catRes.data?.data || catRes.data || [];
      setNumbers(nums);
      setCategories(cats);
      // Set default category if not set
      if (cats.length > 0) {
        setFormData(prev => ({ ...prev, category: cats[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (num = null) => {
    if (num) {
      setEditingId(num._id);
      setFormData({
        phoneNumber: num.phoneNumber || '',
        price: num.price || '',
        originalPrice: num.originalPrice || '',
        operator: num.operator || 'Jio',
        pattern: num.pattern || 'VIP',
        category: num.category?._id || num.category || (categories[0]?._id || ''),
        circle: num.circle || 'All India',
        description: num.description || '',
        isFeatured: num.isFeatured || false,
      });
    } else {
      setEditingId(null);
      setFormData({
        ...defaultForm,
        category: categories[0]?._id || '',
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      return toast.error('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
      };
      if (editingId) {
        await api.put(`/numbers/${editingId}`, payload);
        toast.success('Number updated successfully!');
      } else {
        await api.post('/numbers', payload);
        toast.success('Number added successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save. Check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this number?')) return;
    try {
      await api.delete(`/numbers/${id}`);
      toast.success('Number deleted successfully!');
      setNumbers(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      toast.error('Failed to delete. Try again.');
    }
  };

  const filtered = numbers.filter(n =>
    !search || (n.phoneNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>📱 Numbers Inventory</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>
            {filtered.length} numbers total — Add, Edit, or Delete VIP numbers.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#d4af37', color: '#000', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}
        >
          <FiPlus /> Add New Number
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input
          type="text"
          placeholder="Search by phone number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 14px 10px 40px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#111', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                {['Phone Number', 'Price', 'Operator', 'Pattern', 'Category', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} style={{ padding: '14px 16px' }}>
                        <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    <FiPhone style={{ fontSize: '32px', marginBottom: '8px', display: 'block', margin: '0 auto 12px' }} />
                    {search ? 'No numbers found matching your search.' : 'No numbers in inventory. Click "Add New Number" to get started.'}
                  </td>
                </tr>
              ) : (
                filtered.map(num => (
                  <tr key={num._id} style={{ borderBottom: '1px solid rgba(212,175,55,0.08)', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 700, letterSpacing: '0.05em', fontSize: '15px' }}>
                      {num.phoneNumber}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#d4af37', fontWeight: 700 }}>
                      ₹{num.price?.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(255,255,255,0.08)' }}>
                        {num.operator}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      {num.pattern}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      {num.category?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {num.isFeatured ? (
                        <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>Yes</span>
                      ) : (
                        <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>No</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start' }}>
                        <button
                          onClick={() => handleOpenModal(num)}
                          style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(num._id)}
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(212,175,55,0.2)', background: '#1a1a1a', position: 'sticky', top: 0, zIndex: 10, borderRadius: '16px 16px 0 0' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#d4af37' }}>
                {editingId ? '✏️ Edit Number' : '➕ Add New Number'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center' }}>
                <FiX />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phone Number *</span>
                  <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    placeholder="e.g. 9898111111"
                    style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '16px', outline: 'none', fontWeight: 700, letterSpacing: '0.1em' }}
                  />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>10-digit Indian mobile number (6-9 series)</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Selling Price (₹) *</span>
                    <input required name="price" type="number" min="1" value={formData.price} onChange={handleChange}
                      placeholder="e.g. 1999"
                      style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#d4af37', fontSize: '15px', fontWeight: 700, outline: 'none' }}
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Original Price (₹)</span>
                    <input name="originalPrice" type="number" min="0" value={formData.originalPrice} onChange={handleChange}
                      placeholder="e.g. 2999"
                      style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '15px', outline: 'none' }}
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Operator *</span>
                    <select required name="operator" value={formData.operator} onChange={handleChange}
                      style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                    >
                      {OPERATORS.map(op => <option key={op}>{op}</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pattern *</span>
                    <select required name="pattern" value={formData.pattern} onChange={handleChange}
                      style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                    >
                      {PATTERNS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </label>
                </div>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category *</span>
                  {categories.length === 0 ? (
                    <p style={{ color: '#f87171', fontSize: '12px' }}>⚠️ No categories found. Please add categories first.</p>
                  ) : (
                    <select required name="category" value={formData.category} onChange={handleChange}
                      style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                    >
                      {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                  )}
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Circle / Region</span>
                  <input name="circle" value={formData.circle} onChange={handleChange}
                    placeholder="e.g. All India, Delhi, Mumbai..."
                    style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</span>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
                    placeholder="Brief description of what makes this number special..."
                    style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#d4af37' }}
                  />
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>⭐ Mark as Featured (shown on homepage)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting || categories.length === 0}
                  style={{ flex: 2, padding: '12px', background: submitting ? '#8a7530' : '#d4af37', color: '#000', border: 'none', borderRadius: '8px', cursor: submitting ? 'wait' : 'pointer', fontWeight: 700, fontSize: '15px', letterSpacing: '0.05em' }}
                >
                  {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNumbers;
