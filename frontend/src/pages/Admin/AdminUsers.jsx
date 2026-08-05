import { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiPlus, FiEdit2, FiTrash2, FiShield, FiUserCheck, FiUserX, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data?.data || res.data || []);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenAddModal = () => {
    setEditUser(null);
    setFormData({ name: '', email: '', password: '', phone: '', role: 'admin' });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditUser(user);
    setFormData({ name: user.name || '', email: user.email || '', password: '', phone: user.phone || '', role: user.role || 'user' });
    setShowModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return toast.error('Name and Email are required');
    if (!editUser && !formData.password) return toast.error('Password is required for new accounts');

    setSubmitting(true);
    try {
      if (editUser) {
        await api.put(`/users/${editUser._id}`, formData);
        toast.success('User updated successfully!');
      } else {
        await api.post('/users', formData);
        toast.success('User/Admin created successfully!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this account permanently?')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/users/${user._id}`, { role: newRole });
      toast.success(`Role updated to ${newRole.toUpperCase()}`);
      fetchUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const toggleStatus = async (user) => {
    try {
      await api.put(`/users/${user._id}/status`, { isActive: !user.isActive });
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const filtered = users.filter(u =>
    !search || (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === 'admin').length;
  const activeCount = users.filter(u => u.isActive !== false).length;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>👥 Users & Admins Manager</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Create, edit, change roles, or manage all platform accounts</p>
        </div>
        <button onClick={handleOpenAddModal}
          style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37)', color: '#000', border: 'none', borderRadius: '10px', padding: '12px 20px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(212,175,55,0.2)' }}>
          <FiPlus style={{ fontSize: '18px' }} /> Add User / Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Accounts', value: users.length, icon: '👥' },
          { label: 'Admin Accounts', value: adminCount, icon: '👑' },
          { label: 'Active Users', value: activeCount, icon: '✅' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '28px' }}>{s.icon}</span>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0, textTransform: 'uppercase' }}>{s.label}</p>
              <p style={{ color: '#d4af37', fontSize: '24px', fontWeight: 800, margin: 0 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input type="text" placeholder="Search accounts by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', padding: '12px 14px 12px 40px', color: '#fff', fontSize: '14px', outline: 'none' }} />
      </div>

      {/* Table */}
      <div style={{ background: '#111', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                {['Account Name', 'Email', 'Phone', 'Role', 'Auth', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading accounts...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No matching accounts found.</td></tr>
              ) : filtered.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.role === 'admin' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)', border: user.role === 'admin' ? '1px solid #d4af37' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: user.role === 'admin' ? '#d4af37' : '#fff', flexShrink: 0 }}>
                        {initials(user.name)}
                      </div>
                      <div style={{ maxWidth: '180px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={user.name}>{user.name}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={user.email}>{user.email}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{user.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => toggleRole(user)} title="Click to toggle role"
                      style={{ border: 'none', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', background: user.role === 'admin' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)', color: user.role === 'admin' ? '#d4af37' : 'rgba(255,255,255,0.6)' }}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      {user.authProvider === 'google' ? '🔵 Google' : '🔑 Email'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: user.isActive !== false ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: user.isActive !== false ? '#4ade80' : '#f87171' }}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOpenEditModal(user)} title="Edit Account"
                        style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>
                        <FiEdit2 />
                      </button>
                      <button onClick={() => toggleStatus(user)} title={user.isActive !== false ? 'Deactivate' : 'Activate'}
                        style={{ background: user.isActive !== false ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)', color: user.isActive !== false ? '#eab308' : '#4ade80', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>
                        {user.isActive !== false ? <FiUserX /> : <FiUserCheck />}
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} title="Delete Account"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#111116', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', maxWidth: '450px', width: '100%', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.9)', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}>
              <FiX />
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#d4af37', margin: '0 0 20px' }}>
              {editUser ? '✏️ Edit Account' : '👑 Add New Account'}
            </h2>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" required
                  style={{ width: '100%', background: '#08080b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" required
                  style={{ width: '100%', background: '#08080b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {editUser ? 'Password (Leave blank to keep unchanged)' : 'Password'}
                </label>
                <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••••••" required={!editUser}
                  style={{ width: '100%', background: '#08080b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>Phone Number (Optional)</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 9876543210"
                  style={{ width: '100%', background: '#08080b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>Account Role</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{ width: '100%', background: '#08080b', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', padding: '12px', color: '#d4af37', fontSize: '14px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}>
                  <option value="admin">👑 Admin (Full Access)</option>
                  <option value="user">👤 Regular User</option>
                </select>
              </div>

              <button type="submit" disabled={submitting}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f5d76e, #d4af37)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '14px', cursor: submitting ? 'wait' : 'pointer', marginTop: '8px' }}>
                {submitting ? 'Saving...' : editUser ? 'Update Account' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
