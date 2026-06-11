import client from "../api/client";

export const getVehicles = async () => {
  const res = await client.get("/vehicles");
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