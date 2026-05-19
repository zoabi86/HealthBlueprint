use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub id: Option<i32>,
    pub birth_date: String, // YYYY-MM-DD format
    pub biological_sex: String, // "MALE" or "FEMALE"
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricLog {
    pub id: Option<i32>,
    pub weight_kg: Option<f64>,
    pub height_cm: Option<f64>,
    pub waist_circumference_cm: Option<f64>,
    pub recorded_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HabitLog {
    pub id: Option<i32>,
    pub sleep_duration_hours: Option<f64>,
    pub circadian_alignment: Option<String>, // "OPTIMAL", "DISRUPTED", "SHIFT_WORK"
    pub alcohol_consumption: Option<String>, // "NONE", "MODERATE", "HEAVY"
    pub tobacco_use: Option<String>,          // "NONE", "USER"
    pub dietary_profile: String,              // e.g., "Carnivore", "Mediterranean"
    pub recorded_at: Option<String>,
}
