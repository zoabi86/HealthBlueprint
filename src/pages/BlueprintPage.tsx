import { useState } from 'react';
import { useHealthAPI } from '../hooks/useHealthAPI';
import { BlueprintViewer } from '../components/blueprint/BlueprintViewer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const BlueprintPage = () => {
  const api = useHealthAPI();
  const [blueprint, setBlueprint] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBlueprint = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.triggerBlueprintGeneration();
      setBlueprint(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate blueprint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Health Blueprint</h1>
        <p className="text-gray-400 mt-2">AI-powered personalized health optimization plan</p>
      </div>

      {/* Generate Button */}
      <Card className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Generate Your Health Blueprint</h3>
          <p className="text-sm text-gray-400 mt-1">
            Analyzes your biomarkers and generates personalized recommendations
          </p>
        </div>
        <Button onClick={handleGenerateBlueprint} isLoading={loading}>
          Generate
        </Button>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/40 text-red-400 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Blueprint Viewer */}
      <BlueprintViewer markdown={blueprint} isLoading={loading} contextSegments={[]} />
    </div>
  );
};
