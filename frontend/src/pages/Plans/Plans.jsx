import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaCrown, FaGem, FaStar, FaHeart } from 'react-icons/fa';
import { FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

gsap.registerPlugin(ScrollTrigger);

const PLANS = [
  {
    id: 'special',
    title: 'SPECIAL',
    icon: FaHeart,
    color: 'text-[#d4af37]',
    bgLight: 'bg-[#d4af37]/10',
    price: '₹500+',
    desc: 'Perfect for unique combinations and lucky digits.',
    features: [
      'Basic pattern matching',
      'Standard 3-5 days delivery',
      'All major operators',
      'Standard support'
    ]
  },
  {
    id: 'silver',
    title: 'SILVER',
    icon: FaStar,
    color: 'text-[#aaa9ad]',
    bgLight: 'bg-[#aaa9ad]/10',
    price: '₹2,000+',
    desc: 'Stand out with repeating pairs or triple digits.',
    features: [
      'Repeating 3-digit sequences',
      'Priority 2-3 days delivery',
      'Free operator porting',
      'Priority support'
    ]
  },
  {
    id: 'gold',
    title: 'GOLD',
    icon: FaCrown,
    color: 'text-[#d4af37]',
    bgLight: 'bg-[#d4af37]/20',
    price: '₹5,000+',
    desc: 'Highly memorable tetra (4-digit) repeating numbers.',
    popular: true,
    features: [
      'Tetra (4) repeating digits',
      'Next-day express delivery',
      'Zero porting charges',
      '24/7 dedicated manager'
    ]
  },
  {
    id: 'platinum',
    title: 'PLATINUM',
    icon: FaGem,
    color: 'text-[#e5e4e2]',
    bgLight: 'bg-[#e5e4e2]/20',
    price: '₹15,000+',
    desc: 'The ultimate flex. Penta or Hexa repeating digits.',
    features: [
      'Penta (5) or Hexa (6) digits',
      'Same-day VIP delivery',
      'Lifetime ownership guarantee',
      'Private account manager'
    ]
  }
];

const Plans = () => {
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(headerRef.current.children, 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.1
        }
      );

      // Cards entrance
      const cards = cardsRef.current.querySelectorAll('.plan-card');
      gsap.fromTo(cards, 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          delay: 0.4
        }
      );

      // Shimmer line animation
      gsap.fromTo('.shimmer-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power2.out', delay: 0.3 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#050505] pt-28 pb-24 px-6 text-[#f5f0e1] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#b8912a]/5 blur-[100px] pointer-events-none" />
      
      {/* Dotted Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 max-w-3xl mx-auto">
          <p className="text-[#d4af37] text-xs font-bold tracking-[0.4em] uppercase mb-4">Choose Your Identity</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
            VIP Number{' '}
            <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Categories
            </span>
          </h1>
          <div className="shimmer-line w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-6 origin-center" />
          <p className="text-white/60 leading-relaxed text-sm md:text-base">
            From special combinations to ultra-rare hexa digits, find the perfect category that matches your status and style.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`plan-card relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 group overflow-hidden ${plan.popular ? 'border-[#d4af37]' : 'border-[#d4af37]/20'}`}
                style={{
                  background: plan.popular 
                    ? 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(10,10,10,0.98))' 
                    : 'linear-gradient(180deg, rgba(15,15,15,0.8), rgba(8,8,8,0.9))',
                  borderWidth: '1px',
                  boxShadow: plan.popular ? '0 10px 40px rgba(212,175,55,0.1)' : 'none'
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#f5d76e] to-[#d4af37] text-black text-[9px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-bl-xl shadow-lg">
                    Most Popular
                  </div>
                )}

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-transparent to-[#d4af37]/5 pointer-events-none" />

                <div className={`w-14 h-14 rounded-xl ${plan.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`${plan.color} text-2xl`} />
                </div>
                
                <h3 className={`font-bold tracking-[0.2em] text-sm uppercase mb-2 ${plan.color}`}>{plan.title}</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-display font-bold text-white">
                    {plan.price}
                  </span>
                </div>
                
                <p className="text-white/40 text-xs leading-relaxed mb-8 h-10">
                  {plan.desc}
                </p>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <FiCheckCircle className="text-[#d4af37] text-sm shrink-0 mt-0.5" />
                      <span className="text-white/70 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`${ROUTES.NUMBERS}?category=${plan.title.toLowerCase()}`}
                  className="flex items-center justify-center w-full py-3.5 rounded text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  style={{
                    background: plan.popular 
                      ? 'linear-gradient(135deg, #f5d76e, #d4af37)' 
                      : 'transparent',
                    color: plan.popular ? '#000' : '#d4af37',
                    border: plan.popular ? 'none' : '1px solid rgba(212,175,55,0.4)',
                  }}
                >
                  Explore {plan.title}
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Plans;
