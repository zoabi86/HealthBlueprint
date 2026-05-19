mod models;
mod db;

use db::Database;
use models::BiomarkerSeedData;

#[tauri::command]
fn init_db(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let db = &state.db;
    
    // Load biomarker seed data
    if let Ok(seed_json) = std::fs::read_to_string("../resources/biomarkers.json") {
        if let Ok(seed_data) = serde_json::from_str::<BiomarkerSeedData>(&seed_json) {
            db.load_seed_data(seed_data);
            return Ok("Database initialized with 30+ biomarkers".to_string());
        }
    }

    Ok("Database initialized (biomarker seed not loaded)".to_string())
}

#[tauri::command]
fn save_user_profile(
    profile: models::UserProfile,
    state: tauri::State<'_, AppState>,
) -> Result<i32, String> {
    state.db.save_user_profile(&profile)
}

#[tauri::command]
fn get_user_profile(state: tauri::State<'_, AppState>) -> Result<Option<models::UserProfile>, String> {
    state.db.get_user_profile()
}

#[tauri::command]
fn get_all_biomarkers(state: tauri::State<'_, AppState>) -> Result<Vec<models::BiomarkerConfig>, String> {
    state.db.get_all_biomarkers()
}

#[tauri::command]
fn get_biomarker(id: String, state: tauri::State<'_, AppState>) -> Result<Option<models::BiomarkerConfig>, String> {
    state.db.get_biomarker(&id)
}

#[tauri::command]
fn log_biomarker_value(
    biomarker_id: String,
    value: f64,
    state: tauri::State<'_, AppState>,
) -> Result<i32, String> {
    state.db.log_biomarker_value(&biomarker_id, value)
}

#[tauri::command]
fn get_biomarker_history(
    biomarker_id: String,
    state: tauri::State<'_, AppState>,
) -> Result<Vec<models::BiomarkerLog>, String> {
    state.db.get_biomarker_history(&biomarker_id)
}

#[tauri::command]
fn get_latest_dashboard_state(
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    state.db.get_latest_dashboard_state()
}

pub struct AppState {
    pub db: Database,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db = Database::new();
    
    // Load biomarker seed data from resources
    if let Ok(seed_json) = std::fs::read_to_string("../resources/biomarkers.json") {
        if let Ok(seed_data) = serde_json::from_str::<BiomarkerSeedData>(&seed_json) {
            db.load_seed_data(seed_data);
            eprintln!("Loaded biomarker seed data");
        }
    } else {
        eprintln!("Warning: Could not load biomarker seed file");
    }

    let app_state = AppState { db };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            init_db,
            save_user_profile,
            get_user_profile,
            get_all_biomarkers,
            get_biomarker,
            log_biomarker_value,
            get_biomarker_history,
            get_latest_dashboard_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
