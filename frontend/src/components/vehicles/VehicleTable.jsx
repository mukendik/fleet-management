export default function VehicleTable({ data, onEdit, onDelete }) {
  
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

const headerRowStyle = {
  background: "#f8fafc",
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

const rowStyle = {
  transition: "background 0.15s ease",
};

const actionsStyle = {
  display: "flex",
  gap: "8px",
};

const editBtn = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
};

const deleteBtn = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "none",
  background: "#dc2626",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
};

const badgeStyle = {
  padding: "4px 10px",
  borderRadius: "999px",
  color: "white",
  fontSize: "12px",
  fontWeight: "600",
};

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Brand</th>
            <th style={thStyle}>Model</th>
            <th style={thStyle}>Plate</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((v) => (
            <tr key={v.id} style={rowStyle}>
              <td style={tdStyle}>{v.id}</td>
              <td style={tdStyle}>{v.name}</td>
              <td style={tdStyle}>{v.brand || "-"}</td>
              <td style={tdStyle}>{v.model || "-"}</td>
              <td style={tdStyle}>{v.plate_number}</td>

              <td style={tdStyle}>
                <span
                  style={{
                    ...badgeStyle,
                    background:
                      v.status === "active" ? "#16a34a" : "#6b7280",
                  }}
                >
                  {v.status}
                </span>
              </td>

              <td style={tdStyle}>
                <div style={actionsStyle}>
                  <button style={editBtn} onClick={() => onEdit(v)}>
                    Edit
                  </button>

                  <button style={deleteBtn} onClick={() => onDelete(v.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}