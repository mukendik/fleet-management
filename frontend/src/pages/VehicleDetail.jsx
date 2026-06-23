import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:8000/vehicles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVehicle(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading vehicle...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  if (!vehicle) {
    return <div style={{ padding: 20 }}>Vehicle not found</div>;
  }

  return (
    <div style={{ padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>
          🚗 {vehicle.name} ({vehicle.plate_number})
        </h2>

        <button
          onClick={() => navigate("/vehicles")}
          style={{
            padding: "8px 12px",
            border: "none",
            background: "#111827",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      {/* INFO GRID */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 15,
        }}
      >
        <Card label="Brand" value={vehicle.brand} />
        <Card label="Model" value={vehicle.model} />
        <Card label="Year" value={vehicle.year} />
        <Card label="Mileage" value={`${vehicle.mileage || 0} km`} />
        <Card label="Fuel" value={vehicle.fuel_type} />
        <Card label="Status" value={vehicle.status} />
        <Card label="VIN" value={vehicle.vin_number || "-"} />
        <Card label="Transmission" value={vehicle.transmission} />
      </div>

      {/* FUTURE SECTIONS */}
      <div style={{ marginTop: 40 }}>
        <h3>📊 Intelligence (soon)</h3>
        <p>Risk score, predictions, maintenance suggestions...</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>🛠 Maintenance (soon)</h3>
        <p>Alerts, history, upcoming services...</p>
      </div>
    </div>
  );
}

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