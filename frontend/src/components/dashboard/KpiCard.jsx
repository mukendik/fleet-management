export default function KpiCard({ title, value, sub }) {
  return (
    <div style={styles.card}>
      <p style={styles.title}>{title}</p>
      <h2 style={styles.value}>{value}</h2>
      {sub && <p style={styles.sub}>{sub}</p>}
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 12,
    color: "#6b7280",
  },
  value: {
    fontSize: 28,
    margin: "5px 0",
  },
  sub: {
    fontSize: 12,
    color: "#10b981",
  },
};