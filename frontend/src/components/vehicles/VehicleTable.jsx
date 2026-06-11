export default function VehicleTable({ data, onEdit, onDelete }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginTop: "20px",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f8fafc",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
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
            <tr
              key={v.id}
              style={{
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <td style={tdStyle}>{v.id}</td>
              <td style={tdStyle}>{v.name}</td>
              <td style={tdStyle}>{v.brand || "-"}</td>
              <td style={tdStyle}>{v.model || "-"}</td>
              <td style={tdStyle}>{v.plate_number}</td>

              <td style={tdStyle}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "white",
                    background:
                      v.status === "active"
                        ? "#16a34a"
                        : "#6b7280",
                  }}
                >
                  {v.status}
                </span>
              </td>

              <td style={tdStyle}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => onEdit(v)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(v)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
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

const thStyle = {
  padding: "14px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};

const tdStyle = {
  padding: "14px",
  color: "#111827",
};