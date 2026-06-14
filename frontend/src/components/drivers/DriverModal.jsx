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
      license_expiry_date: form.license_expiry_date || null,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{initialData ? "Modifier chauffeur" : "Créer chauffeur"}</h2>

        <input
          placeholder="Prénom"
          value={form.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
        />

        <input
          placeholder="Nom"
          value={form.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
        />

        <input
          placeholder="Téléphone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <input
          placeholder="Numéro permis"
          value={form.license_number}
          onChange={(e) => handleChange("license_number", e.target.value)}
        />

        <input
          type="date"
          value={form.license_expiry_date || ""}
          onChange={(e) =>
            handleChange("license_expiry_date", e.target.value)
          }
        />

        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div style={{ marginTop: 10 }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : initialData ? "Mettre à jour" : "Créer"}
          </button>

          <button onClick={onClose} style={{ marginLeft: 10 }}>
            Annuler
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
    width: 420,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};