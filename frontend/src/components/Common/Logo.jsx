import { Link } from 'react-router-dom';
import { classNames } from '../../utils/helpers';

/**
 * Millionaire Numbers Logo – uses the actual brand logo image.
 * Responsive: smaller on mobile, larger on desktop.
 */
const Logo = ({ to = '/', size = 'md', showTagline = false, className = '' }) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-xs sm:text-sm', sub: 'text-[7px] sm:text-[8px]' },
    md: { img: 'w-10 h-10 sm:w-12 sm:h-12', text: 'text-sm sm:text-base', sub: 'text-[8px] sm:text-[9px]' },
    lg: { img: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-lg sm:text-xl', sub: 'text-[9px] sm:text-[10px]' },
  };
  const { img: imgClass, text: textClass, sub: subClass } = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={classNames('flex items-center gap-2 sm:gap-2.5', className)}>
      {/* Logo image – uses the actual brand logo */}
      <img
        src="/logo.jpg"
        alt="Millionaire Numbers Logo"
        className={classNames(
          'rounded-full object-cover border border-[#d4af37]/50 shadow-[0_0_12px_rgba(212,175,55,0.3)] shrink-0',
          imgClass
        )}
      />

      {/* Brand text */}
      <div className="leading-none min-w-0">
        <span
          className={classNames('font-display font-bold tracking-wide block truncate', textClass)}
          style={{
            background: 'linear-gradient(135deg, #f5d76e 0%, #d4af37 50%, #b8912a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MILLIONAIRE
        </span>
        <span className={classNames('block font-display font-semibold tracking-[0.3em] sm:tracking-[0.35em] text-[#f5f0e1]/70', subClass)}>
          NUMBERS
        </span>
      </div>

      {showTagline && (
        <span className="hidden lg:block ml-2 pl-2 border-l border-[#d4af37]/25 text-[10px] tracking-[0.2em] text-[#f5f0e1]/40 uppercase">
          Exclusive Numbers
          <br />
          Exclusive You
        </span>
      )}
    </div>
  );

  if (!to) return content;
  return (
    <Link to={to} className="inline-flex items-center shrink-0">
      {content}
    </Link>
  );
};

export default Logo;
