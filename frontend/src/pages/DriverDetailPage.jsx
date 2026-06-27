import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import DriverIntelligenceCard from "../components/driver-intelligence/DriverIntelligenceCard";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/drivers/${id}/intelligence`);
        setData(res.data);

      } catch (err) {
        console.error("Driver intelligence error", err);
        setError("Failed to load driver intelligence");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <div style={container}>Loading intelligence...</div>;
  }

  if (error) {
    return <div style={containerError}>{error}</div>;
  }

  if (!data) {
    return <div style={container}>No driver intelligence found</div>;
  }

  const { driver, score, assignments, metrics } = data;

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <h2 style={{ margin: 0 }}>
          🧠 {driver?.first_name} {driver?.last_name}
        </h2>

        <button onClick={() => navigate("/drivers")} style={btn}>
          ← Back
        </button>
      </div>

      {/* METRICS */}
      <div style={grid}>
        <Card label="Assignments" value={metrics?.total_assignments || 0} />
        <Card label="Email" value={driver?.email || "-"} />
        <Card label="Phone" value={driver?.phone || "-"} />
        <Card label="Status" value={driver?.status || "-"} />
        <Card label="License" value={driver?.license_number || "-"} />
        <Card label="Driver ID" value={driver?.id || id} />
      </div>

      {/* DRIVER INTELLIGENCE */}
      <div style={{ marginTop: 40 }}>
          <DriverIntelligenceCard driverId={id} />
      </div>

    </div>
  );
}

/* ================= UI ================= */

const container = {
  padding: 24,
  background: "#f9fafb",
  minHeight: "100%",
  width: "100%",
  boxSizing: "border-box",
};

const containerError = {
  ...container,
  color: "#dc2626",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const btn = {
  padding: "8px 14px",
  border: "none",
  background: "#111827",
  color: "white",
  borderRadius: 8,
  cursor: "pointer",
};

const scoreBox = (score) => ({
  marginTop: 20,
  padding: 24,
  borderRadius: 14,
  color: "white",
  background:
    score > 70
      ? "#16a34a"
      : score > 40
      ? "#f59e0b"
      : "#dc2626",
});

const grid = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 15,
};

const section = {
  marginTop: 30,
};

const assignmentCard = {
  padding: 14,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  marginTop: 10,
  background: "white",
};

const empty = {
  padding: 12,
  color: "#6b7280",
};

const Card = ({ label, value }) => (
  <div style={card}>
    <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
    <div style={{ fontWeight: "bold" }}>{value}</div>
  </div>
);

const card = {
  padding: 12,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "white",
};