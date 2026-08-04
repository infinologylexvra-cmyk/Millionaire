import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingId(cat._id);
      setFormData({ name: cat.name || '', description: cat.description || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '' });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#050505] text-[#f5f0e1]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#d4af37]">Categories Manager</h1>
          <p className="text-white/50 text-sm mt-1">Manage number categories and their styling.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2.5 rounded font-bold hover:bg-[#b8912a] transition-colors">
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-white/50">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-white/50">No categories found.</p>
        ) : (
          categories.map(cat => (
            <div key={cat._id} className="bg-[#111] border border-[#d4af37]/20 rounded-xl overflow-hidden hover:border-[#d4af37]/50 transition-colors">
              <div className="h-32 bg-[#1a1a1a] relative flex items-center justify-center">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60" />
                ) : (
                  <FiImage className="text-4xl text-white/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#d4af37] mb-1">{cat.name}</h3>
                <p className="text-white/50 text-sm mb-4 line-clamp-2">{cat.description || 'No description provided.'}</p>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button onClick={() => handleOpenModal(cat)} className="text-blue-400 hover:text-blue-300"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#d4af37]/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#d4af37]/20 bg-[#1a1a1a]">
              <h3 className="font-bold text-lg text-[#d4af37]">{editingId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase mb-2">Category Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-[#d4af37]/30 rounded p-3 text-white focus:outline-none focus:border-[#d4af37]" placeholder="e.g. PLATINUM" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-[#d4af37]/30 rounded p-3 text-white focus:outline-none focus:border-[#d4af37]" rows="3" placeholder="Category description..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase mb-2">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#d4af37]/20 file:text-[#d4af37] hover:file:bg-[#d4af37]/30" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-[#d4af37] text-black font-bold uppercase tracking-widest rounded hover:bg-[#b8912a] transition-colors">
                  {editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
