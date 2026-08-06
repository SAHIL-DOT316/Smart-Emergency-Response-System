import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getDriverRequests,
  updateEmergencyStatus,
} from "../../services/emergencyService";

function DriverDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await getDriverRequests();
      setRequests(response.requests);
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

  if (loading) {
    return (
      <div className="container mt-4">
        <h4>Loading...</h4>
      </div>
    );
  }
const handleStatusUpdate = async (
  requestId,
  status
) => {
  try {
    const response =
      await updateEmergencyStatus({
        requestId,
        status,
      });

    toast.success(response.message);

    fetchRequests();
  } catch (error) {
    toast.error(
      error.response?.data?.message
    );
  }
};
  return (
    <div className="container mt-4">

      <h2 className="mb-4">Driver Dashboard</h2>

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

                <td>{request.patient?.fullName}</td>

                <td>{request.patient?.phone}</td>

                <td>{request.pickupAddress}</td>

                <td>{request.emergencyType}</td>

                <td>
                  <span className="badge bg-warning text-dark">
                    {request.status}
                  </span>
                </td>
                <td>
  {request.status === "Accepted" && (
    <button
      className="btn btn-primary btn-sm"
      onClick={() =>
        handleStatusUpdate(
          request._id,
          "Driver Arrived"
        )
      }
    >
      Driver Arrived
    </button>
  )}

  {request.status === "Driver Arrived" && (
    <button
      className="btn btn-warning btn-sm"
      onClick={() =>
        handleStatusUpdate(
          request._id,
          "Patient Picked"
        )
      }
    >
      Patient Picked
    </button>
  )}

  {request.status === "Patient Picked" && (
    <button
      className="btn btn-success btn-sm"
      onClick={() =>
        handleStatusUpdate(
          request._id,
          "Completed"
        )
      }
    >
      Complete
    </button>
  )}

  {request.status === "Completed" && (
    <span className="badge bg-success">
      Completed
    </span>
  )}
</td>

              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="5" className="text-center">
                No assigned requests
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default DriverDashboard;