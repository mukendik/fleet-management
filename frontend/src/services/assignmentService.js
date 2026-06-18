import api from "./api";

export const assignmentService = {
  assign: (vehicle_id, driver_id) =>
    api.post("/assignments", { vehicle_id, driver_id }),

  getCurrent: (vehicleId) =>
    api.get(`/assignments/vehicle/${vehicleId}/current`),

  getHistory: (vehicleId) =>
    api.get(`/assignments/vehicle/${vehicleId}/history`),
};