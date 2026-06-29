import { useAuth } from "../../context/AuthContext";
import DriverHeader from "../../components/DriverHeader";
import QuickStats from "../../components/QuickStats";
import MileageForm from "../../components/MileageForm";
import MaintenanceForm from "../../components/MaintenanceForm";
import ActivityFeed from "../../components/ActivityFeed";

export default function DriverPortalPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={styles.container}>

      <DriverHeader user={user} />

      <QuickStats />

      <div style={styles.grid}>
        <MileageForm />
        <MaintenanceForm />
      </div>

      <ActivityFeed />

    </div>
  );
}

const styles = {
  container: {
    padding: 16,
    maxWidth: 900,
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
    marginTop: 16,
  },
};