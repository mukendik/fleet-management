import { useNavigate } from "react-router-dom";
import VehicleActionsMenu from "./VehicleActionsMenu";

export default function VehicleTable({ data, onEdit, onDelete, onAssign, onView }) {

  const navigate = useNavigate();

  const containerStyle = {
    marginTop: "20px",
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
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
      maintenance: "#f59e0b",
      out_of_service: "#dc2626",
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
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Brand</th>
            <th style={thStyle}>Model</th>
            <th style={thStyle}>Plate</th>
            <th style={thStyle}>VIN</th>
            <th style={thStyle}>Mileage</th>
            <th style={thStyle}>Fuel</th>
            <th style={thStyle}>Year</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((v) => (
            <tr key={v.id}>
              <td style={tdStyle}>{v.id}</td>
              <td style={tdStyle}>{v.name}</td>
              <td style={tdStyle}>{v.brand || "-"}</td>
              <td style={tdStyle}>{v.model || "-"}</td>
              <td style={tdStyle}>{v.plate_number}</td>
              <td style={tdStyle}>{v.vin_number || "-"}</td>
              <td style={tdStyle}>{v.mileage ?? 0} km</td>
              <td style={tdStyle}>{v.fuel_type || "-"}</td>
              <td style={tdStyle}>{v.year || "-"}</td>

              <td style={tdStyle}>
                <span style={badge(v.status)}>
                  {v.status}
                </span>
              </td>

              {/* ✅ MENU 3 POINTS */}
              <td style={tdStyle}>
                <VehicleActionsMenu

                  onView={() => {
                    console.log("VIEW CLICKED", v.id);

                    if (!onView) {
                      console.error("onView is not defined");
                      return;
                    }

                    onView(v.id);
                  }}

                  onEdit={() => onEdit(v)}

                  onAssign={() =>
                    navigate(`/vehicles/${v.id}/assignments`, {
                      state: { vehicle: v }
                    })
                  }

                  onDelete={() => onDelete(v.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}