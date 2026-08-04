import { useState, useEffect } from 'react';
import { FiMail, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const STATUS_STYLE = {
  new: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  read: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  replied: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
};

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contact');
      setMessages(res.data?.data || res.data || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      fetchMessages();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = tab === 'all' ? messages : messages.filter(m => m.status === tab);
  const counts = { all: messages.length, new: messages.filter(m => m.status === 'new').length, read: messages.filter(m => m.status === 'read').length, replied: messages.filter(m => m.status === 'replied').length };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>✉️ Messages Inbox</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{counts.new} new messages</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[['all', `All (${counts.all})`], ['new', `New (${counts.new})`], ['read', `Read (${counts.read})`], ['replied', `Replied (${counts.replied})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              background: tab === key ? '#d4af37' : 'rgba(255,255,255,0.05)',
              color: tab === key ? '#000' : 'rgba(255,255,255,0.6)' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '48px' }}>Loading messages...</p> :
        filtered.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '48px' }}>No messages in this category.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(msg => {
              const s = STATUS_STYLE[msg.status] || STATUS_STYLE.new;
              const isExpanded = expandedId === msg._id;
              return (
                <div key={msg._id} style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                    onClick={() => { setExpandedId(isExpanded ? null : msg._id); if (msg.status === 'new') updateStatus(msg._id, 'read'); }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <p style={{ fontWeight: 700, margin: 0, fontSize: '15px' }}>{msg.name}</p>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, background: s.bg, color: s.color, textTransform: 'capitalize' }}>{msg.status}</span>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>{msg.email} · {msg.phone || ''} · {new Date(msg.createdAt).toLocaleDateString()}</p>
                      {!isExpanded && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '8px 0 0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '600px' }}>
                        <strong>{msg.subject}:</strong> {msg.message}
                      </p>}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '16px' }}>{isExpanded ? <FiChevronUp /> : <FiChevronDown />}</span>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                      <p style={{ fontWeight: 700, color: '#d4af37', margin: '16px 0 8px' }}>{msg.subject}</p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: '0 0 16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>{msg.message}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {msg.status !== 'replied' && (
                          <button onClick={() => updateStatus(msg._id, 'replied')}
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiCheck /> Mark as Replied
                          </button>
                        )}
                        {msg.status === 'new' && (
                          <button onClick={() => updateStatus(msg._id, 'read')}
                            style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default AdminMessages;
