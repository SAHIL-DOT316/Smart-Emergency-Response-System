import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PatientNavbar from "../../components/patient/PatientNavbar";
import {
  getMyEmergencyRequests,
  getAvailableDrivers,
  createEmergencyRequest,
} from "../../services/emergencyService";

function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await getMyEmergencyRequests();
      setRequests(response.requests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load emergency requests"
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await getAvailableDrivers();
      setDrivers(response.drivers || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load ambulances"
      );
    } finally {
      setLoadingDrivers(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchDrivers();
  }, []);

  const handleEmergencyRequest = async () => {
    try {
      setRequesting(true);

      // Temporary location.
      // We'll replace this with real browser GPS next.
      const latitude = 32.6155;
      const longitude = 74.8896;

      const response = await createEmergencyRequest({
        pickupAddress: "Bari Brahmana, Jammu",
        latitude,
        longitude,
        emergencyType: "Accident",
      });

      toast.success(
        "Emergency request sent to dispatch team"
      );

      await fetchRequests();
      await fetchDrivers();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create emergency request"
      );
    } finally {
      setRequesting(false);
    }
  };

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
     <>
    <PatientNavbar />
    <div className="container py-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Emergency Response
          </h2>

          <p className="text-muted mb-0">
            Request and track emergency assistance
          </p>
        </div>

        <div className="text-end">
          <small className="text-muted">
            Available Ambulances
          </small>

          <h4 className="fw-bold text-success mb-0">
            {drivers.length}
          </h4>
        </div>

      </div>


      {/* Emergency Request Card */}

      <div className="card border-0 shadow-sm mb-5">

        <div className="card-body p-4">

          <div className="row align-items-center">

            <div className="col-md-8">

              <span className="badge bg-danger mb-2">
                EMERGENCY
              </span>

              <h3 className="fw-bold">
                Need an ambulance?
              </h3>

              <p className="text-muted mb-0">
                Send an emergency request to the dispatch
                team. The nearest available ambulance will
                be assigned to you.
              </p>

            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">

              <button
                className="btn btn-danger btn-lg px-4"
                onClick={handleEmergencyRequest}
                disabled={requesting}
              >
                {requesting
                  ? "Sending Request..."
                  : "🚨 Request Ambulance"}
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* Available Ambulances */}

      <div className="mb-5">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h4 className="fw-bold mb-1">
              Available Ambulances
            </h4>

            <p className="text-muted mb-0">
              Ambulances currently available for dispatch
            </p>
          </div>

          <span className="badge bg-success fs-6">
            {drivers.length} Available
          </span>

        </div>


        {loadingDrivers ? (

          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="text-muted mt-2">
              Finding available ambulances...
            </p>
          </div>

        ) : drivers.length === 0 ? (

          <div className="alert alert-warning">
            No ambulances are currently available.
            Please try again shortly.
          </div>

        ) : (

          <div className="row g-4">

            {drivers.map((driver) => (

              <div
                className="col-md-6 col-lg-4"
                key={driver._id}
              >

                <div className="card h-100 border-0 shadow-sm">

                  <div className="card-body p-4">

                    <div className="d-flex align-items-center mb-3">

                      <div
                        className="rounded-circle bg-light d-flex
                        align-items-center justify-content-center"
                        style={{
                          width: "55px",
                          height: "55px",
                          fontSize: "28px",
                        }}
                      >
                        🚑
                      </div>

                      <div className="ms-3">

                        <h5 className="fw-bold mb-1">
                          {driver.ambulanceNumber}
                        </h5>

                        <span className="badge bg-success">
                          ● Available
                        </span>

                      </div>

                    </div>

                    <hr />

                    <div className="mb-2">
                      <small className="text-muted">
                        Driver
                      </small>

                      <div className="fw-semibold">
                        {driver.fullName}
                      </div>
                    </div>

                    <div>
                      <small className="text-muted">
                        Contact
                      </small>

                      <div className="fw-semibold">
                        {driver.phone}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* My Emergency Requests */}

      <div>

        <div className="mb-3">

          <h4 className="fw-bold mb-1">
            My Emergency Requests
          </h4>

          <p className="text-muted">
            Track the status of your emergency requests
          </p>

        </div>


        {loadingRequests ? (

          <div className="text-center py-4">
            <div className="spinner-border" />
          </div>

        ) : requests.length === 0 ? (

          <div className="card border-0 shadow-sm">

            <div className="card-body text-center py-5">

              <div style={{ fontSize: "45px" }}>
                🚑
              </div>

              <h5 className="fw-bold mt-3">
                No Emergency Requests
              </h5>

              <p className="text-muted">
                Your emergency requests will appear here.
              </p>

            </div>

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead className="table-dark">

                <tr>
                  <th>Emergency</th>
                  <th>Pickup Location</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Ambulance</th>
                </tr>

              </thead>

              <tbody>

                {requests.map((request) => (

                  <tr key={request._id}>

                    <td className="fw-semibold">
                      {request.emergencyType}
                    </td>

                    <td>
                      {request.pickupAddress}
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
                      {request.driver
                        ? request.driver.fullName
                        : "Waiting for assignment"}
                    </td>

                    <td>
                      {request.driver
                        ? request.driver.ambulanceNumber
                        : "Not Assigned"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
    </>
  );
}

export default PatientDashboard;