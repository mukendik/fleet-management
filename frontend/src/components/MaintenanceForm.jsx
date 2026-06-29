import { useState } from "react";
import api from "../services/api";

export default function MaintenanceForm() {
  const [text, setText] = useState("");

  const submit = async () => {
    try {
      await api.post("/driver/maintenance", {
        description: text,
      });

      alert("Signalement envoyé");
      setText("");
    } catch (err) {
      console.error(err);
      alert("Erreur");
    }
  };

  return (
    <div style={styles.card}>
      <h3>🔧 Maintenance</h3>

      <textarea
        placeholder="Problème véhicule..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.input}
      />

      <button onClick={submit} style={styles.button}>
        Signaler
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
    minHeight: 80,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },

  button: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
};