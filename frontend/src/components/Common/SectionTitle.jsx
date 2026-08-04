const SectionTitle = ({ label, title, subtitle, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {label && (
      <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3">{label}</p>
    )}
    <h2 className="text-3xl md:text-4xl font-display font-bold text-[#d4af37] mb-2">{title}</h2>
    {subtitle && (
      <p className="text-sm text-white/40 mt-3 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
    )}
  </div>
);

export default SectionTitle;
