import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllHospitals,
  deleteHospital,
} from "../../services/hospitalService";
import "./Hospitals.css";
import AddHospitalModal from "../../components/admin/AddHospitalModal";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editHospital, setEditHospital] = useState(null);

  const [search, setSearch] = useState("");

  const fetchHospitals = async () => {
    try {
      const response = await getAllHospitals();
      setHospitals(response.hospitals);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch hospitals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.hospitalName?.toLowerCase().includes(search.toLowerCase()) ||
    hospital.email?.toLowerCase().includes(search.toLowerCase()) ||
    hospital.phone?.includes(search) ||
    hospital.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hospital?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteHospital(id);

      toast.success(response.message);
      fetchHospitals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete Failed"
      );
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="hospital-page-header">
        <div>
          <h2 className="hospital-page-title">
            Hospitals
          </h2>

          <p className="hospital-page-subtitle">
            Manage registered hospitals and emergency bed availability
          </p>
        </div>

        <button
          className="btn btn-primary hospital-add-btn"
          onClick={() => {
            setEditHospital(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Hospital
        </button>

        <AddHospitalModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setEditHospital(null);
          }}
          onSuccess={fetchHospitals}
          editHospital={editHospital}
        />
      </div>

      {/* ================= SEARCH ================= */}
      <div className="hospital-search-wrapper">
        <div className="hospital-search-box">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search by hospital name, email, phone or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="hospital-search-clear"
              onClick={() => setSearch("")}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <div className="hospital-loading">
          <div className="spinner-border text-primary"></div>
          <p>Loading hospitals...</p>
        </div>
      ) : (
        <>
          {/* ================= HOSPITAL COUNT ================= */}
          <div className="hospital-result-info">
            <span>
              Showing <strong>{filteredHospitals.length}</strong>{" "}
              hospital{filteredHospitals.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ================= CARDS ================= */}
          {filteredHospitals.length > 0 ? (
            <div className="row g-4">
              {filteredHospitals.map((hospital) => (
                <div
                  className="col-12 col-md-6 col-xl-4"
                  key={hospital._id}
                >
                  <div className="hospital-card">

                    {/* Card Header */}
                    <div className="hospital-card-header">
                      <div className="hospital-icon">
                        <i className="bi bi-hospital"></i>
                      </div>

                      <div className="hospital-title-section">
                        <h5>{hospital.hospitalName}</h5>

                        <span className="hospital-status">
                          <span className="status-dot"></span>
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Hospital Details */}
                    <div className="hospital-details">

                      <div className="hospital-detail-item">
                        <div className="detail-icon">
                          <i className="bi bi-envelope"></i>
                        </div>

                        <div>
                          <small>Email</small>
                          <p>{hospital.email}</p>
                        </div>
                      </div>

                      <div className="hospital-detail-item">
                        <div className="detail-icon">
                          <i className="bi bi-telephone"></i>
                        </div>

                        <div>
                          <small>Phone</small>
                          <p>{hospital.phone}</p>
                        </div>
                      </div>

                      <div className="hospital-detail-item">
                        <div className="detail-icon">
                          <i className="bi bi-geo-alt"></i>
                        </div>

                        <div>
                          <small>Location</small>
                          <p>{hospital.city}</p>
                        </div>
                      </div>

                    </div>

                    {/* Beds */}
                    <div className="hospital-beds-section">

                      <div className="bed-card emergency-bed">
                        <div className="bed-icon">
                          <i className="bi bi-heart-pulse"></i>
                        </div>

                        <div>
                          <span>Emergency Beds</span>
                          <strong>
                            {hospital.emergencyBeds ?? 0}
                          </strong>
                        </div>
                      </div>

                      <div className="bed-card available-bed">
                        <div className="bed-icon">
                          <i className="bi bi-check-circle"></i>
                        </div>

                        <div>
                          <span>Available Beds</span>
                          <strong>
                            {hospital.availableBeds ?? 0}
                          </strong>
                        </div>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="hospital-card-actions">

                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          setEditHospital(hospital);
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleDelete(hospital._id)
                        }
                      >
                        <i className="bi bi-trash me-2"></i>
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ================= EMPTY STATE ================= */
            <div className="hospital-empty">

              <div className="hospital-empty-icon">
                <i className="bi bi-hospital"></i>
              </div>

              <h4>No hospitals found</h4>

              <p>
                {search
                  ? "Try searching with a different hospital name, email, phone or city."
                  : "No hospitals have been registered yet."}
              </p>

              {search && (
                <button
                  className="btn btn-primary"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </button>
              )}

            </div>
          )}
        </>
      )}
    </>
  );
}

export default Hospitals;