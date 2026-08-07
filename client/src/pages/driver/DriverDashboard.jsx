import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getDriverRequests,
  updateEmergencyStatus,
} from "../../services/emergencyService";

function DriverDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      setUpdating(requestId);

      const response = await updateEmergencyStatus({
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

  if (loading) {
    return (
      <div className="container mt-4">
        <h4>Loading emergency requests...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Driver Dashboard</h2>
          <p className="text-muted mb-0">
            Manage your assigned emergency requests
          </p>
        </div>

        <span className="badge bg-primary fs-6">
          {requests.length} Requests
        </span>
      </div>

      <div className="table-responsive">

        <table className="table table-bordered table-hover">

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
                  className="text-center py-4"
                >
                  No assigned emergency requests
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DriverDashboard;