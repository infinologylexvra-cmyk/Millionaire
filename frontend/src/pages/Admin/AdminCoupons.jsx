import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '0',
    validUntil: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data.data || res.data || []);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingId(coupon._id);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType || 'percentage',
        discountValue: coupon.discountValue || '',
        minOrderAmount: coupon.minOrderAmount || '0',
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        isActive: coupon.isActive ?? true
      });
    } else {
      setEditingId(null);
      setFormData({
        code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '0', validUntil: '', isActive: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/coupons/${editingId}`, formData);
        toast.success('Coupon updated successfully');
      } else {
        await api.post('/coupons', formData);
        toast.success('Coupon created successfully');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (err) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#050505] text-[#f5f0e1]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#d4af37]">Coupons Manager</h1>
          <p className="text-white/50 text-sm mt-1">Create and manage discount codes for your customers.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2.5 rounded font-bold hover:bg-[#b8912a] transition-colors">
          <FiPlus /> Add Coupon
        </button>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#d4af37]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] border-b border-[#d4af37]/20">
                <th className="p-4 text-xs font-bold text-[#d4af37] uppercase tracking-wider">Code</th>
                <th className="p-4 text-xs font-bold text-[#d4af37] uppercase tracking-wider">Discount</th>
                <th className="p-4 text-xs font-bold text-[#d4af37] uppercase tracking-wider">Valid Until</th>
                <th className="p-4 text-xs font-bold text-[#d4af37] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-[#d4af37] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-white/50">Loading coupons...</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-white/50">No coupons found.</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-[#d4af37]/10 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold tracking-wider text-green-400">{coupon.code}</td>
                    <td className="p-4 text-[#d4af37]">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} OFF
                    </td>
                    <td className="p-4 text-white/70">
                      {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${coupon.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      <button onClick={() => handleOpenModal(coupon)} className="text-blue-400 hover:text-blue-300 p-2"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(coupon._id)} className="text-red-400 hover:text-red-300 p-2"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#d4af37]/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#d4af37]/20 bg-[#1a1a1a]">
              <h3 className="font-bold text-lg text-[#d4af37]">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase mb-2">Coupon Code</label>
                <input required type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-black border border-[#d4af37]/30 rounded p-3 text-white focus:outline-none focus:border-[#d4af37]" placeholder="e.g. SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase mb-2">Discount Type</label>
                  <select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} className="w-full bg-black border border-[#d4af37]/30 rounded p-3 text-white focus:outline-none focus:border-[#d4af37]">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase mb-2">Value</label>
                  <input required type="number" value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} className="w-full bg-black border border-[#d4af37]/30 rounded p-3 text-white focus:outline-none focus:border-[#d4af37]" placeholder="e.g. 20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase mb-2">Valid Until</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} className="w-full bg-black border border-[#d4af37]/30 rounded p-3 text-white focus:outline-none focus:border-[#d4af37]" style={{ colorScheme: 'dark' }} />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-[#d4af37]" />
                    <span className="text-white/80">Active</span>
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-[#d4af37] text-black font-bold uppercase tracking-widest rounded hover:bg-[#b8912a] transition-colors">
                  {editingId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
