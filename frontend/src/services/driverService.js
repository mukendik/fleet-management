import api from "./api";

export const driverService = {
  create: (data) => api.post("/drivers", data),

  getAll: (params) => api.get("/drivers", { params }),

  getById: (id) => api.get(`/drivers/${id}`),

  update: (id, data) => api.put(`/drivers/${id}`, data),

  delete: (id) => api.delete(`/drivers/${id}`),
};