import { useEffect, useState } from "react";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(data.items);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (data) => {
    setActionLoading(true);
    await createVehicle(data);
    await load();
    setActionLoading(false);
  };

  const update = async (id, data) => {
    setActionLoading(true);
    await updateVehicle(id, data);
    await load();
    setActionLoading(false);
  };

  const remove = async (id) => {
    setActionLoading(true);
    await deleteVehicle(id);
    await load();
    setActionLoading(false);
  };

  return {
    vehicles,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
    reload: load,
  };
}