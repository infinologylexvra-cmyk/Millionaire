import { Link, useNavigate } from 'react-router-dom';
import { FaCrown, FaGem, FaStar, FaHeart } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiCheckCircle, FiShield, FiPhoneCall, FiZap, FiChevronRight } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';
import { WHATSAPP_NUMBER } from '../../constants/config';
import CityNetworkMap from '../../components/CityNetworkMap/CityNetworkMap';
import IndiaCitiesSection from '../../components/IndiaCities/IndiaCitiesSection';
import DobNumberGenerator from '../../components/DobNumberGenerator/DobNumberGenerator';
import api from '../../services/api';

const VIP_NUMBERS = [
  { num: '9898 1111 11', op: 'AIRTEL', price: '₹11,999' },
  { num: '9810 9999 99', op: 'JIO', price: '₹7,999' },
  { num: '9920 7777 77', op: 'VI', price: '₹4,999' },
  { num: '9876 0000 00', op: 'BSNL', price: '₹2,499' },
];

const FEATURES = [
  { icon: FiShield, title: '100% TRUSTED', desc: 'Verified & Genuine Numbers' },
  { icon: FaGem, title: 'PREMIUM QUALITY', desc: 'Handpicked VIP Numbers' },
  { icon: FiPhoneCall, title: '24/7 SUPPORT', desc: "We're here to help you anytime" },
  { icon: FiZap, title: 'FAST DELIVERY', desc: 'Quick & Secure Activation' },
];

const CATEGORIES = [
  { title: 'PLATINUM', range: '₹8,000 – ₹11,999', icon: FaGem, color: 'text-[#e5e4e2]' },
  { title: 'GOLD', range: '₹5,000 – ₹7,999', icon: FaCrown, color: 'text-[#d4af37]' },
  { title: 'SILVER', range: '₹3,500 – ₹4,999', icon: FaStar, color: 'text-[#aaa9ad]' },
  { title: 'SPECIAL', range: '₹2,499 – ₹3,499', icon: FaHeart, color: 'text-[#d4af37]' },
];

const STEPS = [
  { step: '01', title: 'CHOOSE NUMBER', desc: 'Browse and select your favourite number' },
  { step: '02', title: 'MAKE PAYMENT', desc: 'Secure payment through our trusted gateway' },
  { step: '03', title: 'VERIFICATION', desc: 'We verify your details for activation' },
  { step: '04', title: 'GET YOUR SIM', desc: 'Receive your SIM at your doorstep' },
];

const TESTIMONIALS = [
  { name: 'RAHUL SHARMA', city: 'Mumbai', text: 'Got my dream number from Millionaire Numbers. Excellent service and genuine number!', stars: 5 },
  { name: 'PRIYA MEHTA', city: 'Delhi', text: 'Very professional and fast delivery. The number quality is exactly what they promise.', stars: 5 },
  { name: 'VIKAS MALHOTRA', city: 'New Delhi', text: 'Best platform for VIP numbers in India. 100% trustworthy and secure.', stars: 5 },
];

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-4 my-4 opacity-70">
    <span className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
    <FaCrown className="text-[#d4af37] text-sm" />
    <span className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
  </div>
);

const Home = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const [vipNumbers, setVipNumbers] = useState([]);

  useEffect(() => {
    // Fetch real VIP numbers
    api.get('/numbers?limit=4&minPrice=2499&sort=popular')
      .then(res => {
        if (res.data?.data) {
          setVipNumbers(res.data.data);
        }
      })
      .catch(err => console.error('Failed to fetch VIP numbers', err));
    const ctx = gsap.context(() => {
      // Animate text elements
      gsap.from(textRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });

      // Animate logo crest
      gsap.from(logoRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.5
      });
      
      // Floating animation for the logo
      gsap.to(logoRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
  <div className="min-h-screen bg-[#050505] text-[#f5f0e1]">

    {/* ── HERO ── */}
    <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden px-4 sm:px-6 pt-20 sm:pt-24 pb-10 sm:pb-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[#d4af37]/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-[#d4af37]/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 sm:gap-12 z-10 relative">
        {/* Left content */}
        <div ref={textRef} className="flex-1 text-center lg:text-left order-2 lg:order-1">
          <p className="text-[#d4af37] text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-5">
            Exclusive Numbers <span className="mx-1 sm:mx-2 opacity-50">•</span> Exclusive You
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6">
            INDIA'S <span className="block">PREMIUM</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #f5d76e 0%, #d4af37 45%, #b8912a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SIM NUMBERS
            </span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
            Choose from India's most exclusive and memorable mobile numbers. Stand out with a number that defines you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
            <Link
              to={ROUTES.NUMBERS}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider text-black transition hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37, #b8912a)', boxShadow: '0 4px 24px rgba(212,175,55,0.35)' }}
            >
              Explore Numbers <FiChevronRight />
            </Link>
          </div>
        </div>

        {/* Right – Logo Image */}
        <div className="flex-1 flex justify-center order-1 lg:order-2">
          <div
            ref={logoRef}
            className="relative w-48 h-48 sm:w-72 sm:h-72 md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full flex items-center justify-center p-1.5 sm:p-2"
            style={{ border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 0 80px rgba(212,175,55,0.12)' }}
          >
            {/* Outer rings */}
            <div className="absolute inset-1.5 sm:inset-2 rounded-full border border-[#d4af37]/20" />
            <div className="absolute inset-3 sm:inset-4 rounded-full border border-[#d4af37]/10" />
            
            {/* Logo Image */}
            <img 
              src="/logo.jpg" 
              alt="Millionaire Numbers Logo" 
              className="w-full h-full object-contain rounded-full relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] sm:drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            />
          </div>
        </div>
      </div>
    </section>

    {/* ── FEATURES BAR ── */}
    <section className="border-y border-[#d4af37]/20 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-[#d4af37]/30 flex items-center justify-center">
              <Icon className="text-[#d4af37] text-lg sm:text-2xl" />
            </div>
            <h4 className="text-[#d4af37] text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em]">{title}</h4>
            <p className="text-[10px] sm:text-[11px] text-white/40 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── CITY NETWORK MAP ── */}
    <CityNetworkMap />

    {/* ── VIP NUMBERS ── */}
    <section className="py-14 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-[#d4af37] mb-1">VIP SIM NUMBERS</h2>
        <GoldDivider />
        <p className="text-xs sm:text-sm text-white/40 mb-8 sm:mb-14">Select your dream number from our premium collection</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {(vipNumbers.length > 0 ? vipNumbers : VIP_NUMBERS).map((item, i) => {
            const isReal = !!item._id;
            const num = isReal ? item.phoneNumber : item.num;
            const op = isReal ? item.operator : item.op;
            const price = isReal ? `₹${item.price.toLocaleString()}` : item.price;
            
            return (
              <div
                key={isReal ? item._id : i}
                onClick={() => isReal ? navigate(`/numbers/${item._id}`) : navigate(ROUTES.NUMBERS)}
                className="relative rounded-xl p-5 sm:p-6 text-center group overflow-hidden transition duration-300 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'linear-gradient(180deg, rgba(25,25,25,0.95), rgba(12,12,12,0.98))',
                  border: '1px solid rgba(212,175,55,0.18)',
                }}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <p
                  className="text-xl sm:text-2xl font-bold tracking-widest mb-2"
                  style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {num}
                </p>
                <p className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-[0.3em] mb-2 sm:mb-3">{op}</p>
                <p className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">{price}</p>
                <button className="w-full py-2 text-xs font-bold uppercase tracking-wider border border-[#d4af37]/40 text-[#d4af37] rounded hover:bg-[#d4af37] hover:text-black transition">
                  {isReal ? 'Add to Cart / View' : 'View Details'}
                </button>
              </div>
            );
          })}
        </div>

        <Link
          to={ROUTES.NUMBERS}
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 border border-[#d4af37]/60 text-[#d4af37] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#d4af37]/10 transition"
        >
          View All Numbers <FiChevronRight />
        </Link>
      </div>
    </section>

    {/* ── DOB NUMBER GENERATOR ── */}
    <DobNumberGenerator />

    {/* ── INDIA CITIES (replaces phone mockup) ── */}
    <IndiaCitiesSection />


    {/* ── POPULAR CATEGORIES ── */}
    <section id="categories" className="py-14 sm:py-24 px-4 sm:px-6 bg-[#060606] border-y border-[#d4af37]/10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-[#d4af37] mb-1">POPULAR CATEGORIES</h2>
        <GoldDivider />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-8 sm:mt-14">
          {CATEGORIES.map(({ title, range, icon: Icon, color }, i) => (
            <div
              key={i}
              className="rounded-xl p-5 sm:p-8 text-center group cursor-pointer transition duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(180deg, rgba(22,22,22,0.9), rgba(10,10,10,0.95))',
                border: '1px solid rgba(212,175,55,0.18)',
              }}
            >
              <h3 className="text-[#d4af37] font-bold tracking-[0.15em] sm:tracking-[0.25em] text-xs sm:text-sm uppercase mb-0.5 sm:mb-1">{title}</h3>
              <p className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-wider mb-3 sm:mb-4">Numbers</p>
              <Icon className={`${color} text-2xl sm:text-4xl mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`} />
              <p className="text-[10px] sm:text-xs text-white/60 mb-5 sm:mb-8">{range}</p>
              <button className="w-full py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-[#d4af37]/40 text-[#d4af37] rounded hover:bg-[#d4af37] hover:text-black transition">
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── WHATSAPP CTA ── */}
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-white text-xs sm:text-sm font-bold shadow-xl transition hover:scale-105"
        style={{ background: '#25D366' }}
      >
        <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.738 5.467 2.027 7.77L0 32l8.473-2.003A15.937 15.937 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.67 0-5.163-.73-7.307-2.003l-.523-.313-5.03 1.19 1.213-4.91-.34-.543A13.26 13.26 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.71-10.013c-.417-.21-2.47-1.22-2.853-1.36-.383-.14-.66-.21-.94.21-.28.42-1.083 1.36-1.327 1.64-.243.28-.487.316-.904.105-.417-.21-1.763-.65-3.357-2.073-1.24-1.107-2.077-2.473-2.32-2.89-.243-.417-.026-.643.183-.85.187-.187.417-.487.627-.73.21-.243.28-.417.42-.7.14-.28.07-.523-.035-.73-.105-.21-.94-2.26-1.287-3.1-.34-.82-.683-.71-.94-.72l-.8-.014a1.533 1.533 0 00-1.107.517c-.383.417-1.46 1.427-1.46 3.48 0 2.053 1.493 4.04 1.703 4.32.21.28 2.94 4.49 7.12 6.3 1 .433 1.78.69 2.387.883.99.32 1.893.273 2.607.166.797-.12 2.47-1.01 2.82-1.983.35-.973.35-1.81.243-1.983-.105-.175-.383-.28-.8-.49z"/></svg>
        <span className="hidden sm:inline">WhatsApp Chat</span>
        <span className="sm:hidden">Chat</span>
      </a>
    </div>

  </div>
  );
};

export default Home;
