import { useEffect, useState } from "react";

export default function VehicleModal({
  isOpen,
  initialData,
  onClose,
  onSave,
  loading,
}) {
  const emptyForm = {
    name: "",
    brand: "",
    model: "",
    year: "",
    plate_number: "",
    status: "active",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{initialData ? "Edit Vehicle" : "Create Vehicle"}</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Brand"
          value={form.brand || ""}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />

        <input
          placeholder="Model"
          value={form.model || ""}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        />

        <input
          placeholder="Year"
          value={form.year || ""}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />

        <input
          placeholder="Plate number"
          value={form.plate_number || ""}
          onChange={(e) =>
            setForm({ ...form, plate_number: e.target.value })
          }
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div style={{ marginTop: 10 }}>
          <button onClick={() => onSave(form)} disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update" : "Create"}
          </button>

          <button onClick={onClose} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: 20,
    width: 400,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};