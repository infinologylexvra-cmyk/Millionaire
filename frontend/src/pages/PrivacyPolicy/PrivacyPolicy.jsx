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

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-[#050505] text-[#f5f0e1] pt-28 pb-20">
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-display font-bold mb-4">
          PRIVACY <span style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>POLICY</span>
        </h1>
        <GoldDivider />
        <p className="text-white/30 text-xs mt-4">Last updated: August 2026</p>
      </div>

      <Section title="1. Information We Collect">
        <p>We collect personal information you provide directly, including name, email address, phone number, and delivery address when you register or make a purchase.</p>
      </Section>
      <Section title="2. How We Use Your Information">
        <p>We use your information to process orders, send order confirmations, provide customer support, and improve our services. We do not sell your personal data to third parties.</p>
      </Section>
      <Section title="3. Data Security">
        <p>We implement industry-standard security measures to protect your data. All payment transactions are encrypted via SSL and processed through PCI-DSS compliant payment gateways.</p>
      </Section>
      <Section title="4. Cookies">
        <p>We use cookies to enhance your browsing experience and analyse site traffic. You can choose to disable cookies through your browser settings, though this may affect Platform functionality.</p>
      </Section>
      <Section title="5. Third-Party Services">
        <p>We may use third-party services (e.g., Google, Cloudinary) that have their own privacy policies. We encourage you to review their policies.</p>
      </Section>
      <Section title="6. Your Rights">
        <p>You have the right to access, update, or delete your personal information. Contact us at <a href="mailto:hello@millionairenumbers.in" className="text-[#d4af37] hover:underline">hello@millionairenumbers.in</a> to exercise these rights.</p>
      </Section>
      <Section title="7. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.</p>
      </Section>
    </div>
  </div>
);

export default PrivacyPolicy;
