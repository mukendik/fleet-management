import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // =========================
  // DEBUG GLOBAL STATE
  // =========================
  console.log("========== AUTH CONTEXT ==========");
  console.log("TOKEN :", token);
  console.log("USER :", user);
  console.log("LOADING :", loading);

  // =========================
  // INIT AUTH (STABLE VERSION)
  // =========================
  useEffect(() => {
    const initAuth = async () => {
      console.log("========== INIT AUTH START ==========");

      const storedToken = localStorage.getItem("token");

      console.log("STORED TOKEN :", storedToken);

      if (!storedToken) {
        console.log("NO TOKEN FOUND → USER NULL");
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        console.log("CALL /auth/me...");

        const res = await axios.get("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        console.log("ME RESPONSE SUCCESS :", res.data);

        setToken(storedToken);
        setUser(res.data);

        console.log("USER SET OK");

      } catch (err) {
        console.error("AUTH ERROR /auth/me :", err);

        setUser(null);
        setToken(null);
        localStorage.removeItem("token");

      } finally {
        console.log("INIT AUTH END");
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
  console.log("========== LOGIN START ==========");

  try {
    console.log("1 - POST /auth/login");

    const res = await axios.post(
      "http://localhost:8000/auth/login",
      {
        email,
        password,
      }
    );

    console.log("2 - LOGIN RESPONSE", res.data);

    const accessToken = res.data.access_token;

    console.log("3 - SAVE TOKEN");

    localStorage.setItem("token", accessToken);

    setToken(accessToken);

    console.log("4 - CALL /auth/me");

    const me = await axios.get(
      "http://localhost:8000/auth/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("5 - /auth/me RESPONSE", me.data);

    setUser(me.data);

    console.log("6 - USER SET");

    return me.data;
  } catch (err) {
    console.error("LOGIN ERROR", err);
    throw err;
  }
};
  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    console.log("========== LOGOUT ==========");

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // =========================
  // CONTEXT VALUE
  // =========================
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);