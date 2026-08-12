import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PatientNavbar from "../../components/patient/PatientNavbar";

import {
  getMyEmergencyRequests,
  getAvailableDrivers,
  createEmergencyRequest,
} from "../../services/emergencyService";

import {
  getAddressFromCoordinates,
} from "../../services/locationService";

function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [showEmergencyModal, setShowEmergencyModal] =
    useState(false);

  const [emergencyType, setEmergencyType] =
    useState("");

  const [loadingRequests, setLoadingRequests] =
    useState(true);

  const [loadingDrivers, setLoadingDrivers] =
    useState(true);

  const [requesting, setRequesting] =
    useState(false);

  // ==============================
  // Fetch Patient Requests
  // ==============================

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

  // ==============================
  // Fetch Available Drivers
  // ==============================

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

  // ==============================
  // Initial Load
  // ==============================

  useEffect(() => {
    fetchRequests();
    fetchDrivers();
  }, []);

  // ==============================
  // Create Emergency Request
  // ==============================

  const handleEmergencyRequest = () => {
  if (!emergencyType) {
    toast.error("Please select the type of emergency");
    return;
  }

  if (!navigator.geolocation) {
    toast.error(
      "Geolocation is not supported by your browser."
    );
    return;
  }

  setRequesting(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("Patient Location:", {
          latitude,
          longitude,
        });
          const pickupAddress =
  await getAddressFromCoordinates(
    latitude,
    longitude
  );

console.log("Pickup Address:", pickupAddress);
        const response = await createEmergencyRequest({
          pickupAddress: pickupAddress || "Current Location",
          latitude,
          longitude,
          emergencyType: emergencyType,
        });

        console.log("Emergency Response:", response);

        // Automatic nearest-driver assignment
        toast.success(
          response.driver
            ? `Ambulance ${
                response.driver.ambulanceNumber
              } assigned. ${
                response.driver.distance
              } km away.`
            : "Emergency request created. Waiting for an available ambulance."
        );

        setEmergencyType("");
        setShowEmergencyModal(false);

        await fetchRequests();
        await fetchDrivers();

      } catch (error) {
        console.error(
          "Emergency request error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to create emergency request"
        );
      } finally {
        setRequesting(false);
      }
    },

    (error) => {
      setRequesting(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error(
            "Location permission denied. Please allow location access."
          );
          break;

        case error.POSITION_UNAVAILABLE:
          toast.error(
            "Unable to determine your current location."
          );
          break;

        case error.TIMEOUT:
          toast.error(
            "Location request timed out."
          );
          break;

        default:
          toast.error(
            "Unable to get your current location."
          );
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};
  // ==============================
  // Status Badge
  // ==============================

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

  // ==============================
  // Close Modal
  // ==============================

  const closeModal = () => {
    if (requesting) return;

    setShowEmergencyModal(false);
    setEmergencyType("");
  };

  // ==============================
  // UI
  // ==============================

  return (
    <>
      <PatientNavbar />

      <div className="container py-4">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

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


        {/* ========================================= */}
        {/* EMERGENCY CARD */}
        {/* ========================================= */}

        <div
          className="card border-0 shadow-sm mb-5 overflow-hidden"
          style={{
            borderRadius: "18px",
          }}
        >

          <div className="card-body p-4 p-lg-5">

            <div className="row align-items-center">

              <div className="col-lg-8">

                <div
                  className="d-inline-flex align-items-center px-3 py-2 rounded-pill mb-3"
                  style={{
                    background: "#fee2e2",
                    color: "#b91c1c",
                  }}
                >

                  <span className="fw-bold small">
                    EMERGENCY RESPONSE
                  </span>

                </div>


                <h2 className="fw-bold mb-2">
                  Need an ambulance?
                </h2>


                <p
                  className="text-muted mb-4"
                  style={{
                    maxWidth: "650px",
                  }}
                >
                  Request emergency medical
                  assistance from your current
                  location. Our dispatch team will
                  find and assign the nearest
                  available ambulance.
                </p>


                <div className="d-flex flex-wrap gap-3">

                  <button
                    className="btn btn-danger btn-lg px-4"
                    onClick={() =>
                      setShowEmergencyModal(true)
                    }
                    disabled={requesting}
                  >
                    Request Ambulance
                  </button>


                  <div className="d-flex align-items-center text-muted">

                    <span className="me-2">
                      GPS location required
                    </span>

                  </div>

                </div>

              </div>


              {/* Emergency visual */}

              <div className="col-lg-4 text-center mt-4 mt-lg-0">

                <div
                  className="mx-auto d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "130px",
                    height: "130px",
                    background: "#fff1f2",
                    fontSize: "50px",
                  }}
                >
                  🚑
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================= */}
        {/* AVAILABLE AMBULANCES */}
        {/* ========================================= */}

        <div className="mb-5">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>

              <h4 className="fw-bold mb-1">
                Available Ambulances
              </h4>

              <p className="text-muted mb-0">
                Ambulances currently available
                for dispatch
              </p>

            </div>


            <span className="badge bg-success fs-6">
              {drivers.length} Available
            </span>

          </div>


          {/* Loading */}

          {loadingDrivers ? (

            <div className="text-center py-5">

              <div className="spinner-border text-primary" />

              <p className="text-muted mt-2 mb-0">
                Finding available ambulances...
              </p>

            </div>

          ) : drivers.length === 0 ? (

            /* No drivers */

            <div className="card border-0 shadow-sm">

              <div className="card-body text-center py-5">

                <div
                  style={{
                    fontSize: "45px",
                  }}
                >
                  🚑
                </div>

                <h5 className="fw-bold mt-3">
                  No Ambulances Available
                </h5>

                <p className="text-muted mb-0">
                  Please try again shortly.
                </p>

              </div>

            </div>

          ) : (

            /* Driver Cards */

            <div className="row g-4">

              {drivers.map((driver) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={driver._id}
                >

                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: "16px",
                    }}
                  >

                    <div className="card-body p-4">

                      <div className="d-flex align-items-center mb-3">

                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "55px",
                            height: "55px",
                            background: "#ecfdf5",
                            fontSize: "27px",
                          }}
                        >
                          🚑
                        </div>


                        <div className="ms-3">

                          <h5 className="fw-bold mb-1">
                            {driver.ambulanceNumber}
                          </h5>

                          <span className="badge bg-success">
                            Available
                          </span>

                        </div>

                      </div>


                      <hr />


                      <div className="mb-3">

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


        {/* ========================================= */}
        {/* MY EMERGENCY REQUESTS */}
        {/* ========================================= */}

        <div>

          <div className="mb-3">

            <h4 className="fw-bold mb-1">
              My Emergency Requests
            </h4>

            <p className="text-muted">
              Track the status of your emergency
              requests
            </p>

          </div>


          {/* Loading */}

          {loadingRequests ? (

            <div className="text-center py-4">

              <div className="spinner-border text-primary" />

            </div>

          ) : requests.length === 0 ? (

            /* Empty */

            <div className="card border-0 shadow-sm">

              <div className="card-body text-center py-5">

                <div
                  style={{
                    fontSize: "45px",
                  }}
                >
                  🚑
                </div>

                <h5 className="fw-bold mt-3">
                  No Emergency Requests
                </h5>

                <p className="text-muted mb-0">
                  Your emergency requests will
                  appear here.
                </p>

              </div>

            </div>

          ) : (

            /* Requests Table */

            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "16px",
              }}
            >

              <div className="card-body p-0">

                <div className="table-responsive">

                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-dark">

                      <tr>

                        <th className="px-3">
                          Emergency
                        </th>

                        <th>
                          Pickup Location
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Driver
                        </th>

                        <th>
                          Ambulance
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {requests.map((request) => (

                        <tr key={request._id}>

                          <td className="px-3 fw-semibold">

                            {request.emergencyType}

                          </td>


                          <td>

                            <div
                              style={{
                                maxWidth: "300px",
                              }}
                            >
                              {request.pickupAddress}
                            </div>

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
                                Waiting for assignment
                              </span>

                            )}

                          </td>


                          <td>

                            {request.driver
                              ? request.driver
                                  .ambulanceNumber
                              : "Not Assigned"}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* ========================================= */}
      {/* EMERGENCY MODAL */}
      {/* ========================================= */}

      {showEmergencyModal && (

        <div
          className="modal d-block"
          style={{
            background:
              "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div
              className="modal-content border-0 shadow-lg"
              style={{
                borderRadius: "20px",
              }}
            >

              {/* Modal Header */}

              <div className="modal-header border-0 px-4 pt-4">

                <div>

                  <div className="d-flex align-items-center gap-2 mb-1">

                    <span
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "42px",
                        height: "42px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      !
                    </span>


                    <h5 className="modal-title fw-bold mb-0">
                      Emergency Assistance
                    </h5>

                  </div>


                  <p className="text-muted small mb-0">
                    Select the reason for requesting
                    an ambulance
                  </p>

                </div>


                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={requesting}
                />

              </div>


              {/* Modal Body */}

              <div className="modal-body px-4">

                {/* Location information */}

                <div
                  className="rounded-3 p-3 mb-4"
                  style={{
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >

                  <div className="d-flex align-items-start">

                    <div
                      className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "#dbeafe",
                        color: "#2563eb",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      GPS
                    </div>


                    <div>

                      <div className="fw-semibold">
                        Your current location
                      </div>

                      <small className="text-muted">
                        We'll use your GPS location
                        to find the nearest available
                        ambulance.
                      </small>

                    </div>

                  </div>

                </div>


                {/* Emergency type */}

                <label className="form-label fw-semibold mb-3">
                  What happened?
                </label>


                <div className="row g-2">

                  {[
                    "Accident",
                    "Heart Attack",
                    "Breathing Problem",
                    "Serious Injury",
                    "Pregnancy",
                    "Stroke",
                    "Fire / Burn",
                    "Other",
                  ].map((type) => {

                    const selected =
                      emergencyType === type;

                    return (

                      <div
                        className="col-6"
                        key={type}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setEmergencyType(type)
                          }
                          className="w-100 text-start rounded-3 p-3"
                          style={{
                            background: selected
                              ? "#fee2e2"
                              : "#fff",

                            border: `1px solid ${
                              selected
                                ? "#dc2626"
                                : "#e2e8f0"
                            }`,

                            color: selected
                              ? "#b91c1c"
                              : "#334155",

                            transition:
                              "all 0.2s",
                          }}
                        >

                          <div className="d-flex align-items-center justify-content-between">

                            <span className="fw-semibold small">
                              {type}
                            </span>

                            {selected && (

                              <span className="fw-bold">
                                ✓
                              </span>

                            )}

                          </div>

                        </button>

                      </div>

                    );
                  })}

                </div>

              </div>


              {/* Modal Footer */}

              <div className="modal-footer border-0 px-4 pb-4">

                <button
                  type="button"
                  className="btn btn-light px-4"
                  onClick={closeModal}
                  disabled={requesting}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="btn btn-danger px-4"
                  disabled={
                    !emergencyType ||
                    requesting
                  }
                  onClick={handleEmergencyRequest}
                >

                  {requesting
                    ? "Getting Location..."
                    : "Request Ambulance"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default PatientDashboard;