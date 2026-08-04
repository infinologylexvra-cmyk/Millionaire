import { classNames } from '../../utils/helpers';

const Skeleton = ({ className = '' }) => (
  <div className={classNames('animate-pulse rounded-lg bg-white/5', className)} />
);

export const NumberCardSkeleton = () => (
  <div className="card-surface rounded-2xl p-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
    <Skeleton className="h-8 w-40" />
    <Skeleton className="h-3 w-24" />
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-9 w-24 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
