export type HealthTier = 'Deficient' | 'Suboptimal' | 'Optimal' | 'SupraOptimal' | 'Toxic';

export interface BiomarkerConfig {
  id: string;
  name: string;
  category: string;
  unit: string;
  deficient_max?: number;
  suboptimal_max?: number;
  optimal_max?: number;
  supra_optimal_max?: number;
  description?: string;
  citations?: string[];
}

export interface BiomarkerLog {
  id: number;
  biomarker_id: string;
  value: number;
  recorded_at: string;
}

export interface BiomarkerWithTier extends BiomarkerConfig {
  latest_value?: number;
  tier?: HealthTier;
  recorded_at?: string;
}

export interface UserProfile {
  id?: number;
  birth_date: string;
  biological_sex: 'MALE' | 'FEMALE';
  created_at?: string;
}

export interface BiometricLog {
  id?: number;
  weight_kg?: number;
  height_cm?: number;
  waist_circumference_cm?: number;
  recorded_at?: string;
}

export interface HabitLog {
  id?: number;
  sleep_duration_hours?: number;
  circadian_alignment?: 'OPTIMAL' | 'DISRUPTED' | 'SHIFT_WORK';
  alcohol_consumption?: 'NONE' | 'MODERATE' | 'HEAVY';
  tobacco_use?: 'NONE' | 'USER';
  dietary_profile?: string;
  recorded_at?: string;
}

export interface DashboardState {
  biomarkers: BiomarkerWithTier[];
  profile?: UserProfile;
  lastUpdated?: string;
}
