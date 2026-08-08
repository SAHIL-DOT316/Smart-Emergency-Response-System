import api from "./api";

export const getDriverRequests = async () => {
  const response = await api.get("/emergency/driver");
  return response.data;
};

export const updateEmergencyStatus = async (data) => {
  const response = await api.put(
    "/emergency/update-status",
    data
  );

  return response.data;
};

export const getMyEmergencyRequests = async () => {
  const response = await api.get("/emergency/my-requests");
  return response.data;
};

export const getAvailableDrivers = async () => {
  const response = await api.get("/emergency/available-drivers");
  return response.data;
};

export const createEmergencyRequest = async (data) => {
  const response = await api.post("/emergency/request", data);
  return response.data;
};

export const getAllEmergencyRequests = async () => {
  const response = await api.get("/emergency");

  return response.data;
};