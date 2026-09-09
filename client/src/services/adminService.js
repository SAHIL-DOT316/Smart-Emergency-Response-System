import api from "./api";

// Update admin profile
export const updateAdminProfile = async (profileData) => {
  const response = await api.put("/admin/profile", profileData);
  return response.data;
};

// Change admin password
export const changeAdminPassword = async (passwordData) => {
  const response = await api.put(
    "/admin/change-password",
    passwordData
  );

  return response.data;
};