export default function KpiCard({ title, value, sub, color = "#2563eb", icon }) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
      
      <div style={styles.header}>
        <span style={styles.icon}>{icon}</span>
        <p style={styles.title}>{title}</p>
      </div>

      <h2 style={styles.value}>{value}</h2>

      {sub && <p style={styles.sub}>{sub}</p>}
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  icon: {
    fontSize: 18,
  },

  title: {
    fontSize: 12,
    color: "#6b7280",
    margin: 0,
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