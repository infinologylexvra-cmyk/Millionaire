import { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const generateDobNumbers = (dobStr) => {
  if (!dobStr) return [];
  // dobStr is YYYY-MM-DD
  const [year, month, day] = dobStr.split('-');
  const y2 = year.slice(2);
  const patterns = [
    `98${day}${month}${year}`,
    `99${year}${month}${day}`,
    `98${y2}${month}${day}00`,
    `97${day}${month}${y2}99`,
    `88${month}${day}${year}`
  ];
  return patterns.map((num) => ({
    number: num.replace(/(\d{4})(\d{4})(\d{2})/, '$1 $2 $3'),
    raw: num,
    price: '₹1,999'
  }));
};

const DobNumberGenerator = () => {
  const [dob, setDob] = useState('');
  const [generated, setGenerated] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!dob) return;
    setIsGenerating(true);
    setGenerated([]);

    // Fake loading delay for effect
    setTimeout(() => {
      setGenerated(generateDobNumbers(dob));
      setIsGenerating(false);
    }, 800);
  };

  useEffect(() => {
    if (generated.length > 0 && resultsRef.current) {
      gsap.fromTo(resultsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [generated]);

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#0a0a0a] border-y border-[#d4af37]/20">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f5d76e]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
          Get Your <span style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37, #b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Date of Birth</span> Number
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto mb-10">
          Enter your birth date and our system will generate 5 exclusive VIP numbers containing your special day.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="relative w-full sm:w-auto">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37] text-lg" />
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full sm:w-72 bg-black/50 border border-[#d4af37]/30 text-white rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-[#d4af37] transition"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37)', boxShadow: '0 4px 20px rgba(212,175,55,0.2)' }}
          >
            {isGenerating ? 'Generating...' : 'Generate Numbers'} <FiArrowRight />
          </button>
        </form>

        {generated.length > 0 && (
          <div ref={resultsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {generated.map((item, i) => (
              <div
                key={i}
                className="bg-black border border-[#d4af37]/20 rounded-xl p-5 text-center flex flex-col items-center hover:border-[#d4af37]/60 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FiCalendar className="text-[#d4af37]" />
                </div>
                <p className="text-white font-bold text-lg mb-1 tracking-wider">{item.number}</p>
                <p className="text-[#d4af37] text-sm font-semibold mb-4">{item.price}</p>
                <button
                  onClick={() => navigate(`/checkout?number=${item.raw}`)}
                  className="w-full py-2 border border-[#d4af37]/50 text-[#d4af37] rounded-lg text-xs font-bold uppercase hover:bg-[#d4af37] hover:text-black transition flex items-center justify-center gap-2"
                >
                  <FiShoppingCart /> Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DobNumberGenerator;
