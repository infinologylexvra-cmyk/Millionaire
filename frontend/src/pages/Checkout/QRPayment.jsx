import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { FiShield, FiCheckCircle, FiUploadCloud, FiClock, FiLock, FiCheck } from 'react-icons/fi';

// Reliable Icon Sources
const GPayIcon = "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg";
const PhonePeIcon = "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg";
const PaytmIcon = "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg";
// Using base64 for BHIM and generic UPI to prevent hotlinking breaks
const BhimIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRjE4MjI2IiBkPSJNMzQwLjUgMTEwaC0xNTh2MjY3bDExOS0xMzVoMzl6Ii8+PHBhdGggZmlsbD0iIzI3QTE1OSIgZD0iTTE4Mi41IDI1OHYxNDRoMTk4TDI0NSAyNTh6Ii8+PC9zdmc+";
const UpiIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj48cGF0aCBmaWxsPSIjMTMzYzY0IiBkPSJNMTQ0IDYwaDkydjQwSDExOHYxNDBINzhWMzBoMTMweiIvPjwvc3ZnPg==";

const CircularTimer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Max time = 300s (5 mins)
  const percentage = (timeLeft / 300) * 100;
  const strokeDasharray = `${(percentage * 251) / 100} 251`;

  return (
    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' }}>
      <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(212,175,55,0.2)" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#d4af37"
          strokeWidth="6"
          strokeDasharray={strokeDasharray}
          style={{ transition: 'stroke-dasharray 1s linear' }}
        />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', lineHeight: 1 }}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>MIN : SEC</span>
      </div>
    </div>
  );
};

const QRPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('qr');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [method, setMethod] = useState('screenshot');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now()); // to regenerate QR

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

  useEffect(() => {
    if (step !== 'qr' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Restart timer and regenerate QR
          setRefreshKey(Date.now());
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (method === 'utr' && !utrNumber.trim()) return toast.error('Please enter UTR/Transaction number');
    if (method === 'screenshot' && !screenshot) return toast.error('Please upload payment screenshot');

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (method === 'utr') formData.append('utrNumber', utrNumber.trim());
      else formData.append('screenshot', screenshot);

      await api.post(`/orders/${orderId}/submit-payment`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Payment details submitted!');
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>Loading...</div>
  );

  const upiId = settings?.upiId || 'deepakne97614@nyes';
  const upiName = settings?.upiName || 'Millionaire Numbers';
  const amount = order?.totalAmount || 0;
  
  const dynamicTr = `MN${order?.orderNumber}${refreshKey}`;
  const upiBase = `pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tr=${dynamicTr}`;
  const upiLink = `upi://pay?${upiBase}`;

  const getAppIntent = (appName) => {
    switch (appName) {
      case 'Google Pay': return `gpay://upi/pay?${upiBase}`;
      case 'PhonePe': return `phonepe://pay?${upiBase}`;
      case 'Paytm': return `paytmmp://pay?${upiBase}`;
      case 'BHIM': return `bhim://pay?${upiBase}`;
      default: return upiLink;
    }
  };

  const containerStyle = { background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', color: '#f5f0e1', fontFamily: 'sans-serif', padding: '32px 16px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>

        {step === 'qr' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <FiShield style={{ fontSize: '48px', color: '#d4af37', marginBottom: '16px' }} />
              <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#d4af37', margin: '0 0 8px', fontFamily: 'serif' }}>Secure Payment</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '15px' }}>Order ID: #{order?.orderNumber}</p>
            </div>

            {/* Total Amount Box */}
            <div style={{ ...containerStyle, textAlign: 'center', position: 'relative' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: '0 0 16px' }}>Total Amount to Pay</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#d4af37', textShadow: '0 0 20px rgba(212,175,55,0.3)', lineHeight: 1 }}>
                  ₹{amount.toLocaleString()}
                </span>
                <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
              </div>
            </div>

            {/* QR & Timer Box */}
            <div style={{ ...containerStyle, padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <span style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></span>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Scan & Pay with UPI</p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', justifyContent: 'center' }}>
                {/* QR Section */}
                <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 0 30px rgba(212,175,55,0.4)', border: '2px solid #d4af37', position: 'relative' }}>
                  <QRCodeSVG 
                    value={upiLink} 
                    size={220} 
                    level="H"
                    imageSettings={{
                      src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d4af37'><path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/></svg>",
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </div>

                {/* Timer Section */}
                <div style={{ flex: 1, minWidth: '220px', textAlign: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '16px' }}>Payment expires in</p>
                  <CircularTimer timeLeft={timeLeft} />
                  <div style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.05)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left' }}>
                    <FiShield style={{ color: '#d4af37', fontSize: '20px', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                      <strong style={{ color: '#d4af37' }}>Complete the payment within 5 minutes.</strong> This QR code will expire automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* OR Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '40px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ padding: '0 16px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* UPI Apps Grid */}
              <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 20px' }}>Pay using UPI Apps</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                  { name: 'Google Pay', icon: GPayIcon },
                  { name: 'PhonePe', icon: PhonePeIcon },
                  { name: 'Paytm', icon: PaytmIcon },
                  { name: 'BHIM', icon: BhimIcon },
                  { name: 'Any UPI App', icon: UpiIcon },
                ].map((app) => (
                  <a key={app.name} href={getAppIntent(app.name)}
                       style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s', textDecoration: 'none' }}>
                    <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <img src={app.icon} alt={app.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>{app.name}</span>
                  </a>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                <FiLock style={{ color: '#d4af37' }} />
                You will be redirected to the selected app to complete the payment
              </div>
            </div>

            {/* After Payment Steps */}
            <div style={{ ...containerStyle, padding: '32px' }}>
              <h3 style={{ textAlign: 'center', color: '#d4af37', fontSize: '18px', margin: '0 0 32px' }}>After Payment</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '24px', left: '15%', right: '15%', height: '1px', borderTop: '2px dashed rgba(212,175,55,0.3)', zIndex: 0 }} />
                
                {[
                  { icon: <FiCheckCircle />, title: '1. Make Payment', desc: 'Complete the payment using UPI' },
                  { icon: <FiUploadCloud />, title: '2. Submit Proof', desc: 'Click on the button below and upload screenshot' },
                  { icon: <FiClock />, title: '3. We Will Verify', desc: 'We will verify your payment and confirm your order' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '30%', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0b0b0b', border: '1px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#d4af37', marginBottom: '16px' }}>
                      {step.icon}
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 8px' }}>{step.title}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <button onClick={() => setStep('confirm')}
              style={{ width: '100%', padding: '18px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FiUploadCloud style={{ fontSize: '20px' }} /> I Have Paid — Submit Proof
            </button>
            <button onClick={() => navigate(-1)}
              style={{ width: '100%', padding: '16px', background: 'transparent', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
              ← Go Back
            </button>
          </>
        )}

        {step === 'confirm' && (
          <div style={{ ...containerStyle, padding: '40px 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📤</div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: '0 0 12px', fontFamily: 'serif' }}>Submit Proof</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>Upload screenshot or enter UTR to confirm your payment of ₹{amount.toLocaleString()}</p>
            </div>

            <div style={{ display: 'flex', background: '#000', borderRadius: '10px', padding: '6px', marginBottom: '24px', gap: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setMethod('screenshot')}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s', background: method === 'screenshot' ? '#d4af37' : 'transparent', color: method === 'screenshot' ? '#000' : 'rgba(255,255,255,0.5)' }}>
                📸 Screenshot
              </button>
              <button onClick={() => setMethod('utr')}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s', background: method === 'utr' ? '#d4af37' : 'transparent', color: method === 'utr' ? '#000' : 'rgba(255,255,255,0.5)' }}>
                🔢 UTR Number
              </button>
            </div>

            {method === 'screenshot' ? (
              <div style={{ marginBottom: '32px' }}>
                {screenshotPreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={screenshotPreview} alt="Screenshot" style={{ width: '100%', height: '300px', objectFit: 'contain', background: '#000', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', marginBottom: '12px' }} />
                    <button onClick={() => { setScreenshot(null); setScreenshotPreview(''); }} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>Change Image</button>
                  </div>
                ) : (
                  <label style={{ display: 'block', background: '#000', border: '2px dashed rgba(212,175,55,0.4)', borderRadius: '12px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <FiUploadCloud style={{ fontSize: '48px', color: '#d4af37', marginBottom: '16px' }} />
                    <p style={{ color: '#d4af37', fontWeight: 600, margin: '0 0 8px', fontSize: '16px' }}>Click to upload payment screenshot</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>JPG, PNG, WEBP accepted</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>UTR / Transaction Reference No.</span>
                  <input type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} placeholder="e.g. 509124067312"
                    style={{ background: '#000', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '10px', padding: '16px', color: '#fff', fontSize: '18px', fontFamily: 'monospace', letterSpacing: '0.05em', outline: 'none' }} />
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Find the 12-digit UTR/Ref number in your UPI app transaction history.</p>
                </label>
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', padding: '18px', background: submitting ? '#8a7530' : '#d4af37', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '16px', cursor: submitting ? 'wait' : 'pointer', marginBottom: '16px', boxShadow: '0 4px 12px rgba(212,175,55,0.2)' }}>
              {submitting ? 'Submitting...' : '📨 Submit Payment Details'}
            </button>
            <button onClick={() => setStep('qr')}
              style={{ width: '100%', padding: '16px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
              ← Cancel & Go Back
            </button>
          </div>
        )}

        {/* Footer info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
          {[
            { icon: '🔒', title: '100% Secure', desc: 'Your payments are safe' },
            { icon: '⚡', title: 'Instant Verify', desc: 'We verify quickly' },
            { icon: '🎧', title: '24/7 Support', desc: 'Here to help you' },
            { icon: '⭐', title: 'Trusted', desc: 'By 1000+ customers' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#d4af37', margin: '0 0 2px' }}>{item.title}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default QRPayment;
