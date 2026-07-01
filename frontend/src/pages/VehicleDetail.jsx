import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

import VehicleIntelligenceCard from "../components/vehicle-intelligence/VehicleIntelligenceCard";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [vehicleRes, currentRes] = await Promise.all([
          api.get(`/maintenance/vehicle/${id}/intelligence`),
          api.get(`/assignments/vehicle/${id}/current`),
        ]);

        setData(vehicleRes.data);
        setCurrent(currentRes.data);
      } catch (err) {
        console.error("Error loading vehicle detail", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div>Loading vehicle...</div>;
  if (!data) return <div>No data available</div>;

  const vehicle = data.vehicle;

  return (
    <div style={styles.page}>

      {/* HEADER SaaS */}
      <div style={styles.header}>
        <div>
          <h2>
            🚗 {vehicle.name}
          </h2>

          <div style={styles.sub}>
            {vehicle.plate_number}
          </div>
        </div>

        <div style={styles.actions}>
          <span
            style={{
              ...styles.badge,
              background:
                vehicle.status === "active" ? "#16a34a" : "#f59e0b",
            }}
          >
            {vehicle.status?.toUpperCase()}
          </span>

          <button onClick={() => navigate("/vehicles")} style={styles.btn}>
            Back
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div style={styles.grid}>
        <Card label="Brand" value={vehicle.brand} />
        <Card label="Model" value={vehicle.model} />
        <Card label="Year" value={vehicle.year} />
        <Card label="Mileage" value={`${vehicle.mileage || 0} km`} />
        <Card label="Fuel" value={vehicle.fuel_type || "-"} />
        <Card label="Transmission" value={vehicle.transmission || "-"} />
        <Card label="VIN" value={vehicle.vin_number || "-"} />
        <Card label="Company ID" value={vehicle.company_id} />
      </div>

      {/* CURRENT ASSIGNMENT (NEW 🚀) */}
      <div style={styles.section}>
        <h3>Current Assignment</h3>

        {current?.driver ? (
          <div style={styles.assignmentCard}>
            <div>
              <strong>
                {current.driver.first_name} {current.driver.last_name}
              </strong>

              <div style={styles.muted}>
                {current.driver.email}
              </div>
            </div>

            <span style={styles.activeBadge}>ACTIVE</span>
          </div>
        ) : (
          <div style={styles.empty}>
            No driver assigned
          </div>
        )}
      </div>

      {/* INTELLIGENCE */}
      <div style={{ marginTop: 30 }}>
        <VehicleIntelligenceCard vehicleId={id} />
      </div>

    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */
function Card({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
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
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },

  card: {
    padding: 15,
    background: "white",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 5,
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
};