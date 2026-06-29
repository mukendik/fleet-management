export default function DriverHeader({ user }) {
  return (
    <div style={styles.card}>
      <div>
        <h2 style={{ margin: 0 }}>
          👨‍✈️ {user.email}
        </h2>
        <p style={styles.role}>
          DRIVER PORTAL
        </p>
      </div>

      <div style={styles.badge}>
        ACTIVE
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#111827",
    color: "white",
    padding: 16,
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  role: {
    fontSize: 12,
    opacity: 0.7,
  },

  badge: {
    background: "#22c55e",
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 12,
  },
};