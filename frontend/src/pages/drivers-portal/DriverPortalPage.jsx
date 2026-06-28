import { useEffect, useState } from "react";
import api from "../../services/api";

export default function DriverPortalPage() {
  const driverId = 1; // TODO: remplacer par auth plus tard

  const [vehicle, setVehicle] = useState(null);
  const [mileage, setMileage] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await api.get(`/drivers/${driverId}/intelligence`);

        // on prend le dernier vehicle assigné si dispo
        const lastAssignment = res.data.assignments?.[0];

        setVehicle(lastAssignment?.vehicle || null);
      } catch (err) {
        console.error("Driver portal error", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const submitMileage = async () => {
    if (!vehicle?.id) return alert("No vehicle assigned");

    await api.post(`/vehicles/${vehicle.id}/mileage`, {
      mileage: Number(mileage),
    });

    alert("Mileage updated ✅");
    setMileage("");
  };

  const submitMaintenance = async () => {
    if (!vehicle?.id) return alert("No vehicle assigned");

    await api.post(`/vehicles/${vehicle.id}/maintenance`, {
      note,
    });

    alert("Maintenance logged ✅");
    setNote("");
  };

  if (loading) {
    return <div style={styles.loading}>Loading driver portal...</div>;
  }

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🚗 Driver Portal</h2>
        <p style={styles.sub}>
          Simple & fast vehicle management
        </p>
      </div>

      {/* VEHICLE CARD */}
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Your Vehicle</h3>

        {vehicle ? (
          <>
            <div style={styles.vehicleTitle}>
              🚘 {vehicle.brand} {vehicle.model}
            </div>

            <div style={styles.plate}>
              Plate: {vehicle.plate_number}
            </div>
          </>
        ) : (
          <div style={{ color: "#6b7280" }}>
            No vehicle assigned
          </div>
        )}
      </div>

      {/* MILEAGE */}
      <div style={styles.card}>
        <h3>📍 Update Mileage</h3>

        <input
          style={styles.input}
          placeholder="Enter mileage (km)"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />

        <button style={styles.button} onClick={submitMileage}>
          Submit Mileage
        </button>
      </div>

      {/* MAINTENANCE */}
      <div style={styles.card}>
        <h3>🔧 Maintenance</h3>

        <textarea
          style={styles.textarea}
          placeholder="Describe maintenance performed..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          style={{ ...styles.button, background: "#4f46e5" }}
          onClick={submitMaintenance}
        >
          Submit Maintenance
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.card}>
        <h3>⚡ Quick Actions</h3>

        <button style={styles.danger}>
          🚨 Report Issue
        </button>

        <button style={styles.secondary}>
          📞 Contact Fleet Manager
        </button>
      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 15,
    background: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  header: {
    marginBottom: 20,
  },

  sub: {
    margin: 0,
    color: "#6b7280",
    fontSize: 14,
  },

  card: {
    background: "white",
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    border: "1px solid #e5e7eb",
  },

  vehicleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },

  plate: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 14,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    marginTop: 10,
  },

  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    marginTop: 10,
    minHeight: 80,
  },

  button: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#111827",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondary: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "white",
  },

  danger: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#dc2626",
    color: "white",
    fontWeight: "bold",
  },

  loading: {
    padding: 20,
    color: "#6b7280",
  },
};