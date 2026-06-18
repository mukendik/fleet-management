export default function AssignmentHistory({ history }) {
  return (
    <div style={styles.card}>
      <h3>History</h3>

      {history.length === 0 ? (
        <p>No history</p>
      ) : (
        history.map((h) => (
          <div key={h.id} style={styles.item}>
            <div>
              🚗 Vehicle #{h.vehicle_id} → 👤 Driver #{h.driver_id}
            </div>

            <small>
              {new Date(h.assigned_at).toLocaleString()}{" "}
              {h.unassigned_at &&
                ` → ${new Date(h.unassigned_at).toLocaleString()}`}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  item: {
    padding: 10,
    borderBottom: "1px solid #eee",
  },
};