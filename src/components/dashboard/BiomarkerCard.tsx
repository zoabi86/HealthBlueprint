import { BiomarkerWithTier } from '../../types/health';
import { HealthTierBadge } from '../common/HealthTierBadge';
import { Card } from '../common/Card';
import { RangeVisualizer } from './RangeVisualizer';

interface BiomarkerCardProps {
  biomarker: BiomarkerWithTier;
}

export const BiomarkerCard = ({ biomarker }: BiomarkerCardProps) => {
  return (
    <Card className="space-y-4 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{biomarker.name}</h3>
          <p className="text-sm text-gray-400">{biomarker.category}</p>
        </div>
        {biomarker.tier && <HealthTierBadge tier={biomarker.tier} size="md" />}
      </div>

      {/* Range Visualizer */}
      {biomarker.latest_value !== undefined && (
        <>
          <RangeVisualizer
            value={biomarker.latest_value}
            deficient_max={biomarker.deficient_max}
            suboptimal_max={biomarker.suboptimal_max}
            optimal_max={biomarker.optimal_max}
            supra_optimal_max={biomarker.supra_optimal_max}
            unit={biomarker.unit}
          />

          {/* Footer Info */}
          <div className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
            <span className="font-medium">
              {biomarker.latest_value.toFixed(2)} {biomarker.unit}
            </span>
            <span className="text-xs">
              {biomarker.recorded_at
                ? new Date(biomarker.recorded_at).toLocaleDateString()
                : 'No data'}
            </span>
          </div>
        </>
      )}

      {/* Description */}
      {biomarker.description && (
        <p className="text-xs text-gray-500 italic">{biomarker.description}</p>
      )}
    </Card>
  );
};
