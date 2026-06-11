import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      navigate("/vehicles");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else {
        setError("Erreur serveur. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* HEADER */}
        <h2 style={{ marginBottom: "5px" }}>🚗 Fleet Manager</h2>
        <p style={{ marginTop: 0, color: "#6b7280" }}>
          Sign in to your account
        </p>

        {/* EMAIL */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          style={inputStyle}
        />

        {/* PASSWORD */}
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          style={inputStyle}
        />

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#93c5fd" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Connexion..." : "Login"}
        </button>

        {/* FOOTER */}
        <p
          style={{
            marginTop: "15px",
            fontSize: "12px",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Fleet Manager SaaS • MVP v1
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  outline: "none",
};

export default Login;