import { useState, useEffect } from "react";

export default function VehicleModal({
  isOpen,
  onClose,
  onSave,
  loading,
  isEditMode,
  initialData,
}) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    plate_number: "",
    status: "active",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>
          {isEditMode ? "Edit Vehicle" : "Create Vehicle"}
        </h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />

        <input
          placeholder="Model"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        />

        <input
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />

        <input
          placeholder="Plate number"
          value={form.plate_number}
          onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div style={{ marginTop: "10px" }}>
          <button onClick={() => onSave(form)} disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update"
                : "Create"}
          </button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "20px",
  width: "400px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};