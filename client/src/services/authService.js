import api from "./api";

export const registerPatient = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginPatient = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
export const loginAdmin = async (data) => {
  const response = await api.post("/auth/admin/login", data);
  return response.data;
};
export const loginDriver = async (data) => {
  const response = await api.post("/auth/driver/login", data);
  return response.data;
};

export const logoutDriver = async () => {
  const response = await api.put(
    "/auth/driver/logout"
  );

  return response.data;
};