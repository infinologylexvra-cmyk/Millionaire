import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const Textarea = forwardRef(({ label, error, className = '', containerClassName = '', ...rest }, ref) => (
  <div className={classNames('w-full', containerClassName)}>
    {label && <label className="block mb-2 text-xs tracking-wide text-cream/60 uppercase">{label}</label>}
    <textarea
      ref={ref}
      className={classNames(
        'w-full rounded-xl bg-surface border px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors resize-none',
        'focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30',
        error ? 'border-red-500/60' : 'border-white/10',
        className
      )}
      {...rest}
    />
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';

export default Textarea;
