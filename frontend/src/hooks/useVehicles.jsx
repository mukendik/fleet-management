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

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchVehicles = async (params = {}) => {
    try {
      setLoading(true);

      const data = await getVehicles(params);

      setVehicles(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const create = async (form) => {
    setLoading(true);
    try {
      await createVehicle(form);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, form) => {
    setLoading(true);
    try {
      await updateVehicle(id, form);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    try {
      await deleteVehicle(id);
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    loading,

    total,
    page,
    pages,

    fetchVehicles,

    create,
    update,
    remove,
  };
}