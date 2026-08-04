import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const TestimonialCard = ({ name, city, text, stars = 5 }) => (
  <div
    className="rounded-xl p-7 text-left relative overflow-hidden"
    style={{ background: 'rgba(12,12,12,0.95)', border: '1px solid rgba(212,175,55,0.15)' }}
  >
    <div className="text-[#d4af37] text-5xl font-display absolute top-3 left-5 opacity-15 leading-none select-none">&ldquo;</div>
    <p className="text-sm text-white/65 leading-relaxed mb-5 pt-5 relative z-10">{text}</p>
    <div className="flex text-[#d4af37] text-sm mb-2">{'★'.repeat(stars)}</div>
    <h4 className="text-[#d4af37] font-bold text-xs tracking-[0.2em] uppercase">{name}</h4>
    {city && <p className="text-white/30 text-[10px] mt-0.5">{city}</p>}
  </div>
);

export default TestimonialCard;
