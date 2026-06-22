import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ActivityFeed() {
  const [events, setEvents] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/activity");

      const formatted = res.data.map((a) => ({
        id: a.id,
        text: `${a.driver?.first_name || "Unknown"} ${a.driver?.last_name || ""} → ${a.vehicle?.name || "Vehicle"}`,
        time: a.assigned_at,
        active: a.is_active,
      }));

      setEvents(formatted);
    } catch (err) {
      console.error("Activity load error:", err);
    }
  };

  useEffect(() => {
    load();

    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.card}>
      <h3>Live Activity</h3>

      <div style={styles.list}>
        {events.map((e) => (
          <div key={e.id} style={styles.item}>
            <div>
              {e.text}
              {e.active && <span style={styles.badge}>ACTIVE</span>}
            </div>
            <small>{e.time}</small>
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
  badge: {
    marginLeft: 8,
    padding: "2px 6px",
    fontSize: 10,
    background: "#16a34a",
    color: "white",
    borderRadius: 999,
  },
};