import { Link } from 'react-router-dom';
import { classNames } from '../../utils/helpers';

const variants = {
  primary:
    'gold-gradient-bg text-charcoal font-semibold hover:brightness-110 shadow-gold hover:shadow-gold-lg',
  outline:
    'border border-gold-500/40 text-cream hover:border-gold-400 hover:bg-gold-500/10',
  ghost: 'text-cream/80 hover:text-gold-400',
  dark: 'bg-surface border border-white/10 text-cream hover:border-gold-500/40',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = ({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  loading = false,
  type = 'button',
  ...rest
}) => {
  const classes = classNames(
    'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 whitespace-nowrap',
    variants[variant],
    sizes[size],
    (disabled || loading) && 'opacity-50 pointer-events-none',
    className
  );

  const content = (
    <>
      {loading && <span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
};

export default Button;
