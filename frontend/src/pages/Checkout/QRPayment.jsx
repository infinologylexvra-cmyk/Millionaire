import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const QRPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('qr'); // 'qr' | 'confirm'
  const [method, setMethod] = useState('screenshot'); // 'screenshot' | 'utr'
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          api.get(`/orders/${orderId}`),
          api.get('/settings'),
        ]);
        setOrder(orderRes.data?.data || orderRes.data);
        setSettings(settingsRes.data?.data || settingsRes.data);
      } catch {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (method === 'utr' && !utrNumber.trim()) {
      toast.error('Please enter UTR/Transaction number');
      return;
    }
    if (method === 'screenshot' && !screenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (method === 'utr') {
        formData.append('utrNumber', utrNumber.trim());
      } else {
        formData.append('screenshot', screenshot);
      }

      await api.post(`/orders/${orderId}/submit-payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Payment details submitted! Admin will verify shortly.');
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontSize: '18px' }}>
      Loading payment details...
    </div>
  );

  const upiId = settings?.upiId || 'deepakne97614@nyes';
  const qrCode = settings?.qrCodeUrl;
  const upiName = settings?.upiName || 'Millionaire Numbers';
  const amount = order?.totalAmount || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f0e1', fontFamily: 'sans-serif', padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>

        {step === 'qr' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(212,175,55,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>
                📱
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#d4af37', margin: '0 0 8px' }}>Pay via UPI</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Order #{order?.orderNumber}</p>
            </div>

            {/* Amount */}
            <div style={{ background: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Total Amount to Pay</p>
              <p style={{ fontSize: '40px', fontWeight: 800, color: '#d4af37', margin: 0 }}>₹{amount.toLocaleString()}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>
                {order?.items?.map(i => i.phoneNumber).join(', ')}
              </p>
            </div>

            {/* QR Code */}
            <div style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
              {qrCode ? (
                <>
                  <img src={qrCode} alt="UPI QR Code" style={{ width: '220px', height: '220px', objectFit: 'contain', background: '#fff', borderRadius: '12px', padding: '8px', margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 4px' }}>Scan with any UPI app</p>
                  <p style={{ color: '#d4af37', fontWeight: 700, fontSize: '14px', margin: 0 }}>{upiId}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '4px 0 0' }}>{upiName}</p>
                </>
              ) : (
                <>
                  <div style={{ width: '220px', height: '220px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '40px' }}>📷</span>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>QR not configured</p>
                  </div>
                  <p style={{ color: '#d4af37', fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>Pay to UPI ID:</p>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '18px', letterSpacing: '0.05em', margin: 0 }}>{upiId}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '4px 0 0' }}>{upiName}</p>
                </>
              )}
            </div>

            {/* Supported apps */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Supported Apps:</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" style={{ height: '16px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '16px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style={{ height: '12px', marginTop: '2px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="BHIM UPI" style={{ height: '16px' }} />
              </div>
            </div>

            <button onClick={() => setStep('confirm')}
              style={{ width: '100%', padding: '16px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 4px 12px rgba(212,175,55,0.2)' }}>
              ✅ I Have Paid — Submit Proof
            </button>
            <button onClick={() => navigate(-1)}
              style={{ width: '100%', padding: '12px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              ← Go Back
            </button>
          </>
        )}

        {step === 'confirm' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📤</div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#d4af37', margin: '0 0 8px' }}>Submit Payment Proof</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>Upload screenshot or enter UTR to confirm your payment of ₹{amount.toLocaleString()}</p>
            </div>

            {/* Method Toggle */}
            <div style={{ display: 'flex', background: '#111', borderRadius: '10px', padding: '4px', marginBottom: '20px', gap: '4px' }}>
              <button onClick={() => setMethod('screenshot')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                  background: method === 'screenshot' ? '#d4af37' : 'transparent',
                  color: method === 'screenshot' ? '#000' : 'rgba(255,255,255,0.5)' }}>
                📸 Upload Screenshot
              </button>
              <button onClick={() => setMethod('utr')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                  background: method === 'utr' ? '#d4af37' : 'transparent',
                  color: method === 'utr' ? '#000' : 'rgba(255,255,255,0.5)' }}>
                🔢 Enter UTR Number
              </button>
            </div>

            {method === 'screenshot' ? (
              <div style={{ marginBottom: '20px' }}>
                {screenshotPreview && (
                  <img src={screenshotPreview} alt="Screenshot" style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#111', borderRadius: '10px', marginBottom: '12px' }} />
                )}
                <label style={{ display: 'block', background: '#111', border: '2px dashed rgba(212,175,55,0.4)', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                  <p style={{ color: '#d4af37', fontWeight: 600, margin: '0 0 4px' }}>Click to upload screenshot</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>JPG, PNG, WEBP accepted</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>UTR / Transaction Reference Number</span>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                    placeholder="e.g. 509124067312"
                    style={{ background: '#111', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '10px', padding: '14px', color: '#fff', fontSize: '16px', fontFamily: 'monospace', letterSpacing: '0.05em', outline: 'none' }}
                  />
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>Find the UTR/Ref number in your UPI app transaction history</p>
                </label>
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', padding: '16px', background: submitting ? '#8a7530' : '#d4af37', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '16px', cursor: submitting ? 'wait' : 'pointer', marginBottom: '12px' }}>
              {submitting ? 'Submitting...' : '📨 Submit Payment Details'}
            </button>
            <button onClick={() => setStep('qr')}
              style={{ width: '100%', padding: '12px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              ← Back to QR Code
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QRPayment;
