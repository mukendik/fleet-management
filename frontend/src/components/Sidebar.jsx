import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { navigation } from "../config/navigation";

export default function Sidebar() {
  const { user, loading } = useAuth();

  const role = user?.role?.toUpperCase?.() || "";

  // LOADING STATE
  if (loading) {
    return (
      <div style={styles.sidebar}>
        <div style={styles.logo}>🚗 Fleet SaaS</div>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  // FILTER MENU SAFE
  const menu = navigation.filter((item) => {
    const allowed = item.roles?.map((r) => r.toUpperCase()) || [];
    return allowed.includes(role);
  });

  return (
    <div style={styles.sidebar}>
      {/* LOGO */}
      <div style={styles.logo}>
        🚗 Fleet SaaS
      </div>

      {/* MENU */}
      <div style={styles.menu}>
        {menu.length === 0 ? (
          <div style={styles.empty}>
            No access for role: {role}
          </div>
        ) : (
          menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.link,
                background: isActive ? "#2563eb" : "transparent",
                color: isActive ? "white" : "#111827",
              })}
            >
              <span style={{ marginRight: 10 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))
        )}
      </div>

      {/* FOOTER (LIGHT ONLY) */}
      <div style={styles.footer}>
        <div>👤 {user?.email}</div>
        <div style={styles.role}>
          {role}
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 260,
    height: "100vh",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e5e7eb",
    background: "#ffffff",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },

  menu: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  link: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 8,
    textDecoration: "none",
    transition: "0.2s",
  },

  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 12,
    fontSize: 12,
    color: "#6b7280",
  },

  role: {
    marginTop: 4,
    fontSize: 11,
    padding: "2px 6px",
    display: "inline-block",
    background: "#f3f4f6",
    borderRadius: 6,
    textTransform: "uppercase",
  },

  empty: {
    padding: 10,
    fontSize: 12,
    color: "#ef4444",
    background: "#fef2f2",
    borderRadius: 8,
  },
};