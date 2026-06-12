import { useState } from "react";
import { useNavigate } from "react-router-dom";

import VehicleTable from "../components/vehicles/VehicleTable";
import VehicleModal from "../components/vehicles/VehicleModal";
import ConfirmModal from "../components/vehicles/ConfirmModal";

import { useVehicles } from "../hooks/useVehicles";

export default function Vehicles() {
  const navigate = useNavigate();

  const {
    vehicles,
    loading,
    create,
    update,
    remove,
  } = useVehicles(navigate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openCreate = () => {
    setSelectedVehicle(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEdit = (v) => {
    setSelectedVehicle(v);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleSave = async (form) => {
    if (isEditMode) {
      await update(selectedVehicle.id, form);
    } else {
      await create(form);
    }

    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await remove(deleteId);

    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <div style={{ padding: 20 }}>

      <button onClick={openCreate}>
        + Create Vehicle
      </button>

      <VehicleTable
        data={vehicles}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <VehicleModal
        isOpen={isModalOpen}
        initialData={selectedVehicle}
        isEditMode={isEditMode}
        loading={loading}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Vehicle"
        message="Are you sure?"
        loading={loading}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

    </div>
  );
}