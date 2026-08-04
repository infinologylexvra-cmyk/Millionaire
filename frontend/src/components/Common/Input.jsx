const Input = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
    )}
    <input
      className={`w-full bg-white/5 border rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition ${
        error ? 'border-red-500/50 focus:border-red-400' : 'border-white/10 focus:border-[#d4af37]/50'
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
);

export default Input;
