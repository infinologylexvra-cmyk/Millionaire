import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

/* ─── City data with Unsplash city images ─── */
const CITIES = [
  {
    id: 'mumbai',
    region: 'WEST INDIA',
    name: 'Mumbai',
    operators: 'Airtel · Jio · Vi',
    from: '₹49,999',
    large: true,
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'delhi',
    region: 'NORTH INDIA',
    name: 'Delhi',
    operators: 'Airtel · Jio · BSNL',
    from: '₹29,999',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'bangalore',
    region: 'SOUTH INDIA',
    name: 'Bangalore',
    operators: 'Jio · Airtel · Vi',
    from: '₹19,999',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'hyderabad',
    region: 'SOUTH INDIA',
    name: 'Hyderabad',
    operators: 'Airtel · Jio',
    from: '₹14,999',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'kolkata',
    region: 'EAST INDIA',
    name: 'Kolkata',
    operators: 'BSNL · Airtel · Jio',
    from: '₹9,999',
    img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80&auto=format&fit=crop',
  },
];

const IndiaCitiesSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Heading entrance ── */
      gsap.from(headingRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
        },
      });

      /* ── Cards staggered entrance ── */
      const cards = gridRef.current.querySelectorAll('.city-card');
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
        },
      });

      /* ── Floating glow orbs ── */
      const orbs = sectionRef.current.querySelectorAll('.orb');
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? -20 : 20,
          x: i % 3 === 0 ? 15 : -15,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.4,
        });
      });

      /* ── Parallax shimmer lines ── */
      const lines = sectionRef.current.querySelectorAll('.shimmer-line');
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.5,
            delay: i * 0.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: line, start: 'top 85%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060606 0%, #080808 50%, #060606 100%)', borderTop: '1px solid rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.1)' }}
    >
      {/* ── Floating glow orbs ── */}
      <div className="orb absolute w-96 h-96 rounded-full pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle, #d4af37, transparent)', top: '10%', left: '-10%' }} />
      <div className="orb absolute w-72 h-72 rounded-full pointer-events-none opacity-8" style={{ background: 'radial-gradient(circle, #d4af37, transparent)', bottom: '10%', right: '-8%' }} />
      <div className="orb absolute w-48 h-48 rounded-full pointer-events-none opacity-6" style={{ background: 'radial-gradient(circle, #b8912a, transparent)', top: '50%', right: '20%' }} />

      {/* ── Dotted background ── */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.25) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* ── Heading ── */}
      <div ref={headingRef} className="relative z-10 text-center mb-14 max-w-4xl mx-auto">
        <div className="shimmer-line w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-5 origin-left" />
        <p className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase mb-3">Pan India Delivery</p>
        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-white">
          Where We{' '}
          <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Deliver
          </span>
        </h2>
        <p className="text-sm text-white/40 mt-4 max-w-lg mx-auto leading-relaxed">
          Premium VIP numbers available across every major Indian city — book yours and get it delivered to your door.
        </p>
        <div className="shimmer-line w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-5 origin-left" />
      </div>

      {/* ── City Cards Grid ── */}
      <div ref={gridRef} className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridTemplateRows: 'auto' }}>

          {/* Large featured card (Mumbai) */}
          <div
            className="city-card md:row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ minHeight: 480 }}
          >
            <img
              src={CITIES[0].img}
              alt={CITIES[0].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/80 transition-all duration-500" />
            {/* Gold shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), transparent)' }} />
            {/* Top badge */}
            <div className="absolute top-5 left-5">
              <span className="text-[9px] tracking-[0.35em] text-[#d4af37]/80 uppercase bg-black/40 px-3 py-1 rounded-full border border-[#d4af37]/20 backdrop-blur-sm">
                {CITIES[0].region}
              </span>
            </div>
            {/* Arrow icon */}
            <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
              <FiArrowUpRight className="text-white text-sm" />
            </div>
            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="shimmer-line w-12 h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-3 origin-left" />
              <h3 className="text-4xl font-display font-bold text-white mb-1">{CITIES[0].name}</h3>
              <p className="text-white/50 text-xs mb-3">{CITIES[0].operators}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">VIP Numbers</span>
                <span className="text-[#d4af37] font-bold text-sm">from {CITIES[0].from}</span>
              </div>
            </div>
          </div>

          {/* 4 smaller cards */}
          {CITIES.slice(1).map((city) => (
            <div
              key={city.id}
              className="city-card relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ minHeight: 220 }}
            >
              <img
                src={city.img}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 group-hover:from-black/80 transition-all duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), transparent)' }} />

              {/* Top badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[8px] tracking-[0.3em] text-[#d4af37]/70 uppercase bg-black/40 px-2.5 py-0.5 rounded-full border border-[#d4af37]/15 backdrop-blur-sm">
                  {city.region}
                </span>
              </div>

              {/* Arrow icon */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                <FiArrowUpRight className="text-white text-xs" />
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-2xl font-display font-bold text-white mb-0.5">{city.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 text-[10px]">{city.operators}</p>
                  <span className="text-[#d4af37] font-bold text-xs">from {city.from}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            to="/numbers"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-black rounded-full transition hover:opacity-90 hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', boxShadow: '0 4px 30px rgba(212,175,55,0.3)' }}
          >
            Explore All VIP Numbers <FiArrowUpRight className="text-base" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndiaCitiesSection;
