import api from "./axios";

// DASHBOARD
export const getMaintenanceDashboard = async () => {
  const res = await api.get("/maintenance/dashboard");
  return res.data;
};

// ALERTS
export const getMaintenanceAlerts = async (params = {}) => {
  const res = await api.get("/maintenance/alerts", { params });
  return res.data;
};

// RISK SCORE
export const getVehicleRisk = async (vehicleId) => {
  const res = await api.get(`/maintenance/vehicle/${vehicleId}/risk`);
  return res.data;
};

// SCAN
export const runMaintenanceScan = async () => {
  const res = await api.post("/maintenance/scan");
  return res.data;
};

// RESOLVE ALERT
export const resolveAlert = async (alertId) => {
  const res = await api.put(`/maintenance/alerts/${alertId}/resolve`);
  return res.data;
};

export const getVehicleIntelligence = async (vehicleId) => {
  const res = await api.get(`/maintenance/vehicle/${vehicleId}/intelligence`);
  return res.data;
};