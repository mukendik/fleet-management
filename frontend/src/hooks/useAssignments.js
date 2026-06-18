import { useState } from "react";
import { assignmentService } from "../services/assignmentService";

export function useAssignments() {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchCurrent = async (vehicleId) => {
    const res = await assignmentService.getCurrent(vehicleId);
    setCurrent(res.data);
  };

  const fetchHistory = async (vehicleId) => {
    const res = await assignmentService.getHistory(vehicleId);
    setHistory(res.data || []);
  };

  const assign = async (vehicleId, driverId) => {
    setLoading(true);
    try {
      await assignmentService.assign(vehicleId, driverId);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    current,
    history,
    fetchCurrent,
    fetchHistory,
    assign,
  };
}