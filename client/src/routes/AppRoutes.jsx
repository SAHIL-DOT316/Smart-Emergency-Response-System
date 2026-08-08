import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import LandingPage from "../pages/home/LandingPage";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";

import PatientDashboard from "../pages/patient/PatientDashboard";
import DriverDashboard from "../pages/driver/DriverDashboard";
import HospitalDashboard from "../pages/hospital/HospitalDashboard";

import DashboardHome from "../pages/admin/DashboardHome";
import Drivers from "../pages/admin/Drivers";
import Hospitals from "../pages/admin/Hospitals";
import EmergencyRequests from "../pages/admin/EmergencyRequests";
import Profile from "../pages/admin/Profile";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* Patient */}

      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />


      {/* Driver */}

      <Route
        path="/driver"
        element={
          <ProtectedRoute allowedRoles={["driver"]}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />


      {/* Hospital */}

      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRoles={["hospital"]}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />


      {/* Admin */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<DashboardHome />}
        />

        <Route
          path="drivers"
          element={<Drivers />}
        />

        <Route
          path="hospitals"
          element={<Hospitals />}
        />

        <Route
          path="emergency-requests"
          element={<EmergencyRequests />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;