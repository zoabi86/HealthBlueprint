# System Architecture Specification: Project Aegis Health

**Document Version:** 1.0.0

**Target:** Implementation AI Agent / Systems Engineer

**Environment:** Fully Offline, Open-Source, Desktop Application

---

## 1. Executive Summary & Core Philosophy

Project Aegis is a privacy-first, fully air-gapped personal health informatics platform designed to track, store, and interpret multi-dimensional health metrics (blood biomarkers, vitals, biometrics, and habits).

### Operational Constraints

* **Zero Cloud Dependency:** The application must never reach out to an external network for processing data. Every mathematical calculation, relational parsing step, and AI inference step happens on local hardware.
* **Deterministic Dominance:** LLMs cannot define clinical parameters or thresholds. The AI agent acts exclusively as a contextual interpreter and synthesizer. All biomarker classifications are governed by hardcoded, auditable mathematical rules.
* **Extensibility:** The database and engine pipeline must allow seamless onboarding of new rules, new biomarkers, and custom graph dependencies without rewriting core logic.

---

## 2. Technical Stack Blueprint

The application uses a high-performance, containerless desktop architecture:

* **App Wrapper & Core OS Bridge:** **Tauri v2 (Rust)**
* Manages system sandboxing, database file operations, security, windowing, and IPC communication.


* **UI & Rendering Engine:** **React (TypeScript) + Tailwind CSS**
* Handled via a local webview managed by Tauri.
* UI Components are derived from **Shadcn UI (Radix Primitives)**.
* Data visualizations are built using SVG primitives via **Recharts / Tremor**.


* **Primary Database Layer:** **SQLite**
* Embedded single-file transactional storage managed via the native Rust `rusqlite` or `diesel` drivers.


* **Vector Embeddings Store (RAG):** **LanceDB / embedded ChromaDB**
* Configured via a local Python **Tauri Sidecar** or an in-process engine to parse and vectorize medical research files.


* **Inference Engine Daemon:** **Ollama**
* Interacted with locally over HTTP (`http://localhost:11434`) targeting quantized open weights (`llama3:8b`, `BioMistral:7b`, or `phi3`).



---

## 3. Database Schema (SQLite)

The local SQLite database enforces normalization to trace changes in biomarkers, habits, and user profiles over time.

```sql
-- 1. Core Profile Definition
CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    birth_date TEXT NOT NULL,
    biological_sex TEXT CHECK(biological_sex IN ('MALE', 'FEMALE')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Variable Biometrics (Tracks physical metrics fluctuations over time)
CREATE TABLE biometric_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weight_kg REAL,
    height_cm REAL,
    waist_circumference_cm REAL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Qualitative & Quantitative Lifestyle Vectors
CREATE TABLE habit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sleep_duration_hours REAL,
    circadian_alignment TEXT CHECK(circadian_alignment IN ('OPTIMAL', 'DISRUPTED', 'SHIFT_WORK')),
    alcohol_consumption TEXT CHECK(alcohol_consumption IN ('NONE', 'MODERATE', 'HEAVY')),
    tobacco_use TEXT CHECK(tobacco_use IN ('NONE', 'USER')),
    dietary_profile TEXT NOT NULL, -- e.g., "Carnivore", "Standard Western", "Mediterranean"
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Central Diagnostic Lexicon (Rules Configuration)
CREATE TABLE biomarker_configs (
    id TEXT PRIMARY KEY,               -- e.g., "FASTING_INSULIN", "HS_CRP", "HBA1C"
    name TEXT NOT NULL,                -- e.g., "Fasting Insulin"
    category TEXT NOT NULL,            -- e.g., "Metabolic", "Lipids", "Hematology"
    unit TEXT NOT NULL,                -- e.g., "uIU/mL", "mg/dL", "g/dL"
    deficient_max REAL,                -- Boundaries mapping out upper limits of each tier
    suboptimal_max REAL,
    optimal_max REAL,
    supra_optimal_max REAL,
    description TEXT,
    citations TEXT                     -- Stored JSON array of local document references/DOIs
);

-- 5. Individual Lab Test Value Logs
CREATE TABLE biomarker_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    biomarker_id TEXT NOT NULL,
    value REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(biomarker_id) REFERENCES biomarker_configs(id) ON DELETE CASCADE
);

```

---

## 4. The Processing Pipeline & Inference Architecture

The implementation agent must develop the computational backend as a strict linear data pipeline:

```
[Raw User Ingestion] 
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Phase 1: Deterministic Range Classification            │
│ - Rust checks value against biomarker_configs          │
│ - Outputs: Deficient | Suboptimal | Optimal | etc.     │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: Relational Graph Traverser                   │
│ - Compares multiple active flags against dynamic pairs │
│ - Identifies systemic thematic insights                 │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: RAG Context Augmentation                      │
│ - Pulls vector texts matching flagged biomarkers        │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Phase 4: Local LLM Direct Prompt Injection             │
│ - System prompt executes via Ollama                    │
│ - Outputs: Tailored Health Blueprint Markdown          │
└────────────────────────────────────────────────────────┘

```

### Phase 1: Range Classification Logic

When values are queried, the Rust runtime evaluates data points into a deterministic category:

```rust
pub enum HealthTier {
    Deficient,
    Suboptimal,
    Optimal,
    SupraOptimal,
    Toxic,
}

pub fn evaluate_biomarker(value: f64, config: &BiomarkerConfig) -> HealthTier {
    if let Some(def_max) = config.deficient_max {
        if value <= def_max { return HealthTier::Deficient; }
    }
    if let Some(sub_max) = config.suboptimal_max {
        if value <= sub_max { return HealthTier::Suboptimal; }
    }
    if let Some(opt_max) = config.optimal_max {
        if value <= opt_max { return HealthTier::Optimal; }
    }
    if let Some(supra_max) = config.supra_optimal_max {
        if value <= supra_max { return HealthTier::SupraOptimal; }
    }
    HealthTier::Toxic
}

```

### Phase 2: Knowledge Graph Architecture

Implement a cross-functional dependency layout. Create a `biomarker_dependencies` system linking interrelated physiological indicators to isolate root causes:

* **Rule Example:** If `FASTING_INSULIN` is flagged as `SupraOptimal` AND `HS_CRP` is flagged as `Optimal`, pass thematic context: `"Metabolic stress independent of chronic system-wide inflammation"`.
* **Rule Example:** If `FASTING_INSULIN` is flagged as `SupraOptimal` AND `HS_CRP` is flagged as `SupraOptimal`, pass thematic context: `"Metabolic dysfunction coupled with active systemic inflammation"`.

### Phase 3: Offline RAG Implementation

1. **Sidecar Component:** Package a small executable/Python instance capable of running embedding algorithms completely on the CPU/local GPU.
2. **Data Source:** Reads from a directory located inside the application's local sandbox path (`$APP_DATA/reference_docs/`).
3. **Query Engine:** When a biomarker is flagged as non-optimal, the system queries the embedded vector database for the top three most contextually relevant research abstracts or clinical practice guidelines.

### Phase 4: Structured Prompt Construction for Ollama

The prompt dispatched to Ollama must use an absolute role boundary framework.

```text
SYSTEM PROMPT:
You are an advanced, technical health informatics compiler. Your duty is to synthesize structured biological data and lifestyle factors into a clear, unified health optimization blueprint.

CRITICAL RULES:
1. Do NOT alter, hallucinate, or challenge the biomarker classification tiers provided in the JSON payload. They are clinical constants.
2. Rely strictly on the injected context segments from peer-reviewed files for your functional advice.
3. If no relevant scientific context is available in the provided payload, base your advice solely on established physiological mechanics. Do not manufacture citations.
4. Output your analysis using clear Markdown headings, avoiding vague generalizations.

INPUT DATA PAYLOAD:
---
USER PROFILE: {Age: X, Biological Sex: Y, Diet: Z, Habits: ...}
DETERMINISTIC ANALYSIS DETECTED: {JSON Payload containing flagged markers and graph insights}
VERIFIED LOCAL RESEARCH SEGMENTS: {Relevant vector chunk excerpts}
---

Generate the Blueprint.

```

---

## 5. Front-End Interface Guidelines

The user interface must present as a clear, highly analytical cockpit. Avoid excessive white space; maximize dashboard utility and visibility.

### 1. Five-Tier Color System

Ensure all components adhere to a unified grading system using Tailwind semantic styles:

* **Deficient:** `bg-red-500/20 text-red-400 border-red-500/40`
* **Suboptimal:** `bg-amber-500/10 text-amber-400 border-amber-500/20`
* **Optimal:** `bg-emerald-500/20 text-emerald-400 border-emerald-500/40`
* **Supra-Optimal:** `bg-amber-600/20 text-amber-500 border-amber-600/30`
* **Toxic:** `bg-red-700/30 text-red-500 border-red-700/50`

### 2. Multi-Zone Interactive Range Visualizer

Every biomarker item card should use a horizontal tracking bar that visually displays reference boundaries. The current value must sit as a defined node directly above its specific tier block (as specified in the initial component layout).

### 3. Blueprint Viewer

The final output rendered from the Ollama integration layer must pass through a strict Markdown rendering component supporting seamless dark-mode code syntax highlighting and collapsible accordions for local scientific verification fragments.

---

## 6. IPC Bridge API Definitions (Tauri Commands)

The implementation frontend and native backend interface through these explicit asynchronous boundaries:

```typescript
// Invoke signatures exposed by the Rust system core
import { invoke } from '@tauri-apps/api/core';

export const HealthAPI = {
  // Profile Operations
  saveProfile: (profile: object) => invoke<void>('save_user_profile', { profile }),
  getProfile: () => invoke<object>('get_user_profile'),

  // Lab Results Logging
  logBiomarkerValue: (id: string, val: number) => invoke<void>('log_biomarker_value', { id, val }),
  getBiomarkerHistory: (id: string) => invoke<Array<any>>('get_biomarker_history', { id }),
  getLatestDashboardState: () => invoke<Array<any>>('get_latest_dashboard_state'),

  // AI Pipeline Execution
  triggerBlueprintGeneration: () => invoke<string>('generate_local_blueprint'),
};

```

---

## 7. Immediate Execution Directives For Implementation Agent

To construct this system progressively, build along the following critical path:

1. **Phase 1 (Data Foundation):** Initialize the Tauri configuration file framework. Establish the local SQLite migration script containing the detailed tables and load default core biomarker profiles into `biomarker_configs`.
2. **Phase 2 (The UI Cockpit):** Build the React interface layout. Construct the manual logging forms and connect the custom multi-zone horizontal range visualization engine.
3. **Phase 3 (Deterministic Pipeline):** Implement the Rust processing command that loops through data entries, queries against the configuration boundaries, and builds the five-tier payload state.
4. **Phase 4 (Local Inference Integration):** Integrate the local HTTP request mechanism targeting the native Ollama service port. Formulate the dynamic system prompt generator and render the streaming markdown text outputs directly onto the health dashboard view.