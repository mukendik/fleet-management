export default function AssignmentRow({ assignment }) {
  const { driver, vehicle, is_active, assigned_at } = assignment;

  return (
    <tr style={styles.row}>

      {/* DRIVER */}
      <td>
        👤 {driver?.first_name} {driver?.last_name}
      </td>

      {/* VEHICLE */}
      <td>
        🚗 {vehicle?.name}
      </td>

      {/* PLATE */}
      <td style={{ color: "#2563eb", fontWeight: "600" }}>
        {vehicle?.plate_number}
      </td>

      {/* STATUS */}
      <td>
        {is_active ? (
          <span style={styles.active}>ACTIVE</span>
        ) : (
          <span style={styles.ended}>ENDED</span>
        )}
      </td>

      {/* DATE */}
      <td style={{ fontSize: 12, color: "#6b7280" }}>
        {new Date(assigned_at).toLocaleString()}
      </td>
    </tr>
  );
}

const styles = {
  row: {
    borderBottom: "1px solid #eee",
  },
  active: {
    background: "#16a34a",
    color: "white",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
  },
  ended: {
    background: "#9ca3af",
    color: "white",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
  },
};