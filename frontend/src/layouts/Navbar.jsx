import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={{ color: "white" }}>🚗 Fleet SaaS</h2>

        <div style={styles.userBox}>
          <p>{user?.email}</p>
          <small>{user?.role}</small>
        </div>

        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/vehicles" style={styles.link}>Vehicles</Link>
          <Link to="/drivers" style={styles.link}>Drivers</Link>
        </nav>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f3f4f6",
  },
  sidebar: {
    width: 220,
    background: "#0f172a",
    color: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  userBox: {
    marginTop: 20,
    padding: 10,
    background: "#1e293b",
    borderRadius: 8,
  },
  nav: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  logout: {
    marginTop: 20,
    padding: 10,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: 20,
    overflow: "auto",
  },
};