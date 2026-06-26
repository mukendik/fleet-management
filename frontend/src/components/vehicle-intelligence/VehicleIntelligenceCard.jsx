import { useEffect, useState } from "react";
import api from "../../services/api";

export default function VehicleIntelligenceCard({ vehicleId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIntelligence = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/maintenance/vehicle/${vehicleId}/intelligence`
        );

        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'intelligence véhicule");
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) fetchIntelligence();
  }, [vehicleId]);

  if (loading) return <Card>Chargement intelligence...</Card>;
  if (error) return <Card error>{error}</Card>;
  if (!data) return null;

  const { intelligence, maintenance } = data;

  const riskScore = intelligence?.risk_score ?? 0;
  const riskLevel = intelligence?.risk_level ?? "low";

  const riskConfig = {
    low: { color: "#10b981", bg: "#ecfdf5" },
    medium: { color: "#f59e0b", bg: "#fffbeb" },
    high: { color: "#ef4444", bg: "#fef2f2" },
  }[riskLevel] || { color: "#6b7280", bg: "#f3f4f6" };

  return (
    <div style={styles.container}>

      {/* ===================== INTELLIGENCE ===================== */}
      <Section title="📊 Intelligence">

        <div style={{ ...styles.intelCard, background: riskConfig.bg }}>

          <div style={styles.kpiGrid}>

            {/* SCORE */}
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>Risk Score</div>

              <div style={styles.kpiValue}>
                {riskScore}/100
              </div>

              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${riskScore}%`,
                    backgroundColor: riskConfig.color,
                  }}
                />
              </div>
            </div>

            {/* LEVEL */}
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>Risk Level</div>

              <div
                style={{
                  ...styles.badge,
                  backgroundColor: riskConfig.color,
                }}
              >
                {riskLevel.toUpperCase()}
              </div>
            </div>

          </div>
        </div>
      </Section>

      {/* ===================== ALERTS ===================== */}
      <Section title="🛠 Maintenance Alerts">

        {maintenance?.alerts?.length > 0 ? (
          maintenance.alerts.map((a) => (
            <div key={a.id} style={styles.alertCard}>
              <strong>{a.rule_name}</strong>

              <div style={styles.small}>
                Due: {a.due_km} km • Current: {a.current_km} km
              </div>

              <div style={styles.tag(riskLevel)}>
                {a.severity}
              </div>
            </div>
          ))
        ) : (
          <Empty text="Aucune alerte active" />
        )}

      </Section>

      {/* ===================== HISTORY ===================== */}
      <Section title="📋 Dernières actions">

        <Empty text="Historique maintenance non disponible (MVP)" />

      </Section>

      {/* ===================== FORECAST ===================== */}
      <Section title="🔮 Prochaines interventions">

        {maintenance?.timeline?.length > 0 ? (
          maintenance.timeline.map((t, i) => (
            <div key={i} style={styles.timelineCard}>
              <strong>{t.label}</strong>

              <div style={styles.small}>
                {t.km ? `📍 ${t.km} km` : ""}{" "}
                {t.date ? `📅 ${t.date}` : ""}
              </div>
            </div>
          ))
        ) : (
          <Empty text="Aucune estimation disponible" />
        )}

      </Section>

    </div>
  );
}

/* =========================
   UI COMPONENTS
========================= */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Card({ children, error }) {
  return (
    <div style={{ ...styles.card, color: error ? "red" : "#111" }}>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <div style={styles.empty}>{text}</div>;
}

/* =========================
   STYLES
========================= */

const styles = {

  container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  section: {
    padding: 15,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fff",
  },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 16,
  },

  intelCard: {
    padding: 15,
    borderRadius: 12,
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  kpi: {
    padding: 10,
    borderRadius: 10,
    background: "white",
  },

  kpiLabel: {
    fontSize: 12,
    color: "#6b7280",
  },

  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
    transition: "width 0.5s ease-in-out",
  },

  badge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  alertCard: {
    padding: 10,
    border: "1px solid #eee",
    borderRadius: 10,
    marginBottom: 8,
  },

  timelineCard: {
    padding: 10,
    border: "1px dashed #ddd",
    borderRadius: 10,
    marginBottom: 8,
  },

  small: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  empty: {
    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
  },

  card: {
    padding: 15,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    background: "white",
  },

  tag: (riskLevel) => ({
    marginTop: 6,
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 6,
    fontSize: 11,
    background:
      riskLevel === "high"
        ? "#fee2e2"
        : riskLevel === "medium"
        ? "#fef3c7"
        : "#e5e7eb",
  }),
};