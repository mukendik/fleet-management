import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AssignmentChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/stats/weekly");
        setData(res.data);
      } catch (err) {
        console.error("Weekly stats error:", err);
      }
    };

    load();
  }, []);

  return (
    <div style={styles.card}>
      <h3>Assignments (7 days)</h3>

      <div style={styles.chart}>
        {data.map((d) => (
          <div key={d.day} style={styles.barContainer}>
            <div
              style={{
                ...styles.bar,
                height: Math.max(d.value * 12, 6),

                background:
                  d.value > 5
                    ? "#16a34a"
                    : d.value > 2
                    ? "#2563eb"
                    : "#cbd5e1",
              }}
            />

            <span style={styles.value}>{d.value}</span>

            <span style={styles.label}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },

  chart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    height: 180,
    marginTop: 20,
  },

  barContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },

  bar: {
    width: 24,
    borderRadius: 6,
    transition: "height .4s ease",
    transform:"scaleY(1.03)",
    cursor: "pointer",
  },

  value: {
    fontSize: 12,
    marginBottom: 6,
    color: "#374151",
    fontWeight: "bold",
  },

  label: {
    fontSize: 12,
    marginTop: 6,
    color: "#6b7280",
  },
};