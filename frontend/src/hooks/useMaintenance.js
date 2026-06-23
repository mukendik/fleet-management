import { useEffect, useState } from "react";
import {
  getMaintenanceDashboard,
  getMaintenanceAlerts,
  runMaintenanceScan,
  resolveAlert,
} from "../api/maintenanceService";

export const useMaintenance = () => {
  const [dashboard, setDashboard] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);

    try {
      const [dash, alertData] = await Promise.all([
        getMaintenanceDashboard(),
        getMaintenanceAlerts(),
      ]);

      setDashboard(dash);
      setAlerts(alertData.items || []);
    } finally {
      setLoading(false);
    }
  };

  const scan = async () => {
    await runMaintenanceScan();
    await fetchAll();
  };

  const resolve = async (id) => {
    await resolveAlert(id);
    await fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    dashboard,
    alerts,
    loading,
    refresh: fetchAll,
    scan,
    resolve,
  };
};