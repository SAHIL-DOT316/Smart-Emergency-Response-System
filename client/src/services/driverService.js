import api from "./api";

export const getAllDrivers = async () => {
  const response = await api.get("/admin/drivers");
  return response.data;
};

export const addDriver = async (driverData) => {
  const response = await api.post("/admin/drivers", driverData);
  return response.data;
};

export const getDriverById = async (id) => {
  const response = await api.get(`/admin/drivers/${id}`);
  return response.data;
};

export const updateDriver = async (id, driverData) => {
  const response = await api.put(`/admin/drivers/${id}`, driverData);
  return response.data;
};

export const deleteDriver = async (id) => {
  const response = await api.delete(`/admin/drivers/${id}`);
  return response.data;
};