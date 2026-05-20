import { useEffect, useState } from 'react';
import { useHealthAPI } from '../../hooks/useHealthAPI';
import { BiomarkerWithTier } from '../../types/health';
import { BiomarkerCard } from './BiomarkerCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const Dashboard = () => {
  const api = useHealthAPI();
  const [biomarkers, setBiomarkers] = useState<BiomarkerWithTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await api.getLatestDashboardState();
        setBiomarkers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading health dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-semibold">Error: {error}</p>
      </div>
    );
  }

  // Group biomarkers by category
  const groupedBiomarkers = biomarkers.reduce(
    (acc, bm) => {
      if (!acc[bm.category]) acc[bm.category] = [];
      acc[bm.category].push(bm);
      return acc;
    },
    {} as Record<string, BiomarkerWithTier[]>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Health Dashboard</h1>
        <p className="text-gray-400 mt-2">Real-time biomarker analysis and tracking</p>
      </div>

      {/* Biomarkers */}
      {biomarkers.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-gray-400">No biomarkers logged yet. Start by adding your first biomarker value.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedBiomarkers).map(([category, markers]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-white mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {markers.map((biomarker) => (
                  <BiomarkerCard key={biomarker.id} biomarker={biomarker} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
