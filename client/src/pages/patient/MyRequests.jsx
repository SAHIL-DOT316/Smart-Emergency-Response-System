import { useEffect, useState } from "react";
import {
  AccessTime,
  DirectionsCar,
  Emergency,
  LocationOn,
  Person,
  Refresh,
  LocalHospital,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import PatientNavbar from "../../components/patient/PatientNavbar";

import {
  getMyEmergencyRequests,
} from "../../services/emergencyService";

import "./myRequests.css";


function MyRequests() {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH MY REQUESTS
  // ==========================================

  const fetchRequests = async () => {

    try {

      setLoading(true);

      const response =
        await getMyEmergencyRequests();

      console.log(
        "MY REQUESTS:",
        response
      );

      setRequests(
        response.requests || []
      );

    } catch (error) {

      console.error(
        "My requests error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load your requests"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    fetchRequests();

  }, []);


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "request-status pending";

      case "Accepted":
        return "request-status accepted";

      case "Driver Arrived":
        return "request-status arrived";

      case "Patient Picked":
        return "request-status picked";

      case "Hospital Assigned":
        return "request-status hospital";

      case "Hospital Accepted":
        return "request-status hospital";

      case "Patient Arrived":
        return "request-status arrived";

      case "Completed":
        return "request-status completed";

      case "Cancelled":
        return "request-status cancelled";

      default:
        return "request-status";

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="my-requests-page">

      <PatientNavbar />


      <main className="my-requests-main">


        {/* ======================================
            HEADER
        ====================================== */}

        <section className="my-requests-header">

          <div>

            <div className="page-badge">

              <Emergency />

              Emergency Response System

            </div>


            <h1>
              My Emergency Requests
            </h1>


            <p>
              View your emergency request history
              and track the current status of your
              ambulance requests.
            </p>

          </div>


          <button
            className="refresh-requests-btn"
            onClick={fetchRequests}
            disabled={loading}
          >

            <Refresh />

            Refresh

          </button>

        </section>



        {/* ======================================
            REQUEST COUNT
        ====================================== */}

        <section className="request-summary">

          <div className="summary-card">

            <div className="summary-icon blue">

              <AccessTime />

            </div>

            <div>

              <span>
                Total Requests
              </span>

              <strong>
                {requests.length}
              </strong>

            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon red">

              <Emergency />

            </div>

            <div>

              <span>
                Active
              </span>

              <strong>

                {
                  requests.filter(
                    (request) =>
                      request.status !== "Completed" &&
                      request.status !== "Cancelled"
                  ).length
                }

              </strong>

            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon green">

              <LocalHospital />

            </div>

            <div>

              <span>
                Completed
              </span>

              <strong>

                {
                  requests.filter(
                    (request) =>
                      request.status === "Completed"
                  ).length
                }

              </strong>

            </div>

          </div>

        </section>



        {/* ======================================
            REQUEST LIST
        ====================================== */}

        <section className="requests-section">


          <div className="section-title">

            <div>

              <h2>
                Request History
              </h2>

              <p>
                All your ambulance emergency requests
              </p>

            </div>

          </div>



          {/* LOADING */}

          {loading ? (

            <div className="requests-loading">

              <div className="requests-spinner"></div>

              <p>
                Loading your emergency requests...
              </p>

            </div>

          ) : requests.length === 0 ? (

            /* EMPTY */

            <div className="requests-empty">

              <div className="empty-icon">

                <Emergency />

              </div>

              <h3>
                No Emergency Requests
              </h3>

              <p>
                You haven't created any emergency
                requests yet.
              </p>

            </div>

          ) : (

            /* REQUESTS */

            <div className="my-request-list">

              {requests.map((request) => (

                <div
                  className="my-request-card"
                  key={request._id}
                >


                  {/* =================================
                      CARD HEADER
                  ================================= */}

                  <div className="request-card-top">


                    <div className="request-title">


                      <div className="request-emergency-icon">

                        <Emergency />

                      </div>


                      <div>

                        <h3>
                          {request.emergencyType}
                        </h3>

                        <span>

                          Request #

                          {request._id.slice(-6)}

                        </span>

                      </div>

                    </div>


                    <span
                      className={getStatusClass(
                        request.status
                      )}
                    >

                      {request.status}

                    </span>

                  </div>



                  {/* =================================
                      DETAILS
                  ================================= */}

                  <div className="request-card-details">


                    {/* LOCATION */}

                    <div className="request-detail">

                      <div className="detail-icon location">

                        <LocationOn />

                      </div>

                      <div>

                        <small>
                          Pickup Location
                        </small>

                        <strong>

                          {request.pickupAddress ||
                            "Current Location"}

                        </strong>

                      </div>

                    </div>



                    {/* DRIVER */}

                    <div className="request-detail">

                      <div className="detail-icon driver">

                        <Person />

                      </div>

                      <div>

                        <small>
                          Driver
                        </small>

                        <strong>

                          {request.driver
                            ? request.driver.fullName
                            : "Waiting for assignment"}

                        </strong>

                      </div>

                    </div>



                    {/* AMBULANCE */}

                    <div className="request-detail">

                      <div className="detail-icon ambulance">

                        <DirectionsCar />

                      </div>

                      <div>

                        <small>
                          Ambulance
                        </small>

                        <strong>

                          {request.driver
                            ? request.driver.ambulanceNumber
                            : "Not Assigned"}

                        </strong>

                      </div>

                    </div>



                    {/* CREATED DATE */}

                    <div className="request-detail">

                      <div className="detail-icon time">

                        <AccessTime />

                      </div>

                      <div>

                        <small>
                          Requested At
                        </small>

                        <strong>

                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleString()
                            : "—"}

                        </strong>

                      </div>

                    </div>

                  </div>



                  {/* =================================
                      FOOTER
                  ================================= */}

                  <div className="request-card-footer">


                    <div className="request-id">

                      <span>
                        Request ID
                      </span>

                      <strong>
                        {request._id}
                      </strong>

                    </div>


                    {request.driver &&
                      request.status !== "Completed" &&
                      request.status !== "Cancelled" && (

                        <button
                          className="track-request-btn"
                          onClick={() => {

                            toast.info(
                              "Tracking will be available from the dashboard."
                            );

                          }}
                        >

                          <LocationOn />

                          Track Ambulance

                        </button>

                      )}

                  </div>


                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>

  );

}


export default MyRequests;