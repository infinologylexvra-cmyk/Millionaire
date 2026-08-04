import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(({ label, error, type = 'text', className = '', containerClassName = '', ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={classNames('w-full', containerClassName)}>
      {label && <label className="block mb-2 text-xs tracking-wide text-cream/60 uppercase">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={classNames(
            'w-full rounded-xl bg-surface border px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors',
            'focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30',
            error ? 'border-red-500/60' : 'border-white/10',
            isPassword && 'pr-11',
            className
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-gold-400"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
