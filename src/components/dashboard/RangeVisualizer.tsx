import { HealthTier } from '../../types/health';

interface RangeVisualizerProps {
  value: number;
  deficient_max?: number;
  suboptimal_max?: number;
  optimal_max?: number;
  supra_optimal_max?: number;
  unit: string;
}

const getTierForValue = (
  value: number,
  deficient_max?: number,
  suboptimal_max?: number,
  optimal_max?: number,
  supra_optimal_max?: number
): HealthTier => {
  if (deficient_max !== undefined && value <= deficient_max) return 'Deficient';
  if (suboptimal_max !== undefined && value <= suboptimal_max) return 'Suboptimal';
  if (optimal_max !== undefined && value <= optimal_max) return 'Optimal';
  if (supra_optimal_max !== undefined && value <= supra_optimal_max) return 'SupraOptimal';
  return 'Toxic';
};

export const RangeVisualizer = ({
  value,
  deficient_max,
  suboptimal_max,
  optimal_max,
  supra_optimal_max,
  unit,
}: RangeVisualizerProps) => {
  const tier = getTierForValue(value, deficient_max, suboptimal_max, optimal_max, supra_optimal_max);

  // Build tier segments
  const tiers = [
    { label: 'Deficient', max: deficient_max, color: 'bg-red-500/40' },
    { label: 'Suboptimal', max: suboptimal_max, color: 'bg-amber-500/20' },
    { label: 'Optimal', max: optimal_max, color: 'bg-emerald-500/40' },
    { label: 'Supra-Optimal', max: supra_optimal_max, color: 'bg-amber-600/30' },
    { label: 'Toxic', max: null, color: 'bg-red-700/50' },
  ].filter((t) => t.max !== undefined || t.label === 'Toxic');

  // Calculate max range for positioning
  const maxRange = Math.max(supra_optimal_max || 0, value * 1.2);
  const valuePercent = (value / maxRange) * 100;

  return (
    <div className="space-y-2">
      <div className="relative h-12 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        {/* Tier segments background */}
        <div className="flex h-full">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`flex-1 ${tier.color} border-r border-gray-800 last:border-r-0 flex items-center justify-center text-xs font-semibold text-gray-300`}
            >
              {tier.label}
            </div>
          ))}
        </div>

        {/* Value indicator */}
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all"
          style={{ left: `${Math.min(valuePercent, 100)}%` }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 bg-gray-900 px-3 py-1 rounded text-white text-xs font-bold whitespace-nowrap border border-gray-600">
            {value.toFixed(2)} {unit}
          </div>
        </div>
      </div>

      {/* Range labels */}
      <div className="text-xs text-gray-500 space-y-1">
        {deficient_max && <div>Deficient: ≤ {deficient_max}</div>}
        {suboptimal_max && <div>Suboptimal: ≤ {suboptimal_max}</div>}
        {optimal_max && <div>Optimal: ≤ {optimal_max}</div>}
        {supra_optimal_max && <div>Supra-Optimal: ≤ {supra_optimal_max}</div>}
      </div>
    </div>
  );
};
