import { FaCrown, FaGem, FaStar, FaHeart } from 'react-icons/fa';
import { FiShield, FiPhoneCall, FiZap, FiCheckCircle, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-3 my-3 opacity-70">
    <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
    <FaCrown className="text-[#d4af37] text-xs" />
    <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
  </div>
);

const About = () => (
  <div className="min-h-screen bg-[#050505] text-[#f5f0e1] pt-28 pb-20">
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">Our Story</p>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
          ABOUT <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>US</span>
        </h1>
        <GoldDivider />
        <p className="text-white/50 max-w-2xl mx-auto text-sm leading-relaxed mt-4">
          India's most trusted marketplace for exclusive VIP, fancy and premium mobile numbers — verified sellers, secure payments, doorstep delivery.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
        <div>
          <h2 className="text-3xl font-display text-[#d4af37] mb-4">Our Mission</h2>
          <GoldDivider />
          <p className="text-white/60 leading-relaxed mt-6 mb-4">
            At Millionaire Numbers, we believe your phone number is more than a contact detail — it's an identity. We've made it our mission to connect you with numbers that make a statement.
          </p>
          <p className="text-white/60 leading-relaxed">
            Since our founding, we've delivered thousands of premium numbers to satisfied customers across India. Every number in our catalogue is verified, genuine, and ready for activation.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { val: '10,000+', label: 'Happy Customers' },
            { val: '50,000+', label: 'Premium Numbers' },
            { val: '5+', label: 'Years Experience' },
            { val: '4', label: 'Major Operators' },
          ].map(({ val, label }, i) => (
            <div key={i} className="rounded-xl p-6 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-3xl font-display font-bold" style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="text-center mb-20">
        <h2 className="text-3xl font-display text-[#d4af37] mb-1">WHY CHOOSE US</h2>
        <GoldDivider />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {[
            { icon: FiShield, title: '100% Trusted', desc: 'All numbers are verified and genuine before listing.' },
            { icon: FaGem, title: 'Premium Quality', desc: 'Hand-picked VIP numbers from top operators.' },
            { icon: FiPhoneCall, title: '24/7 Support', desc: 'Our team is always here to help you.' },
            { icon: FiZap, title: 'Fast Delivery', desc: 'Quick and secure SIM activation at your doorstep.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="rounded-xl p-6 text-center" style={{ background: 'rgba(15,15,15,0.9)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="w-12 h-12 rounded-full border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4">
                <Icon className="text-[#d4af37] text-xl" />
              </div>
              <h4 className="text-[#d4af37] text-sm font-bold mb-2">{title}</h4>
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

export default About;
