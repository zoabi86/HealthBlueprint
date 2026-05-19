import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface BiomarkerConfig {
  id: string;
  name: string;
  category: string;
  unit: string;
  description?: string;
}

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [biomarkerCount, setBiomarkerCount] = useState(0);
  const [biomarkers, setBiomarkers] = useState<BiomarkerConfig[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        setLoading(true);
        setError("");

        // Initialize database
        await invoke("init_db");
        setInitialized(true);

        // Load biomarkers
        const markers = await invoke<BiomarkerConfig[]>("get_all_biomarkers");
        setBiomarkers(markers);
        setBiomarkerCount(markers.length);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(`Failed to initialize: ${errorMsg}`);
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initDb();
  }, []);

  if (loading) {
    return (
      <main className="container">
        <h1>Initializing...</h1>
        <p>Setting up database and loading biomarkers...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Health Blueprint - Database Status</h1>

      {error && (
        <div style={{ color: "red", padding: "1rem", marginBottom: "1rem", border: "1px solid red" }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {initialized ? (
        <div>
          <div style={{ padding: "1rem", backgroundColor: "#e8f5e9", border: "1px solid #4caf50", marginBottom: "1rem" }}>
            <h3>✓ Database Initialized Successfully</h3>
            <p>
              <strong>Biomarker Configs Loaded:</strong> {biomarkerCount}
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3>Biomarker Categories</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {Array.from(new Set(biomarkers.map((b) => b.category))).map((cat) => (
                <div key={cat} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                  <h4>{cat}</h4>
                  <p>{biomarkers.filter((b) => b.category === cat).length} markers</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Sample Biomarkers</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>ID</th>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Category</th>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Unit</th>
                </tr>
              </thead>
              <tbody>
                {biomarkers.slice(0, 10).map((marker) => (
                  <tr key={marker.id}>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd", fontSize: "0.85rem" }}>{marker.id}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{marker.name}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{marker.category}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{marker.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Showing 10 of {biomarkerCount} biomarkers</p>
          </div>
        </div>
      ) : (
        <p>Database not initialized</p>
      )}
    </main>
  );
}
