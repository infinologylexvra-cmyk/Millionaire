import { Link } from 'react-router-dom';

const Button = ({ children, variant = 'primary', size = 'md', to, onClick, className = '', disabled = false, type = 'button', ...props }) => {
  const sizeClasses = { sm: 'px-4 py-2 text-xs', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' };
  const base = `inline-flex items-center justify-center gap-2 rounded font-bold uppercase tracking-wider transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`;

  const variants = {
    primary: 'text-black hover:opacity-90',
    outline: 'border border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10',
    ghost: 'text-[#d4af37] hover:bg-[#d4af37]/10',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
  };

  const inlineStyle =
    variant === 'primary'
      ? { background: 'linear-gradient(135deg, #f5d76e, #d4af37, #b8912a)', boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }
      : {};

  const cls = `${base} ${variants[variant] || variants.primary} ${className}`;

  if (to) return <Link to={to} className={cls} style={inlineStyle} {...props}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} style={inlineStyle} {...props}>{children}</button>;
};

export default Button;
