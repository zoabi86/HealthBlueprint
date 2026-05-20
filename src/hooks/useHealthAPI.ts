import { invoke } from '@tauri-apps/api/core';
import { BiomarkerLog, UserProfile, BiomarkerWithTier, DashboardState } from '../types/health';

export const useHealthAPI = () => {
  // Profile Operations
  const saveProfile = async (profile: UserProfile): Promise<void> => {
    return invoke<void>('save_user_profile', { profile });
  };

  const getProfile = async (): Promise<UserProfile> => {
    return invoke<UserProfile>('get_user_profile');
  };

  // Biomarker Operations
  const logBiomarkerValue = async (biomarkerId: string, value: number): Promise<void> => {
    return invoke<void>('log_biomarker_value', { biomarker_id: biomarkerId, value });
  };

  const getBiomarkerHistory = async (biomarkerId: string): Promise<BiomarkerLog[]> => {
    return invoke<BiomarkerLog[]>('get_biomarker_history', { biomarker_id: biomarkerId });
  };

  const getLatestDashboardState = async (): Promise<BiomarkerWithTier[]> => {
    return invoke<BiomarkerWithTier[]>('get_latest_dashboard_state');
  };

  // Blueprint Generation
  const triggerBlueprintGeneration = async (): Promise<string> => {
    return invoke<string>('generate_local_blueprint');
  };

  return {
    saveProfile,
    getProfile,
    logBiomarkerValue,
    getBiomarkerHistory,
    getLatestDashboardState,
    triggerBlueprintGeneration,
  };
};
