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
  const [vehicleToDeleteId, setVehicleToDeleteId] = useState(null);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);


  const load = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data.items);
    } catch (err) {
      navigate("/login");
    }
  };

  const openCreateModal = () => {
    setSelectedVehicle(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!vehicleToDeleteId) return;

    try {
      setLoading(true);

      await deleteVehicle(vehicleToDeleteId);

      setConfirmOpen(false);
      setVehicleToDeleteId(null);

      await load();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const openDeleteModal = (id) => {
    setVehicleToDeleteId(id);
    setConfirmOpen(true);
  };

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

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
      <button onClick={openCreateModal}>
        + Create Vehicle
      </button>

      <VehicleTable
        data={vehicles}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
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
        message="Are you sure you want to delete this vehicle?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}