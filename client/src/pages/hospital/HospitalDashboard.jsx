import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  updateHospitalBeds,
  updateHospitalLocation,
} from "../../services/hospitalService";

import {
  getHospitalRequests,
  acceptHospitalEmergency,
  rejectHospitalEmergency,
} from "../../services/emergencyService";

import {
  FaHospital,
  FaMapMarkerAlt,
  FaBed,
  FaAmbulance,
  FaSignOutAlt,
  FaPhone,
  FaEnvelope,
  FaCity,
  FaUserInjured,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
  FaArrowRight,
  FaHeartbeat,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import "./HospitalDashboard.css";

function HospitalDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // =====================================================
  // LOCATION
  // =====================================================

  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [currentLatitude, setCurrentLatitude] =
    useState(null);

  const [currentLongitude, setCurrentLongitude] =
    useState(null);

  const [currentAddress, setCurrentAddress] =
    useState("Location not detected");

  const [locationUpdated, setLocationUpdated] =
    useState(false);

  // =====================================================
  // HOSPITAL STATUS
  // =====================================================

  const [hospitalStatus, setHospitalStatus] =
    useState("Online");

  // =====================================================
  // BED MANAGEMENT
  // =====================================================

  const emergencyBeds =
    user?.emergencyBeds ?? 0;

  const [availableBeds, setAvailableBeds] =
    useState(user?.availableBeds ?? 0);

  const [bedInput, setBedInput] =
    useState(user?.availableBeds ?? 0);

  const [updatingBeds, setUpdatingBeds] =
    useState(false);

  const occupiedBeds =
    Math.max(
      0,
      emergencyBeds - availableBeds
    );

  const bedPercentage =
    emergencyBeds > 0
      ? Math.round(
          (availableBeds / emergencyBeds) * 100
        )
      : 0;

  // =====================================================
  // EMERGENCY REQUESTS
  // =====================================================

  const [emergencyRequests, setEmergencyRequests] =
    useState([]);

  const [loadingRequests, setLoadingRequests] =
    useState(false);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    try {
      logout();

      toast.success(
        "Logged out successfully"
      );

      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // =====================================================
  // UPDATE BEDS
  // =====================================================

  const handleUpdateBeds = async () => {
    const beds = Number(bedInput);

    if (!Number.isInteger(beds)) {
      toast.error(
        "Please enter a valid whole number"
      );
      return;
    }

    if (beds < 0) {
      toast.error(
        "Available beds cannot be negative"
      );
      return;
    }

    if (beds > emergencyBeds) {
      toast.error(
        "Available beds cannot exceed total emergency beds"
      );
      return;
    }

    try {
      setUpdatingBeds(true);

      const response =
        await updateHospitalBeds(beds);

      setAvailableBeds(beds);

      toast.success(
        response.message ||
          "Bed availability updated"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update bed availability"
      );
    } finally {
      setUpdatingBeds(false);
    }
  };

  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          setCurrentLatitude(latitude);
          setCurrentLongitude(longitude);

          setCurrentAddress(
            `Latitude: ${latitude.toFixed(
              6
            )}, Longitude: ${longitude.toFixed(6)}`
          );

          const response =
            await updateHospitalLocation(
              latitude,
              longitude
            );

          setLocationUpdated(true);

          toast.success(
            response.message ||
              "Hospital location updated successfully"
          );
        } catch (error) {
          console.error(error);

          toast.error(
            error.response?.data?.message ||
              "Failed to update hospital location"
          );
        } finally {
          setLoadingLocation(false);
        }
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setLoadingLocation(false);

        toast.error(
          "Unable to access your location. Please allow location permission."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =====================================================
  // LOAD HOSPITAL REQUESTS
  // =====================================================

  const loadHospitalRequests = async () => {
    try {
      setLoadingRequests(true);

      const response =
        await getHospitalRequests();

      setEmergencyRequests(
        response.requests || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load emergency requests"
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  // =====================================================
  // ACCEPT EMERGENCY
  // =====================================================

  const handleAcceptEmergency = async (
    requestId
  ) => {
    try {
      await acceptHospitalEmergency(
        requestId
      );

      toast.success(
        "Emergency accepted successfully"
      );

      await loadHospitalRequests();

      setAvailableBeds((prev) =>
        Math.max(0, prev - 1)
      );

      setBedInput((prev) =>
        Math.max(0, Number(prev) - 1)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to accept emergency"
      );
    }
  };

  // =====================================================
  // REJECT EMERGENCY
  // =====================================================

  const handleRejectEmergency = async (
    requestId
  ) => {
    try {
      await rejectHospitalEmergency(
        requestId
      );

      toast.success(
        "Emergency rejected"
      );

      await loadHospitalRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject emergency"
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    getCurrentLocation();
    loadHospitalRequests();
  }, []);

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Hospital Assigned":
        return "status-warning";

      case "Hospital Accepted":
        return "status-success";

      case "Patient Arrived":
        return "status-primary";

      case "Completed":
        return "status-completed";

      default:
        return "status-default";
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="hospital-dashboard">

      {/* ============================================
          BACKGROUND
      ============================================ */}

      <div className="hospital-background" />

      <div className="hospital-overlay" />

      {/* ============================================
          MAIN CONTAINER
      ============================================ */}

      <div className="container-fluid position-relative px-lg-5">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="hospital-header">

          <div className="hospital-header-left">

            <div className="hospital-logo">
              <FaHospital />
            </div>

            <div>
              <h3 className="hospital-title">
                {user?.hospitalName ||
                  "Hospital Dashboard"}
              </h3>

              <div className="hospital-city">
                <FaCity />
                {user?.city ||
                  "Hospital Management System"}
              </div>
            </div>

          </div>

          <div className="hospital-header-right">

            <div className="hospital-online-status">

              <span className="online-dot" />

              <span>
                {hospitalStatus}
              </span>

            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        </div>

        {/* ==========================================
            HERO
        ========================================== */}

        <div className="hospital-hero">

          <div className="hero-content">

            <div className="hero-label">
              Emergency Response Center
            </div>

            <h1>
              Hospital Control Dashboard
            </h1>

            <p>
              Monitor emergency requests,
              manage hospital resources and
              coordinate ambulance arrivals
              from one place.
            </p>

            <div className="hero-status">

              <span className="hero-status-dot" />

              Hospital is ready for emergency
              response

            </div>

          </div>

          <div className="hero-hospital-icon">
            <FaHospital />
          </div>

        </div>

        {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="row g-4 mb-4">

          {/* TOTAL BEDS */}

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="stat-icon blue">
                <FaBed />
              </div>

              <div>
                <div className="stat-title">
                  Emergency Beds
                </div>

                <div className="stat-value">
                  {emergencyBeds}
                </div>

                <div className="stat-description">
                  Total emergency capacity
                </div>
              </div>

            </div>

          </div>

          {/* AVAILABLE */}

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="stat-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <div className="stat-title">
                  Available Beds
                </div>

                <div className="stat-value text-success">
                  {availableBeds}
                </div>

                <div className="stat-description">
                  Currently available
                </div>
              </div>

            </div>

          </div>

          {/* OCCUPIED */}

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="stat-icon orange">
                <FaUserInjured />
              </div>

              <div>
                <div className="stat-title">
                  Occupied Beds
                </div>

                <div className="stat-value text-warning">
                  {occupiedBeds}
                </div>

                <div className="stat-description">
                  Currently occupied
                </div>
              </div>

            </div>

          </div>

          {/* EMERGENCIES */}

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="stat-icon red">
                <FaAmbulance />
              </div>

              <div>
                <div className="stat-title">
                  Emergency Requests
                </div>

                <div className="stat-value">
                  {emergencyRequests.length}
                </div>

                <div className="stat-description">
                  Assigned to hospital
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            HOSPITAL INFORMATION + LOCATION
        ========================================== */}

        <div className="row g-4 mb-4">

          {/* ========================================
              HOSPITAL INFORMATION
          ======================================== */}

          <div className="col-xl-5">

            <div className="dashboard-card h-100">

              <div className="card-header-custom">

                <div>
                  <h5>
                    <FaHospital />
                    Hospital Information
                  </h5>

                  <p>
                    Registered hospital details
                  </p>
                </div>

              </div>

              <div className="hospital-info-list">

                {/* NAME */}

                <div className="hospital-info-item">

                  <div className="info-icon">
                    <FaHospital />
                  </div>

                  <div>
                    <small>
                      Hospital Name
                    </small>

                    <strong>
                      {user?.hospitalName ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

                {/* EMAIL */}

                <div className="hospital-info-item">

                  <div className="info-icon">
                    <FaEnvelope />
                  </div>

                  <div>
                    <small>
                      Email
                    </small>

                    <strong>
                      {user?.email ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

                {/* PHONE */}

                <div className="hospital-info-item">

                  <div className="info-icon">
                    <FaPhone />
                  </div>

                  <div>
                    <small>
                      Phone
                    </small>

                    <strong>
                      {user?.phone ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

                {/* CITY */}

                <div className="hospital-info-item">

                  <div className="info-icon">
                    <FaCity />
                  </div>

                  <div>
                    <small>
                      City
                    </small>

                    <strong>
                      {user?.city ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

                {/* ADDRESS */}

                <div className="hospital-info-item">

                  <div className="info-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <small>
                      Address
                    </small>

                    <strong>
                      {user?.address ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ========================================
              LOCATION
          ======================================== */}

          <div className="col-xl-7">

            <div className="dashboard-card location-card h-100">

              <div className="card-header-custom">

                <div>

                  <h5>
                    <FaMapMarkerAlt />
                    Hospital Location
                  </h5>

                  <p>
                    Your location is used to
                    calculate the nearest hospital.
                  </p>

                </div>

                <button
                  className="btn btn-primary btn-sm location-update-btn"
                  onClick={getCurrentLocation}
                  disabled={loadingLocation}
                >

                  <FaSyncAlt
                    className={
                      loadingLocation
                        ? "spin"
                        : ""
                    }
                  />

                  {loadingLocation
                    ? "Detecting..."
                    : "Update Location"}

                </button>

              </div>

              {/* LOCATION STATUS */}

              <div
                className={`location-status ${
                  locationUpdated
                    ? "location-success"
                    : "location-warning"
                }`}
              >

                <div className="location-big-icon">

                  {locationUpdated ? (
                    <FaCheckCircle />
                  ) : (
                    <FaExclamationTriangle />
                  )}

                </div>

                <div>

                  <strong>
                    {locationUpdated
                      ? "Location detected"
                      : "Location required"}
                  </strong>

                  <p>
                    {locationUpdated
                      ? "Hospital coordinates are available for emergency routing."
                      : "Allow browser location access to continue."}
                  </p>

                </div>

              </div>

              {/* ADDRESS */}

              <div className="location-address">

                <FaMapMarkerAlt />

                <span>
                  {currentAddress}
                </span>

              </div>

              {/* COORDINATES */}

              <div className="row g-3 mt-2">

                <div className="col-md-6">

                  <div className="coordinate-box">

                    <small>
                      Latitude
                    </small>

                    <strong>
                      {currentLatitude !== null
                        ? currentLatitude.toFixed(
                            6
                          )
                        : "--"}
                    </strong>

                  </div>

                </div>

                <div className="col-md-6">

                  <div className="coordinate-box">

                    <small>
                      Longitude
                    </small>

                    <strong>
                      {currentLongitude !== null
                        ? currentLongitude.toFixed(
                            6
                          )
                        : "--"}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            BED MANAGEMENT + EMERGENCY REQUESTS
        ========================================== */}

        <div className="row g-4 mb-4">

          {/* ========================================
              BED MANAGEMENT
          ======================================== */}

          <div className="col-xl-5">

            <div className="dashboard-card h-100">

              <div className="card-header-custom">

                <div>

                  <h5>
                    <FaBed />
                    Emergency Bed Status
                  </h5>

                  <p>
                    Manage current emergency
                    capacity
                  </p>

                </div>

                <span className="capacity-badge">
                  {bedPercentage}% Available
                </span>

              </div>

              {/* INPUT */}

              <div className="bed-update-section">

                <label>
                  Available Emergency Beds
                </label>

                <div className="input-group">

                  <input
                    type="number"
                    min="0"
                    max={emergencyBeds}
                    className="form-control"
                    value={bedInput}
                    onChange={(e) =>
                      setBedInput(
                        e.target.value
                      )
                    }
                  />

                  <button
                    className="btn btn-primary"
                    onClick={
                      handleUpdateBeds
                    }
                    disabled={
                      updatingBeds
                    }
                  >

                    {updatingBeds
                      ? "Updating..."
                      : "Update"}

                  </button>

                </div>

                <div className="form-text">
                  Maximum available:
                  {" "}
                  <strong>
                    {emergencyBeds}
                  </strong>
                  {" "}beds
                </div>

              </div>

              {/* PROGRESS */}

              <div className="bed-progress-container">

                <div className="progress-heading">

                  <span>
                    Available Capacity
                  </span>

                  <strong>
                    {bedPercentage}%
                  </strong>

                </div>

                <div className="progress bed-progress">

                  <div
                    className="progress-bar bg-success"
                    style={{
                      width:
                        `${bedPercentage}%`,
                    }}
                  />

                </div>

              </div>

              {/* BED NUMBERS */}

              <div className="row text-center mt-4">

                <div className="col-4">

                  <div className="bed-number">
                    {emergencyBeds}
                  </div>

                  <small>
                    Total
                  </small>

                </div>

                <div className="col-4">

                  <div className="bed-number text-success">
                    {availableBeds}
                  </div>

                  <small>
                    Available
                  </small>

                </div>

                <div className="col-4">

                  <div className="bed-number text-danger">
                    {occupiedBeds}
                  </div>

                  <small>
                    Occupied
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* ========================================
              EMERGENCY REQUESTS
          ======================================== */}

          <div className="col-xl-7">

            <div className="dashboard-card emergency-card-container">

              {/* HEADER */}

              <div className="card-header-custom">

                <div>

                  <h5>
                    <FaAmbulance />
                    Emergency Requests
                  </h5>

                  <p>
                    Incoming emergency cases
                    assigned to your hospital
                  </p>

                </div>

                <div className="request-header-actions">

                  <span className="request-count">
                    {emergencyRequests.length}
                    {" "}
                    Requests
                  </span>

                  <button
                    className="refresh-request-btn"
                    onClick={
                      loadHospitalRequests
                    }
                    disabled={
                      loadingRequests
                    }
                    title="Refresh requests"
                  >

                    <FaSyncAlt
                      className={
                        loadingRequests
                          ? "spin"
                          : ""
                      }
                    />

                  </button>

                </div>

              </div>

              {/* ====================================
                  LOADING
              ==================================== */}

              {loadingRequests ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    <FaSyncAlt className="spin" />
                  </div>

                  <h6>
                    Loading Emergency Requests
                  </h6>

                  <p>
                    Checking for incoming
                    emergency cases...
                  </p>

                </div>

              ) : emergencyRequests.length ===
                0 ? (

                /* ==================================
                    EMPTY
                ================================== */

                <div className="empty-state">

                  <div className="empty-icon">
                    <FaAmbulance />
                  </div>

                  <h6>
                    No Emergency Requests
                  </h6>

                  <p>
                    Emergency requests assigned
                    to this hospital will appear
                    here.
                  </p>

                </div>

              ) : (

                /* ==================================
                    REQUEST LIST
                ================================== */

                <div className="emergency-request-list">

                  {emergencyRequests.map(
                    (request) => (

                    <div
                      className="emergency-request-card"
                      key={request._id}
                    >

                      {/* REQUEST TOP */}

                      <div className="request-top">

                        <div className="request-title-section">

                          <div className="emergency-request-icon">

                            <FaExclamationTriangle />

                          </div>

                          <div>

                            <h6>
                              {request.emergencyType}
                            </h6>

                            <small>
                              Request ID:{" "}
                              {request._id.slice(
                                -6
                              )}
                            </small>

                          </div>

                        </div>

                        <span
                          className={`request-status ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>

                      </div>

                      <hr />

                      {/* =================================
                          PATIENT INFORMATION
                      ================================= */}

                      <div className="request-details-grid">

                        {/* PATIENT */}

                        <div className="request-detail">

                          <div className="request-detail-icon">
                            <FaUserInjured />
                          </div>

                          <div>

                            <small>
                              Patient
                            </small>

                            <strong>
                              {request.patient
                                ?.fullName ||
                                "Unknown Patient"}
                            </strong>

                          </div>

                        </div>

                        {/* PHONE */}

                        <div className="request-detail">

                          <div className="request-detail-icon">
                            <FaPhone />
                          </div>

                          <div>

                            <small>
                              Phone
                            </small>

                            <strong>
                              {request.patient
                                ?.phone ||
                                "Not available"}
                            </strong>

                          </div>

                        </div>

                        {/* DRIVER */}

                        <div className="request-detail">

                          <div className="request-detail-icon ambulance-detail">
                            <FaAmbulance />
                          </div>

                          <div>

                            <small>
                              Driver
                            </small>

                            <strong>
                              {request.driver
                                ?.fullName ||
                                "Not assigned"}
                            </strong>

                          </div>

                        </div>

                        {/* AMBULANCE */}

                        <div className="request-detail">

                          <div className="request-detail-icon ambulance-detail">
                            <FaAmbulance />
                          </div>

                          <div>

                            <small>
                              Ambulance
                            </small>

                            <strong>
                              {request.driver
                                ?.ambulanceNumber ||
                                "Not available"}
                            </strong>

                          </div>

                        </div>

                      </div>

                      {/* PICKUP */}

                      <div className="pickup-location">

                        <div className="pickup-icon">
                          <FaMapMarkerAlt />
                        </div>

                        <div>

                          <small>
                            Pickup Location
                          </small>

                          <strong>
                            {request.pickupAddress ||
                              "Location unavailable"}
                          </strong>

                        </div>

                      </div>

                      {/* =================================
                          FOOTER
                      ================================= */}

                      <div className="request-footer">

                        <div className="request-time">

                          <FaClock />

                          {new Date(
                            request.createdAt
                          ).toLocaleString()}

                        </div>

                        {/* ACTIONS */}

                        {request.status ===
                          "Hospital Assigned" && (

                          <div className="request-actions">

                            <button
                              className="accept-btn"
                              onClick={() =>
                                handleAcceptEmergency(
                                  request._id
                                )
                              }
                            >

                              <FaCheckCircle />

                              Accept

                              <FaArrowRight />

                            </button>

                            <button
                              className="reject-btn"
                              onClick={() =>
                                handleRejectEmergency(
                                  request._id
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>

                        )}

                        {request.status ===
                          "Hospital Accepted" && (

                          <div className="accepted-label">

                            <FaCheckCircle />

                            Emergency Accepted

                          </div>

                        )}

                        {request.status ===
                          "Patient Arrived" && (

                          <div className="accepted-label">

                            <FaHeartbeat />

                            Patient Arrived

                          </div>

                        )}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* =========================================
    LIVE AMBULANCE TRACKING
========================================= */}

<div className="col-12">

  <div className="dashboard-card ambulance-tracking-card">

    {/* HEADER */}

    <div className="card-header-custom">

      <div className="d-flex align-items-center gap-3">

        <div className="tracking-icon">

          <FaAmbulance />

        </div>

        <div>

          <h5 className="fw-bold mb-1">

            Incoming Ambulance

          </h5>

          <p className="text-muted small mb-0">

            Live ambulance arrival monitoring

          </p>

        </div>

      </div>

      <span className="live-badge">

        <span className="live-dot" />

        LIVE

      </span>

    </div>


    {/* AMBULANCE INFO */}

    <div className="ambulance-info-section">

      <div className="ambulance-driver-info">

        <div className="ambulance-large-icon">

          <FaAmbulance />

        </div>

        <div>

          <h5 className="fw-bold mb-1">

            Ambulance MH-12-AB-1234

          </h5>

          <p className="text-muted mb-1">

            Driver: Rahul Sharma

          </p>

          <span className="small text-success">

            <FaCheckCircle className="me-1" />

            Patient Picked

          </span>

        </div>

      </div>


      <div className="driver-contact">

        <div className="contact-item">

          <FaPhone />

          <div>

            <small>Driver Phone</small>

            <strong>9876543210</strong>

          </div>

        </div>

      </div>

    </div>


    {/* MAP PLACEHOLDER */}

    <div className="ambulance-map">

      <div className="map-background">

        <div className="map-route-line" />

        <div className="map-location patient-location">

          <FaUserInjured />

          <span>Patient</span>

        </div>

        <div className="map-location ambulance-location">

          <FaAmbulance />

          <span>Ambulance</span>

        </div>

        <div className="map-location hospital-location">

          <FaHospital />

          <span>Hospital</span>

        </div>

      </div>

    </div>


    {/* TRACKING DETAILS */}

    <div className="row g-3 mt-3">

      <div className="col-md-4">

        <div className="tracking-stat">

          <div className="tracking-stat-icon">

            <FaMapMarkerAlt />

          </div>

          <div>

            <small>Distance</small>

            <strong>3.4 km</strong>

          </div>

        </div>

      </div>


      <div className="col-md-4">

        <div className="tracking-stat">

          <div className="tracking-stat-icon">

            <FaClock />

          </div>

          <div>

            <small>Estimated Arrival</small>

            <strong>8 min</strong>

          </div>

        </div>

      </div>


      <div className="col-md-4">

        <div className="tracking-stat">

          <div className="tracking-stat-icon">

            <FaCheckCircle />

          </div>

          <div>

            <small>Current Status</small>

            <strong>Patient Picked</strong>

          </div>

        </div>

      </div>

    </div>


    {/* ACTIONS */}

    <div className="tracking-actions mt-4">

      <button className="btn btn-success">

        <FaPhone className="me-2" />

        Call Driver

      </button>

      <button className="btn btn-primary">

        <FaMapMarkerAlt className="me-2" />

        Track Ambulance

      </button>

    </div>

  </div>

</div>

        {/* ==========================================
            QUICK STATUS
        ========================================== */}

        <div className="dashboard-card mb-4">

          <div className="quick-response-section">

            <div className="quick-response-icon">
              <FaHeartbeat />
            </div>

            <div>

              <h6>
                Emergency Response Status
              </h6>

              <p>
                Your hospital is currently
                available to receive emergency
                patients.
              </p>

            </div>

            <div className="quick-response-status">

              <span className="online-dot" />

              READY

            </div>

          </div>

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="hospital-footer">

          <span>
            Emergency Response System
          </span>

          <span>
            Hospital Control Center
          </span>

        </div>

      </div>
    </div>
  );
}

export default HospitalDashboard;