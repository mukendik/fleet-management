import KpiCard from "../components/dashboard/KpiCard";
import AssignmentChart from "../components/dashboard/AssignmentChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";

export default function Dashboard() {
  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h1>Fleet Dashboard</h1>
        <p style={{ color: "#6b7280" }}>
          Live overview of your operations
        </p>
      </div>

      {/* KPI GRID */}
      <div style={styles.kpiGrid}>
        <KpiCard title="Vehicles" value={22} sub="20 available" icon="🚗" />
        <KpiCard title="Drivers" value={6} sub="4 available" icon="👨‍✈" />
        <KpiCard title="Assigned" value={18} icon="📊" />
        <KpiCard title="Free" value={4} icon="🟢" />
      </div>

      {/* MIDDLE SECTION */}
      <div style={styles.middle}>
        <AssignmentChart />
        <ActivityFeed />
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    background: "#f9fafb",
    minHeight: "100vh",
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 15,
    marginBottom: 20,
  },

  middle: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 15,
  },
};