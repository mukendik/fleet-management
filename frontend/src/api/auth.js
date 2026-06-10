import client from "./client";

export const login = async (email, password) => {
  return client.post("/auth/login", {
    email,
    password,
  });
};