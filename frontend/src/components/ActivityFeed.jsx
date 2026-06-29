export default function ActivityFeed() {
  return (
    <div style={styles.card}>
      <h3>📊 Activité récente</h3>

      <div style={styles.item}>🚗 Assignment #12</div>
      <div style={styles.item}>⛽ 120 km ajouté</div>
      <div style={styles.item}>🔧 Maintenance signalée</div>
    </div>
  );
}

const styles = {
  card: {
    marginTop: 16,
    background: "white",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },

  item: {
    padding: 10,
    borderBottom: "1px solid #f3f4f6",
    fontSize: 14,
  },
};