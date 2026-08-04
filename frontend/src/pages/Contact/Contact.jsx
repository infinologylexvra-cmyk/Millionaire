import { useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-3 my-3 opacity-70">
    <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
    <FaCrown className="text-[#d4af37] text-xs" />
    <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
  </div>
);

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: connect to API
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f0e1] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">Custom Requests</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            REQUEST A <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NUMBER</span>
          </h1>
          <GoldDivider />
          <p className="text-white/40 text-sm max-w-xl mx-auto mt-4">Have specific requirements for a VIP number? Send us a message and we will suggest the perfect number according to your needs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: FiPhone, label: 'Phone', val: '+91 98886 95199' },
              { icon: FiMail, label: 'Email', val: 'hello@millionairenumbers.in' },
              { icon: FiMapPin, label: 'Address', val: 'SBP City Center Sector 115 Mohali Kharar Landran Road' },
            ].map(({ icon: Icon, label, val }, i) => (
              <div key={i} className="flex gap-4 items-start rounded-xl p-5" style={{ background: 'rgba(15,15,15,0.9)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                  <Icon className="text-[#d4af37] text-sm" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm text-white/80">{val}</p>
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded text-white text-sm font-bold uppercase tracking-widest transition hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.738 5.467 2.027 7.77L0 32l8.473-2.003A15.937 15.937 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5 rounded-xl p-8" style={{ background: 'rgba(12,12,12,0.95)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h3 className="text-[#d4af37] font-display text-xl mb-2">Request A Number</h3>
            <div className="p-1">
              <label className="block text-xs uppercase tracking-widest text-[#d4af37] mb-2 font-semibold">Your Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#d4af37]" />
            </div>
            <div className="grid grid-cols-2 gap-4 p-1">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#d4af37] mb-2 font-semibold">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#d4af37]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#d4af37] mb-2 font-semibold">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#d4af37]" />
              </div>
            </div>
            <div className="p-1">
              <label className="block text-xs uppercase tracking-widest text-[#d4af37] mb-2 font-semibold">Your Requirements (Name, DOB, Lucky Numbers, etc)</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#d4af37] resize-none" />
            </div>
            <button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 bg-[#d4af37] text-black font-bold py-4 rounded-lg uppercase tracking-wider text-sm transition-transform active:scale-95">
              {sent ? <><FiCheckCircle /> Request Sent!</> : <><FiSend /> Send Request</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
