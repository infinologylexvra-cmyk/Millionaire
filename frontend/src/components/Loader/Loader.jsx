import { classNames } from '../../utils/helpers';

const Loader = ({ fullScreen = false, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-2', lg: 'w-14 h-14 border-[3px]' };

  const spinner = (
    <div
      className={classNames(
        'rounded-full border-gold-500/25 border-t-gold-500 animate-spin',
        sizes[size],
        className
      )}
    />
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal">
      <div className="flex flex-col items-center gap-4">
        {spinner}
        <p className="text-xs tracking-[0.3em] text-gold-500/80 uppercase">Millionaire Numbers</p>
      </div>
    </div>
  );
};

export default Loader;
