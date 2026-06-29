import { useState } from "react";
import api from "../services/api";

export default function MileageForm() {
  const [km, setKm] = useState("");

  const submit = async () => {
    try {
      await api.post("/driver/mileage", {
        km: Number(km),
      });

      alert("Kilométrage enregistré");
      setKm("");
    } catch (err) {
      console.error(err);
      alert("Erreur envoi");
    }
  };

  return (
    <div style={styles.card}>
      <h3>⛽ Kilométrage</h3>

      <input
        type="number"
        placeholder="Km actuel"
        value={km}
        onChange={(e) => setKm(e.target.value)}
        style={styles.input}
      />

      <button onClick={submit} style={styles.button}>
        Envoyer
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },

  button: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};