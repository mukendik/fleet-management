import React from "react";

const getColor = (level) => {
  switch (level) {
    case "healthy": return "green";
    case "attention": return "orange";
    case "risk": return "red";
    case "critical": return "darkred";
    default: return "gray";
  }
};

const VehicleRiskCard = ({ risk, vehicle }) => {
  return (
    <div style={{
      padding: 15,
      border: "1px solid #ddd",
      borderRadius: 8,
      marginBottom: 20
    }}>
      <h2>{vehicle.name} ({vehicle.plate_number})</h2>

      <div style={{ fontSize: 18 }}>
        Risk Score:{" "}
        <span style={{ color: getColor(risk.level), fontWeight: "bold" }}>
          {risk.score} ({risk.level})
        </span>
      </div>
    </div>
  );
};

export default VehicleRiskCard;