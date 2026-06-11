import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VehicleTable from "../components/vehicles/VehicleTable";
import VehicleModal from "../components/vehicles/VehicleModal";
import ConfirmModal from "../components/vehicles/ConfirmModal";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

export default function Vehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const load = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data.items);
    } catch (err) {
      navigate("/login");
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteVehicle(vehicleToDelete.id);

      setConfirmOpen(false);
      setVehicleToDelete(null);

      await loadVehicles();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (form) => {
    setLoading(true);

    try {
      if (selectedVehicle) {
        await updateVehicle(selectedVehicle.id, form);
      } else {
        await createVehicle(form);
      }

      setIsModalOpen(false);
      setSelectedVehicle(null);

      await load();
    } finally {
      setLoading(false);
    }
  };

   return (
    <div style={{ padding: 20 }}>
            <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
    <h1
      style={{
        margin: 0,
        fontSize: "28px",
      }}
    >
      🚗 Fleet Manager
    </h1>

    <p
      style={{
        margin: "4px 0 0",
        color: "#6b7280",
      }}
    >
      Manage your vehicles
    </p>
  </div>
        <span
          style={{
            color: "#374151",
            fontWeight: "500",
          }}
        >
          Welcome Ghislain
        </span>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => {
          setSelectedVehicle(null);
          setIsModalOpen(true);
        }}
      >
        + Create Vehicle
      </button>

      <VehicleTable
        data={vehicles}
        onEdit={(v) => {
          setSelectedVehicle(v);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <VehicleModal
        isOpen={isModalOpen}
        initialData={selectedVehicle}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        loading={loading}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Vehicle"
        message={`Are you sure you want to delete ${vehicleToDelete?.name} ?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        onClose={() => {
          setConfirmOpen(false);
          setVehicleToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}