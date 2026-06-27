import { useEffect, useState } from "react";
import api from "../../services/api";

export default function DriverIntelligenceCard({ driverId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await api.get(
          `/drivers/${driverId}/intelligence`
        );

        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [driverId]);

  if (loading) {
    return <div style={loadingStyle}>Loading driver intelligence...</div>;
  }

  if (!data) {
    return <div style={emptyStyle}>No intelligence available.</div>;
  }

  const { score, metrics, assignments } = data;

  const scoreColor =
    score.value >= 70
      ? "#16a34a"
      : score.value >= 40
      ? "#f59e0b"
      : "#dc2626";

  const riskColor =
    score.level === "good"
      ? "#16a34a"
      : score.level === "medium"
      ? "#f59e0b"
      : "#dc2626";

  return (
    <div style={container}>

      {/* HEADER */}
      <h2 style={{ marginTop: 0 }}>
        🧠 Driver Intelligence
      </h2>

      {/* SCORE CARD */}
      <div
        style={{
          ...scoreBox,
          background: scoreColor,
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.9 }}>
          Driver Score
        </div>

        <div style={{ fontSize: 42, fontWeight: "bold" }}>
          {score.value}/100
        </div>

        <div>
          Risk: <b>{score.level}</b>
        </div>
      </div>

      {/* METRICS */}
      <div style={grid}>
        <Metric
          title="Driver Score"
          value={`${score.value}/100`}
          color="#2563eb"
        />

        <Metric
          title="Risk Level"
          value={score.level}
          color={riskColor}
        />

        <Metric
          title="Assignments"
          value={metrics.total_assignments}
          color="#7c3aed"
        />
      </div>

      {/* ASSIGNMENTS */}
      <div style={{ marginTop: 30 }}>
        <h3>🚗 Assignment History</h3>

        {assignments.length === 0 ? (
          <p style={{ color: "#6b7280" }}>
            No assignment.
          </p>
        ) : (
          assignments.map((a) => (
            <div key={a.id} style={assignmentCard}>
              <div style={{ fontWeight: 600 }}>
            🚗 {a.vehicle?.brand} {a.vehicle?.model}
            </div>

            <div style={{ fontSize: 12, color: "#6b7280" }}>
            Plate: {a.vehicle?.plate_number}
            </div>

              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Assignment ID: {a.id}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= UI ================= */

const container = {
  marginTop: 20,
  background: "#ffffff",
  borderRadius: 14,
  padding: 20,
  border: "1px solid #e5e7eb",
};

const loadingStyle = {
  padding: 20,
  color: "#6b7280",
};

const emptyStyle = {
  padding: 20,
  color: "#6b7280",
};

const scoreBox = {
  color: "white",
  padding: 20,
  borderRadius: 14,
  textAlign: "center",
  marginTop: 15,
  marginBottom: 25,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 15,
};

const assignmentCard = {
  padding: 12,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  marginBottom: 10,
  background: "#f9fafb",
};

function Metric({ title, value, color }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: "#f9fafb",
        borderLeft: `5px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280" }}>
        {title}
      </div>

      <div style={{ fontSize: 20, fontWeight: "bold" }}>
        {value}
      </div>
    </div>
  );
}