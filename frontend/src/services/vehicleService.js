import client from "../api/client";

export const getVehicles = async (params = {}) => {
  const res = await client.get("/vehicles", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || "",
      status: params.status || "",
      brand: params.brand || "",
    },
  });

  return res.data;
};

export const createVehicle = async (data) => {
  const res = await client.post("/vehicles", data);
  return res.data;
};

export const updateVehicle = async (id, data) => {
  const res = await client.put(`/vehicles/${id}`, data);
  return res.data;
};

export const deleteVehicle = async (id) => {
  const res = await client.delete(`/vehicles/${id}`);
  return res.data;
};