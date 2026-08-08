import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logoutDriver } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext";

import {
  getDriverRequests,
  updateEmergencyStatus,
} from "../../services/emergencyService";

import { updateDriverLocation } from "../../services/driverService";

function DriverDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

 const navigate = useNavigate();
const { logout } = useAuth();
const handleLogout = async () => {
  try {
    await logoutDriver();

    logout();

    toast.success("Logged out successfully");

    navigate("/login");

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Logout failed"
    );
  }
};

  const fetchRequests = async () => {
    try {
      const response = await getDriverRequests();

      setRequests(response.requests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH REQUESTS ON LOAD
  // =========================

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // DRIVER GPS LOCATION
  // =========================

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            await updateDriverLocation(
              latitude,
              longitude
            );

            console.log(
              "Driver location updated:",
              latitude,
              longitude
            );
          } catch (error) {
            console.error(
              "Failed to update driver location:",
              error
            );
          }
        },

        (error) => {
          console.error(
            "Unable to get driver location:",
            error
          );
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    // Update immediately
    updateLocation();

    // Update every 30 seconds
    const interval = setInterval(
      updateLocation,
      30000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================
  // UPDATE EMERGENCY STATUS
  // =========================

  const handleStatusUpdate = async (
    requestId,
    status
  ) => {
    try {
      setUpdating(requestId);

      const response =
        await updateEmergencyStatus({
          requestId,
          status,
        });

      toast.success(response.message);

      await fetchRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setUpdating(null);
    }
  };

  // =========================
  // ACTION BUTTON
  // =========================

  const getActionButton = (request) => {
    if (request.status === "Accepted") {
      return (
        <button
          className="btn btn-primary btn-sm"
          disabled={updating === request._id}
          onClick={() =>
            handleStatusUpdate(
              request._id,
              "Driver Arrived"
            )
          }
        >
          {updating === request._id
            ? "Updating..."
            : "Driver Arrived"}
        </button>
      );
    }

    if (request.status === "Driver Arrived") {
      return (
        <button
          className="btn btn-warning btn-sm"
          disabled={updating === request._id}
          onClick={() =>
            handleStatusUpdate(
              request._id,
              "Patient Picked"
            )
          }
        >
          {updating === request._id
            ? "Updating..."
            : "Patient Picked"}
        </button>
      );
    }

    if (request.status === "Patient Picked") {
      return (
        <button
          className="btn btn-success btn-sm"
          disabled={updating === request._id}
          onClick={() =>
            handleStatusUpdate(
              request._id,
              "Completed"
            )
          }
        >
          {updating === request._id
            ? "Updating..."
            : "Complete"}
        </button>
      );
    }

    if (request.status === "Completed") {
      return (
        <span className="badge bg-success">
          Completed
        </span>
      );
    }

    return (
      
      <span className="text-muted">
        Waiting...
      </span>
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />

        <p className="text-muted mt-3">
          Loading emergency requests...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    
    <div className="container py-4">

      {/* Header */}
<div className="d-flex justify-content-between align-items-center mb-4">

  <div>
    <h2>Driver Dashboard</h2>

    <p className="text-muted mb-0">
      Manage your assigned emergency requests
    </p>
  </div>

  <div className="d-flex align-items-center gap-3">

    <span className="badge bg-success fs-6">
      ● Online
    </span>

    <button
      className="btn btn-outline-danger"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>

</div>


      {/* GPS Status */}

      <div className="alert alert-success mb-4">
        <strong>Location Tracking Active</strong>

        <div className="small mt-1">
          Your current location is being updated
          automatically every 30 seconds.
        </div>
      </div>


      {/* Requests Table */}

      <div className="card border-0 shadow-sm">

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead className="table-dark">

                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Pickup Address</th>
                  <th>Emergency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {requests.length > 0 ? (

                  requests.map((request) => (

                    <tr key={request._id}>

                      <td>
                        {request.patient?.fullName ||
                          "N/A"}
                      </td>

                      <td>
                        {request.patient?.phone ||
                          "N/A"}
                      </td>

                      <td>
                        {request.pickupAddress ||
                          "N/A"}
                      </td>

                      <td>
                        {request.emergencyType ||
                          "N/A"}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            request.status ===
                            "Completed"
                              ? "bg-success"
                              : request.status ===
                                "Accepted"
                              ? "bg-primary"
                              : request.status ===
                                "Driver Arrived"
                              ? "bg-info text-dark"
                              : request.status ===
                                "Patient Picked"
                              ? "bg-secondary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {request.status}
                        </span>

                      </td>

                      <td>
                        {getActionButton(request)}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-5"
                    >

                      <h5 className="fw-bold">
                        No Assigned Requests
                      </h5>

                      <p className="text-muted mb-0">
                        You currently have no emergency
                        requests assigned to you.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DriverDashboard;