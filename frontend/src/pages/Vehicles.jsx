import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

import VehicleModal from "../components/VehicleModal";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const navigate = useNavigate();

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data.items);
    } catch (err) {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSave = async (formData) => {
    try {
      setLoading(true);

      if (isEditMode) {
        await updateVehicle(selectedVehicle.id, formData);
      } else {
        await createVehicle(formData);
      }

      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedVehicle(null);

      await loadVehicles();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setIsEditMode(true);
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteVehicle(id);
    await loadVehicles();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicles ({vehicles.length})</h1>

      <button onClick={openCreateModal}>+ Create Vehicle</button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>

      <table style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Plate Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.name}</td>
              <td>{vehicle.brand || "-"}</td>
              <td>{vehicle.model || "-"}</td>
              <td>{vehicle.year || "-"}</td>
              <td>{vehicle.plate_number}</td>
              <td>{vehicle.status}</td>
              <td>
                <button>View</button>
                <button onClick={() => openEditModal(vehicle)}>Edit</button>
                <button onClick={() => handleDelete(vehicle.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
        onSave={handleSave}
        loading={loading}
        isEditMode={isEditMode}
        initialData={selectedVehicle}
      />
    </div>
  );
}