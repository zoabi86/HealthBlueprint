import { useState } from 'react';
import { UserProfile } from '../../types/health';
import { useHealthAPI } from '../../hooks/useHealthAPI';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface ProfileFormProps {
  onSuccess?: () => void;
}

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const api = useHealthAPI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    birth_date: '',
    biological_sex: 'MALE',
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
      await api.saveProfile(formData);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-white">User Profile Setup</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Birth Date</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Biological Sex</label>
          <select
            name="biological_sex"
            value={formData.biological_sex}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Save Profile
        </Button>
      </form>
    </Card>
  );
};
