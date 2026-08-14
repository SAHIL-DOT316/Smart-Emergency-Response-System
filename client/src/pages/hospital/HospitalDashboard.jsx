import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateHospitalBeds,
} from "../../services/hospitalService";
import {
  FaHospital,
  FaMapMarkerAlt,
  FaBed,
  FaAmbulance,
  FaSignOutAlt,
  FaLocationArrow,
  FaPhone,
  FaEnvelope,
  FaCity,
  FaUserInjured,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import "./HospitalDashboard.css";

function HospitalDashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  // =========================================
  // STATE
  // =========================================

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

  const [hospitalStatus, setHospitalStatus] =
    useState("Online");
const [availableBeds, setAvailableBeds] =
  useState(user?.availableBeds ?? 0);

const [updatingBeds, setUpdatingBeds] =
  useState(false);

const [bedInput, setBedInput] =
  useState(user?.availableBeds ?? 0);
  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    try {
      logout();

      toast.success("Logged out successfully");

      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
const handleUpdateBeds = async () => {

  const beds = Number(bedInput);

  if (Number.isNaN(beds)) {
    toast.error("Please enter a valid number");
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
  // =========================================
  // GET CURRENT LOCATION
  // =========================================

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

          /*
           * For now we display coordinates.
           *
           * Later we will connect your
           * getAddressFromCoordinates()
           * service here.
           */

          setCurrentAddress(
            `Latitude: ${latitude.toFixed(
              6
            )}, Longitude: ${longitude.toFixed(6)}`
          );

          setLocationUpdated(true);

          toast.success(
            "Hospital location detected"
          );
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to process location"
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

  // =========================================
  // GET LOCATION ON FIRST LOGIN
  // =========================================

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // =========================================
  // DEMO DATA
  // =========================================

  const emergencyBeds =
  user?.emergencyBeds ?? 0;

const occupiedBeds =
  emergencyBeds - availableBeds;

const bedPercentage =
  emergencyBeds > 0
    ? Math.round(
        (availableBeds / emergencyBeds) * 100
      )
    : 0;

  // =========================================
  // DEMO EMERGENCY REQUESTS
  // =========================================

  const emergencyRequests = [];

  // =========================================
  // UI
  // =========================================

  return (
    <div className="hospital-dashboard">

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="hospital-background" />

      <div className="hospital-overlay" />

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="container-fluid position-relative">

        {/* ===================================
            HEADER
        ==================================== */}

        <div className="hospital-header">

          <div className="d-flex justify-content-between align-items-center">

            {/* Hospital Logo / Name */}

            <div className="d-flex align-items-center gap-3">

              <div className="hospital-logo">

                <FaHospital />

              </div>

              <div>

                <h3 className="fw-bold mb-1 text-white">

                  {user?.hospitalName ||
                    "Hospital Dashboard"}

                </h3>

                <div className="text-white-50">

                  <FaCity className="me-2" />

                  {user?.city ||
                    "Hospital Management System"}

                </div>

              </div>

            </div>


            {/* Header Right */}

            <div className="d-flex align-items-center gap-3">

              {/* Status */}

              <div className="hospital-online-status">

                <span className="online-dot" />

                {hospitalStatus}

              </div>


              {/* Logout */}

              <button
                className="btn btn-light d-flex align-items-center gap-2"
                onClick={handleLogout}
              >

                <FaSignOutAlt />

                Logout

              </button>

            </div>

          </div>

        </div>


        {/* ===================================
            WELCOME / HERO
        ==================================== */}

        <div className="hospital-hero">

          <div>

            <p className="text-white-50 mb-2">

              Emergency Response Center

            </p>

            <h1 className="text-white fw-bold">

              Hospital Control Dashboard

            </h1>

            <p className="text-white-50 mb-0">

              Monitor emergency requests,
              hospital resources and ambulance
              arrivals from one place.

            </p>

          </div>


          <div className="hero-hospital-icon">

            <FaHospital />

          </div>

        </div>


        {/* ===================================
            STATISTICS
        ==================================== */}

        <div className="row g-4 mb-4">

          {/* Emergency Beds */}

          <div className="col-lg-3 col-md-6">

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

                  Total emergency beds

                </div>

              </div>

            </div>

          </div>


          {/* Available Beds */}

          <div className="col-lg-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="stat-icon green">

                <FaCheckCircle />

              </div>

              <div>

                <div className="stat-title">

                  Available Beds

                </div>

                <div className="stat-value">

                  {availableBeds}

                </div>

                <div className="stat-description">

                  Currently available

                </div>

              </div>

            </div>

          </div>


          {/* Occupied Beds */}

          <div className="col-lg-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="stat-icon orange">

                <FaUserInjured />

              </div>

              <div>

                <div className="stat-title">

                  Occupied Beds

                </div>

                <div className="stat-value">

                  {occupiedBeds}

                </div>

                <div className="stat-description">

                  Currently occupied

                </div>

              </div>

            </div>

          </div>


          {/* Ambulances */}

          <div className="col-lg-3 col-md-6">

            <div className="dashboard-stat-card">

              <div className="stat-icon red">

                <FaAmbulance />

              </div>

              <div>

                <div className="stat-title">

                  Incoming Ambulances

                </div>

                <div className="stat-value">

                  0

                </div>

                <div className="stat-description">

                  No ambulance arriving

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================
            MAIN ROW
        ==================================== */}

        <div className="row g-4">

          {/* =================================
              HOSPITAL INFORMATION
          ================================== */}

          <div className="col-lg-5">

            <div className="dashboard-card">

              <div className="card-header-custom">

                <div>

                  <h5 className="fw-bold mb-1">

                    <FaHospital className="me-2 text-primary" />

                    Hospital Information

                  </h5>

                  <p className="text-muted small mb-0">

                    Registered hospital details

                  </p>

                </div>

              </div>


              <div className="hospital-info-list">

                {/* Name */}

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


                {/* Email */}

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


                {/* Phone */}

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


                {/* City */}

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


                {/* Address */}

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


          {/* =================================
              LOCATION
          ================================== */}

          <div className="col-lg-7">

            <div className="dashboard-card location-card">

              <div className="card-header-custom">

                <div>

                  <h5 className="fw-bold mb-1">

                    <FaMapMarkerAlt className="me-2 text-danger" />

                    Hospital Location

                  </h5>

                  <p className="text-muted small mb-0">

                    Your location is used to find
                    the nearest hospital for
                    emergency patients.

                  </p>

                </div>


                <button
                  className="btn btn-primary btn-sm d-flex align-items-center gap-2"
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


              {/* Location Status */}

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

                  <p className="mb-0 small">

                    {locationUpdated
                      ? "Your hospital coordinates are available."
                      : "Allow browser location access to continue."}

                  </p>

                </div>

              </div>


              {/* Address */}

              <div className="location-address">

                <FaMapMarkerAlt />

                <span>

                  {currentAddress}

                </span>

              </div>


              {/* Coordinates */}

              <div className="row g-3 mt-2">

                <div className="col-md-6">

                  <div className="coordinate-box">

                    <small>

                      Latitude

                    </small>

                    <strong>

                      {currentLatitude !==
                      null
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

                      {currentLongitude !==
                      null
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


          {/* =================================
              BED MANAGEMENT
          ================================== */}

        <div className="col-lg-5">

  <div className="dashboard-card">

    <div className="card-header-custom">

      <div>

        <h5 className="fw-bold mb-1">

          <FaBed className="me-2 text-primary" />

          Emergency Bed Status

        </h5>

        <p className="text-muted small mb-0">

          Manage current emergency capacity

        </p>

      </div>

    </div>


    {/* =================================
        BED UPDATE
    ================================= */}

    <div className="mb-4">

      <label className="form-label fw-semibold">

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
            setBedInput(e.target.value)
          }
        />

        <button
          className="btn btn-primary"
          onClick={handleUpdateBeds}
          disabled={updatingBeds}
        >

          {updatingBeds
            ? "Updating..."
            : "Update"}

        </button>

      </div>

      <div className="form-text">

        Maximum available beds:
        {" "}
        <strong>
          {emergencyBeds}
        </strong>

      </div>

    </div>


    {/* =================================
        PROGRESS
    ================================= */}

    <div className="bed-progress-container">

      <div className="d-flex justify-content-between mb-2">

        <span>

          Available Capacity

        </span>

        <strong>

          {bedPercentage}%

        </strong>

      </div>


      <div className="progress">

        <div
          className="progress-bar bg-success"
          style={{
            width: `${bedPercentage}%`,
          }}
        />

      </div>


      {/* =================================
          BED NUMBERS
      ================================= */}

      <div className="row text-center mt-4">

        <div className="col-4">

          <div className="bed-number">

            {emergencyBeds}

          </div>

          <small className="text-muted">

            Total

          </small>

        </div>


        <div className="col-4">

          <div className="bed-number text-success">

            {availableBeds}

          </div>

          <small className="text-muted">

            Available

          </small>

        </div>


        <div className="col-4">

          <div className="bed-number text-danger">

            {occupiedBeds}

          </div>

          <small className="text-muted">

            Occupied

          </small>

        </div>

      </div>

    </div>

  </div>

</div>


          {/* =================================
              EMERGENCY REQUESTS
          ================================== */}

          <div className="col-lg-7">

            <div className="dashboard-card">

              <div className="card-header-custom">

                <div>

                  <h5 className="fw-bold mb-1">

                    <FaAmbulance className="me-2 text-danger" />

                    Emergency Requests

                  </h5>

                  <p className="text-muted small mb-0">

                    Incoming emergency cases

                  </p>

                </div>


                <span className="badge bg-primary">

                  {emergencyRequests.length} Requests

                </span>

              </div>


              {emergencyRequests.length ===
              0 ? (

                <div className="empty-state">

                  <div className="empty-icon">

                    <FaAmbulance />

                  </div>

                  <h6 className="fw-bold">

                    No Emergency Requests

                  </h6>

                  <p className="text-muted small mb-0">

                    Emergency requests assigned
                    to this hospital will appear
                    here.

                  </p>

                </div>

              ) : (

                <div>

                  {/* Later we will map requests here */}

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ===================================
            FOOTER
        ==================================== */}

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