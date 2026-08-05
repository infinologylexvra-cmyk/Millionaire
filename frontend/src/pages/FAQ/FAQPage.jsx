import { useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-3 my-3 opacity-70">
    <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
    <FaCrown className="text-[#d4af37] text-xs" />
    <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
  </div>
);

const FAQS = [
  { q: 'What are VIP / Fancy numbers?', a: 'VIP or fancy numbers are special mobile numbers with memorable patterns like repeating digits, sequential sequences, or mirror patterns. They are often considered prestigious and are priced higher than regular numbers.' },
  { q: 'How do I purchase a number?', a: 'Simply browse our collection, select your favourite number, add it to cart, and complete the checkout. We will then contact you for document verification before SIM activation.' },
  { q: 'Is the payment secure?', a: 'Yes! We use secure direct UPI and encrypted payment channels to ensure your payment information is always safe.' },
  { q: 'How long does delivery take?', a: 'Once verification is complete, your SIM is typically delivered within 2-5 business days anywhere in India.' },
  { q: 'Can I return a purchased number?', a: 'Due to the unique and exclusive nature of VIP numbers, returns are only accepted if the number delivered does not match what was ordered. Please read our Refund Policy for full details.' },
  { q: 'Do you support all operators?', a: 'Yes, we carry numbers from all major Indian telecom operators including Airtel, Jio, Vi (Vodafone-Idea), and BSNL.' },
  { q: 'Is the number genuine and working?', a: 'Absolutely. Every number listed on our platform is 100% genuine, verified, and ready for activation.' },
  { q: 'Can I use a VIP number for porting?', a: 'Yes, you can port your existing number to a VIP number as per TRAI porting guidelines. We will guide you through the process.' },
];

const FAQPage = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f0e1] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">Got Questions?</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            FREQUENTLY <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ASKED</span>
          </h1>
          <GoldDivider />
          <p className="text-white/40 text-sm mt-4">Everything you need to know about Millionaire Numbers.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden transition"
              style={{ background: 'rgba(12,12,12,0.95)', border: open === i ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.07)' }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-medium text-white">{q}</span>
                {open === i ? <FiChevronUp className="text-[#d4af37] shrink-0" /> : <FiChevronDown className="text-white/30 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-sm text-white/55 leading-relaxed">{a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
