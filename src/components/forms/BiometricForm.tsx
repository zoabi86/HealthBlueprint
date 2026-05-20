import { useState } from 'react';
import { BiometricLog } from '../../types/health';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface BiometricFormProps {
  onSubmit?: (data: BiometricLog) => Promise<void>;
  onSuccess?: () => void;
}

export const BiometricForm = ({ onSubmit, onSuccess }: BiometricFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BiometricLog>({
    weight_kg: undefined,
    height_cm: undefined,
    waist_circumference_cm: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (onSubmit) {
        await onSubmit(formData);
      }
      setFormData({ weight_kg: undefined, height_cm: undefined, waist_circumference_cm: undefined });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log biometrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-white">Log Biometrics</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight_kg"
            step="0.1"
            value={formData.weight_kg || ''}
            onChange={handleChange}
            placeholder="e.g., 75.5"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
          <input
            type="number"
            name="height_cm"
            step="0.1"
            value={formData.height_cm || ''}
            onChange={handleChange}
            placeholder="e.g., 180"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Waist Circumference (cm)</label>
          <input
            type="number"
            name="waist_circumference_cm"
            step="0.1"
            value={formData.waist_circumference_cm || ''}
            onChange={handleChange}
            placeholder="e.g., 85"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Log Biometrics
        </Button>
      </form>
    </Card>
  );
};
