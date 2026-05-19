pub const SCHEMA_USER_PROFILE: &str = r#"
CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    birth_date TEXT NOT NULL,
    biological_sex TEXT CHECK(biological_sex IN ('MALE', 'FEMALE')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
"#;

pub const SCHEMA_BIOMETRIC_LOGS: &str = r#"
CREATE TABLE IF NOT EXISTS biometric_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weight_kg REAL,
    height_cm REAL,
    waist_circumference_cm REAL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
"#;

pub const SCHEMA_HABIT_LOGS: &str = r#"
CREATE TABLE IF NOT EXISTS habit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sleep_duration_hours REAL,
    circadian_alignment TEXT CHECK(circadian_alignment IN ('OPTIMAL', 'DISRUPTED', 'SHIFT_WORK')),
    alcohol_consumption TEXT CHECK(alcohol_consumption IN ('NONE', 'MODERATE', 'HEAVY')),
    tobacco_use TEXT CHECK(tobacco_use IN ('NONE', 'USER')),
    dietary_profile TEXT NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
"#;

pub const SCHEMA_BIOMARKER_CONFIGS: &str = r#"
CREATE TABLE IF NOT EXISTS biomarker_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    deficient_max REAL,
    suboptimal_max REAL,
    optimal_max REAL,
    supra_optimal_max REAL,
    description TEXT,
    citations TEXT
)
"#;

pub const SCHEMA_BIOMARKER_LOGS: &str = r#"
CREATE TABLE IF NOT EXISTS biomarker_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    biomarker_id TEXT NOT NULL,
    value REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(biomarker_id) REFERENCES biomarker_configs(id) ON DELETE CASCADE
)
"#;

pub fn get_all_schemas() -> Vec<&'static str> {
    vec![
        SCHEMA_USER_PROFILE,
        SCHEMA_BIOMETRIC_LOGS,
        SCHEMA_HABIT_LOGS,
        SCHEMA_BIOMARKER_CONFIGS,
        SCHEMA_BIOMARKER_LOGS,
    ]
}
