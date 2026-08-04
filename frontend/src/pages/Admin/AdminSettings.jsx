import { useState, useEffect } from 'react';
import { FiSave, FiGlobe, FiShare2, FiBarChart2, FiSearch, FiX, FiUploadCloud, FiEdit2, FiTrash2, FiImage, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const TABS = ['General', 'UPI & QR', 'Social Media', 'Stats', 'SEO'];

const AdminSettings = () => {
  const [tab, setTab] = useState('General');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data?.data || res.data);
    } catch { toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Settings saved successfully!');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const set = (path, value) => {
    setSettings(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let ref = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...ref[keys[i]] };
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const inputStyle = { width: '100%', background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
  const labelText = { fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', background: '#050505', minHeight: '100vh' }}>Loading settings...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: 0 }}>⚙️ Site Settings</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Configure your platform globally</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: saving ? '#8a7530' : '#d4af37', color: '#000', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
          <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: '#111', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
              background: tab === t ? '#d4af37' : 'transparent',
              color: tab === t ? '#000' : 'rgba(255,255,255,0.5)' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tab === 'General' && (
          <>
            <div style={gridStyle}>
              <label style={labelStyle}><span style={labelText}>Site Name</span><input value={settings.siteName || ''} onChange={e => set('siteName', e.target.value)} style={inputStyle} /></label>
              <label style={labelStyle}><span style={labelText}>Tagline</span><input value={settings.tagline || ''} onChange={e => set('tagline', e.target.value)} style={inputStyle} /></label>
            </div>
            <div style={gridStyle}>
              <label style={labelStyle}><span style={labelText}>Support Email</span><input value={settings.supportEmail || ''} onChange={e => set('supportEmail', e.target.value)} style={inputStyle} /></label>
              <label style={labelStyle}><span style={labelText}>Support Phone</span><input value={settings.supportPhone || ''} onChange={e => set('supportPhone', e.target.value)} style={inputStyle} /></label>
            </div>
            <div style={gridStyle}>
              <label style={labelStyle}><span style={labelText}>WhatsApp Number</span><input value={settings.whatsappNumber || ''} onChange={e => set('whatsappNumber', e.target.value)} style={inputStyle} /></label>
              <label style={labelStyle}><span style={labelText}>Address</span><input value={settings.address || ''} onChange={e => set('address', e.target.value)} style={inputStyle} /></label>
            </div>
            <div style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, margin: 0 }}>Maintenance Mode</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>When on, the site shows a maintenance message to all visitors.</p>
              </div>
              <div onClick={() => set('maintenanceMode', !settings.maintenanceMode)}
                style={{ width: '52px', height: '28px', borderRadius: '14px', background: settings.maintenanceMode ? '#d4af37' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: settings.maintenanceMode ? '27px' : '3px', transition: 'all 0.3s' }} />
              </div>
            </div>
          </>
        )}

        {tab === 'UPI & QR' && (
          <div style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ color: '#d4af37', margin: '0 0 20px', fontWeight: 700 }}>📱 UPI Payment Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={labelStyle}>
                <span style={labelText}>UPI ID</span>
                <input value={settings.upiId || ''} onChange={e => set('upiId', e.target.value)} placeholder="e.g. deepakne97614@nyes" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                <span style={labelText}>QR Code Image URL</span>
                <input value={settings.qrCodeUrl || ''} onChange={e => set('qrCodeUrl', e.target.value)} placeholder="https://..." style={inputStyle} />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Paste a direct image URL to your UPI QR code</span>
              </label>
              {settings.qrCodeUrl && (
                <div>
                  <p style={{ ...labelText, marginBottom: '8px' }}>QR Preview</p>
                  <img src={settings.qrCodeUrl} alt="QR Code" style={{ width: '180px', height: '180px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '8px' }} onError={e => e.target.style.display='none'} />
                </div>
              )}
              <label style={labelStyle}>
                <span style={labelText}>Account Holder Name</span>
                <input value={settings.upiName || ''} onChange={e => set('upiName', e.target.value)} placeholder="e.g. Deepak Kumar" style={inputStyle} />
              </label>
            </div>
          </div>
        )}

        {tab === 'Social Media' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['instagram', 'facebook', 'twitter', 'youtube'].map(key => (
              <label key={key} style={labelStyle}>
                <span style={labelText}>{key.charAt(0).toUpperCase() + key.slice(1)} URL</span>
                <input value={settings.socialLinks?.[key] || ''} onChange={e => set(`socialLinks.${key}`, e.target.value)} placeholder={`https://${key}.com/...`} style={inputStyle} />
              </label>
            ))}
          </div>
        )}

        {tab === 'Stats' && (
          <div style={gridStyle}>
            {[['trustedCustomers', 'Trusted Customers'], ['averageRating', 'Average Rating'], ['numbersSold', 'Numbers Sold'], ['citiesCovered', 'Cities Covered']].map(([key, label]) => (
              <label key={key} style={labelStyle}>
                <span style={labelText}>{label}</span>
                <input type="number" value={settings.stats?.[key] || ''} onChange={e => set(`stats.${key}`, Number(e.target.value))} style={inputStyle} />
              </label>
            ))}
          </div>
        )}

        {tab === 'SEO' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={labelStyle}>
              <span style={labelText}>Meta Title</span>
              <input value={settings.seo?.metaTitle || ''} onChange={e => set('seo.metaTitle', e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              <span style={labelText}>Meta Description</span>
              <textarea value={settings.seo?.metaDescription || ''} onChange={e => set('seo.metaDescription', e.target.value)} rows="4"
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }} />
            </label>
          </div>
        )}
      </div>

      {/* Save button bottom */}
      <div style={{ marginTop: '24px' }}>
        <button onClick={handleSave} disabled={saving}
          style={{ width: '100%', padding: '14px', background: saving ? '#8a7530' : '#d4af37', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>
          {saving ? 'Saving...' : '💾 Save All Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
