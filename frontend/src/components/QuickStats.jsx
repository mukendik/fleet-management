export default function QuickStats() {
  return (
    <div style={styles.grid}>

      <Card title="Today KM" value="120 km" color="#2563eb" />
      <Card title="Trips" value="3" color="#f59e0b" />
      <Card title="Alerts" value="0" color="#ef4444" />

    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
      <div style={styles.title}>{title}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginTop: 16,
  },

  card: {
    background: "white",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },

  title: {
    fontSize: 12,
    color: "#6b7280",
  },

  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
};