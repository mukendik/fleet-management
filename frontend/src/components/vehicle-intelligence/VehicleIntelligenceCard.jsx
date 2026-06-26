import React from "react";

export default function VehicleIntelligenceCard({ data }) {
  if (!data) return null;

  const { intelligence, maintenance } = data;

  const riskColor =
    intelligence?.risk_level === "high"
      ? "#ef4444"
      : intelligence?.risk_level === "medium"
      ? "#f59e0b"
      : "#10b981";

  return (
    <div style={styles.wrapper}>
      {/* HEADER */}
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Vehicle Intelligence</h3>

        <div
          style={{
            ...styles.badge,
            backgroundColor: riskColor,
          }}
        >
          {intelligence?.risk_level?.toUpperCase() || "LOW"}
        </div>
      </div>

      {/* RISK SCORE */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Risk Score</div>

        <div style={styles.scoreRow}>
          <div style={styles.scoreValue}>
            {intelligence?.risk_score ?? 0}/100
          </div>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${intelligence?.risk_score ?? 0}%`,
                backgroundColor: riskColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* PREDICTIONS (placeholder futur IA) */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Predictions</div>
        <div style={styles.placeholder}>
          {intelligence?.predictions || "No AI predictions available yet"}
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Maintenance Suggestions</div>

        <div style={styles.placeholder}>
          {intelligence?.suggestions || "No suggestions available yet"}
        </div>
      </div>

      {/* MAINTENANCE ALERTS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Active Alerts</div>

        {maintenance?.alerts?.length > 0 ? (
          <div style={styles.alertList}>
            {maintenance.alerts.map((a) => (
              <div key={a.id} style={styles.alertCard}>
                <div style={styles.alertTitle}>{a.rule_name}</div>

                <div style={styles.alertMeta}>
                  <span>⚠️ {a.severity}</span>
                  <span>KM: {a.current_km}</span>
                  <span>Due: {a.due_km}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.placeholderSuccess}>
            No active maintenance alerts 🎉
          </div>
        )}
      </div>

      {/* TIMELINE */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Maintenance Timeline</div>

        <div style={styles.timeline}>
          {maintenance?.timeline?.map((t, i) => (
            <div key={i} style={styles.timelineItem}>
              <div style={styles.timelineDot} />
              <div>
                <div style={styles.timelineLabel}>{t.label}</div>
                <div style={styles.timelineSub}>
                  {t.km ? `${t.km} km` : ""}
                  {t.date ? ` • ${t.date}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =======================
   STYLES
======================= */

const styles = {
  wrapper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    backgroundColor: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 18,
  },

  badge: {
    color: "white",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  scoreValue: {
    fontSize: 22,
    fontWeight: "bold",
    minWidth: 80,
  },

  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  placeholder: {
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    color: "#6b7280",
    fontSize: 13,
  },

  placeholderSuccess: {
    padding: 12,
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
    color: "#10b981",
    fontSize: 13,
  },

  alertList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  alertCard: {
    padding: 12,
    border: "1px solid #f3f4f6",
    borderRadius: 10,
    backgroundColor: "#fff7ed",
  },

  alertTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  alertMeta: {
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#6b7280",
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  timelineItem: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },

  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    marginTop: 5,
  },

  timelineLabel: {
    fontWeight: "600",
    fontSize: 14,
  },

  timelineSub: {
    fontSize: 12,
    color: "#6b7280",
  },
};