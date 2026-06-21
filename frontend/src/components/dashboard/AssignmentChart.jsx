import { useEffect, useState } from "react";

export default function AssignmentChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // mock pour MVP (on branchera API après)
    setData([
      { day: "Mon", value: 3 },
      { day: "Tue", value: 5 },
      { day: "Wed", value: 2 },
      { day: "Thu", value: 6 },
      { day: "Fri", value: 4 },
      { day: "Sat", value: 7 },
      { day: "Sun", value: 3 },
    ]);
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
                height: d.value * 10,
              }}
            />
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
  },
  chart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    height: 150,
    marginTop: 20,
  },
  barContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    background: "#3b82f6",
    borderRadius: 4,
    transition: "0.3s",
  },
  label: {
    fontSize: 12,
    marginTop: 5,
    color: "#6b7280",
  },
};