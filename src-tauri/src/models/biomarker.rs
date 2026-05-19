use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiomarkerConfig {
    pub id: String,
    pub name: String,
    pub category: String,
    pub unit: String,
    pub deficient_max: Option<f64>,
    pub suboptimal_max: Option<f64>,
    pub optimal_max: Option<f64>,
    pub supra_optimal_max: Option<f64>,
    pub description: Option<String>,
    pub citations: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiomarkerLog {
    pub id: Option<i32>,
    pub biomarker_id: String,
    pub value: f64,
    pub recorded_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiomarkerWithLatest {
    pub config: BiomarkerConfig,
    pub latest_value: Option<BiomarkerLog>,
}

#[derive(Debug, Deserialize)]
pub struct BiomarkerSeedData(pub Vec<BiomarkerConfig>);

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum HealthTier {
    Deficient,
    Suboptimal,
    Optimal,
    SupraOptimal,
    Toxic,
}

impl HealthTier {
    pub fn as_str(&self) -> &str {
        match self {
            HealthTier::Deficient => "Deficient",
            HealthTier::Suboptimal => "Suboptimal",
            HealthTier::Optimal => "Optimal",
            HealthTier::SupraOptimal => "SupraOptimal",
            HealthTier::Toxic => "Toxic",
        }
    }

    pub fn color_class(&self) -> &str {
        match self {
            HealthTier::Deficient => "bg-red-500/20 text-red-400 border-red-500/40",
            HealthTier::Suboptimal => "bg-amber-500/10 text-amber-400 border-amber-500/20",
            HealthTier::Optimal => "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
            HealthTier::SupraOptimal => "bg-amber-600/20 text-amber-500 border-amber-600/30",
            HealthTier::Toxic => "bg-red-700/30 text-red-500 border-red-700/50",
        }
    }
}

pub fn evaluate_biomarker(value: f64, config: &BiomarkerConfig) -> HealthTier {
    if let Some(def_max) = config.deficient_max {
        if value <= def_max {
            return HealthTier::Deficient;
        }
    }
    if let Some(sub_max) = config.suboptimal_max {
        if value <= sub_max {
            return HealthTier::Suboptimal;
        }
    }
    if let Some(opt_max) = config.optimal_max {
        if value <= opt_max {
            return HealthTier::Optimal;
        }
    }
    if let Some(supra_max) = config.supra_optimal_max {
        if value <= supra_max {
            return HealthTier::SupraOptimal;
        }
    }
    HealthTier::Toxic
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiomarkerWithLatest {
    pub config: BiomarkerConfig,
    pub latest_value: Option<BiomarkerLog>,
}

#[derive(Debug, Deserialize)]
pub struct BiomarkerSeedData(pub Vec<BiomarkerConfig>);

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum HealthTier {
    Deficient,
    Suboptimal,
    Optimal,
    SupraOptimal,
    Toxic,
}

impl HealthTier {
    pub fn as_str(&self) -> &str {
        match self {
            HealthTier::Deficient => "Deficient",
            HealthTier::Suboptimal => "Suboptimal",
            HealthTier::Optimal => "Optimal",
            HealthTier::SupraOptimal => "SupraOptimal",
            HealthTier::Toxic => "Toxic",
        }
    }

    pub fn color_class(&self) -> &str {
        match self {
            HealthTier::Deficient => "bg-red-500/20 text-red-400 border-red-500/40",
            HealthTier::Suboptimal => "bg-amber-500/10 text-amber-400 border-amber-500/20",
            HealthTier::Optimal => "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
            HealthTier::SupraOptimal => "bg-amber-600/20 text-amber-500 border-amber-600/30",
            HealthTier::Toxic => "bg-red-700/30 text-red-500 border-red-700/50",
        }
    }
}

pub fn evaluate_biomarker(value: f64, config: &BiomarkerConfig) -> HealthTier {
    if let Some(def_max) = config.deficient_max {
        if value <= def_max {
            return HealthTier::Deficient;
        }
    }
    if let Some(sub_max) = config.suboptimal_max {
        if value <= sub_max {
            return HealthTier::Suboptimal;
        }
    }
    if let Some(opt_max) = config.optimal_max {
        if value <= opt_max {
            return HealthTier::Optimal;
        }
    }
    if let Some(supra_max) = config.supra_optimal_max {
        if value <= supra_max {
            return HealthTier::SupraOptimal;
        }
    }
    HealthTier::Toxic
}
