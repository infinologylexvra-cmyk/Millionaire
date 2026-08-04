import { classNames } from '../../utils/helpers';

const EmptyState = ({ icon, title, description, action, className = '' }) => (
  <div className={classNames('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
    {icon && <div className="text-4xl mb-4 text-gold-500/60">{icon}</div>}
    <h3 className="font-display text-xl text-cream mb-2">{title}</h3>
    {description && <p className="text-cream/50 max-w-sm mb-6 text-sm">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
