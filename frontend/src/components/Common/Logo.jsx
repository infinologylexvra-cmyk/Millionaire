import { Link } from 'react-router-dom';
import { classNames } from '../../utils/helpers';

/**
 * Millionaire Numbers Logo – uses the actual brand logo image.
 * Falls back to a text mark if the image fails to load.
 */
const Logo = ({ to = '/', size = 'md', showTagline = false, className = '' }) => {
  const sizeMap = {
    sm: { img: 36, text: 'text-sm' },
    md: { img: 48, text: 'text-base' },
    lg: { img: 64, text: 'text-xl' },
  };
  const { img: imgSize, text: textSize } = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={classNames('flex items-center gap-2.5', className)}>
      {/* Logo image */}
      <img
        src="/logo.jpg"
        alt="Millionaire Numbers"
        width={imgSize}
        height={imgSize}
        className="rounded-md object-contain"
        style={{ width: imgSize, height: imgSize }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      {/* Brand text */}
      <div className="leading-none">
        <span
          className={classNames('font-display font-bold tracking-wide', textSize)}
          style={{
            background: 'linear-gradient(135deg, #f5d76e 0%, #d4af37 50%, #b8912a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MILLIONAIRE
        </span>
        <span className="block font-display font-semibold tracking-[0.35em] text-[#f5f0e1]/70 text-[0.55em]">
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
    <Link to={to} className="inline-flex items-center">
      {content}
    </Link>
  );
};

export default Logo;
