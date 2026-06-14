import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 16px",
    color: isActive ? "white" : "#cbd5e1",
    background: isActive ? "#2563eb" : "transparent",
    textDecoration: "none",
    borderRadius: "8px",
    marginBottom: "8px",
  });

  return (
    <div
      style={{
        width: "240px",
        background: "#0f172a",
        padding: "20px",
        color: "white",
        height: "100vh",
      }}
    >
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        🚗 Fleet SaaS
      </h2>

      <NavLink to="/dashboard" style={linkStyle}>
        Dashboard
      </NavLink>

      <NavLink to="/vehicles" style={linkStyle}>
        Vehicles
      </NavLink>

      {/* ✅ NEW MODULE */}
      <NavLink to="/drivers" style={linkStyle}>
        Drivers
      </NavLink>
    </div>
  );
}