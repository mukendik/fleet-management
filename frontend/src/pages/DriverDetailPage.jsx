import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDriver() {
      try {
        setLoading(true);
        const res = await api.get(`/drivers/${id}`);
        setDriver(res.data);
      } catch (err) {
        console.error("Error loading driver", err);
      } finally {
        setLoading(false);
      }
    }

    loadDriver();
  }, [id]);

  if (loading) {
    return (
      <div style={pageStyle}>
        Loading driver...
      </div>
    );
  }

  if (!driver) {
    return (
      <div style={pageStyle}>
        No driver found
      </div>
    );
  }

  return (
    <div style={pageStyle}>

      {/* CONTENT CONTAINER */}
      <div style={containerStyle}>

        {/* HEADER */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>
            👨‍✈️ {driver.first_name} {driver.last_name}
          </h2>

          <button
            onClick={() => navigate("/drivers")}
            style={backBtn}
          >
            ← Back
          </button>
        </div>

        {/* GRID */}
        <div style={gridStyle}>
          <Card label="First Name" value={driver.first_name} />
          <Card label="Last Name" value={driver.last_name} />
          <Card label="Email" value={driver.email || "-"} />
          <Card label="Phone" value={driver.phone || "-"} />
          <Card label="License" value={driver.license_number} />
          <Card label="Status" value={driver.status} />
        </div>

        {/* FUTURE SECTION */}
        <div style={{ marginTop: 40 }}>
          <h3>Activity (coming soon)</h3>
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  background: "#f9fafb",
  padding: "20px",
  boxSizing: "border-box",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const backBtn = {
  padding: "8px 12px",
  border: "none",
  background: "#111827",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
};

const gridStyle = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 15,
};

function Card({ label, value }) {
  return (
    <div
      style={{
        padding: 15,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        background: "white",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: "600", marginTop: 5 }}>
        {value}
      </div>
    </div>
  );
}