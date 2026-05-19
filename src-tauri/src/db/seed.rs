use rusqlite::{Connection, Result as SqliteResult};
use crate::models::{BiomarkerConfig, BiomarkerSeedData};

pub fn load_biomarker_defaults(conn: &Connection, seed_file_path: &str) -> SqliteResult<()> {
    // Check if biomarker_configs table is already populated
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM biomarker_configs")?;
    let count: i32 = stmt.query_row([], |row| row.get(0))?;

    if count > 0 {
        return Ok(());
    }

    // Read and deserialize seed file
    let seed_data: BiomarkerSeedData = match std::fs::read_to_string(seed_file_path) {
        Ok(content) => match serde_json::from_str(&content) {
            Ok(data) => data,
            Err(e) => {
                eprintln!("Failed to deserialize biomarker seed data: {}", e);
                return Err(rusqlite::Error::InvalidQuery);
            }
        },
        Err(e) => {
            eprintln!("Biomarker seed file not found at {}: {}", seed_file_path, e);
            return Ok(());
        }
    };

    // Insert each biomarker
    for biomarker in seed_data.0 {
        conn.execute(
            "INSERT INTO biomarker_configs (id, name, category, unit, deficient_max, suboptimal_max, optimal_max, supra_optimal_max, description, citations)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            rusqlite::params![
                &biomarker.id,
                &biomarker.name,
                &biomarker.category,
                &biomarker.unit,
                &biomarker.deficient_max,
                &biomarker.suboptimal_max,
                &biomarker.optimal_max,
                &biomarker.supra_optimal_max,
                &biomarker.description,
                &biomarker.citations,
            ],
        )?;
    }

    Ok(())
}
