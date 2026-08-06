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