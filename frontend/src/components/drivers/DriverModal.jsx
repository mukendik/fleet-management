import { useEffect, useState } from "react";

const emptyForm = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  license_number: "",
  license_expiry_date: "",
  status: "active",
};

const statusOptions = [
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
];

export default function DriverModal({
  isOpen,
  initialData,
  onClose,
  onSave,
  loading,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        license_number: initialData.license_number || "",
        license_expiry_date: initialData.license_expiry_date || "",
        status: initialData.status || "active",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      license_expiry_date:
        form.license_expiry_date || null,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {initialData ? "Modifier chauffeur" : "Créer chauffeur"}
        </h2>

        <input
          style={styles.input}
          placeholder="Prénom"
          value={form.first_name}
          onChange={(e) =>
            handleChange("first_name", e.target.value)
          }
        />

        <input
          style={styles.input}
          placeholder="Nom"
          value={form.last_name}
          onChange={(e) =>
            handleChange("last_name", e.target.value)
          }
        />

        <input
          style={styles.input}
          placeholder="Téléphone"
          value={form.phone}
          onChange={(e) =>
            handleChange("phone", e.target.value)
          }
        />

        <input
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            handleChange("email", e.target.value)
          }
        />

        <input
          style={styles.input}
          placeholder="Numéro permis"
          value={form.license_number}
          onChange={(e) =>
            handleChange("license_number", e.target.value)
          }
        />

        <input
          style={styles.input}
          type="date"
          value={form.license_expiry_date || ""}
          onChange={(e) =>
            handleChange(
              "license_expiry_date",
              e.target.value
            )
          }
        />

        <select
          style={styles.select}
          value={form.status}
          onChange={(e) =>
            handleChange("status", e.target.value)
          }
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div style={styles.actions}>
          <button
            style={styles.saveBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : initialData
              ? "Update"
              : "Create"}
          </button>

          <button
            style={styles.cancelBtn}
            onClick={onClose}
          >
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
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "white",
    padding: 20,
    width: 420,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  title: {
    marginBottom: 10,
  },

  input: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },

  select: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
  },

  actions: {
    marginTop: 10,
    display: "flex",
    gap: 10,
  },

  saveBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },

  cancelBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#e5e7eb",
    cursor: "pointer",
    fontSize: "14px",
  },
};