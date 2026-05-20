import { HealthTier } from '../../types/health';

interface HealthTierBadgeProps {
  tier: HealthTier;
  size?: 'sm' | 'md' | 'lg';
}

const tierStyles: Record<HealthTier, string> = {
  Deficient: 'bg-red-500/20 text-red-400 border border-red-500/40',
  Suboptimal: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  Optimal: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  SupraOptimal: 'bg-amber-600/20 text-amber-500 border border-amber-600/30',
  Toxic: 'bg-red-700/30 text-red-500 border border-red-700/50',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs font-medium rounded',
  md: 'px-3 py-2 text-sm font-semibold rounded-md',
  lg: 'px-4 py-2 text-base font-bold rounded-lg',
};

export const HealthTierBadge = ({ tier, size = 'md' }: HealthTierBadgeProps) => {
  return (
    <span className={`${tierStyles[tier]} ${sizeClasses[size]}`}>
      {tier}
    </span>
  );
};
