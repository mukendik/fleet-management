import { useEffect, useState } from "react";
import api from "../services/api";

import AssignmentToolbar from "../components/assignments/AssignmentToolbar";
import AssignmentTable from "../components/assignments/AssignmentTable";
import AssignmentModal from "../components/assignments/AssignmentModal";

export default function Assignments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/assignments");

      setData(res.data || []);
    } catch (err) {
      console.error("Assignments error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = data.filter((a) => {
    const driver = `${a.driver?.first_name || ""} ${a.driver?.last_name || ""}`.toLowerCase();
    const vehicle = (a.vehicle?.name || "").toLowerCase();
    const plate = (a.vehicle?.plate_number || "").toLowerCase();

    const q = search.toLowerCase();

    const matchSearch =
      driver.includes(q) ||
      vehicle.includes(q) ||
      plate.includes(q);

    const matchStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
        ? a.is_active
        : !a.is_active;

    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Loading assignments...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2>🚗 Assignments</h2>
      <p style={{ color: "#6b7280" }}>
        Manage vehicle-driver assignments
      </p>

      {/* TOOLBAR */}
      <AssignmentToolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onCreate={() => {
          console.log("OPEN MODAL");
          setShowModal(true);
        }}
      />

      {/* TABLE */}
      <AssignmentTable data={filtered} />

      {/* MODAL */}
      {showModal && (
        <AssignmentModal
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            setShowModal(false);
            await load();
          }}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "#f6f7fb",
    minHeight: "100vh",
  },
};