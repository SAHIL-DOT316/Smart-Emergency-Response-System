import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllEmergencyRequests,
  getNearestDrivers,
  assignDriver,
} from "../../services/emergencyService";

function EmergencyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nearestDrivers, setNearestDrivers] = useState({});
  const [loadingDrivers, setLoadingDrivers] = useState(null);
  const [assigning, setAssigning] = useState(null);

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

  // --------------------------------
  // Priority
  // --------------------------------

  const priority = {
    Accident: 1,
    "Heart Attack": 2,
    Stroke: 3,
    "Breathing Problem": 4,
    Other: 5,
  };

  const getPriority = (type) => {
    return priority[type] || 5;
  };

  const getPriorityLabel = (type) => {
    const value = getPriority(type);

    if (value === 1) return "CRITICAL";
    if (value === 2) return "HIGH";
    if (value === 3) return "HIGH";
    if (value === 4) return "MEDIUM";

    return "NORMAL";
  };

  const getPriorityClass = (type) => {
    const value = getPriority(type);

    if (value === 1) {
      return "bg-danger";
    }

    if (value === 2 || value === 3) {
      return "bg-warning text-dark";
    }

    if (value === 4) {
      return "bg-info text-dark";
    }

    return "bg-secondary";
  };

  // --------------------------------
  // Find nearest ambulance
  // --------------------------------

  const handleFindNearest = async (requestId) => {
    try {
      setLoadingDrivers(requestId);

      const response = await getNearestDrivers(requestId);

      setNearestDrivers((prev) => ({
        ...prev,
        [requestId]: response.drivers || [],
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to find available ambulances"
      );
    } finally {
      setLoadingDrivers(null);
    }
  };

  // --------------------------------
  // Assign driver
  // --------------------------------

  const handleAssignDriver = async (
    requestId,
    driverId
  ) => {
    try {
      setAssigning(driverId);

      const response = await assignDriver(
        requestId,
        driverId
      );

      toast.success(response.message);

      await fetchRequests();

      setNearestDrivers((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to assign driver"
      );
    } finally {
      setAssigning(null);
    }
  };

  // --------------------------------
  // Separate requests
  // --------------------------------

  const pendingRequests = requests
  .filter((request) => request.status === "Pending")
  .sort((a, b) => {
    const priority = {
      "Heart Attack": 1,
      Stroke: 1,
      Accident: 2,
      "Breathing Problem": 2,
      "Serious Injury": 2,
      Pregnancy: 3,
      "Fire / Burn": 3,
      Other: 4,
    };

    return (
      (priority[a.emergencyType] || 5) -
      (priority[b.emergencyType] || 5)
    );
  });

const activeRequests = requests.filter(
  (request) =>
    request.status === "Accepted" ||
    request.status === "Driver Arrived" ||
    request.status === "Patient Picked"
);

const completedRequests = requests.filter(
  (request) => request.status === "Completed"
);


  // --------------------------------
  // Request Card
  // --------------------------------

  const EmergencyCard = ({ request }) => {
    return (
      <div className="card border-0 shadow-sm h-100">

        <div className="card-body p-4">

          {/* Header */}

          <div className="d-flex justify-content-between align-items-start mb-3">

            <div>
              <span
                className={`badge ${getPriorityClass(
                  request.emergencyType
                )}`}
              >
                {getPriorityLabel(
                  request.emergencyType
                )}
              </span>

              <h5 className="fw-bold mt-2 mb-1">
                {request.emergencyType}
              </h5>
            </div>

            <span className="badge bg-light text-dark border">
              #{request._id.slice(-6)}
            </span>

          </div>

          <hr />

          {/* Patient */}

          <div className="mb-3">

            <small className="text-muted">
              Patient
            </small>

            <div className="fw-semibold">
              {request.patient?.fullName ||
                "Unknown"}
            </div>

            <small className="text-muted">
              {request.patient?.phone || "-"}
            </small>

          </div>

          {/* Location */}

          <div className="mb-3">

            <small className="text-muted">
              Pickup Location
            </small>

            <div className="fw-semibold">
              {request.pickupAddress ||
                "Location unavailable"}
            </div>

          </div>

          {/* Status */}

          <div className="mb-3">

            <small className="text-muted">
              Status
            </small>

            <div>
              <span
                className={`badge ${
                  request.status === "Pending"
                    ? "bg-warning text-dark"
                    : request.status === "Completed"
                    ? "bg-success"
                    : "bg-primary"
                }`}
              >
                {request.status}
              </span>
            </div>

          </div>

          {/* Driver */}

          {request.driver && (
            <div className="border rounded p-3 mb-3">

              <small className="text-muted">
                Assigned Driver
              </small>

              <div className="fw-semibold">
                {request.driver.fullName}
              </div>

              <small className="text-muted">
                {request.driver.phone}
              </small>

            </div>
          )}

          {/* Pending action */}

          {request.status === "Pending" && (
            <>

              <button
                className="btn btn-primary w-100"
                disabled={
                  loadingDrivers === request._id
                }
                onClick={() =>
                  handleFindNearest(request._id)
                }
              >
                {loadingDrivers === request._id
                  ? "Finding Ambulances..."
                  : "Find Nearest Ambulance"}
              </button>

              {/* Ambulances */}

              {nearestDrivers[request._id] && (

                <div className="mt-3">

                  <small className="text-muted">
                    Available Ambulances
                  </small>

                  {nearestDrivers[request._id]
                    .slice(0, 3)
                    .map((driver, index) => (

                      <div
                        key={driver._id}
                        className="border rounded p-3 mt-2"
                      >

                        <div className="d-flex justify-content-between">

                          <div>

                            <div className="fw-bold">
                              {driver.ambulanceNumber}
                            </div>

                            <small>
                              {driver.fullName}
                            </small>

                          </div>

                          <div className="text-end">

                            <div className="fw-bold text-primary">
                              {driver.distance} km
                            </div>

                            <small className="text-muted">
                              away
                            </small>

                          </div>

                        </div>

                        <button
                          className="btn btn-success btn-sm w-100 mt-2"
                          disabled={
                            assigning === driver._id
                          }
                          onClick={() =>
                            handleAssignDriver(
                              request._id,
                              driver._id
                            )
                          }
                        >
                          {assigning === driver._id
                            ? "Assigning..."
                            : index === 0
                            ? "Assign Nearest"
                            : "Assign"}
                        </button>

                      </div>

                    ))}

                </div>

              )}

            </>
          )}

        </div>

      </div>
    );
  };

  // --------------------------------
  // Loading
  // --------------------------------

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
 
  return (
    <div>

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Emergency Control Center
          </h2>

          <p className="text-muted mb-0">
            Monitor and dispatch emergency ambulances
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

      <div className="row g-3 mb-5">

        <div className="col-md-3">

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

        <div className="col-md-3">

          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <small className="text-muted">
                Pending
              </small>

              <h3 className="fw-bold text-danger mb-0">
                {pendingRequests.length}
              </h3>

            </div>
          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <small className="text-muted">
                Active
              </small>

              <h3 className="fw-bold text-primary mb-0">
                {activeRequests.length}
              </h3>

            </div>
          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <small className="text-muted">
                Completed
              </small>

              <h3 className="fw-bold text-success mb-0">
                {completedRequests.length}
              </h3>

            </div>
          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* PENDING REQUESTS */}
      {/* ================================= */}

      <div className="mb-5">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h4 className="fw-bold mb-1">
              Pending Emergency Requests
            </h4>

            <p className="text-muted mb-0">
              Requests waiting for ambulance assignment
            </p>
          </div>

          <span className="badge bg-danger fs-6">
            {pendingRequests.length}
          </span>

        </div>

        {pendingRequests.length === 0 ? (

          <div className="card border-0 shadow-sm">

            <div className="card-body text-center py-4">

              <h6 className="fw-bold">
                No pending requests
              </h6>

              <p className="text-muted mb-0">
                All emergency requests have been handled.
              </p>

            </div>

          </div>

        ) : (

          <div className="row g-4">

            {pendingRequests.map((request) => (

              <div
                className="col-md-6 col-xl-4"
                key={request._id}
              >
                <EmergencyCard request={request} />
              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================================= */}
      {/* ACTIVE REQUESTS */}
      {/* ================================= */}

      <div className="mb-5">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h4 className="fw-bold mb-1">
              Active Assignments
            </h4>

            <p className="text-muted mb-0">
              Ambulances currently handling emergencies
            </p>
          </div>

          <span className="badge bg-primary fs-6">
            {activeRequests.length}
          </span>

        </div>

        {activeRequests.length === 0 ? (

          <div className="card border-0 shadow-sm">

            <div className="card-body text-center py-4">
              <p className="text-muted mb-0">
                No active emergency assignments.
              </p>
            </div>

          </div>

        ) : (

          <div className="row g-4">

            {activeRequests.map((request) => (

              <div
                className="col-md-6 col-xl-4"
                key={request._id}
              >
                <EmergencyCard request={request} />
              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================================= */}
      {/* COMPLETED */}
      {/* ================================= */}

      <div>

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h4 className="fw-bold mb-1">
              Completed Emergencies
            </h4>

            <p className="text-muted mb-0">
              Successfully completed emergency requests
            </p>
          </div>

          <span className="badge bg-success fs-6">
            {completedRequests.length}
          </span>

        </div>

        {completedRequests.length === 0 ? (

          <div className="card border-0 shadow-sm">

            <div className="card-body text-center py-4">

              <p className="text-muted mb-0">
                No completed emergencies yet.
              </p>

            </div>

          </div>

        ) : (

          <div className="row g-4">

            {completedRequests.map((request) => (

              <div
                className="col-md-6 col-xl-4"
                key={request._id}
              >
                <EmergencyCard request={request} />
              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default EmergencyRequests;