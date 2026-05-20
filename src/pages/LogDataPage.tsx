import { useState } from 'react';
import { BiomarkerLogForm } from '../components/forms/BiomarkerLogForm';
import { BiometricForm } from '../components/forms/BiometricForm';
import { HabitForm } from '../components/forms/HabitForm';

export const LogDataPage = () => {
  const [activeTab, setActiveTab] = useState<'biomarker' | 'biometric' | 'habit'>('biomarker');

  const tabs = [
    { label: 'Biomarker', value: 'biomarker' as const },
    { label: 'Biometric', value: 'biometric' as const },
    { label: 'Habits', value: 'habit' as const },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Log Your Data</h1>
        <p className="text-gray-400 mt-2">Track your health metrics in real-time</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'biomarker' && <BiomarkerLogForm />}
        {activeTab === 'biometric' && <BiometricForm />}
        {activeTab === 'habit' && <HabitForm />}
      </div>
    </div>
  );
};
