import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllDrivers,
  deleteDriver,
} from "../../services/driverService";

import AddDriverModal from "../../components/admin/AddDriverModal";

import "./Drivers.css";

function Drivers() {
  const [search, setSearch] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editDriver, setEditDriver] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  // ==========================================
  // FETCH DRIVERS
  // ==========================================

  const fetchDrivers = async () => {
    try {
      setLoading(true);

      const response = await getAllDrivers();

      setDrivers(response.drivers || []);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load drivers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE DRIVER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this driver?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteDriver(id);

      toast.success(response.message);

      fetchDrivers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredDrivers = drivers.filter((driver) => {
    const searchValue = search.toLowerCase();

    return (
      driver.fullName
        ?.toLowerCase()
        .includes(searchValue) ||
      driver.email
        ?.toLowerCase()
        .includes(searchValue) ||
      driver.phone
        ?.toLowerCase()
        .includes(searchValue) ||
      driver.ambulanceNumber
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="drivers-loading">
        <div className="spinner-border text-primary"></div>

        <p>Loading Drivers...</p>
      </div>
    );
  }

  return (
    <div className="drivers-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="drivers-header">

        <div>
          <h2 className="drivers-title">
            Drivers
          </h2>

          <p className="drivers-subtitle">
            Manage ambulance drivers and their
            availability
          </p>
        </div>

        <button
          className="btn btn-primary drivers-add-btn"
          onClick={() => {
            setEditDriver(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-person-plus me-2"></i>
          Add Driver
        </button>

      </div>


      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}

      <AddDriverModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditDriver(null);
        }}
        onSuccess={fetchDrivers}
        editDriver={editDriver}
      />


      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="drivers-search">

        <div className="drivers-search-box">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search by name, email, phone or ambulance number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="drivers-search-clear"
              onClick={() => setSearch("")}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}

        </div>

        <div className="drivers-result-count">
          {filteredDrivers.length}{" "}
          {filteredDrivers.length === 1
            ? "Driver"
            : "Drivers"}
        </div>

      </div>


      {/* ======================================
          DRIVER CARDS
      ====================================== */}

      {filteredDrivers.length > 0 ? (

        <div className="row g-4">

          {filteredDrivers.map((driver) => (

            <div
              className="col-12 col-md-6 col-xl-4"
              key={driver._id}
            >

              <div className="driver-card">

                {/* ============================
                    CARD HEADER
                ============================ */}

                <div className="driver-card-header">

                  <div className="driver-profile">

                    <div className="driver-avatar">
                      <i className="bi bi-person-fill"></i>
                    </div>

                    <div className="driver-name-section">

                      <h5>
                        {driver.fullName}
                      </h5>

                      <span>
                        <i className="bi bi-person-badge me-1"></i>
                        Ambulance Driver
                      </span>

                    </div>

                  </div>


                  {/* STATUS */}

                  <span
                    className={`driver-status ${
                      driver.status ===
                      "available"
                        ? "available"
                        : driver.status === "busy"
                        ? "busy"
                        : "offline"
                    }`}
                  >
                    <span className="status-dot"></span>

                    {driver.status ||
                      "offline"}
                  </span>

                </div>


                {/* ============================
                    AMBULANCE
                ============================ */}

                <div className="ambulance-box">

                  <div className="ambulance-icon">
                    <i className="bi bi-truck"></i>
                  </div>

                  <div>
                    <span>
                      Ambulance Number
                    </span>

                    <strong>
                      {driver.ambulanceNumber ||
                        "Not Assigned"}
                    </strong>
                  </div>

                </div>


                {/* ============================
                    DRIVER INFORMATION
                ============================ */}

                <div className="driver-info">

                  <div className="driver-info-row">

                    <div className="info-icon">
                      <i className="bi bi-telephone"></i>
                    </div>

                    <div>
                      <span>Phone</span>

                      <strong>
                        {driver.phone ||
                          "Not Available"}
                      </strong>
                    </div>

                  </div>


                  <div className="driver-info-row">

                    <div className="info-icon">
                      <i className="bi bi-envelope"></i>
                    </div>

                    <div>
                      <span>Email</span>

                      <strong
                        title={driver.email}
                      >
                        {driver.email ||
                          "Not Available"}
                      </strong>
                    </div>

                  </div>

                </div>


                {/* ============================
                    ACTIONS
                ============================ */}

                <div className="driver-actions">

                  <button
                    className="driver-edit-btn"
                    onClick={() => {
                      setEditDriver(driver);
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
                    Edit
                  </button>


                  <button
                    className="driver-delete-btn"
                    onClick={() =>
                      handleDelete(driver._id)
                    }
                  >
                    <i className="bi bi-trash3"></i>
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        /* ======================================
           EMPTY STATE
        ====================================== */

        <div className="drivers-empty">

          <div className="drivers-empty-icon">
            <i className="bi bi-person-x"></i>
          </div>

          <h4>
            No Drivers Found
          </h4>

          <p>
            {search
              ? "No drivers match your search."
              : "No drivers have been added yet."}
          </p>

          {search && (
            <button
              className="btn btn-outline-primary"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          )}

        </div>

      )}

    </div>
  );
}

export default Drivers;