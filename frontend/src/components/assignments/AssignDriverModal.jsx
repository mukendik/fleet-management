import { useEffect, useState } from "react";

export default function AssignDriverModal({
  isOpen,
  drivers,
  onClose,
  onAssign,
  loading,
}) {
  const [driverId, setDriverId] = useState("");

  useEffect(() => {
    if (!isOpen) setDriverId("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!driverId) return;
    onAssign(driverId);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Assign Driver</h2>

        <select
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        >
          <option value="">Select driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.first_name} {d.last_name}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Assigning..." : "Assign"}
          </button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "white",
    padding: 20,
    width: 400,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};