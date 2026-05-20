import { useState } from 'react';
import { HabitLog } from '../../types/health';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface HabitFormProps {
  onSubmit?: (data: HabitLog) => Promise<void>;
  onSuccess?: () => void;
}

export const HabitForm = ({ onSubmit, onSuccess }: HabitFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<HabitLog>({
    sleep_duration_hours: undefined,
    circadian_alignment: 'OPTIMAL',
    alcohol_consumption: 'NONE',
    tobacco_use: 'NONE',
    dietary_profile: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sleep_duration_hours' ? (value ? parseFloat(value) : undefined) : value,
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
      setFormData({
        sleep_duration_hours: undefined,
        circadian_alignment: 'OPTIMAL',
        alcohol_consumption: 'NONE',
        tobacco_use: 'NONE',
        dietary_profile: '',
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log habits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-white">Log Lifestyle Habits</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sleep Duration (hours)</label>
          <input
            type="number"
            name="sleep_duration_hours"
            step="0.5"
            value={formData.sleep_duration_hours || ''}
            onChange={handleChange}
            placeholder="e.g., 7.5"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Circadian Alignment</label>
          <select
            name="circadian_alignment"
            value={formData.circadian_alignment}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="OPTIMAL">Optimal</option>
            <option value="DISRUPTED">Disrupted</option>
            <option value="SHIFT_WORK">Shift Work</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Alcohol Consumption</label>
          <select
            name="alcohol_consumption"
            value={formData.alcohol_consumption}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="NONE">None</option>
            <option value="MODERATE">Moderate</option>
            <option value="HEAVY">Heavy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tobacco Use</label>
          <select
            name="tobacco_use"
            value={formData.tobacco_use}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="NONE">Non-User</option>
            <option value="USER">User</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Profile</label>
          <input
            type="text"
            name="dietary_profile"
            value={formData.dietary_profile}
            onChange={handleChange}
            placeholder="e.g., Mediterranean, Carnivore"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Log Habits
        </Button>
      </form>
    </Card>
  );
};
