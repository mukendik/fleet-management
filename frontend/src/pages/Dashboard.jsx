import { useEffect, useState } from "react";
import statsService from "../services/statsService";

import KpiCard from "../components/dashboard/KpiCard";
import AssignmentChart from "../components/dashboard/AssignmentChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    load();

    const interval = setInterval(load, 30000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const res = await statsService.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  if (!data) return <p>Loading dashboard...</p>;


  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>Fleet Dashboard</h1>
        <p>Live overview of your operations</p>
      </div>

      {/* KPI ROW */}
      <div style={styles.kpiGrid}>
        <KpiCard title="Vehicles" value={data.vehicles.total} sub={`${data.vehicles.free} free`} />
        <KpiCard
          title="Drivers"
          value={data.drivers.total}
          sub={`${data.drivers.active} active • ${data.drivers.assigned} assigned`}
        />
        <KpiCard title="Today Assignments" value={data.assignments.today} />
        <KpiCard title="Weekly Activity" value={data.assignments.weekly} />
      </div>

      {/* CHART + FEED */}
      <div style={styles.grid2}>
        <AssignmentChart />
        <ActivityFeed />
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    background: "#f6f7fb",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    marginBottom: 20,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 15,
    marginBottom: 20,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 15,
  },
};