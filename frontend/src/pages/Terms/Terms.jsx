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

const Terms = () => (
  <div className="min-h-screen bg-[#050505] text-[#f5f0e1] pt-28 pb-20">
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-display font-bold mb-4">
          TERMS OF <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SERVICE</span>
        </h1>
        <GoldDivider />
        <p className="text-white/30 text-xs mt-4">Last updated: August 2026</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>By accessing or using Millionaire Numbers ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the Platform.</p>
      </Section>
      <Section title="2. Use of the Platform">
        <p>You may use the Platform only for lawful purposes. You agree not to use the Platform in any way that could damage, disable, or impair the Platform, or interfere with any other party's use of it.</p>
      </Section>
      <Section title="3. Purchases & Payments">
        <p>All purchases are subject to availability. We reserve the right to refuse or cancel an order at any time. Payments are processed securely through Direct UPI / PhonePe / GPay. By completing a purchase, you represent that you are authorised to use the payment method provided.</p>
      </Section>
      <Section title="4. Number Activation">
        <p>VIP numbers are subject to telecom operator availability and regulatory approval. While we endeavour to fulfil all orders, Millionaire Numbers cannot guarantee activation timelines that are under the operator's control.</p>
      </Section>
      <Section title="5. Intellectual Property">
        <p>All content on the Platform, including text, graphics, logos, and images, is the property of Millionaire Numbers and is protected by applicable intellectual property laws.</p>
      </Section>
      <Section title="6. Limitation of Liability">
        <p>Millionaire Numbers shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Platform.</p>
      </Section>
      <Section title="7. Changes to Terms">
        <p>We reserve the right to modify these terms at any time. Continued use of the Platform after any changes constitutes your acceptance of the new terms.</p>
      </Section>
      <Section title="8. Contact Us">
        <p>If you have any questions about these Terms, please contact us at <a href="mailto:hello@millionairenumbers.in" className="text-[#d4af37] hover:underline">hello@millionairenumbers.in</a>.</p>
      </Section>
    </div>
  </div>
);

export default Terms;
