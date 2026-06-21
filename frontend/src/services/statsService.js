import api from "./api";

const statsService = {
  getDashboard: () => api.get("/stats/dashboard"),
};

export default statsService;