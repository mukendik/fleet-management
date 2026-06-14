import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  brand: "",
  model: "",
  year: "",
  plate_number: "",
  vin_number: "",
  mileage: 0,
  fuel_type: "petrol",
  status: "active",
  transmission: "",
};

const fuelOptions = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Essence" },
  { value: "electric", label: "Électrique" },
  { value: "hybrid", label: "Hybride" },
];

const statusOptions = [
  { value: "active", label: "Actif" },
  { value: "out_of_service", label: "Hors Service" },
  { value: "maintenance", label: "Maintenance" },
];

const transmissionOptions = [
  { value: "", label: "Non défini" },
  { value: "manual", label: "Manuelle" },
  { value: "automatic", label: "Automatique" },
];

export default function VehicleModal({
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
        name: initialData.name || "",
        brand: initialData.brand || "",
        model: initialData.model || "",
        plate_number: initialData.plate_number || "",
        vin_number: initialData.vin_number || "",
        mileage: initialData.mileage ?? 0,
        year: initialData.year ? String(initialData.year) : "",
        fuel_type: initialData.fuel_type || "petrol",
        status: initialData.status || "active",
        transmission: initialData.transmission || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),

      plate_number: form.plate_number.trim(),

      year: form.year ? Number(form.year) : null,

      mileage: form.mileage
        ? Number(form.mileage)
        : 0,

      fuel_type: form.fuel_type,

      status: form.status,

      transmission:
        form.transmission?.trim() !== ""
          ? form.transmission
          : null,

      vin_number:
        form.vin_number?.trim() !== ""
          ? form.vin_number.trim()
          : null,
    };

    console.log("Vehicle payload:", payload);

    onSave(payload);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>
          {initialData
            ? "Modifier véhicule"
            : "Créer véhicule"}
        </h2>

        <input
          placeholder="Nom"
          value={form.name}
          onChange={(e) =>
            handleChange("name", e.target.value)
          }
        />

        <input
          placeholder="Marque"
          value={form.brand}
          onChange={(e) =>
            handleChange("brand", e.target.value)
          }
        />

        <input
          placeholder="Modèle"
          value={form.model}
          onChange={(e) =>
            handleChange("model", e.target.value)
          }
        />

        <input
          placeholder="Immatriculation"
          value={form.plate_number}
          onChange={(e) =>
            handleChange("plate_number", e.target.value)
          }
        />

        <input
          placeholder="VIN (optionnel)"
          value={form.vin_number}
          onChange={(e) =>
            handleChange("vin_number", e.target.value)
          }
        />

        <input
          placeholder="Kilométrage"
          type="number"
          min="0"
          value={form.mileage}
          onChange={(e) =>
            handleChange("mileage", e.target.value)
          }
        />

        <input
          placeholder="Année"
          type="number"
          min="1900"
          max="2100"
          value={form.year}
          onChange={(e) =>
            handleChange("year", e.target.value)
          }
        />

        <select
          value={form.fuel_type}
          onChange={(e) =>
            handleChange("fuel_type", e.target.value)
          }
        >
          {fuelOptions.map((fuel) => (
            <option
              key={fuel.value}
              value={fuel.value}
            >
              {fuel.label}
            </option>
          ))}
        </select>

        <select
          value={form.status}
          onChange={(e) =>
            handleChange("status", e.target.value)
          }
        >
          {statusOptions.map((status) => (
            <option
              key={status.value}
              value={status.value}
            >
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={form.transmission}
          onChange={(e) =>
            handleChange("transmission", e.target.value)
          }
        >
          {transmissionOptions.map((transmission) => (
            <option
              key={transmission.value}
              value={transmission.value}
            >
              {transmission.label}
            </option>
          ))}
        </select>

        <div style={styles.actions}>
          <button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Enregistrement..."
              : initialData
              ? "Mettre à jour"
              : "Créer"}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
          >
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
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    padding: 20,
    width: 450,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
};