import { useParams } from "react-router-dom";
import VehicleDetail from "./VehicleDetail";

export default function AssignmentsPage() {
  const { id } = useParams();

  return <VehicleDetail vehicleId={id} />;
}