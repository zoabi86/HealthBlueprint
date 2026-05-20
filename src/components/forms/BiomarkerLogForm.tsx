import { useState, useEffect } from 'react';
import { useHealthAPI } from '../../hooks/useHealthAPI';
import { BiomarkerConfig } from '../../types/health';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface BiomarkerLogFormProps {
  biomarkers?: BiomarkerConfig[];
  onSuccess?: () => void;
}

export const BiomarkerLogForm = ({ biomarkers = [], onSuccess }: BiomarkerLogFormProps) => {
  const api = useHealthAPI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    biomarker_id: '',
    value: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.logBiomarkerValue(formData.biomarker_id, parseFloat(formData.value));
      setFormData({ biomarker_id: '', value: '' });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log biomarker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-white">Log Biomarker Value</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Biomarker</label>
          <select
            name="biomarker_id"
            value={formData.biomarker_id}
            onChange={handleChange}
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a biomarker...</option>
            {biomarkers.map((bm) => (
              <option key={bm.id} value={bm.id}>
                {bm.name} ({bm.unit})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Value</label>
          <input
            type="number"
            name="value"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            required
            placeholder="Enter measurement value"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Log Value
        </Button>
      </form>
    </Card>
  );
};
