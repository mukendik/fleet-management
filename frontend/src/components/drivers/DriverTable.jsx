export default function DriverTable({ drivers, onEdit, onDelete }) {
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
          <tr style={headerRowStyle}>
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

              <td style={tdStyle}>
                <div style={actionsStyle}>
                  <button
                    style={editBtn}
                    onClick={() => onEdit(d)}
                  >
                    Edit
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => onDelete(d.id)}
                  >
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