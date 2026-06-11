import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = async () => {
  try {
    setError("");

    const res = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.access_token);

    navigate("/vehicles");

  } catch (err) {
    console.error(err);

    if (err.response?.status === 401) {
      setError("Email ou mot de passe incorrect");
    } else {
      setError("Erreur serveur. Veuillez réessayer.");
    }
  }
};

  return (
    <div>
      <h1>Login</h1>

     <input
        placeholder="email"
        value={email}
       // onChange={(e) => setEmail(e.target.value)}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
      //  onChange={(e) => setPassword(e.target.value)}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
      />

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

          <button onClick={handleLogin}>
            Login
          </button>
    </div>
  );
};

export default Login;