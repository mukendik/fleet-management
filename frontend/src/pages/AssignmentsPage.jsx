import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { assignmentService } from "../services/assignmentService";
import { driverService } from "../services/driverService";

export default function AssignmentsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // -------------------------
  // STATE
  // -------------------------
  const [vehicle, setVehicle] = useState(null);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState("");
  const [showModal, setShowModal] = useState(false);

  // -------------------------
  // LOAD DATA
  // -------------------------
  const load = async () => {
    setLoading(true);

    try {
    const currentRes = await assignmentService.getCurrent(id);
    const historyRes = await assignmentService.getHistory(id);
    const driversRes = await driverService.getAll();

    setCurrent(currentRes.data || null);
    setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
    setDrivers(driversRes.data?.items || []);
    } catch (err) {
       console.error("❌ LOAD FAILED:", err);
       console.error("❌ DETAILS:", err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 IMPORTANT: load immédiat + polling propre
  useEffect(() => {
    load(); // initial fetch immédiat

    const interval = setInterval(() => {
      load();
    }, 15000); // 15s (plus réactif que 30s)

    return () => clearInterval(interval);
  }, [id]);

  // -------------------------
  // VEHICLE HEADER
  // -------------------------
  useEffect(() => {
    if (location.state?.vehicle) {
      setVehicle(location.state.vehicle);
    }
  }, [location.state]);

  // -------------------------
  // ASSIGN DRIVER
  // -------------------------
  const handleAssign = async () => {
    try {
      if (!selectedDriver) return;

      await assignmentService.create({
        vehicle_id: Number(id),
        driver_id: Number(selectedDriver),
      });

      setShowModal(false);
      setSelectedDriver("");
      await load();
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  // -------------------------
  // UNASSIGN DRIVER
  // -------------------------
  const handleUnassign = async () => {
    if (!current?.id) return;

    const confirm = window.confirm(
      "Are you sure you want to unassign this driver?"
    );

    if (!confirm) return;

    try {
      await assignmentService.remove(current.id);
      await load();
    } catch (err) {
      console.error("Unassign error:", err);
    }
  };

  // -------------------------
  // SAFE RENDER DRIVER
  // -------------------------
  const renderDriver = (driver) => {
    if (!driver) return <span>Unknown driver</span>;

    return (
      <strong>
        {driver.first_name || "?"} {driver.last_name || "?"}
      </strong>
    );
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>

      {/* BACK */}
      <button onClick={() => navigate("/vehicles")} style={{ marginBottom: 20 }}>
        ← Back
      </button>

      <h1 style={{ marginBottom: 20 }}>Vehicle Assignment</h1>

      {/* VEHICLE HEADER */}
      {vehicle && (
        <div style={{
          padding: 15,
          background: "#f9fafb",
          borderRadius: 10,
          marginBottom: 20,
          border: "1px solid #e5e7eb",
        }}>
          <h2 style={{ margin: 0 }}>{vehicle.name}</h2>
          <p style={{ margin: "5px 0" }}>
            {vehicle.brand} {vehicle.model}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Plate:</strong> {vehicle.plate_number}
          </p>
        </div>
      )}

      {/* CURRENT */}
      <div style={{
        padding: 15,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        marginBottom: 20,
      }}>
        <h3>Current Driver</h3>

        {loading ? (
          <p>Loading...</p>
        ) : current?.driver ? (
          <>
            <p>{renderDriver(current.driver)}</p>
            <p>{current.driver.license_number || "-"}</p>
            <p>Assigned since: {current.assigned_at || "-"}</p>
          </>
        ) : (
          <p>No driver assigned</p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "white",
            }}
          >
            {current?.driver ? "Change Driver" : "Assign Driver"}
          </button>

          {current?.id && (
            <button
              onClick={handleUnassign}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: "#dc2626",
                color: "white",
              }}
            >
              Unassign
            </button>
          )}
        </div>
      </div>

      {/* HISTORY */}
      <div style={{
        padding: 15,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
      }}>
        <h3>History</h3>

        {!Array.isArray(history) || history.length === 0 ? (
          <p>No history</p>
        ) : (
          history.map((h) => (
            <div key={h.id} style={{
              padding: 10,
              borderBottom: "1px solid #eee",
            }}>
              {h?.driver ? (
                <strong>
                  {h.driver.first_name} {h.driver.last_name}
                </strong>
              ) : (
                <strong>Unknown driver</strong>
              )}

              {!h.unassigned_at && (
                <span style={{
                  background: "#16a34a",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 12,
                  marginLeft: 10,
                }}>
                  ACTIVE
                </span>
              )}

              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {h.assigned_at} → {h.unassigned_at || "Now"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            width: 420,
          }}>
            <h3>Select Driver</h3>

            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            >
              <option value="">Select a driver</option>

              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name} {d.last_name}
                </option>
              ))}
            </select>

            <div style={{
              marginTop: 15,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button onClick={handleAssign} style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
              }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}