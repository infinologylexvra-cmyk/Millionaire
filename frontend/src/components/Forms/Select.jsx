import { forwardRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { classNames } from '../../utils/helpers';

const Select = forwardRef(({ label, error, className = '', containerClassName = '', children, ...rest }, ref) => (
  <div className={classNames('w-full', containerClassName)}>
    {label && <label className="block mb-2 text-xs tracking-wide text-cream/60 uppercase">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={classNames(
          'w-full appearance-none rounded-xl bg-surface border px-4 py-3 pr-9 text-sm text-cream outline-none transition-colors',
          'focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30',
          error ? 'border-red-500/60' : 'border-white/10',
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
    </div>
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
));

Select.displayName = 'Select';

export default Select;
