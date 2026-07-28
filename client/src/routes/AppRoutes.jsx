import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import PatientDashboard from "../pages/patient/PatientDashboard";
import DriverDashboard from "../pages/driver/DriverDashboard";
import HospitalDashboard from "../pages/hospital/HospitalDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import LandingPage from "../pages/home/LandingPage";
function AppRoutes() {
  return (
    <Routes>
     <Route path="/" element={<LandingPage />} />
     <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/driver" element={<DriverDashboard />} />
      <Route path="/hospital" element={<HospitalDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AppRoutes;