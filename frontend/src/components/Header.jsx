import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "60px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <div style={{ fontWeight: "600" }}>
        Fleet Management System
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}