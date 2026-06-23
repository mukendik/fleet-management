import React from "react";

const VehicleAlertsPanel = ({ alerts }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Active Alerts</h3>

      {alerts.length === 0 && <p>No alerts 🎉</p>}

      {alerts.map((a) => (
        <div
          key={a.id}
          style={{
            padding: 10,
            marginBottom: 10,
            border: "1px solid #ddd",
            borderLeft: `5px solid ${
              a.severity === "critical" ? "red" : "orange"
            }`,
          }}
        >
          <strong>{a.rule_name}</strong>
          <div>KM: {a.current_km}</div>
          <div>Status: {a.severity}</div>
        </div>
      ))}
    </div>
  );
};

export default VehicleAlertsPanel;