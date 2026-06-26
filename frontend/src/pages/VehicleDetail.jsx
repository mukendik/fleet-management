import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

import VehicleIntelligenceCard from "../components/vehicle-intelligence/VehicleIntelligenceCard";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntelligence() {
      try {
        setLoading(true);

        const res = await api.get(
          `/maintenance/vehicle/${id}/intelligence`
        );

        setData(res.data);
      } catch (err) {
        console.error("Error loading vehicle intelligence", err);
      } finally {
        setLoading(false);
      }
    }

    loadIntelligence();
  }, [id]);

  if (loading) return <div>Loading vehicle...</div>;
  if (!data) return <div>No data available</div>;

  const vehicle = data.vehicle;

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
        <Card label="Fuel" value={vehicle.fuel_type || "-"} />
        <Card label="Status" value={vehicle.status} />
        <Card label="VIN" value={vehicle.vin_number || "-"} />
        <Card label="Transmission" value={vehicle.transmission || "-"} />
      </div>

      {/* INTELLIGENCE */}
      <div style={{ marginTop: 40 }}>
        <VehicleIntelligenceCard data={data} />
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