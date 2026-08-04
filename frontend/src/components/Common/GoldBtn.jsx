import { Link } from 'react-router-dom';

const GoldBtn = ({ children, to, outline = false, ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition active:scale-95';
  const style = outline
    ? 'border border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10'
    : 'text-black hover:opacity-90';
  const inlineStyle = outline
    ? {}
    : { background: 'linear-gradient(135deg, #f5d76e, #d4af37, #b8912a)' };

  if (to)
    return (
      <Link to={to} className={`${base} ${style}`} style={inlineStyle} {...props}>
        {children}
      </Link>
    );
  return (
    <button className={`${base} ${style}`} style={inlineStyle} {...props}>
      {children}
    </button>
  );
};

export default GoldBtn;
