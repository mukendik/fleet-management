export default function CurrentDriverCard({ assignment }) {
  if (!assignment || !assignment.driver_id) {
    return (
      <div style={styles.card}>
        <h3>Current Driver</h3>
        <p>No driver assigned</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3>Current Driver</h3>

      <div style={styles.row}>
        <strong>Driver ID:</strong> {assignment.driver_id}
      </div>

      <div style={styles.row}>
        <strong>Assigned at:</strong>{" "}
        {new Date(assignment.assigned_at).toLocaleString()}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: 15,
  },
  row: {
    marginTop: 5,
    fontSize: 14,
  },
};