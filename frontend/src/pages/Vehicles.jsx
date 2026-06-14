import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VehicleTable from "../components/vehicles/VehicleTable";
import VehicleModal from "../components/vehicles/VehicleModal";
import ConfirmModal from "../components/vehicles/ConfirmModal";

import { useVehicles } from "../hooks/useVehicles";
import { useToast } from "../components/ui/toast";
import { getApiErrorMessage } from "../utils/apiError";

export default function Vehicles() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    vehicles,
    loading,
    total,
    pages,
    fetchVehicles,
    create,
    update,
    remove,
  } = useVehicles(navigate);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [brand, setBrand] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔥 FETCH CENTRAL
  useEffect(() => {
    fetchVehicles({
      page: currentPage,
      limit,
      search,
      status,
      brand,
    });
  }, [currentPage, limit, search, status, brand]);

  const refetch = () => {
    fetchVehicles({
      page: currentPage,
      limit,
      search,
      status,
      brand,
    });
  };

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

  // ======================
  // CREATE / UPDATE
  // ======================
  const handleSave = async (form) => {
    try {
      if (isEditMode) {
        await update(selectedVehicle.id, form);
        toast("Vehicle updated successfully", "success");
      } else {
        await create(form);
        toast("Vehicle created successfully", "success");
      }

      setIsModalOpen(false);
      setSelectedVehicle(null);
      refetch();
    } catch (err) {
      toast(getApiErrorMessage(err), "error");
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await remove(deleteId);
      toast("Vehicle deleted successfully", "success");

      setConfirmOpen(false);
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast(getApiErrorMessage(err), "error");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      {/* ACTION BAR */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>

        <button onClick={openCreate}>+ Create Vehicle</button>

        <input
          placeholder="Search plate..."
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setCurrentPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="out_of_service">Out of service</option>
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setCurrentPage(1);
            setLimit(Number(e.target.value));
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* TABLE */}
      <VehicleTable
        data={vehicles}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* PAGINATION */}
      <div style={{ marginTop: 15, display: "flex", gap: 10 }}>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {pages} ({total})
        </span>

        <button
          disabled={currentPage === pages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>

      </div>

      {/* MODALS */}
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