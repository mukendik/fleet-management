import React from "react";

const MaintenanceStats = ({ dashboard }) => {
  if (!dashboard) return null;

  return (
    <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
      <div>🚨 Alerts: {dashboard.total_alerts}</div>
      <div>⚠️ Warning: {dashboard.warning}</div>
      <div>🔴 Critical: {dashboard.critical}</div>
      <div>🚗 At Risk: {dashboard.vehicles_at_risk}</div>
    </div>
  );
};

export default MaintenanceStats;