import { useEffect } from "react";
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

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Patient marker
const patientIcon = L.divIcon({
  className: "custom-map-marker",

  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#dc2626;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:22px;
      border:4px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,.3);
    ">
      📍
    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// Ambulance marker
const ambulanceIcon = L.divIcon({
  className: "ambulance-map-marker",

  html: `
    <div style="
      width:48px;
      height:48px;
      border-radius:50%;
      background:#2563eb;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:25px;
      border:4px solid white;
      box-shadow:0 5px 15px rgba(37,99,235,.45);
    ">
      🚑
    </div>
  `,

  iconSize: [48, 48],
  iconAnchor: [24, 24],
});


// Automatically move map when ambulance moves
function MapUpdater({ position }) {

  const map = useMap();

  useEffect(() => {

    if (!position) return;

    map.setView(
      [position.latitude, position.longitude],
      15,
      {
        animate: true,
      }
    );

  }, [position, map]);

  return null;
}


function AmbulanceMap({
  patientLocation,
  ambulanceLocation,
  driver,
}) {

  if (!patientLocation) {

    return (
      <div
        style={{
          height: "450px",
          borderRadius: "20px",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >

        <div style={{ fontSize: "50px" }}>
          📍
        </div>

        <h5 className="fw-bold mt-3">
          Waiting for your location
        </h5>

        <p className="text-muted">
          Your GPS location will appear here.
        </p>

      </div>
    );
  }


  const center = ambulanceLocation
    ? [
        ambulanceLocation.latitude,
        ambulanceLocation.longitude,
      ]
    : [
        patientLocation.latitude,
        patientLocation.longitude,
      ];


  const routePositions = ambulanceLocation
    ? [
        [
          ambulanceLocation.latitude,
          ambulanceLocation.longitude,
        ],

        [
          patientLocation.latitude,
          patientLocation.longitude,
        ],
      ]
    : [];


  return (

    <div
      style={{
        position: "relative",
        height: "520px",
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow:
          "0 10px 35px rgba(15,23,42,.12)",
      }}
    >

      {/* MAP */}

      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <MapUpdater
          position={ambulanceLocation}
        />


        {/* PATIENT */}

        <Marker
          position={[
            patientLocation.latitude,
            patientLocation.longitude,
          ]}
          icon={patientIcon}
        >

          <Popup>

            <strong>
              Your Location
            </strong>

            <br />

            Waiting for ambulance here.

          </Popup>

        </Marker>


        {/* AMBULANCE */}

        {ambulanceLocation && (

          <Marker
            position={[
              ambulanceLocation.latitude,
              ambulanceLocation.longitude,
            ]}
            icon={ambulanceIcon}
          >

            <Popup>

              <strong>
                🚑 Ambulance
              </strong>

              <br />

              {driver?.ambulanceNumber ||
                "Ambulance"}

              <br />

              {driver?.fullName ||
                "Driver"}

            </Popup>

          </Marker>

        )}


        {/* SIMPLE ROUTE LINE */}

        {ambulanceLocation && (

          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "#2563eb",
              weight: 5,
              opacity: 0.8,
              dashArray: "10 8",
            }}
          />

        )}

      </MapContainer>


      {/* TOP STATUS CARD */}

      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "18px",
          right: "18px",
          zIndex: 1000,
          background: "rgba(255,255,255,.96)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "15px 18px",
          boxShadow:
            "0 6px 20px rgba(0,0,0,.12)",
        }}
      >

        <div className="d-flex align-items-center">

          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🚑
          </div>


          <div className="ms-3">

            <div className="fw-bold">

              {ambulanceLocation
                ? "Ambulance is on the way"
                : "Waiting for ambulance"}

            </div>


            <small className="text-muted">

              {driver?.ambulanceNumber ||
                "Searching for ambulance..."}

            </small>

          </div>


          {ambulanceLocation && (

            <span
              className="badge bg-success ms-auto"
            >
              LIVE
            </span>

          )}

        </div>

      </div>


      {/* BOTTOM DRIVER CARD */}

      {ambulanceLocation && driver && (

        <div
          style={{
            position: "absolute",
            bottom: "18px",
            left: "18px",
            right: "18px",
            zIndex: 1000,
            background: "white",
            borderRadius: "18px",
            padding: "16px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.15)",
          }}
        >

          <div className="d-flex align-items-center">

            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              👨‍✈️
            </div>


            <div className="ms-3">

              <div className="fw-bold">
                {driver.fullName}
              </div>

              <small className="text-muted">
                {driver.phone}
              </small>

            </div>


            <div className="ms-auto text-end">

              <div className="fw-bold text-primary">
                {driver.ambulanceNumber}
              </div>

              <small className="text-success">
                ● Approaching
              </small>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default AmbulanceMap;