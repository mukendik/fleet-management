import { useEffect, useState } from "react";

export default function ActivityFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents([
      "Driver John assigned to BMW X5",
      "Driver Alex unassigned",
      "Vehicle Tesla Model 3 assigned",
    ]);

    const interval = setInterval(() => {
      setEvents((prev) => [
        "New assignment event " + new Date().toLocaleTimeString(),
        ...prev,
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.card}>
      <h3>Live Activity</h3>

      <div style={styles.list}>
        {events.map((e, i) => (
          <div key={i} style={styles.item}>
            {e}
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
  list: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: 300,
    overflow: "auto",
  },
  item: {
    fontSize: 13,
    padding: 8,
    background: "#f3f4f6",
    borderRadius: 8,
  },
};