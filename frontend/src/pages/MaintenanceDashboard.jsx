import React from "react";
import { useMaintenance } from "../hooks/useMaintenance";
import MaintenanceStats from "../components/maintenance/MaintenanceStats";
import AlertsTable from "../components/maintenance/AlertsTable";

const MaintenanceDashboard = () => {
  const { dashboard, alerts, loading, scan, resolve } = useMaintenance();

  if (loading) return <div>Loading maintenance...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Maintenance Dashboard</h1>

      <button onClick={scan}>
        Run Full Scan
      </button>

      <MaintenanceStats dashboard={dashboard} />

      <AlertsTable alerts={alerts} onResolve={resolve} />
    </div>
  );
};

export default MaintenanceDashboard;