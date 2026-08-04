import { FaCrown } from 'react-icons/fa';

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-3 my-3 opacity-70">
    <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
    <FaCrown className="text-[#d4af37] text-xs" />
    <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-display text-[#d4af37] mb-3">{title}</h2>
    <div className="text-sm text-white/60 leading-relaxed space-y-3">{children}</div>
  </div>
);

const RefundPolicy = () => (
  <div className="min-h-screen bg-[#050505] text-[#f5f0e1] pt-28 pb-20">
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-display font-bold mb-4">
          REFUND <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>POLICY</span>
        </h1>
        <GoldDivider />
        <p className="text-white/30 text-xs mt-4">Last updated: August 2026</p>
      </div>

      <Section title="1. General Policy">
        <p>Due to the exclusive and unique nature of VIP mobile numbers, all sales are generally considered final. Once a number has been allocated and the SIM activation process has begun, we cannot offer a refund.</p>
      </Section>
      <Section title="2. Eligibility for Refund">
        <p>A refund may be considered under the following circumstances:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>The number delivered does not match the number ordered.</li>
          <li>The operator is unable to activate the number due to technical issues.</li>
          <li>Duplicate payment was made for the same order.</li>
        </ul>
      </Section>
      <Section title="3. How to Request a Refund">
        <p>To request a refund, please email us at <a href="mailto:hello@millionairenumbers.in" className="text-[#d4af37] hover:underline">hello@millionairenumbers.in</a> within 7 days of your order with your order ID and the reason for the refund request.</p>
      </Section>
      <Section title="4. Refund Processing">
        <p>Once a refund is approved, it will be processed within 7-10 business days to your original payment method. We will notify you via email once the refund has been initiated.</p>
      </Section>
      <Section title="5. Contact Us">
        <p>If you have any questions about our Refund Policy, please contact our support team at <a href="mailto:hello@millionairenumbers.in" className="text-[#d4af37] hover:underline">hello@millionairenumbers.in</a> or call us at +91 98765 43210.</p>
      </Section>
    </div>
  </div>
);

export default RefundPolicy;
