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
const AmazonPayIcon = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Amazon_Pay_logo.svg";
const BhimIcon = "https://upload.wikimedia.org/wikipedia/commons/e/e9/BHIM_logo.svg";
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
    if (!utrNumber.trim()) return toast.error('Please enter 12-digit UTR / Transaction number');

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('utrNumber', utrNumber.trim());

      await api.post(`/orders/${orderId}/submit-payment`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('UTR Number submitted successfully!');
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit UTR number');
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
      case 'Amazon Pay': return `amazonpay://pay?${upiBase}`;
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

              {/* UPI Apps Section - 4 Apps Launcher */}
              <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#d4af37', letterSpacing: '0.05em' }}>
                    ⚡ ONE-TAP DIRECT APP LAUNCHER
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.3)' }}>
                    Auto ₹{amount.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  {[
                    { name: 'PhonePe', icon: PhonePeIcon, bg: 'rgba(95, 37, 159, 0.25)', border: 'rgba(168, 85, 247, 0.4)' },
                    { name: 'GPay', icon: GPayIcon, bg: 'rgba(66, 133, 244, 0.25)', border: 'rgba(59, 130, 246, 0.4)' },
                    { name: 'Paytm', icon: PaytmIcon, bg: 'rgba(0, 186, 242, 0.25)', border: 'rgba(6, 182, 212, 0.4)' },
                    { name: 'BHIM', icon: '/bhim_logo.jpg', bg: 'rgba(5, 150, 105, 0.25)', border: 'rgba(16, 185, 129, 0.4)' },
                  ].map((app) => (
                    <a
                      key={app.name}
                      href={getAppIntent(app.name === 'GPay' ? 'Google Pay' : app.name)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-decoration-none"
                      style={{
                        background: app.bg,
                        border: `1px solid ${app.border}`,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        textDecoration: 'none',
                        minHeight: '100px'
                      }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 overflow-hidden bg-black/60 p-1.5 border border-white/10 shrink-0">
                        <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-white text-xs font-bold tracking-wide text-center">{app.name}</span>
                    </a>
                  ))}
                </div>

                {/* Direct Full Width UPI Launcher Button */}
                <a
                  href={upiLink}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm text-black transition-all hover:opacity-90 active:scale-98 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                    textDecoration: 'none'
                  }}
                >
                  <span>⚡</span>
                  <span>Pay ₹{amount.toLocaleString()} via Any Installed UPI App</span>
                  <span>🚀</span>
                </a>
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
                  { icon: <FiUploadCloud />, title: '2. Submit UTR', desc: 'Enter 12-digit UTR Number after payment' },
                  { icon: <FiClock />, title: '3. We Will Verify', desc: 'We will verify your UTR and confirm your order' }
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
              <FiUploadCloud style={{ fontSize: '20px' }} /> I Have Paid — Enter UTR Number
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
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔢</div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#d4af37', margin: '0 0 12px', fontFamily: 'serif' }}>Enter UTR Number</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>Enter 12-digit UTR/Transaction Reference number to confirm your payment of ₹{amount.toLocaleString()}</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>12-Digit UTR / Transaction Reference No.</span>
                <input type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} placeholder="e.g. 509124067312"
                  style={{ background: '#000', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '10px', padding: '16px', color: '#fff', fontSize: '20px', fontFamily: 'monospace', letterSpacing: '0.08em', outline: 'none', textAlign: 'center' }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0, textAlign: 'center' }}>Find the 12-digit UTR/Ref number in your PhonePe / GPay / Paytm / BHIM transaction history.</p>
              </label>
            </div>

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', padding: '18px', background: submitting ? '#8a7530' : '#d4af37', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '16px', cursor: submitting ? 'wait' : 'pointer', marginBottom: '16px', boxShadow: '0 4px 12px rgba(212,175,55,0.2)' }}>
              {submitting ? 'Submitting...' : '📨 Submit UTR & Verify'}
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
