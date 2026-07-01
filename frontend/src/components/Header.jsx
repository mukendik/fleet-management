import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.header}>
      <div>
        <strong>Fleet SaaS</strong>
      </div>

      <div style={styles.center}>
        🏢 Company #{user?.company_id}
      </div>

      <div style={styles.right}>
        <span>{user?.email}</span>

        <span style={styles.badge}>
          {user?.role}
        </span>

        <button onClick={handleLogout} style={styles.btn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: 60,
    background: "#0f172a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },

  center: {
    opacity: 0.8,
    fontSize: 13,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  badge: {
    background: "#2563eb",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 11,
    textTransform: "uppercase",
  },

  btn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
};