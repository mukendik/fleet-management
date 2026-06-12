import { useEffect, useState } from "react";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

export function useVehicles(navigate) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data.items);
    } catch (err) {
      navigate("/login");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (form) => {
    setLoading(true);
    try {
      await createVehicle(form);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, form) => {
    setLoading(true);
    try {
      await updateVehicle(id, form);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    try {
      await deleteVehicle(id);
      await load();
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    loading,
    load,
    create,
    update,
    remove,
  };
}