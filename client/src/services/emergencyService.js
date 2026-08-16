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
export const getNearestDrivers = async (requestId) => {
  const response = await api.get(
    `/emergency/nearest-drivers/${requestId}`
  );

  return response.data;
};

export const assignDriver = async (requestId, driverId) => {
  const response = await api.put(
    "/emergency/assign-driver",
    {
      requestId,
      driverId,
    }
  );

  return response.data;
};

//Hospital Emergency service
export const getNearestHospitals = async (requestId) => {
  const response = await api.get(
    `/emergency/nearest-hospitals/${requestId}`
  );
  
  return response.data;
};

export const getHospitalRequests = async () => {
  const response = await api.get("/emergency/hospital");

  return response.data;
};
export const acceptHospitalEmergency = async (
  requestId
) => {
  const response = await api.put(
    "/emergency/hospital/accept",
    {
      requestId,
    }
  );

  return response.data;
};
export const rejectHospitalEmergency = async (
  requestId
) => {
  const response = await api.put(
    "/emergency/hospital/reject",
    {
      requestId,
    }
  );

  return response.data;
};
export const assignHospital = async (
  requestId,
  hospitalId
) => {
  const response = await api.put(
    "/emergency/assign-hospital",
    {
      requestId,
      hospitalId,
    }
  );

  return response.data;
};