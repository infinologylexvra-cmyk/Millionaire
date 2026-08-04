import { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiShield, FiUserX, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>👥 Users Manager</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Manage all registered users</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Users', value: users.length, icon: '👥' },
          { label: 'Admin Users', value: adminCount, icon: '👑' },
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

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 14px 10px 40px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
      </div>

      {/* Table */}
      <div style={{ background: '#111', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                {['User', 'Email', 'Phone', 'Role', 'Auth', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading users...</td></tr>
              ) : filtered.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.role === 'admin' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: user.role === 'admin' ? '#d4af37' : '#fff', flexShrink: 0 }}>
                        {initials(user.name)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{user.email}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{user.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: user.role === 'admin' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.08)', color: user.role === 'admin' ? '#d4af37' : 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
                      {user.role === 'admin' ? '👑 Admin' : 'User'}
                    </span>
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
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => toggleStatus(user)}
                      style={{ background: user.isActive !== false ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: user.isActive !== false ? '#f87171' : '#4ade80', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {user.isActive !== false ? <><FiUserX /> Deactivate</> : <><FiUserCheck /> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
