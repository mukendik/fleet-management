import { useEffect, useState } from "react";

import AssignDriverModal from "../components/assignments/AssignDriverModal";
import CurrentDriverCard from "../components/assignments/CurrentDriverCard";
import AssignmentHistory from "../components/assignments/AssignmentHistory";

import { useAssignments } from "../hooks/useAssignments";
import { driverService } from "../services/driverService";

export default function VehicleDetail({ vehicleId }) {
  const {
    current,
    history,
    fetchCurrent,
    fetchHistory,
    assign,
    loading,
  } = useAssignments();

  const [modalOpen, setModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchCurrent(vehicleId);
    fetchHistory(vehicleId);

    driverService.getAll().then((res) => {
      setDrivers(res.data.items || res.data);
    });
  }, [vehicleId]);

  const handleAssign = async (driverId) => {
    await assign(vehicleId, driverId);
    setModalOpen(false);

    fetchCurrent(vehicleId);
    fetchHistory(vehicleId);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Vehicle Assignment</h1>

      <button onClick={() => setModalOpen(true)}>
        Assign Driver
      </button>

      <CurrentDriverCard assignment={current?.data} />

      <AssignmentHistory history={history?.data || []} />

      <AssignDriverModal
        isOpen={modalOpen}
        drivers={drivers}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssign}
        loading={loading}
      />
    </div>
  );
}