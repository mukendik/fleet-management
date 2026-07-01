import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

import DriverIntelligenceCard from "../components/driver-intelligence/DriverIntelligenceCard";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [driverRes, currentRes] = await Promise.all([
          api.get(`/drivers/${id}/intelligence`),
          api.get(`/assignments/driver/${id}/current`),
        ]);

        setData(driverRes.data);
        setCurrent(currentRes.data);

      } catch (err) {
        console.error("Driver intelligence error", err);
        setError("Failed to load driver intelligence");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!data) return <div style={styles.container}>No data</div>;

  const { driver, metrics } = data;

  return (
    <div style={styles.page}>

      {/* HEADER SaaS */}
      <div style={styles.header}>
        <div>
          <h2>
            🧠 {driver?.first_name} {driver?.last_name}
          </h2>

          <div style={styles.sub}>
            {driver?.email}
          </div>
        </div>

        <div style={styles.actions}>
          <span
            style={{
              ...styles.badge,
              background:
                driver?.status === "active" ? "#16a34a" : "#f59e0b",
            }}
          >
            {driver?.status?.toUpperCase()}
          </span>

          <button onClick={() => navigate("/drivers")} style={styles.btn}>
            Back
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div style={styles.grid}>
        <Card label="Assignments" value={metrics?.total_assignments || 0} />
        <Card label="Email" value={driver?.email || "-"} />
        <Card label="Phone" value={driver?.phone || "-"} />
        <Card label="License" value={driver?.license_number || "-"} />
        <Card label="Driver ID" value={driver?.id || id} />
        <Card label="Company ID" value={driver?.company_id || "-"} />
      </div>

      {/* CURRENT ASSIGNMENT (NEW 🚀) */}
      <div style={styles.section}>
        <h3>Current Assignment</h3>

        {current?.vehicle ? (
          <div style={styles.assignmentCard}>
            <div>
              <strong>{current.vehicle.name}</strong>
              <div style={styles.muted}>
                {current.vehicle.plate_number}
              </div>
            </div>

            <span style={styles.activeBadge}>ACTIVE</span>
          </div>
        ) : (
          <div style={styles.empty}>
            No vehicle assigned
          </div>
        )}
      </div>

      {/* INTELLIGENCE */}
      <div style={{ marginTop: 30 }}>
        <DriverIntelligenceCard driverId={id} />
      </div>

    </div>
  );
}

/* ================= UI ================= */

const styles = {
  page: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sub: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    color: "white",
    fontSize: 12,
  },

  btn: {
    padding: "6px 10px",
    border: "none",
    background: "#111827",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },

  section: {
    background: "white",
    padding: 15,
    borderRadius: 12,
  },

  assignmentCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    background: "#f3f4f6",
    borderRadius: 10,
  },

  activeBadge: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "#16a34a",
    color: "white",
    fontSize: 11,
  },

  muted: {
    fontSize: 12,
    color: "#6b7280",
  },

  empty: {
    padding: 10,
    background: "#fef3c7",
    borderRadius: 8,
  },

  error: {
    padding: 20,
    color: "#dc2626",
  },
};

/* ================= CARD ================= */

function Card({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

styles.card = {
  padding: 15,
  background: "white",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

styles.label = {
  fontSize: 12,
  color: "#6b7280",
};

styles.value = {
  fontSize: 15,
  fontWeight: "600",
  marginTop: 5,
};