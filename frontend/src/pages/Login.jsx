import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  try {
    setError("");
    setLoading(true);

    const user = await login(email, password);

    console.log("LOGIN USER:", user);

    switch (user.role.toLowerCase()) {
      case "admin":
        navigate("/dashboard");
        break;

      case "driver":
        navigate("/driver-portal");
        break;

      default:
        navigate("/dashboard");
    }

  } catch (err) {
    console.error(err);
    setError("Erreur login");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🚗 Fleet Manager</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={styles.button}>
          {loading ? "Login..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    width: 350,
    padding: 25,
    borderRadius: 12,
    background: "white",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    marginTop: 15,
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};