import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EmergencyIcon from "@mui/icons-material/Emergency";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";
import CloseIcon from "@mui/icons-material/Close";
import RouteIcon from "@mui/icons-material/Route";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
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

import "./patientDashboard.css";


// =====================================================
// LEAFLET DEFAULT ICON FIX
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// =====================================================
// CUSTOM PATIENT ICON
// =====================================================

const patientIcon = L.divIcon({
  className: "custom-leaflet-marker",

  html: `
    <div
      style="
        width:42px;
        height:42px;
        border-radius:50%;
        background:#2563eb;
        border:4px solid white;
        box-shadow:0 4px 15px rgba(0,0,0,0.35);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:22px;
      "
    >
      📍
    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 21],
});


// =====================================================
// CUSTOM AMBULANCE ICON
// =====================================================

const ambulanceIcon = L.divIcon({
  className: "custom-leaflet-marker",

  html: `
    <div
      style="
        width:48px;
        height:48px;
        border-radius:50%;
        background:#dc2626;
        border:4px solid white;
        box-shadow:0 4px 18px rgba(220,38,38,0.45);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:25px;
      "
    >
      🚑
    </div>
  `,

  iconSize: [48, 48],
  iconAnchor: [24, 24],
});


// =====================================================
// MAP AUTO FIT COMPONENT
// =====================================================

function MapAutoFit({
  patientPosition,
  driverPosition,
}) {
  const map = useMap();

  useEffect(() => {

    if (!patientPosition && !driverPosition) {
      return;
    }

    const points = [];

    if (patientPosition) {
      points.push(patientPosition);
    }

    if (driverPosition) {
      points.push(driverPosition);
    }

    if (points.length === 1) {

      map.setView(
        points[0],
        15,
        {
          animate: true,
        }
      );

      return;
    }

    if (points.length === 2) {

      const bounds =
        L.latLngBounds(points);

      map.fitBounds(
        bounds,
        {
          padding: [60, 60],
          maxZoom: 16,
          animate: true,
        }
      );
    }

  }, [
    map,
    patientPosition,
    driverPosition,
  ]);

  return null;
}


// =====================================================
// MAIN COMPONENT
// =====================================================

function PatientDashboard() {

  // =====================================================
  // STATES
  // =====================================================

  const [requests, setRequests] =
    useState([]);

  const [drivers, setDrivers] =
    useState([]);

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

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  // =====================================================
  // LIVE DRIVER LOCATION
  // =====================================================

  const socketRef =
    useRef(null);

  const [driverLocation, setDriverLocation] =
    useState(null);

  // =====================================================
  // ROUTE
  // =====================================================

  const [routeCoordinates, setRouteCoordinates] =
    useState([]);

  const [routeLoading, setRouteLoading] =
    useState(false);

  const [routeDistance, setRouteDistance] =
    useState(null);

  const [routeDuration, setRouteDuration] =
    useState(null);


  // =====================================================
  // FETCH REQUESTS
  // =====================================================

  const fetchRequests = async () => {

    try {

      const response =
        await getMyEmergencyRequests();

      console.log(
        "PATIENT REQUESTS:",
        response
      );

      setRequests(
        response.requests || []
      );

    } catch (error) {

      console.error(
        "Request fetch error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load emergency requests"
      );

    } finally {

      setLoadingRequests(false);

    }
  };


  // =====================================================
  // FETCH AVAILABLE DRIVERS
  // =====================================================

  const fetchDrivers = async () => {

    try {

      const response =
        await getAvailableDrivers();

      console.log(
        "AVAILABLE DRIVERS:",
        response
      );

      setDrivers(
        response.drivers || []
      );

    } catch (error) {

      console.error(
        "Driver fetch error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load ambulances"
      );

    } finally {

      setLoadingDrivers(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchRequests();

    fetchDrivers();

  }, []);


  // =====================================================
  // CREATE EMERGENCY REQUEST
  // =====================================================

  const handleEmergencyRequest = () => {

    if (!emergencyType) {

      toast.error(
        "Please select the type of emergency"
      );

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

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;


          console.log(
            "Patient Location:",
            {
              latitude,
              longitude,
            }
          );


          // =================================================
          // GET ADDRESS
          // =================================================

          let pickupAddress =
            "Current Location";


          try {

            const address =
              await getAddressFromCoordinates(
                latitude,
                longitude
              );

            if (address) {

              pickupAddress =
                address;

            }

          } catch (addressError) {

            console.warn(
              "Address lookup failed:",
              addressError
            );

          }


          console.log(
            "Pickup Address:",
            pickupAddress
          );


          // =================================================
          // CREATE REQUEST
          // =================================================

          const response =
            await createEmergencyRequest({

              pickupAddress,

              latitude,

              longitude,

              emergencyType,

            });


          console.log(
            "Emergency Response:",
            response
          );


          // =================================================
          // SUCCESS
          // =================================================

          if (response.driver) {

            toast.success(
              `Ambulance ${response.driver.ambulanceNumber} assigned`
            );

          } else {

            toast.success(
              "Emergency request created. Waiting for an available ambulance."
            );

          }


          // =================================================
          // RESET
          // =================================================

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


      // ===================================================
      // LOCATION ERROR
      // ===================================================

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


      // ===================================================
      // GPS OPTIONS
      // ===================================================

      {
        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 0,
      }

    );

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "status-pending";

      case "Accepted":
        return "status-accepted";

      case "Driver Arrived":
        return "status-arrived";

      case "Patient Picked":
        return "status-picked";

      case "Hospital Assigned":
        return "status-hospital";

      case "Hospital Accepted":
        return "status-hospital";

      case "Completed":
        return "status-completed";

      default:
        return "status-default";

    }

  };


  // =====================================================
  // CLOSE EMERGENCY MODAL
  // =====================================================

  const closeModal = () => {

    if (requesting) {
      return;
    }

    setShowEmergencyModal(false);

    setEmergencyType("");

  };


  // =====================================================
  // ACTIVE REQUEST
  // =====================================================

  const activeRequest =
    requests.find(
      (request) =>

        request.status === "Accepted" ||

        request.status === "Driver Arrived" ||

        request.status === "Patient Picked" ||

        request.status === "Hospital Assigned" ||

        request.status === "Hospital Accepted"
    );


  // =====================================================
  // COMPLETED REQUESTS
  // =====================================================

  const completedRequests =
    requests.filter(
      (request) =>
        request.status === "Completed"
    );


  // =====================================================
  // SOCKET.IO
  // LIVE DRIVER LOCATION
  // =====================================================

  useEffect(() => {

    console.log(
      "🔌 Connecting patient socket..."
    );


    const newSocket =
      io(
        "http://localhost:5000",
        {
          withCredentials: true,

          transports: [
            "websocket",
            "polling",
          ],
        }
      );


    socketRef.current =
      newSocket;


    // =================================================
    // CONNECT
    // =================================================

    newSocket.on(
      "connect",
      () => {

        console.log(
          "✅ PATIENT SOCKET CONNECTED:",
          newSocket.id
        );

      }
    );


    // =================================================
    // DRIVER LOCATION
    // =================================================

    newSocket.on(
      "driver-location-update",
      (data) => {

        console.log(
          "🚑 LIVE DRIVER LOCATION:",
          data
        );


        if (
          !data ||
          data.latitude == null ||
          data.longitude == null
        ) {

          return;

        }


        // ===============================================
        // DRIVER FILTER
        // ===============================================

        if (
          selectedRequest?.driver?._id &&
          data.driverId &&
          String(
            selectedRequest.driver._id
          ) !==
          String(
            data.driverId
          )
        ) {

          return;

        }


        setDriverLocation({

          latitude:
            Number(data.latitude),

          longitude:
            Number(data.longitude),

          driverId:
            data.driverId,

          updatedAt:
            data.updatedAt,

        });

      }
    );


    // =================================================
    // CONNECTION ERROR
    // =================================================

    newSocket.on(
      "connect_error",
      (error) => {

        console.error(
          "❌ PATIENT SOCKET ERROR:",
          error.message
        );

      }
    );


    // =================================================
    // DISCONNECT
    // =================================================

    newSocket.on(
      "disconnect",
      (reason) => {

        console.log(
          "❌ PATIENT SOCKET DISCONNECTED:",
          reason
        );

      }
    );


    // =================================================
    // CLEANUP
    // =================================================

    return () => {

      console.log(
        "🧹 Cleaning patient socket..."
      );


      newSocket.off(
        "connect"
      );


      newSocket.off(
        "driver-location-update"
      );


      newSocket.off(
        "connect_error"
      );


      newSocket.off(
        "disconnect"
      );


      newSocket.disconnect();


      socketRef.current =
        null;

    };

  }, [
    selectedRequest,
  ]);


  // =====================================================
  // RESET LIVE LOCATION WHEN REQUEST CHANGES
  // =====================================================

  useEffect(() => {

    setDriverLocation(null);

    setRouteCoordinates([]);

    setRouteDistance(null);

    setRouteDuration(null);

  }, [
    selectedRequest?._id,
  ]);


  // =====================================================
  // FETCH ROAD ROUTE
  // OSRM
  // =====================================================

  const fetchRoadRoute = async () => {

    if (!selectedRequest) {

      return;

    }


    if (!driverLocation) {

      return;

    }


    // =================================================
    // PATIENT LOCATION
    // =================================================

    const patientLatitude =
      Number(
        selectedRequest.latitude
      );

    const patientLongitude =
      Number(
        selectedRequest.longitude
      );


    // =================================================
    // DRIVER LOCATION
    // =================================================

    const driverLatitude =
      Number(
        driverLocation.latitude
      );

    const driverLongitude =
      Number(
        driverLocation.longitude
      );


    // =================================================
    // VALIDATE
    // =================================================

    if (

      !Number.isFinite(
        patientLatitude
      ) ||

      !Number.isFinite(
        patientLongitude
      ) ||

      !Number.isFinite(
        driverLatitude
      ) ||

      !Number.isFinite(
        driverLongitude
      )

    ) {

      console.log(
        " Invalid coordinates for route"
      );

      return;

    }


    try {

      setRouteLoading(true);


      console.log(
        "🛣️ FETCHING ROAD ROUTE"
      );


      console.log(
        "Patient:",
        {
          latitude:
            patientLatitude,

          longitude:
            patientLongitude,
        }
      );


      console.log(
        "Driver:",
        {
          latitude:
            driverLatitude,

          longitude:
            driverLongitude,
        }
      );


      // =================================================
      // OSRM ROUTING URL
      // =================================================

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +

        `${driverLongitude},${driverLatitude};` +

        `${patientLongitude},${patientLatitude}` +

        `?overview=full&geometries=geojson`;


      const response =
        await fetch(url);


      if (!response.ok) {

        throw new Error(
          "Route API request failed"
        );

      }


      const data =
        await response.json();


      // =================================================
      // CHECK ROUTE
      // =================================================

      if (

        data.code !== "Ok" ||

        !data.routes ||

        data.routes.length === 0

      ) {

        console.log(
          "No road route found"
        );


        setRouteCoordinates([]);

        setRouteDistance(null);

        setRouteDuration(null);

        return;

      }


      const route =
        data.routes[0];


      const coordinates =
        route.geometry.coordinates;


      // =================================================
      // OSRM:
      //
      // [longitude, latitude]
      //
      // LEAFLET:
      //
      // [latitude, longitude]
      // =================================================

      const leafletCoordinates =
        coordinates.map(
          ([longitude, latitude]) => [

            Number(latitude),

            Number(longitude),

          ]
        );


      setRouteCoordinates(
        leafletCoordinates
      );


      // =================================================
      // DISTANCE
      // =================================================

      if (
        route.distance != null
      ) {

        const distanceKm =
          route.distance / 1000;


        setRouteDistance(
          distanceKm.toFixed(2)
        );

      }


      // =================================================
      // DURATION
      // =================================================

      if (
        route.duration != null
      ) {

        const minutes =
          Math.ceil(
            route.duration / 60
          );


        setRouteDuration(
          minutes
        );

      }


      console.log(
        "ROAD ROUTE RECEIVED:",
        leafletCoordinates.length,
        "points"
      );


    } catch (error) {

      console.error(
        " ROUTE ERROR:",
        error
      );


      setRouteCoordinates([]);

      setRouteDistance(null);

      setRouteDuration(null);

    } finally {

      setRouteLoading(false);

    }

  };


  // =====================================================
  // UPDATE ROAD ROUTE WHEN DRIVER MOVES
  // =====================================================

  useEffect(() => {

    if (!selectedRequest) {

      return;

    }


    if (!driverLocation) {

      return;

    }


    const timer =
      setTimeout(
        () => {

          fetchRoadRoute();

        },

        3000
      );


    return () => {

      clearTimeout(timer);

    };

  }, [
    selectedRequest,
    driverLocation,
  ]);


  // =====================================================
  // PATIENT POSITION
  // =====================================================

  const patientPosition =
    selectedRequest &&
    Number.isFinite(
      Number(
        selectedRequest.latitude
      )
    ) &&
    Number.isFinite(
      Number(
        selectedRequest.longitude
      )
    )
      ? [

          Number(
            selectedRequest.latitude
          ),

          Number(
            selectedRequest.longitude
          ),

        ]
      : null;


  // =====================================================
  // DRIVER POSITION
  // =====================================================

  const liveDriverPosition =
    driverLocation
      ? [

          Number(
            driverLocation.latitude
          ),

          Number(
            driverLocation.longitude
          ),

        ]
      : null;


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="patient-dashboard">

      <PatientNavbar />


      <main className="patient-main">


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="patient-header">

          <div>

            <div className="patient-header-badge">

              <span className="pulse-dot"></span>

              Emergency Response System

            </div>


            <h1>

              Your Safety,

              <span>
                {" "}
                Our Priority.
              </span>

            </h1>


            <p>

              Request an ambulance, monitor your
              emergency request and track your
              ambulance in real time.

            </p>

          </div>


          <div className="header-ambulance-counter">

            <div className="counter-icon">

              <LocalHospitalIcon
                sx={{
                  fontSize: 50,
                  color: "#dc2626",
                }}
              />

            </div>


            <div>

              <small>
                Available Ambulances
              </small>


              <strong>
                {drivers.length}
              </strong>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* ACTIVE EMERGENCY */}
        {/* ================================================= */}

        {activeRequest && (

          <section className="active-emergency-card">


            <div className="active-left">

              <div className="active-icon">

                <EmergencyIcon
                  sx={{
                    fontSize: 42,
                    color: "#dc2626",
                  }}
                />

              </div>


              <div>

                <div className="active-label">
                  ACTIVE EMERGENCY
                </div>


                <h3>
                  {activeRequest.emergencyType}
                </h3>


                <p>
                  Ambulance is assigned to your request.
                </p>

              </div>

            </div>


            <div className="active-middle">

              <small>
                Status
              </small>


              <span
                className={`status-badge ${getStatusClass(
                  activeRequest.status
                )}`}
              >

                {activeRequest.status}

              </span>

            </div>


            <button
              className="track-button"

              onClick={() => {

                setSelectedRequest(
                  activeRequest
                );

              }}
            >

              <LocationOnIcon
                sx={{
                  fontSize: 22,
                }}
              />

              Track Ambulance

            </button>

          </section>

        )}


        {/* ================================================= */}
        {/* REQUEST HERO */}
        {/* ================================================= */}

        <section className="request-hero">

          <div className="hero-content">


            <div className="hero-badge">

              <EmergencyIcon
                sx={{
                  fontSize: 18,
                  verticalAlign: "middle",
                  marginRight: "6px",
                }}
              />

              EMERGENCY ASSISTANCE

            </div>


            <h2>
              Need an ambulance?
            </h2>


            <p>

              Get the nearest available ambulance
              from your current GPS location.

            </p>


            <div className="hero-actions">


              <button
                className="request-button"

                onClick={() =>
                  setShowEmergencyModal(true)
                }

                disabled={requesting}
              >

                <LocalHospitalIcon
                  sx={{
                    fontSize: 30,
                    color: "#dc2626",
                  }}
                />


                <span>
                  Request Ambulance
                </span>

              </button>


              <div className="gps-info">

                <span className="gps-icon">

                  <MyLocationIcon
                    sx={{
                      fontSize: 24,
                      color: "#2563eb",
                    }}
                  />

                </span>


                <div>

                  <strong>
                    GPS Location
                  </strong>


                  <small>
                    Required for dispatch
                  </small>

                </div>

              </div>

            </div>

          </div>


          <div className="hero-illustration">

            <div className="illustration-circle">

              <LocalHospitalIcon
                sx={{
                  fontSize: 70,
                  color: "#dc2626",
                }}
              />

            </div>


            <div className="orbit orbit-one"></div>

            <div className="orbit orbit-two"></div>

          </div>

        </section>


        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <section className="stats-grid">


          <div className="stat-card">

            <div className="stat-icon blue">

              <AccessTimeIcon
                sx={{
                  fontSize: 28,
                  color: "#2563eb",
                }}
              />

            </div>


            <div>

              <small>
                Total Requests
              </small>


              <strong>
                {requests.length}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">

              <LocalHospitalIcon
                sx={{
                  fontSize: 28,
                  color: "#16a34a",
                }}
              />

            </div>


            <div>

              <small>
                Available
              </small>


              <strong>
                {drivers.length}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">

              <CheckCircleIcon
                sx={{
                  fontSize: 28,
                  color: "#7c3aed",
                }}
              />

            </div>


            <div>

              <small>
                Completed
              </small>


              <strong>
                {completedRequests.length}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon red">

              <EmergencyIcon
                sx={{
                  fontSize: 28,
                  color: "#dc2626",
                }}
              />

            </div>


            <div>

              <small>
                Emergency Support
              </small>


              <strong>
                24/7
              </strong>

            </div>

          </div>


        </section>


        {/* ================================================= */}
        {/* AVAILABLE AMBULANCES */}
        {/* ================================================= */}

        <section className="dashboard-section">


          <div className="section-heading">


            <div>

              <div className="section-title-row">

                <span className="section-title-icon">

                  <LocalHospitalIcon
                    sx={{
                      fontSize: 30,
                      color: "#dc2626",
                    }}
                  />

                </span>


                <h2>
                  Available Ambulances
                </h2>

              </div>


              <p>
                Ambulances currently available
                for emergency dispatch.
              </p>

            </div>


            <button
              className="refresh-button"

              onClick={fetchDrivers}

              disabled={loadingDrivers}
            >

              <RefreshIcon
                sx={{
                  fontSize: 20,
                  marginRight: "6px",
                }}
              />

              Refresh

            </button>

          </div>


          {loadingDrivers ? (

            <div className="loading-container">

              <div className="spinner"></div>


              <p>
                Finding available ambulances...
              </p>

            </div>

          ) : drivers.length === 0 ? (

            <div className="empty-state">

              <div>

                <LocalHospitalIcon
                  sx={{
                    fontSize: 55,
                    color: "#dc2626",
                  }}
                />

              </div>


              <h3>
                No Ambulances Available
              </h3>


              <p>
                Please try again shortly.
              </p>

            </div>

          ) : (

            <div className="ambulance-grid">

              {drivers.map(
                (driver) => (

                  <div
                    className="ambulance-card"
                    key={driver._id}
                  >


                    <div className="ambulance-top">

                      <div className="ambulance-avatar">

                        <LocalHospitalIcon
                          sx={{
                            fontSize: 35,
                            color: "#dc2626",
                          }}
                        />

                      </div>


                      <div>

                        <h3>
                          {driver.ambulanceNumber}
                        </h3>


                        <span className="available-badge">

                          ● Available

                        </span>

                      </div>

                    </div>


                    <div className="ambulance-info">


                      <div>

                        <small>
                          Driver
                        </small>


                        <strong>
                          {driver.fullName}
                        </strong>

                      </div>


                      <div>

                        <small>
                          Contact
                        </small>


                        <strong>
                          {driver.phone}
                        </strong>

                      </div>


                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ================================================= */}
        {/* MY REQUESTS */}
        {/* ================================================= */}

        <section className="dashboard-section">


          <div className="section-heading">


            <div>

              <div className="section-title-row">

                <span className="section-title-icon">

                  <AccessTimeIcon
                    sx={{
                      fontSize: 28,
                      color: "#2563eb",
                    }}
                  />

                </span>


                <h2>
                  My Emergency Requests
                </h2>

              </div>


              <p>
                View the history and current status
                of your emergency requests.
              </p>

            </div>


            <button
              className="refresh-button"

              onClick={fetchRequests}

              disabled={loadingRequests}
            >

              <RefreshIcon
                sx={{
                  fontSize: 20,
                  marginRight: "6px",
                }}
              />

              Refresh

            </button>

          </div>


          {loadingRequests ? (

            <div className="loading-container">

              <div className="spinner"></div>


              <p>
                Loading your requests...
              </p>

            </div>

          ) : requests.length === 0 ? (

            <div className="empty-state">


              <div>

                <AccessTimeIcon
                  sx={{
                    fontSize: 50,
                    color: "#64748b",
                  }}
                />

              </div>


              <h3>
                No Emergency Requests
              </h3>


              <p>
                Your emergency requests will
                appear here.
              </p>

            </div>

          ) : (

            <div className="requests-container">


              {requests.map(
                (request) => (

                  <div
                    className="request-card"
                    key={request._id}
                  >


                    <div className="request-card-header">


                      <div className="request-emergency">


                        <div className="request-icon">

                          <EmergencyIcon
                            sx={{
                              fontSize: 28,
                              color: "#dc2626",
                            }}
                          />

                        </div>


                        <div>

                          <h3>
                            {request.emergencyType}
                          </h3>


                          <small>

                            Request #

                            {request._id.slice(-6)}

                          </small>

                        </div>

                      </div>


                      <span
                        className={`status-badge ${getStatusClass(
                          request.status
                        )}`}
                      >

                        {request.status}

                      </span>

                    </div>


                    <div className="request-details">


                      <div>

                        <small>
                          Pickup Location
                        </small>


                        <strong>

                          <LocationOnIcon
                            sx={{
                              fontSize: 18,
                              color: "#dc2626",
                              verticalAlign: "middle",
                              marginRight: "4px",
                            }}
                          />


                          {request.pickupAddress ||
                            "Current Location"}

                        </strong>

                      </div>


                      <div>

                        <small>
                          Driver
                        </small>


                        <strong>

                          {request.driver ? (

                            <>

                              <PersonIcon
                                sx={{
                                  fontSize: 18,
                                  verticalAlign: "middle",
                                  marginRight: "5px",
                                }}
                              />

                              {request.driver.fullName}

                            </>

                          ) : (

                            "Waiting for assignment"

                          )}

                        </strong>

                      </div>


                      <div>

                        <small>
                          Ambulance
                        </small>


                        <strong>

                          {request.driver ? (

                            <>

                              <DirectionsCarIcon
                                sx={{
                                  fontSize: 18,
                                  verticalAlign: "middle",
                                  marginRight: "5px",
                                  color: "#2563eb",
                                }}
                              />

                              {request.driver.ambulanceNumber}

                            </>

                          ) : (

                            "Not Assigned"

                          )}

                        </strong>

                      </div>

                    </div>


                    <div className="request-footer">


                      <small>

                        <AccessTimeIcon
                          sx={{
                            fontSize: 15,
                            verticalAlign: "middle",
                            marginRight: "4px",
                          }}
                        />


                        {request.createdAt
                          ? new Date(
                              request.createdAt
                            ).toLocaleString()
                          : ""}

                      </small>


                      {request.driver &&
                        request.status !==
                        "Completed" && (

                          <button
                            className="small-track-button"

                            onClick={() => {

                              setSelectedRequest(
                                request
                              );

                            }}
                          >

                            <LocationOnIcon
                              sx={{
                                fontSize: 19,
                                marginRight: "5px",
                              }}
                            />

                            Track Ambulance

                          </button>

                        )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* ================================================= */}
      {/* TRACKING MODAL */}
      {/* ================================================= */}

      {selectedRequest && (

        <div className="tracking-overlay">


          <div className="tracking-modal">


            {/* ================================================= */}
            {/* TRACKING HEADER */}
            {/* ================================================= */}

            <div className="tracking-header">


              <div>

                <span>
                  LIVE TRACKING
                </span>


                <h2>
                  Ambulance Tracking
                </h2>

              </div>


              <button
                onClick={() => {

                  setSelectedRequest(null);

                  setDriverLocation(null);

                  setRouteCoordinates([]);

                  setRouteDistance(null);

                  setRouteDuration(null);

                }}
              >

                <CloseIcon
                  sx={{
                    fontSize: 24,
                  }}
                />

              </button>

            </div>


            {/* ================================================= */}
            {/* MAP */}
            {/* ================================================= */}

            <div
              style={{
                width: "100%",
                height: "550px",
                borderRadius: "18px",
                overflow: "hidden",
                position: "relative",
              }}
            >


              {patientPosition ? (

                <MapContainer

                  center={
                    patientPosition
                  }

                  zoom={14}

                  scrollWheelZoom={true}

                  style={{
                    width: "100%",
                    height: "100%",
                  }}

                >


                  {/* ================================================= */}
                  {/* OPEN STREET MAP */}
                  {/* ================================================= */}

                  <TileLayer

                    attribution='&copy; OpenStreetMap contributors'

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                  />


                  {/* ================================================= */}
                  {/* AUTO FIT MAP */}
                  {/* ================================================= */}

                  <MapAutoFit

                    patientPosition={
                      patientPosition
                    }

                    driverPosition={
                      liveDriverPosition
                    }

                  />


                  {/* ================================================= */}
                  {/* PATIENT MARKER */}
                  {/* ================================================= */}

                  <Marker

                    position={
                      patientPosition
                    }

                    icon={
                      patientIcon
                    }

                  >

                    <Popup>

                      <strong>
                        Your Location
                      </strong>

                      <br />

                      Patient pickup point

                    </Popup>

                  </Marker>


                  {/* ================================================= */}
                  {/* AMBULANCE MARKER */}
                  {/* ================================================= */}

                  {liveDriverPosition && (

                    <Marker

                      position={
                        liveDriverPosition
                      }

                      icon={
                        ambulanceIcon
                      }

                    >

                      <Popup>

                        <div>

                          <strong>
                            🚑 Ambulance
                          </strong>

                          <br />

                          <span>

                            {selectedRequest
                              .driver
                              ?.ambulanceNumber ||
                              "Ambulance"}

                          </span>

                          <br />

                          <span>

                            Driver:{" "}

                            {selectedRequest
                              .driver
                              ?.fullName ||
                              "Unknown"}

                          </span>

                        </div>

                      </Popup>

                    </Marker>

                  )}


                  {/* ================================================= */}
                  {/* REAL ROAD ROUTE */}
                  {/* ================================================= */}

                  {routeCoordinates.length > 0 && (

                    <Polyline

                      positions={
                        routeCoordinates
                      }

                      pathOptions={{
                        color: "#2563eb",
                        weight: 7,
                        opacity: 0.85,
                        lineCap: "round",
                        lineJoin: "round",
                      }}

                    />

                  )}

                </MapContainer>

              ) : (

                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f1f5f9",
                  }}
                >

                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >

                    <LocationOnIcon
                      sx={{
                        fontSize: 55,
                        color: "#dc2626",
                      }}
                    />


                    <h3>
                      Patient location unavailable
                    </h3>


                    <p>
                      GPS coordinates were not found
                      for this emergency request.
                    </p>

                  </div>

                </div>

              )}


              {/* ================================================= */}
              {/* ROUTE LOADING */}
              {/* ================================================= */}

              {routeLoading && (

                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "50%",
                    transform:
                      "translateX(-50%)",
                    background:
                      "white",
                    padding:
                      "10px 18px",
                    borderRadius:
                      "25px",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.18)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    fontWeight: 600,
                  }}
                >

                  <RouteIcon
                    sx={{
                      color: "#2563eb",
                      fontSize: 20,
                    }}
                  />

                  Finding road route...

                </div>

              )}

            </div>


            {/* ================================================= */}
            {/* LIVE STATUS */}
            {/* ================================================= */}

            <div
              style={{
                marginTop: "15px",
                padding: "16px 20px",
                background: "#f8fafc",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >


              <span
                style={{
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  background:
                    liveDriverPosition
                      ? "#16a34a"
                      : "#f59e0b",
                  display: "inline-block",
                  boxShadow:
                    liveDriverPosition
                      ? "0 0 0 5px rgba(22,163,74,0.12)"
                      : "0 0 0 5px rgba(245,158,11,0.12)",
                }}
              ></span>


              <div>

                <strong>

                  {liveDriverPosition
                    ? "Ambulance is live"
                    : "Waiting for ambulance location..."}

                </strong>


                {liveDriverPosition &&
                  driverLocation?.updatedAt && (

                    <span
                      style={{
                        marginLeft: "10px",
                        color: "#64748b",
                      }}
                    >

                      Updated{" "}

                      {new Date(
                        driverLocation.updatedAt
                      ).toLocaleTimeString()}

                    </span>

                  )}

              </div>

            </div>


            {/* ================================================= */}
            {/* ROUTE INFORMATION */}
            {/* ================================================= */}

            {liveDriverPosition && (

              <div
                style={{
                  marginTop: "12px",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >


                <div
                  style={{
                    background: "#eff6ff",
                    borderRadius: "14px",
                    padding: "15px",
                  }}
                >

                  <small
                    style={{
                      display: "block",
                      color: "#64748b",
                      marginBottom: "5px",
                    }}
                  >

                    <RouteIcon
                      sx={{
                        fontSize: 17,
                        verticalAlign:
                          "middle",
                        marginRight:
                          "4px",
                      }}
                    />

                    Road Distance

                  </small>


                  <strong>

                    {routeDistance
                      ? `${routeDistance} km`
                      : routeLoading
                        ? "Calculating..."
                        : "—"}

                  </strong>

                </div>


                <div
                  style={{
                    background: "#f0fdf4",
                    borderRadius: "14px",
                    padding: "15px",
                  }}
                >

                  <small
                    style={{
                      display: "block",
                      color: "#64748b",
                      marginBottom: "5px",
                    }}
                  >

                    <AccessTimeIcon
                      sx={{
                        fontSize: 17,
                        verticalAlign:
                          "middle",
                        marginRight:
                          "4px",
                      }}
                    />

                    Estimated Time

                  </small>


                  <strong>

                    {routeDuration
                      ? `${routeDuration} min`
                      : routeLoading
                        ? "Calculating..."
                        : "—"}

                  </strong>

                </div>

              </div>

            )}


            {/* ================================================= */}
            {/* TRACKING INFO */}
            {/* ================================================= */}

            <div className="tracking-info">


              <div>

                <small>
                  Ambulance
                </small>


                <strong>

                  {selectedRequest
                    .driver
                    ?.ambulanceNumber ||
                    "Not Assigned"}

                </strong>

              </div>


              <div>

                <small>
                  Driver
                </small>


                <strong>

                  {selectedRequest
                    .driver
                    ?.fullName ||
                    "Unknown"}

                </strong>

              </div>


              <div>

                <small>
                  Status
                </small>


                <span
                  className={`status-badge ${getStatusClass(
                    selectedRequest.status
                  )}`}
                >

                  {selectedRequest.status}

                </span>

              </div>

            </div>


          </div>

        </div>

      )}


      {/* ================================================= */}
      {/* EMERGENCY MODAL */}
      {/* ================================================= */}

      {showEmergencyModal && (

        <div className="emergency-overlay">


          <div className="emergency-modal">


            {/* ================================================= */}
            {/* MODAL HEADER */}
            {/* ================================================= */}

            <div className="modal-header-custom">


              <div>

                <div className="modal-danger-icon">

                  <EmergencyIcon
                    sx={{
                      fontSize: 25,
                      color: "#dc2626",
                    }}
                  />

                </div>


                <div>

                  <h2>
                    Emergency Assistance
                  </h2>


                  <p>

                    Select the reason for requesting
                    an ambulance.

                  </p>

                </div>

              </div>


              <button
                className="modal-close"

                onClick={closeModal}

                disabled={requesting}
              >

                <CloseIcon
                  sx={{
                    fontSize: 24,
                  }}
                />

              </button>

            </div>


            {/* ================================================= */}
            {/* LOCATION */}
            {/* ================================================= */}

            <div className="location-box">


              <div className="location-icon">

                <MyLocationIcon
                  sx={{
                    fontSize: 26,
                    color: "#2563eb",
                  }}
                />

              </div>


              <div>

                <strong>
                  Your current location
                </strong>


                <p>

                  We'll use your GPS location
                  to find the nearest ambulance.

                </p>

              </div>

            </div>


            {/* ================================================= */}
            {/* EMERGENCY TYPE */}
            {/* ================================================= */}

            <label>
              What happened?
            </label>


            <div className="emergency-types">


              {[
                "Accident",
                "Heart Attack",
                "Breathing Problem",
                "Serious Injury",
                "Pregnancy",
                "Stroke",
                "Fire / Burn",
                "Other",
              ].map(
                (type) => {

                  const selected =
                    emergencyType === type;


                  return (

                    <button

                      key={type}

                      className={
                        selected
                          ? "emergency-type selected"
                          : "emergency-type"
                      }

                      onClick={() =>
                        setEmergencyType(
                          type
                        )
                      }

                    >

                      <span>
                        {type}
                      </span>


                      {selected && (

                        <CheckCircleIcon
                          sx={{
                            fontSize: 20,
                            color: "#dc2626",
                          }}
                        />

                      )}

                    </button>

                  );

                }
              )}

            </div>


            {/* ================================================= */}
            {/* MODAL FOOTER */}
            {/* ================================================= */}

            <div className="modal-footer-custom">


              <button

                className="cancel-button"

                onClick={closeModal}

                disabled={requesting}

              >

                Cancel

              </button>


              <button

                className="confirm-button"

                disabled={
                  !emergencyType ||
                  requesting
                }

                onClick={
                  handleEmergencyRequest
                }

              >

                {requesting
                  ? "Getting Location..."
                  : "Request Ambulance"}

              </button>


            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default PatientDashboard;