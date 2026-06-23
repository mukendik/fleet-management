import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleIntelligence } from "./../services/maintenanceService";

import VehicleRiskCard from "../components/vehicle-intelligence/VehicleRiskCard";
import MaintenanceTimeline from "../components/vehicle-intelligence/MaintenanceTimeline";
import VehicleAlertsPanel from "../components/vehicle-intelligence/VehicleAlertsPanel";

const VehicleIntelligencePage = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getVehicleIntelligence(id);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div>Loading intelligence...</div>;
  if (!data) return <div>No data</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Vehicle Intelligence</h1>

      <VehicleRiskCard risk={data.risk} vehicle={data.vehicle} />

      <MaintenanceTimeline timeline={data.timeline} />

      <VehicleAlertsPanel alerts={data.alerts} />
    </div>
  );
};

export default VehicleIntelligencePage;