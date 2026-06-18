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
  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);

    try {
      const [currentRes, historyRes, driversRes] = await Promise.all([
        assignmentService.getCurrent(id),
        assignmentService.getHistory(id),
        driverService.getAll(),
      ]);

      setCurrent(currentRes.data || null);
      setHistory(historyRes.data || []);
      setDrivers(driversRes.data?.items || []);
    } catch (err) {
      console.error("Assignment load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // VEHICLE HEADER FALLBACK
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
      await assignmentService.create({
        vehicle_id: Number(id),
        driver_id: Number(selectedDriver),
      });

      setShowModal(false);
      setSelectedDriver("");
      load();
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  // -------------------------
  // SAFE DRIVER RENDER
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
    <div style={{ padding: 20 }}>

      {/* BACK */}
      <button onClick={() => navigate("/vehicles")}>
        ← Back
      </button>

      <h1>Vehicle Assignment</h1>

      {/* VEHICLE HEADER */}
      {vehicle && (
        <div
          style={{
            padding: 15,
            background: "#f9fafb",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <h2>{vehicle.name}</h2>
          <p>
            {vehicle.brand} {vehicle.model}
          </p>
          <p>
            <strong>Plate:</strong> {vehicle.plate_number}
          </p>
        </div>
      )}

      {/* CURRENT ASSIGNMENT */}
      <div
        style={{
          padding: 15,
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <h3>Current Driver</h3>

        {loading ? (
          <p>Loading...</p>
        ) : current?.driver ? (
          <>
            <p>{renderDriver(current.driver)}</p>

            <p>{current.driver.license_number || "-"}</p>

            <p>
              Assigned since: {current.assigned_at || "-"}
            </p>
          </>
        ) : (
          <p>No driver assigned</p>
        )}

        <button onClick={() => setShowModal(true)}>
          {current ? "Change Driver" : "Assign Driver"}
        </button>
      </div>

      {/* HISTORY */}
      <div>
        <h3>History</h3>

        {!Array.isArray(history) || history.length === 0 ? (
          <p>No history</p>
        ) : (
          history.map((h) => (
            <div
              key={h.id}
              style={{
                padding: 10,
                borderBottom: "1px solid #eee",
              }}
            >
              {h?.driver ? (
                <strong>
                  {h.driver.first_name} {h.driver.last_name}
                </strong>
              ) : (
                <strong>Unknown driver</strong>
              )}

              <div>
                {h.assigned_at} → {h.unassigned_at || "Now"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              width: 400,
            }}
          >
            <h3>Select Driver</h3>

            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            >
              <option value="">-- Choose --</option>

              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name} {d.last_name}
                </option>
              ))}
            </select>

            <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
              <button onClick={handleAssign}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}