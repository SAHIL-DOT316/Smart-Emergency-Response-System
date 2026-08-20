import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { logoutDriver } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext";
import "./DriverDashboard.css";
import {
  getDriverRequests,
  updateEmergencyStatus,
  getNearestHospitals,
  assignHospital,
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
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HotelIcon from "@mui/icons-material/Hotel";
import CallIcon from "@mui/icons-material/Call";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import RefreshIcon from "@mui/icons-material/Refresh";
import BedIcon from "@mui/icons-material/Bed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

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
   const [hospitals, setHospitals] = useState([]);
const [hospitalLoading, setHospitalLoading] =
  useState(false);

const [selectedRequest, setSelectedRequest] =
  useState(null);

const [assigningHospital, setAssigningHospital] =
  useState(null);

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


  const fetchNearestHospitals = async (requestId) => {
  try {
    setHospitalLoading(true);
    setSelectedRequest(requestId);

    const response =
      await getNearestHospitals(requestId);

    setHospitals(
      (response.hospitals || []).sort(
        (a, b) => a.distance - b.distance
      )
    );

  } catch (error) {

    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to load nearby hospitals"
    );

  } finally {

    setHospitalLoading(false);

  }
};

  const handleAssignHospital = async (
  hospitalId
) => {

  if (!selectedRequest) {
    toast.error(
      "Please select an emergency request"
    );
    return;
  }

  try {

    setAssigningHospital(hospitalId);

    const response =
      await assignHospital(
        selectedRequest,
        hospitalId
      );

    toast.success(
      response.message ||
      "Hospital requested successfully"
    );

    await fetchRequests();

    setHospitals([]);

    setSelectedRequest(null);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to request hospital"
    );

  } finally {

    setAssigningHospital(null);

  }
}; 



  const fetchRequests = async () => {

    try {

      const response =
        await getDriverRequests();
   console.log("REFRESH RESPONSE:", response);
console.log("ALL REQUESTS:", response.requests);
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
          " NEW EMERGENCY:",
          data
        );

        if (soundEnabled) {

          await playEmergencySound();

        }

        toast.error(
          ` NEW EMERGENCY: ${
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

    // Patient is now inside ambulance
    if (status === "Patient Picked") {
      await fetchNearestHospitals(
        requestId
      );
    }

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
        request.status === "Driver Arrived" ||
      request.status === "Patient Picked" ||
      request.status === "Hospital Assigned"
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

    }}
    // =========================================
// ACTION BUTTON
// =========================================

const getActionButton = (request) => {

  // -----------------------------
  // NEW REQUEST
  // -----------------------------
  if (request.status === "Accepted") {

    return (
      <button
        className="btn btn-primary w-100"
        disabled={updating === request._id}
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

  // -----------------------------
  // DRIVER ARRIVED
  // -----------------------------
  if (request.status === "Driver Arrived") {

    return (
      <button
        className="btn btn-warning w-100"
        disabled={updating === request._id}
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

  // -----------------------------
  // PATIENT PICKED
  // -----------------------------
 if (request.status === "Patient Picked") {

  return (
    <button
      className="btn btn-outline-primary w-100"
      onClick={() =>
        fetchNearestHospitals(request._id)
      }
    >
      <LocalHospitalIcon
        style={{
          fontSize: 18,
          marginRight: 5,
        }}
      />

      Find Nearby Hospitals
    </button>
  );
}

if (request.status === "Hospital Assigned") {

  return (
    <button
      className="btn btn-success w-100"
      disabled={updating === request._id}
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
        ? "Completing..."
        : "Complete Emergency"}
    </button>
  );
}



  return (
    <span className="text-muted">
      No action available
    </span>
  );
};

   return (

  <div className="driver-dashboard">

    {/* =========================================
        BACKGROUND
    ========================================= */}

    <div className="driver-background" />

    <div className="driver-overlay" />


    <div className="driver-content">

      <div className="container-fluid px-lg-5 py-4">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="driver-header mb-4">

          <div className="driver-brand">

            <div className="driver-logo">
              <LocalShippingIcon />
            </div>

            <div>

              <div className="small text-white-50">
                EMERGENCY RESPONSE CENTER
              </div>

              <h2 className="text-white fw-bold mb-0">
                Driver Dashboard
              </h2>

              <div className="text-white-50">
                Welcome,{" "}
                <strong>
                  {user?.fullName || "Driver"}
                </strong>
              </div>

            </div>

          </div>


          <div className="driver-header-actions">

            <span className="driver-online">

              <span className="online-dot" />

              ONLINE

            </span>


            {!soundEnabled ? (

              <button
                className="btn btn-danger alert-button"
                onClick={async () => {

                  await playEmergencySound();

                  setSoundEnabled(true);

                  toast.success(
                    "Emergency alerts enabled"
                  );

                }}
              >

                <NotificationsActiveIcon />

                Enable Alerts

              </button>

            ) : (

              <span className="alerts-active">

                <NotificationsActiveIcon />

                Alerts ON

              </span>

            )}


            <button
              className="btn btn-light"
              onClick={handleLogout}
            >

              <PowerSettingsNewIcon />

              Logout

            </button>

          </div>

        </div>



        {/* =====================================
            HERO
        ===================================== */}

        <div className="driver-hero mb-4">

          <div className="driver-hero-content">

            <div className="hero-badge">

              <WarningAmberIcon />

              Emergency Response Active

            </div>

            <h1>
              Save lives.
              <br />
              <span>Respond faster.</span>
            </h1>

            <p>
              Monitor emergency requests,
              navigate to patients and find
              the nearest available hospital.
            </p>

          </div>


          <div className="hero-ambulance">

            <LocalShippingIcon />

          </div>

        </div>



        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="row g-4 mb-4">


          <div className="col-xl-3 col-md-6">

            <div className="driver-stat-card danger">

              <div>

                <span>
                  New Requests
                </span>

                <h2>
                  {newRequests.length}
                </h2>

                <small>
                  Emergency cases
                </small>

              </div>

              <EmergencyIcon />

            </div>

          </div>


          <div className="col-xl-3 col-md-6">

            <div className="driver-stat-card warning">

              <div>

                <span>
                  Active Emergency
                </span>

                <h2>
                  {activeRequests.length}
                </h2>

                <small>
                  Currently handling
                </small>

              </div>

              <PendingActionsIcon />

            </div>

          </div>


          <div className="col-xl-3 col-md-6">

            <div className="driver-stat-card success">

              <div>

                <span>
                  Completed
                </span>

                <h2>
                  {completedRequests.length}
                </h2>

                <small>
                  Successfully completed
                </small>

              </div>

              <CheckCircleIcon />

            </div>

          </div>


          <div className="col-xl-3 col-md-6">

            <div className="driver-stat-card primary">

              <div>

                <span>
                  Nearby Hospitals
                </span>

                <h2>
                  {hospitals.length}
                </h2>

                <small>
                  Emergency facilities
                </small>

              </div>

              <LocalHospitalIcon />

            </div>

          </div>

        </div>



        {/* =====================================
            LOCATION
        ===================================== */}

        <div className="glass-card mb-4">

          <div className="location-header">

            <div className="location-icon">

              <LocationOnIcon />

            </div>

            <div>

              <small>
                LIVE LOCATION
              </small>

              <h5 className="mb-1 fw-bold">
                Current Ambulance Location
              </h5>

              <p className="text-muted mb-0">
                {currentAddress}
              </p>

            </div>

            <div className="ms-auto location-live">

              <span />

              GPS ACTIVE

            </div>

          </div>


          {currentLatitude !== null && (

            <div className="coordinates">

              <div>

                <small>
                  LATITUDE
                </small>

                <strong>
                  {currentLatitude.toFixed(6)}
                </strong>

              </div>

              <div>

                <small>
                  LONGITUDE
                </small>

                <strong>
                  {currentLongitude.toFixed(6)}
                </strong>

              </div>

            </div>

          )}

        </div>



        {/* =====================================
            NEW EMERGENCIES
        ===================================== */}


          <section className="dashboard-section">

            <div className="section-title">

              <div className="section-title-icon danger-icon">

                <EmergencyIcon />

              </div>

              <div>

                <h4>
                  New Emergency Requests
                </h4>

                <p>
                  Immediate response required
                </p>

              </div>

             <div className="d-flex align-items-center gap-2">

  <span className="section-count danger-count">
    {newRequests.length}
  </span>

  <button
    type="button"
    className="refresh-request-button"
    onClick={fetchRequests}
    disabled={loading}
    title="Refresh emergency requests"
  >
    <RefreshIcon
      className={loading ? "spin" : ""}
    />
  </button>

</div>

            </div>
            {newRequests.length === 0 ? (

  <div className="empty-card">

    <EmergencyIcon />

    <h5>
      No New Emergency Requests
    </h5>

    <p>
      New ambulance requests will appear here.
    </p>

  </div>

) :(

            <div className="row g-4">

              {newRequests.map(
                request => (

                  <div
                    className="col-xl-6"
                    key={request._id}
                  >

                    <div className="emergency-card new-card">

                      <div className="emergency-card-top">

                        <div className="emergency-type">

                          <div className="emergency-icon">

                            <EmergencyIcon />

                          </div>

                          <div>

                            <h5>
                              {request.emergencyType ||
                                "Emergency"}
                            </h5>

                            <small>
                              Request #
                              {request._id.slice(-6)}
                            </small>

                          </div>

                        </div>

                        {getStatusBadge(
                          request.status
                        )}

                      </div>


                      <div className="emergency-details">

                        <div>

                          <PersonIcon />

                          <span>
                            {request.patient
                              ?.fullName ||
                              "Unknown Patient"}
                          </span>

                        </div>


                        <div>

                          <PhoneIcon />

                          <span>
                            {request.patient
                              ?.phone ||
                              "N/A"}
                          </span>

                        </div>


                        <div className="full-width">

                          <LocationOnIcon />

                          <span>
                            {request.pickupAddress ||
                              "Pickup location unavailable"}
                          </span>

                        </div>

                      </div>


                      <div className="emergency-footer">

                        <AccessTimeIcon />

                        <span>
                          {new Date(
                            request.createdAt
                          ).toLocaleString()}
                        </span>

                        <div className="ms-auto">

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
)}
          </section>
        


        {/* =====================================
            ACTIVE EMERGENCIES
        ===================================== */}

        <section className="dashboard-section">

          <div className="section-title">

            <div className="section-title-icon warning-icon">

              <PendingActionsIcon />

            </div>

            <div>

              <h4>
                Active Emergency
              </h4>

              <p>
                Current patient transportation
              </p>

            </div>

         <div className="d-flex align-items-center gap-2">

  <span className="section-count warning-count">
    {activeRequests.length}
  </span>

  <button
    type="button"
    className="refresh-request-button"
    onClick={fetchRequests}
    disabled={loading}
    title="Refresh emergency requests"
  >
    <RefreshIcon
      className={loading ? "spin" : ""}
    />
  </button>

</div>

          </div>


          {activeRequests.length === 0 ? (

            <div className="empty-card">

              <PendingActionsIcon />

              <h5>
                No Active Emergency
              </h5>

              <p>
                Active patient transportation
                will appear here.
              </p>

            </div>

          ) : (

            <div className="row g-4">

              {activeRequests.map(
                request => (

                  <div
                    className="col-xl-6"
                    key={request._id}
                  >

                    <div className="emergency-card active-card">

                      <div className="emergency-card-top">

                        <div className="emergency-type">

                          <div className="emergency-icon blue">

                            <LocalShippingIcon />

                          </div>

                          <div>

                            <h5>
                              {request.emergencyType}
                            </h5>

                            <small>
                              Patient transportation
                            </small>

                          </div>

                        </div>

                        {getStatusBadge(
                          request.status
                        )}

                      </div>


                      <div className="emergency-details">

                        <div>

                          <PersonIcon />

                          <span>
                            {request.patient
                              ?.fullName ||
                              "N/A"}
                          </span>

                        </div>


                        <div>

                          <PhoneIcon />

                          <span>
                            {request.patient
                              ?.phone ||
                              "N/A"}
                          </span>

                        </div>


                        <div className="full-width">

                          <LocationOnIcon />

                          <span>
                            {request.pickupAddress ||
                              "N/A"}
                          </span>

                        </div>

                      </div>


                      <div className="mt-3">

                        {getActionButton(
                          request
                        )}

                      </div>


                      {/* FIND HOSPITAL */}

                      {request.status ===
                        "Patient Picked" && (

                        <button
                          className="find-hospital-button mt-3"
                          onClick={() =>
                            fetchNearestHospitals(
                              request._id
                            )
                          }
                        >

                          <LocalHospitalIcon />

                          Find Nearby Hospitals

                        </button>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>



        {/* =====================================
            AVAILABLE HOSPITALS
        ===================================== */}

        <section className="dashboard-section">

          <div className="section-title">

            <div className="section-title-icon hospital-icon">

              <LocalHospitalIcon />

            </div>

            <div>

              <h4>
                Available Hospitals
              </h4>

              <p>
                Nearest emergency hospitals
                sorted by distance
              </p>

            </div>

            {hospitals.length > 0 && (

              <span className="section-count hospital-count">

                {hospitals.length}

              </span>

            )}

          </div>


          {hospitalLoading ? (

            <div className="empty-card">

              <RefreshIcon className="spin" />

              <h5>
                Finding Nearby Hospitals
              </h5>

              <p>
                Checking emergency beds and
                hospital availability...
              </p>

            </div>

          ) : hospitals.length === 0 ? (

            <div className="empty-card">

              <LocalHospitalIcon />

              <h5>
                No Hospital Selected
              </h5>

              <p>
                After picking up a patient,
                find nearby hospitals here.
              </p>

            </div>

          ) : (

            <div className="row g-4">

              {hospitals.map(
                (hospital, index) => (

                  <div
                    className="col-xl-4 col-lg-6"
                    key={hospital._id}
                  >

                    <div className="hospital-card">

                      {/* RANK */}

                      <div className="hospital-rank">

                        #{index + 1}

                      </div>


                      {/* HEADER */}

                      <div className="hospital-card-header">

                        <div className="hospital-logo-small">

                          <LocalHospitalIcon />

                        </div>

                        <div>

                          <h5>
                            {hospital.hospitalName}
                          </h5>

                          <small>
                            {hospital.city}
                          </small>

                        </div>

                      </div>


                      {/* DISTANCE */}

                      <div className="distance-box">

                        <div>

                          <NavigationIcon />

                          <div>

                            <small>
                              DISTANCE
                            </small>

                            <strong>
                              {hospital.distance}
                              {" km"}
                            </strong>

                          </div>

                        </div>


                        <span className="nearest-label">

                          {index === 0
                            ? "NEAREST"
                            : `#${index + 1}`}

                        </span>

                      </div>


                      {/* BED STATUS */}

                      <div className="hospital-beds">

                        <div>

                          <BedIcon />

                          <div>

                            <small>
                              Available Beds
                            </small>

                            <strong className="text-success">

                              {hospital.availableBeds}

                            </strong>

                          </div>

                        </div>


                        <div>

                          <HotelIcon />

                          <div>

                            <small>
                              Emergency Beds
                            </small>

                            <strong>

                              {hospital.emergencyBeds}

                            </strong>

                          </div>

                        </div>

                      </div>


                      {/* INFO */}

                      <div className="hospital-info">

                        <div>

                          <LocationOnIcon />

                          <span>
                            {hospital.address ||
                              "Address unavailable"}
                          </span>

                        </div>


                        <div>

                          <CallIcon />

                          <span>
                            {hospital.phone ||
                              "Phone unavailable"}
                          </span>

                        </div>

                      </div>


                      {/* ACTION */}

                      <button
                        className="request-hospital-btn"
                        disabled={
                          assigningHospital ===
                          hospital._id
                        }
                        onClick={() =>
                          handleAssignHospital(
                            hospital._id
                          )
                        }
                      >

                        {assigningHospital ===
                        hospital._id ? (

                          <>
                            <RefreshIcon className="spin" />

                            Requesting...

                          </>

                        ) : (

                          <>

                            <LocalHospitalIcon />

                            Request Hospital

                          </>

                        )}

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>



        {/* =====================================
            COMPLETED
        ===================================== */}

        <section className="dashboard-section">

          <div className="section-title">

            <div className="section-title-icon success-icon">

              <CheckCircleIcon />

            </div>

            <div>

              <h4>
                Completed Requests
              </h4>

              <p>
                Successfully completed emergencies
              </p>

            </div>

            <span className="section-count success-count">

              {completedRequests.length}

            </span>

          </div>


          <div className="completed-card">

            {completedRequests.length === 0 ? (

              <div className="empty-card">

                <CheckCircleIcon />

                <h5>
                  No Completed Requests
                </h5>

                <p>
                  Completed emergencies will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle mb-0">

                  <thead>

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
                          key={request._id}
                        >

                          <td>

                            <PersonIcon />

                            {request.patient
                              ?.fullName ||
                              "N/A"}

                          </td>


                          <td>

                            {request.emergencyType}

                          </td>


                          <td>

                            <LocationOnIcon />

                            {request.pickupAddress}

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

        </section>



        {/* =====================================
            FOOTER
        ===================================== */}

        <div className="driver-footer">

          <div>

            <LocalShippingIcon />

            Emergency Response System

          </div>

          <span>
            Driver Control Center
          </span>

        </div>


      </div>

    </div>

  </div>

);

}


export default DriverDashboard;