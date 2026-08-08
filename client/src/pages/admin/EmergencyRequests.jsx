import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAllEmergencyRequests } from "../../services/emergencyService";

function EmergencyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await getAllEmergencyRequests();

      setRequests(response.requests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load emergency requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";

      case "Accepted":
        return "bg-primary";

      case "Driver Arrived":
        return "bg-info text-dark";

      case "Patient Picked":
        return "bg-secondary";

      case "Completed":
        return "bg-success";

      default:
        return "bg-dark";
    }
  };

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Emergency Requests
          </h2>

          <p className="text-muted mb-0">
            Manage and assign emergency ambulance requests
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchRequests}
        >
          Refresh
        </button>

      </div>


      {/* Summary */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <small className="text-muted">
                Total Requests
              </small>

              <h3 className="fw-bold mb-0">
                {requests.length}
              </h3>

            </div>
          </div>

        </div>


        <div className="col-md-4">

          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <small className="text-muted">
                Pending
              </small>

              <h3 className="fw-bold text-warning mb-0">
                {
                  requests.filter(
                    (request) =>
                      request.status === "Pending"
                  ).length
                }
              </h3>

            </div>
          </div>

        </div>


        <div className="col-md-4">

          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <small className="text-muted">
                Accepted
              </small>

              <h3 className="fw-bold text-primary mb-0">
                {
                  requests.filter(
                    (request) =>
                      request.status === "Accepted"
                  ).length
                }
              </h3>

            </div>
          </div>

        </div>

      </div>


      {/* Requests */}

      <div className="card border-0 shadow-sm">

        <div className="card-body">

          {loading ? (

            <div className="text-center py-5">

              <div className="spinner-border text-primary" />

              <p className="text-muted mt-3 mb-0">
                Loading emergency requests...
              </p>

            </div>

          ) : requests.length === 0 ? (

            <div className="text-center py-5">

              <h5 className="fw-bold">
                No Emergency Requests
              </h5>

              <p className="text-muted mb-0">
                New patient emergency requests will appear here.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-dark">

                  <tr>
                    <th>Patient</th>
                    <th>Emergency</th>
                    <th>Pickup Location</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Driver</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {requests.map((request) => (

                    <tr key={request._id}>

                      <td>

                        <div className="fw-semibold">
                          {request.patient?.fullName ||
                            "Unknown"}
                        </div>

                        <small className="text-muted">
                          {request.patient?.email || ""}
                        </small>

                      </td>


                      <td>

                        <span className="fw-semibold">
                          {request.emergencyType}
                        </span>

                      </td>


                      <td>
                        {request.pickupAddress}
                      </td>


                      <td>
                        {request.patient?.phone || "-"}
                      </td>


                      <td>

                        <span
                          className={`badge ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>

                      </td>


                      <td>

                        {request.driver ? (

                          <div>

                            <div className="fw-semibold">
                              {request.driver.fullName}
                            </div>

                            <small className="text-muted">
                              {request.driver.phone}
                            </small>

                          </div>

                        ) : (

                          <span className="text-muted">
                            Not Assigned
                          </span>

                        )}

                      </td>


                      <td>

                        {request.status === "Pending" ? (

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              toast.info(
                                "Driver assignment coming next"
                              );
                            }}
                          >
                            Assign Driver
                          </button>

                        ) : (

                          <span className="text-muted">
                            No Action
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default EmergencyRequests;