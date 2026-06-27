import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverActionMenu from "./DriverActionMenu";
import ConfirmModal from "../common/ConfirmModal";

export default function DriverTable({
  drivers,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  // ======================
  // STATE SAFE DELETE FLOW
  // ======================
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // OPEN MODAL (SAFE: store full object)
  const openDeleteModal = (driver) => {
    if (!driver?.id) {
      console.error("Driver missing id", driver);
      return;
    }

    setDriverToDelete(driver);
    setConfirmOpen(true);
  };

  // CONFIRM DELETE (SAFE EXECUTION)
  const handleConfirmDelete = async () => {
    if (!driverToDelete?.id) {
      console.error("No driver selected for deletion");
      return;
    }

    try {
      console.log("Deleting driver:", driverToDelete.id);

      await onDelete(driverToDelete.id);
      console.log("onDelete function:", onDelete);
      // cleanup
      setConfirmOpen(false);
      setDriverToDelete(null);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const containerStyle = {
    marginTop: "20px",
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "visible",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    padding: "14px",
    textAlign: "left",
    fontSize: "13px",
    color: "#374151",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb",
  };

  const tdStyle = {
    padding: "14px",
    fontSize: "14px",
    color: "#111827",
    borderBottom: "1px solid #f1f5f9",
  };

  const badge = (value) => {
    const map = {
      active: "#16a34a",
      inactive: "#6b7280",
      suspended: "#dc2626",
    };

    return {
      padding: "4px 10px",
      borderRadius: "999px",
      color: "white",
      fontSize: "12px",
      fontWeight: "600",
      background: map[value] || "#6b7280",
    };
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>First Name</th>
            <th style={thStyle}>Last Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>License</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {drivers?.map((d) => (
            <tr key={d.id}>
              <td style={tdStyle}>{d.id}</td>
              <td style={tdStyle}>{d.first_name}</td>
              <td style={tdStyle}>{d.last_name}</td>
              <td style={tdStyle}>{d.email || "-"}</td>
              <td style={tdStyle}>{d.phone || "-"}</td>
              <td style={tdStyle}>{d.license_number}</td>

              <td style={tdStyle}>
                <span style={badge(d.status)}>
                  {d.status}
                </span>
              </td>

              {/* ======================
                  ACTION MENU
              ====================== */}
              <td style={tdStyle}>
                <DriverActionMenu
                  onView={() => navigate(`/drivers/${d.id}`)}

                  onEdit={() => onEdit(d)}

                  // IMPORTANT: pass full object (not id)
                  onDelete={() => openDeleteModal(d)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ======================
          CONFIRM MODAL
      ====================== */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete driver"
        message={
          driverToDelete
            ? `Delete ${driverToDelete.first_name} ${driverToDelete.last_name} ?`
            : "Delete this driver ?"
        }
        onCancel={() => {
          setConfirmOpen(false);
          setDriverToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
      />
    </div>
  );
}