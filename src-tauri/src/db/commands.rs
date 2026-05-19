use rusqlite::Connection;
use crate::models::{UserProfile, BiomarkerConfig, BiomarkerLog};

/// Save user profile to database
pub fn save_user_profile(
    conn: &Connection,
    profile: &UserProfile,
) -> Result<i32, String> {
    conn.execute(
        "INSERT INTO user_profile (birth_date, biological_sex)
         VALUES (?1, ?2)",
        rusqlite::params![&profile.birth_date, &profile.biological_sex],
    )
    .map_err(|e| format!("Failed to save profile: {}", e))?;

    conn.last_insert_rowid();
    Ok(conn.last_insert_rowid() as i32)
}

/// Get the latest user profile
pub fn get_user_profile(conn: &Connection) -> Result<Option<UserProfile>, String> {
    let mut stmt = conn
        .prepare("SELECT id, birth_date, biological_sex, created_at FROM user_profile ORDER BY created_at DESC LIMIT 1")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let profile = stmt
        .query_row([], |row| {
            Ok(UserProfile {
                id: Some(row.get(0)?),
                birth_date: row.get(1)?,
                biological_sex: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .optional()
        .map_err(|e| format!("Failed to query profile: {}", e))?;

    Ok(profile)
}

/// Get all biomarker configurations
pub fn get_all_biomarkers(conn: &Connection) -> Result<Vec<BiomarkerConfig>, String> {
    let mut stmt = conn
        .prepare("SELECT id, name, category, unit, deficient_max, suboptimal_max, optimal_max, supra_optimal_max, description, citations FROM biomarker_configs ORDER BY category, name")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let biomarkers = stmt
        .query_map([], |row| {
            Ok(BiomarkerConfig {
                id: row.get(0)?,
                name: row.get(1)?,
                category: row.get(2)?,
                unit: row.get(3)?,
                deficient_max: row.get(4)?,
                suboptimal_max: row.get(5)?,
                optimal_max: row.get(6)?,
                supra_optimal_max: row.get(7)?,
                description: row.get(8)?,
                citations: row.get(9)?,
            })
        })
        .map_err(|e| format!("Failed to query biomarkers: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect biomarkers: {}", e))?;

    Ok(biomarkers)
}

/// Get biomarker by ID
pub fn get_biomarker(conn: &Connection, id: &str) -> Result<Option<BiomarkerConfig>, String> {
    let mut stmt = conn
        .prepare("SELECT id, name, category, unit, deficient_max, suboptimal_max, optimal_max, supra_optimal_max, description, citations FROM biomarker_configs WHERE id = ?1")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let biomarker = stmt
        .query_row(rusqlite::params![id], |row| {
            Ok(BiomarkerConfig {
                id: row.get(0)?,
                name: row.get(1)?,
                category: row.get(2)?,
                unit: row.get(3)?,
                deficient_max: row.get(4)?,
                suboptimal_max: row.get(5)?,
                optimal_max: row.get(6)?,
                supra_optimal_max: row.get(7)?,
                description: row.get(8)?,
                citations: row.get(9)?,
            })
        })
        .optional()
        .map_err(|e| format!("Failed to query biomarker: {}", e))?;

    Ok(biomarker)
}

/// Log a biomarker value
pub fn log_biomarker_value(
    conn: &Connection,
    biomarker_id: &str,
    value: f64,
) -> Result<i32, String> {
    conn.execute(
        "INSERT INTO biomarker_logs (biomarker_id, value)
         VALUES (?1, ?2)",
        rusqlite::params![biomarker_id, value],
    )
    .map_err(|e| format!("Failed to log biomarker value: {}", e))?;

    Ok(conn.last_insert_rowid() as i32)
}

/// Get biomarker history
pub fn get_biomarker_history(
    conn: &Connection,
    biomarker_id: &str,
) -> Result<Vec<BiomarkerLog>, String> {
    let mut stmt = conn
        .prepare("SELECT id, biomarker_id, value, recorded_at FROM biomarker_logs WHERE biomarker_id = ?1 ORDER BY recorded_at DESC LIMIT 100")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let logs = stmt
        .query_map(rusqlite::params![biomarker_id], |row| {
            Ok(BiomarkerLog {
                id: row.get(0)?,
                biomarker_id: row.get(1)?,
                value: row.get(2)?,
                recorded_at: row.get(3)?,
            })
        })
        .map_err(|e| format!("Failed to query biomarker history: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect biomarker history: {}", e))?;

    Ok(logs)
}

/// Get latest dashboard state with all biomarkers and their latest values
pub fn get_latest_dashboard_state(
    conn: &Connection,
) -> Result<serde_json::Value, String> {
    let biomarkers = get_all_biomarkers(conn)?;
    
    let mut dashboard_data = Vec::new();

    for biomarker in biomarkers {
        let latest_log: Option<BiomarkerLog> = {
            let mut stmt = conn
                .prepare(
                    "SELECT id, biomarker_id, value, recorded_at FROM biomarker_logs WHERE biomarker_id = ?1 ORDER BY recorded_at DESC LIMIT 1",
                )
                .map_err(|e| format!("Failed to prepare statement: {}", e))?;

            stmt.query_row(rusqlite::params![&biomarker.id], |row| {
                Ok(BiomarkerLog {
                    id: row.get(0)?,
                    biomarker_id: row.get(1)?,
                    value: row.get(2)?,
                    recorded_at: row.get(3)?,
                })
            })
            .optional()
            .map_err(|e| format!("Failed to query latest log: {}", e))?
        };

        dashboard_data.push(serde_json::json!({
            "biomarker": biomarker,
            "latest_value": latest_log
        }));
    }

    Ok(serde_json::json!({
        "timestamp": "1970-01-01T00:00:00Z",
        "biomarkers": dashboard_data
    }))
}
