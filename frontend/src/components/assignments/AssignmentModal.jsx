import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AssignmentModal({ onClose, onSuccess }) {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const [d, v] = await Promise.all([
        api.get("/drivers"),
        api.get("/vehicles"),
      ]);

      setDrivers(d.data?.items || d.data || []);
      setVehicles(v.data?.items || v.data || []);
    } catch (err) {
      console.error("Modal load error:", err);
      setDrivers([]);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    try {
      if (!driverId || !vehicleId) return;

      await api.post("/assignments", {
        driver_id: Number(driverId),
        vehicle_id: Number(vehicleId),
      });

      onSuccess();
    } catch (err) {
      console.error("Assignment error:", err);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <h3>New Assignment</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              style={styles.select}
            >
              <option value="">Select driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name} {d.last_name}
                </option>
              ))}
            </select>

            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              style={styles.select}
            >
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.plate_number})
                </option>
              ))}
            </select>

            <div style={styles.actions}>
              <button onClick={onClose}>
                Cancel
              </button>

              <button onClick={submit} style={styles.save}>
                Assign
              </button>
            </div>
          </>
        )}

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
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    width: 420,
  },
  select: {
    width: "100%",
    padding: 10,
    marginTop: 10,
  },
  actions: {
    marginTop: 15,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  save: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
  },
};