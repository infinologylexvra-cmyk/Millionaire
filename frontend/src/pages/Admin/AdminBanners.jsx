import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const defaultForm = { title: '', subtitle: '', ctaText: '', ctaLink: '', order: 0, isActive: true };

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings/banners?all=true');
      setBanners(res.data?.data || res.data || []);
    } catch { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingId(banner._id);
      setFormData({ title: banner.title || '', subtitle: banner.subtitle || '', ctaText: banner.ctaText || '', ctaLink: banner.ctaLink || '', order: banner.order || 0, isActive: banner.isActive ?? true });
      setImagePreview(banner.image || '');
    } else {
      setEditingId(null);
      setFormData(defaultForm);
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await api.put(`/settings/banners/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner updated!');
      } else {
        await api.post('/settings/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner created!');
      }
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/settings/banners/${id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch { toast.error('Failed to delete banner'); }
  };

  const inputStyle = { width: '100%', background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>🖼️ Banners Manager</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Upload and manage homepage slider banners</p>
        </div>
        <button onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#d4af37', color: '#000', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          <FiPlus /> Add Banner
        </button>
      </div>

      {loading ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '48px' }}>Loading banners...</p> :
        banners.length === 0 ? (
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', padding: '48px', textAlign: 'center' }}>
            <FiImage style={{ fontSize: '40px', color: 'rgba(255,255,255,0.1)', marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>No banners yet. Click "Add Banner" to upload one.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {banners.map(banner => (
              <div key={banner._id} style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ height: '150px', background: '#1a1a1a', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FiImage style={{ fontSize: '40px', color: 'rgba(255,255,255,0.1)' }} />
                  )}
                  <span style={{ position: 'absolute', top: '8px', right: '8px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: banner.isActive ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)', color: '#fff' }}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span style={{ position: 'absolute', top: '8px', left: '8px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: 'rgba(0,0,0,0.7)', color: '#d4af37' }}>
                    #{banner.order}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px', color: '#d4af37' }}>{banner.title}</p>
                  {banner.subtitle && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 12px' }}>{banner.subtitle}</p>}
                  {banner.ctaText && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 12px' }}>CTA: {banner.ctaText} → {banner.ctaLink}</p>}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    <button onClick={() => handleOpenModal(banner)} style={{ flex: 1, background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <FiEdit2 /> Edit
                    </button>
                    <button onClick={() => handleDelete(banner._id)} style={{ flex: 1, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.85)' }}>
          <div style={{ background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.2)', position: 'sticky', top: 0, zIndex: 10, borderRadius: '16px 16px 0 0' }}>
              <h3 style={{ margin: 0, color: '#d4af37', fontWeight: 700 }}>{editingId ? 'Edit Banner' : 'Add Banner'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '20px' }}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Image Upload */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Banner Image</p>
                {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
                <input type="file" accept="image/*" onChange={handleFileChange}
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', width: '100%' }} />
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Title *</span>
                <input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Subtitle</span>
                <input value={formData.subtitle} onChange={e => setFormData(p => ({ ...p, subtitle: e.target.value }))} style={inputStyle} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>CTA Button Text</span>
                  <input value={formData.ctaText} onChange={e => setFormData(p => ({ ...p, ctaText: e.target.value }))} style={inputStyle} placeholder="e.g. Shop Now" />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>CTA Link</span>
                  <input value={formData.ctaLink} onChange={e => setFormData(p => ({ ...p, ctaLink: e.target.value }))} style={inputStyle} placeholder="/numbers" />
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Display Order</span>
                  <input type="number" value={formData.order} onChange={e => setFormData(p => ({ ...p, order: Number(e.target.value) }))} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '20px' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} style={{ width: '18px', height: '18px', accentColor: '#d4af37' }} />
                  <span style={{ fontSize: '14px' }}>Active</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '12px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                  {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
