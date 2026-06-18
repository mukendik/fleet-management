import api from "./api";

export const assignmentService = {
  // ======================
  // CURRENT ASSIGNMENT
  // ======================
  getCurrent: (vehicleId) =>
    api.get(`/assignments/vehicle/${vehicleId}/current`),

  // ======================
  // HISTORY
  // ======================
  getHistory: (vehicleId) =>
    api.get(`/assignments/vehicle/${vehicleId}/history`),

  // ======================
  // CREATE / ASSIGN DRIVER
  // ======================
  create: (payload) =>
    api.post("/assignments", payload),

  assign: (vehicleId, driverId) =>
    api.post("/assignments", {
      vehicle_id: vehicleId,
      driver_id: driverId,
    }),

  // ======================
  // REMOVE / UNASSIGN
  // ======================
  remove: (assignmentId) =>
    api.delete(`/assignments/${assignmentId}`),
};

export default assignmentService;