import api from "./api";

export const getAllHospitals = async () => {
  const response = await api.get("/admin/hospitals");
  return response.data;
};

export const addHospital = async (hospitalData) => {
  const response = await api.post("/admin/hospitals", hospitalData);
  return response.data;
};

export const getHospitalById = async (id) => {
  const response = await api.get(`/admin/hospitals/${id}`);
  return response.data;
};

export const updateHospital = async (id, hospitalData) => {
  const response = await api.put(`/admin/hospitals/${id}`, hospitalData);
  return response.data;
};

export const deleteHospital = async (id) => {
  const response = await api.delete(`/admin/hospitals/${id}`);
  return response.data;
};

export const updateHospitalLocation =
  async (latitude, longitude) => {

    const response =
      await api.put(
        "/hospital/location",
        {
          latitude,
          longitude,
        }
      );

    return response.data;
  };
  export const updateHospitalBeds = async (
  availableBeds
) => {

  const response = await api.put(
    "/hospital/beds",
    {
      availableBeds,
    }
  );

  return response.data;
};