import { classNames } from '../../utils/helpers';

const Checkbox = ({ label, className = '', ...rest }) => (
  <label className={classNames('flex items-center gap-2.5 cursor-pointer select-none text-sm text-cream/70', className)}>
    <input type="checkbox" className="peer sr-only" {...rest} />
    <span className="w-[18px] h-[18px] shrink-0 rounded border border-gold-500/40 bg-surface peer-checked:bg-gold-500 peer-checked:border-gold-500 transition-colors flex items-center justify-center">
      <svg className="w-3 h-3 text-charcoal opacity-0 peer-checked:opacity-100" viewBox="0 0 12 12" fill="none">
        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    {label}
  </label>
);

export default Checkbox;
