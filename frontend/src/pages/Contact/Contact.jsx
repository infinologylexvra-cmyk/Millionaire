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
          <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            CONTACT <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>US</span>
          </h1>
          <GoldDivider />
          <p className="text-white/40 text-sm max-w-xl mx-auto mt-4">Have a question or want to reserve a number? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: FiPhone, label: 'Phone', val: '+91 98765 43210' },
              { icon: FiMail, label: 'Email', val: 'hello@millionairenumbers.in' },
              { icon: FiMapPin, label: 'Address', val: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051, India' },
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
            <h3 className="text-[#d4af37] font-display text-xl mb-2">Send a Message</h3>
            {[
              { name: 'name', label: 'Your Name', type: 'text' },
              { name: 'email', label: 'Email Address', type: 'email' },
              { name: 'phone', label: 'Phone Number', type: 'tel' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1.5">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]/50 transition"
                  placeholder={label}
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1.5">Message</label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]/50 transition resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-bold uppercase tracking-widest text-black rounded transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)' }}
            >
              {sent ? <><FiCheckCircle /> Message Sent!</> : <><FiSend /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
