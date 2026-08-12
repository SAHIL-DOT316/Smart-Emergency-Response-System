import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { logoutDriver } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext";

import {
  getDriverRequests,
  updateEmergencyStatus,
} from "../../services/emergencyService";

import { updateDriverLocation } from "../../services/driverService";

import {
  getAddressFromCoordinates,
} from "../../services/locationService";

// MUI ICONS
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EmergencyIcon from "@mui/icons-material/Emergency";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import NavigationIcon from "@mui/icons-material/Navigation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";


function DriverDashboard() {

  // =========================================
  // STATE
  // =========================================

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(null);

  const [soundEnabled, setSoundEnabled] =
    useState(false);

  const [currentAddress, setCurrentAddress] =
    useState("Detecting current location...");

  const [currentLatitude, setCurrentLatitude] =
    useState(null);

  const [currentLongitude, setCurrentLongitude] =
    useState(null);

  const navigate = useNavigate();

  const { user, logout } = useAuth();


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {

    try {

      await logoutDriver();

      logout();

      toast.success(
        "Logged out successfully"
      );

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Logout failed"
      );

    }

  };


  // =========================================
  // FETCH REQUESTS
  // =========================================

  const fetchRequests = async () => {

    try {

      const response =
        await getDriverRequests();

      setRequests(
        response.requests || []
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to load requests"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // EMERGENCY SOUND
  // =========================================

  const playEmergencySound = async () => {

    try {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      const audioContext =
        new AudioContext();

      if (
        audioContext.state ===
        "suspended"
      ) {

        await audioContext.resume();

      }

      const playBeep = (
        startTime,
        frequency
      ) => {

        const oscillator =
          audioContext.createOscillator();

        const gainNode =
          audioContext.createGain();

        oscillator.type = "square";

        oscillator.frequency.value =
          frequency;

        gainNode.gain.setValueAtTime(
          0.5,
          startTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          startTime + 0.4
        );

        oscillator.connect(
          gainNode
        );

        gainNode.connect(
          audioContext.destination
        );

        oscillator.start(
          startTime
        );

        oscillator.stop(
          startTime + 0.4
        );

      };

      const now =
        audioContext.currentTime;

      playBeep(now, 900);
      playBeep(now + 0.5, 1200);
      playBeep(now + 1, 900);
      playBeep(now + 1.5, 1200);
      playBeep(now + 2, 900);

    } catch (error) {

      console.error(
        "Emergency sound failed:",
        error
      );

    }

  };


  // =========================================
  // SOCKET.IO
  // =========================================

  useEffect(() => {

    if (!user?.id) {
      return;
    }

    const socket =
      io("http://localhost:5000", {
        withCredentials: true,
      });

    socket.on(
      "connect",
      () => {

        console.log(
          "Driver socket connected:",
          socket.id
        );

        socket.emit(
          "driver-online",
          user.id
        );

      }
    );

    socket.on(
      "new-emergency-request",
      async (data) => {

        console.log(
          "🚨 NEW EMERGENCY:",
          data
        );

        if (soundEnabled) {

          await playEmergencySound();

        }

        toast.error(
          `🚨 NEW EMERGENCY: ${
            data?.emergencyType ||
            "Emergency request"
          }`,
          {
            autoClose: false,
          }
        );

        await fetchRequests();

      }
    );

    socket.on(
      "connect_error",
      (error) => {

        console.error(
          "Socket connection error:",
          error
        );

      }
    );

    return () => {

      socket.off("connect");

      socket.off(
        "new-emergency-request"
      );

      socket.off(
        "connect_error"
      );

      socket.disconnect();

    };

  }, [user, soundEnabled]);


  // =========================================
  // INITIAL REQUESTS
  // =========================================

  useEffect(() => {

    fetchRequests();

  }, []);


  // =========================================
  // GPS LOCATION
  // =========================================

  useEffect(() => {

    if (!navigator.geolocation) {

      toast.error(
        "Geolocation is not supported."
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

            setCurrentLatitude(
              latitude
            );

            setCurrentLongitude(
              longitude
            );

            await updateDriverLocation(
              latitude,
              longitude
            );

            try {

              const address =
                await getAddressFromCoordinates(
                  latitude,
                  longitude
                );

              setCurrentAddress(
                address ||
                "Location detected"
              );

            } catch {

              setCurrentAddress(
                "Location detected"
              );

            }

          } catch (error) {

            console.error(
              "Location update error:",
              error
            );

          }

        },

        (error) => {

          console.error(
            error
          );

          setCurrentAddress(
            "Unable to detect location"
          );

        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }

      );

    };

    updateLocation();

    const interval =
      setInterval(
        updateLocation,
        30000
      );

    return () => {

      clearInterval(
        interval
      );

    };

  }, []);


  // =========================================
  // UPDATE STATUS
  // =========================================

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

      toast.success(
        response.message
      );

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


  // =========================================
  // COUNTS
  // =========================================

  const newRequests =
    requests.filter(
      request =>
        request.status === "Accepted"
    );

  const activeRequests =
    requests.filter(
      request =>
        request.status ===
          "Driver Arrived" ||
        request.status ===
          "Patient Picked"
    );

  const completedRequests =
    requests.filter(
      request =>
        request.status ===
        "Completed"
    );


  // =========================================
  // STATUS BADGE
  // =========================================

  const getStatusBadge = (
    status
  ) => {

    if (status === "Accepted") {

      return (
        <span className="badge bg-danger px-3 py-2">
          <EmergencyIcon
            style={{
              fontSize: 16,
              marginRight: 4,
            }}
          />
          NEW
        </span>
      );

    }

    if (
      status ===
      "Driver Arrived"
    ) {

      return (
        <span className="badge bg-info text-dark px-3 py-2">
          ARRIVED
        </span>
      );

    }

    if (
      status ===
      "Patient Picked"
    ) {

      return (
        <span className="badge bg-warning text-dark px-3 py-2">
          PATIENT PICKED
        </span>
      );

    }

    if (
      status ===
      "Completed"
    ) {

      return (
        <span className="badge bg-success px-3 py-2">
          <CheckCircleIcon
            style={{
              fontSize: 16,
              marginRight: 4,
            }}
          />
          COMPLETED
        </span>
      );

    }

    return (
      <span className="badge bg-secondary px-3 py-2">
        {status}
      </span>
    );

  };


  // =========================================
  // ACTION BUTTON
  // =========================================

  const getActionButton = (
    request
  ) => {

    if (
      request.status ===
      "Accepted"
    ) {

      return (
        <button
          className="btn btn-primary w-100"
          disabled={
            updating === request._id
          }
          onClick={() =>
            handleStatusUpdate(
              request._id,
              "Driver Arrived"
            )
          }
        >

          <NavigationIcon
            style={{
              fontSize: 18,
              marginRight: 5,
            }}
          />

          {updating === request._id
            ? "Updating..."
            : "Driver Arrived"}

        </button>
      );

    }

    if (
      request.status ===
      "Driver Arrived"
    ) {

      return (
        <button
          className="btn btn-warning w-100"
          disabled={
            updating === request._id
          }
          onClick={() =>
            handleStatusUpdate(
              request._id,
              "Patient Picked"
            )
          }
        >

          <PersonIcon
            style={{
              fontSize: 18,
              marginRight: 5,
            }}
          />

          {updating === request._id
            ? "Updating..."
            : "Patient Picked"}

        </button>
      );

    }

    if (
      request.status ===
      "Patient Picked"
    ) {

      return (
        <button
          className="btn btn-success w-100"
          disabled={
            updating === request._id
          }
          onClick={() =>
            handleStatusUpdate(
              request._id,
              "Completed"
            )
          }
        >

          <CheckCircleIcon
            style={{
              fontSize: 18,
              marginRight: 5,
            }}
          />

          {updating === request._id
            ? "Updating..."
            : "Complete"}

        </button>
      );

    }

    return (
      <span className="text-muted">
        No action
      </span>
    );

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          style={{
            width: 45,
            height: 45,
          }}
        />

        <p className="text-muted mt-3">
          Loading driver dashboard...
        </p>

      </div>
    );

  }


  // =========================================
  // UI
  // =========================================

  return (

    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      <div className="container">


        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: 16,
          }}
        >

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div className="d-flex align-items-center gap-3">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#e8f1ff",
                  }}
                >

                  <LocalShippingIcon
                    style={{
                      fontSize: 34,
                    }}
                    color="primary"
                  />

                </div>

                <div>

                  <h2 className="fw-bold mb-1">
                    Driver Dashboard
                  </h2>

                  <p className="text-muted mb-0">
                    Welcome,{" "}
                    <strong>
                      {user?.fullName ||
                        "Driver"}
                    </strong>
                  </p>

                </div>

              </div>


              <div className="d-flex align-items-center gap-2 flex-wrap">

                <span className="badge bg-success px-3 py-2">
                  <span
                    style={{
                      fontSize: 12,
                    }}
                  >
                    ●
                  </span>{" "}
                  ONLINE
                </span>


                {!soundEnabled && (

                  <button
                    className="btn btn-danger"
                    onClick={async () => {

                      await playEmergencySound();

                      setSoundEnabled(
                        true
                      );

                      toast.success(
                        "Emergency alerts enabled"
                      );

                    }}
                  >

                    <NotificationsActiveIcon
                      style={{
                        fontSize: 19,
                        marginRight: 5,
                      }}
                    />

                    Enable Alerts

                  </button>

                )}


                {soundEnabled && (

                  <span className="badge bg-success px-3 py-2">

                    <NotificationsActiveIcon
                      style={{
                        fontSize: 17,
                        marginRight: 4,
                      }}
                    />

                    Alerts ON

                  </span>

                )}


                <button
                  className="btn btn-outline-danger"
                  onClick={
                    handleLogout
                  }
                >

                  <PowerSettingsNewIcon
                    style={{
                      fontSize: 18,
                      marginRight: 5,
                    }}
                  />

                  Logout

                </button>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="row g-3 mb-4">


          {/* NEW */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: 16,
                borderLeft:
                  "5px solid #dc3545",
              }}
            >

              <div className="card-body">

                <div className="d-flex justify-content-between">

                  <div>

                    <p className="text-muted mb-1">
                      New Requests
                    </p>

                    <h2 className="fw-bold text-danger mb-0">
                      {newRequests.length}
                    </h2>

                  </div>

                  <EmergencyIcon
                    color="error"
                    style={{
                      fontSize: 42,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ACTIVE */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: 16,
                borderLeft:
                  "5px solid #ffc107",
              }}
            >

              <div className="card-body">

                <div className="d-flex justify-content-between">

                  <div>

                    <p className="text-muted mb-1">
                      Active Emergency
                    </p>

                    <h2 className="fw-bold text-warning mb-0">
                      {activeRequests.length}
                    </h2>

                  </div>

                  <PendingActionsIcon
                    color="warning"
                    style={{
                      fontSize: 42,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: 16,
                borderLeft:
                  "5px solid #198754",
              }}
            >

              <div className="card-body">

                <div className="d-flex justify-content-between">

                  <div>

                    <p className="text-muted mb-1">
                      Completed
                    </p>

                    <h2 className="fw-bold text-success mb-0">
                      {completedRequests.length}
                    </h2>

                  </div>

                  <CheckCircleIcon
                    color="success"
                    style={{
                      fontSize: 42,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            CURRENT LOCATION
        ===================================== */}

        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: 16,
          }}
        >

          <div className="card-body p-4">

            <div className="d-flex align-items-start gap-3">

              <LocationOnIcon
                color="error"
                style={{
                  fontSize: 35,
                }}
              />

              <div>

                <h5 className="fw-bold mb-1">
                  Current Location
                </h5>

                <div className="text-muted">
                  {currentAddress}
                </div>

                {currentLatitude !== null &&
                  currentLongitude !== null && (

                  <small className="text-muted">

                    Lat:{" "}
                    {currentLatitude.toFixed(
                      6
                    )}

                    {" • "}

                    Long:{" "}
                    {currentLongitude.toFixed(
                      6
                    )}

                  </small>

                )}

              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            NEW EMERGENCY
        ===================================== */}

        {newRequests.length > 0 && (

          <div className="mb-4">

            <div className="d-flex align-items-center gap-2 mb-3">

              <EmergencyIcon
                color="error"
              />

              <h4 className="fw-bold mb-0 text-danger">
                New Emergency Requests
              </h4>

            </div>


            <div className="row g-3">

              {newRequests.map(
                request => (

                  <div
                    className="col-lg-6"
                    key={request._id}
                  >

                    <div
                      className="card border-danger shadow-sm h-100"
                      style={{
                        borderRadius: 16,
                        borderWidth: 2,
                      }}
                    >

                      <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-start mb-3">

                          <div>

                            <h5 className="fw-bold mb-1">

                              <MedicalServicesIcon
                                style={{
                                  marginRight: 5,
                                }}
                              />

                              {request.emergencyType ||
                                "Emergency"}

                            </h5>

                            <small className="text-muted">
                              New emergency request
                            </small>

                          </div>

                          {getStatusBadge(
                            request.status
                          )}

                        </div>


                        <div className="mb-2">

                          <PersonIcon
                            style={{
                              fontSize: 19,
                              marginRight: 8,
                            }}
                          />

                          <strong>
                            {request.patient
                              ?.fullName ||
                              "Unknown Patient"}
                          </strong>

                        </div>


                        <div className="mb-2">

                          <PhoneIcon
                            style={{
                              fontSize: 19,
                              marginRight: 8,
                            }}
                          />

                          {request.patient
                            ?.phone ||
                            "N/A"}

                        </div>


                        <div className="mb-3">

                          <LocationOnIcon
                            color="error"
                            style={{
                              fontSize: 20,
                              marginRight: 8,
                            }}
                          />

                          {request.pickupAddress ||
                            "Pickup location unavailable"}

                        </div>


                        <div className="d-flex gap-2">

                          {getActionButton(
                            request
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* =====================================
            ACTIVE EMERGENCIES
        ===================================== */}

        <div className="mb-4">

          <div className="d-flex align-items-center gap-2 mb-3">

            <PendingActionsIcon
              color="warning"
            />

            <h4 className="fw-bold mb-0">
              Active Emergencies
            </h4>

          </div>


          {activeRequests.length === 0 ? (

            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: 16,
              }}
            >

              <div className="card-body text-center py-4">

                <PendingActionsIcon
                  style={{
                    fontSize: 45,
                    color: "#adb5bd",
                  }}
                />

                <p className="text-muted mt-2 mb-0">
                  No active emergency
                  requests
                </p>

              </div>

            </div>

          ) : (

            <div className="row g-3">

              {activeRequests.map(
                request => (

                  <div
                    className="col-lg-6"
                    key={request._id}
                  >

                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        borderRadius: 16,
                      }}
                    >

                      <div className="card-body p-4">

                        <div className="d-flex justify-content-between mb-3">

                          <h5 className="fw-bold">

                            <LocalShippingIcon
                              color="primary"
                              style={{
                                marginRight: 7,
                              }}
                            />

                            {request.emergencyType ||
                              "Emergency"}

                          </h5>

                          {getStatusBadge(
                            request.status
                          )}

                        </div>


                        <p className="mb-2">

                          <PersonIcon
                            style={{
                              marginRight: 7,
                            }}
                          />

                          {request.patient
                            ?.fullName ||
                            "N/A"}

                        </p>


                        <p className="mb-3">

                          <LocationOnIcon
                            color="error"
                            style={{
                              marginRight: 7,
                            }}
                          />

                          {request.pickupAddress ||
                            "N/A"}

                        </p>


                        {getActionButton(
                          request
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =====================================
            COMPLETED REQUESTS
        ===================================== */}

        <div className="mb-4">

          <div className="d-flex align-items-center gap-2 mb-3">

            <CheckCircleIcon
              color="success"
            />

            <h4 className="fw-bold mb-0">
              Completed Requests
            </h4>

          </div>


          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
            }}
          >

            <div className="card-body p-0">

              {completedRequests.length === 0 ? (

                <div className="text-center py-4">

                  <CheckCircleIcon
                    style={{
                      fontSize: 45,
                      color: "#adb5bd",
                    }}
                  />

                  <p className="text-muted mt-2">
                    No completed requests yet.
                  </p>

                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-light">

                      <tr>

                        <th>
                          Patient
                        </th>

                        <th>
                          Emergency
                        </th>

                        <th>
                          Pickup
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {completedRequests.map(
                        request => (

                          <tr
                            key={
                              request._id
                            }
                          >

                            <td>

                              <PersonIcon
                                style={{
                                  fontSize: 18,
                                  marginRight: 6,
                                }}
                              />

                              {request.patient
                                ?.fullName ||
                                "N/A"}

                            </td>


                            <td>

                              {request.emergencyType ||
                                "N/A"}

                            </td>


                            <td>

                              <LocationOnIcon
                                style={{
                                  fontSize: 18,
                                  marginRight: 5,
                                }}
                              />

                              {request.pickupAddress ||
                                "N/A"}

                            </td>


                            <td>

                              {getStatusBadge(
                                request.status
                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* =====================================
            TEST SOUND
        ===================================== */}

        <div className="text-center mt-4">

          <button
            className="btn btn-outline-danger"
            onClick={
              playEmergencySound
            }
          >

            <NotificationsActiveIcon
              style={{
                marginRight: 6,
              }}
            />

            Test Emergency Sound

          </button>

        </div>

      </div>

    </div>

  );

}

export default DriverDashboard;