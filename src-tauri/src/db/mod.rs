use std::collections::HashMap;
use std::sync::Mutex;
use serde_json::{json, Value};
use crate::models::{UserProfile, BiomarkerConfig, BiomarkerLog, BiomarkerSeedData};

/// Simple in-memory database for Phase 1
/// In Phase 2+, this will be replaced with rusqlite/SQLite
pub struct Database {
    pub biomarkers: Mutex<HashMap<String, BiomarkerConfig>>,
    pub profiles: Mutex<Vec<UserProfile>>,
    pub biomarker_logs: Mutex<Vec<BiomarkerLog>>,
}

impl Database {
    pub fn new() -> Self {
        Database {
            biomarkers: Mutex::new(HashMap::new()),
            profiles: Mutex::new(Vec::new()),
            biomarker_logs: Mutex::new(Vec::new()),
        }
    }

    pub fn load_seed_data(&self, seed_data: BiomarkerSeedData) {
        let mut biomarkers = self.biomarkers.lock().unwrap();
        for biomarker in seed_data.0 {
            biomarkers.insert(biomarker.id.clone(), biomarker);
        }
    }

    pub fn save_user_profile(&self, profile: &UserProfile) -> Result<i32, String> {
        let mut profiles = self.profiles.lock().unwrap();
        profiles.push(profile.clone());
        Ok(profiles.len() as i32)
    }

    pub fn get_user_profile(&self) -> Result<Option<UserProfile>, String> {
        let profiles = self.profiles.lock().unwrap();
        Ok(profiles.last().cloned())
    }

    pub fn get_all_biomarkers(&self) -> Result<Vec<BiomarkerConfig>, String> {
        let biomarkers = self.biomarkers.lock().unwrap();
        let mut result: Vec<_> = biomarkers.values().cloned().collect();
        // Sort by category, then name
        result.sort_by(|a, b| {
            match a.category.cmp(&b.category) {
                std::cmp::Ordering::Equal => a.name.cmp(&b.name),
                other => other,
            }
        });
        Ok(result)
    }

    pub fn get_biomarker(&self, id: &str) -> Result<Option<BiomarkerConfig>, String> {
        let biomarkers = self.biomarkers.lock().unwrap();
        Ok(biomarkers.get(id).cloned())
    }

    pub fn log_biomarker_value(&self, biomarker_id: &str, value: f64) -> Result<i32, String> {
        let mut logs = self.biomarker_logs.lock().unwrap();
        let id = (logs.len() + 1) as i32;
        logs.push(BiomarkerLog {
            id: Some(id),
            biomarker_id: biomarker_id.to_string(),
            value,
            recorded_at: "2026-05-19T00:00:00Z".to_string(),
        });
        Ok(id)
    }

    pub fn get_biomarker_history(&self, biomarker_id: &str) -> Result<Vec<BiomarkerLog>, String> {
        let logs = self.biomarker_logs.lock().unwrap();
        let mut result: Vec<_> = logs
            .iter()
            .filter(|log| log.biomarker_id == biomarker_id)
            .cloned()
            .collect();
        // Sort by timestamp descending
        result.sort_by(|a, b| b.recorded_at.cmp(&a.recorded_at));
        Ok(result.into_iter().take(100).collect())
    }

    pub fn get_latest_dashboard_state(&self) -> Result<Value, String> {
        let biomarkers = self.get_all_biomarkers()?;
        let logs = self.biomarker_logs.lock().unwrap();

        let mut dashboard_data = Vec::new();
        for biomarker in biomarkers {
            let latest_value = logs
                .iter()
                .filter(|log| log.biomarker_id == biomarker.id)
                .max_by(|a, b| a.recorded_at.cmp(&b.recorded_at))
                .cloned();

            dashboard_data.push(json!({
                "biomarker": biomarker,
                "latest_value": latest_value
            }));
        }

        Ok(json!({
            "timestamp": "2026-05-19T00:00:00Z",
            "biomarkers": dashboard_data
        }))
    }
}
