import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllHospitals,
  deleteHospital,
} from "../../services/hospitalService";

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
    toast.error(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchHospitals();
}, []);

const filteredHospitals = hospitals.filter((hospital) =>
  hospital.hospitalName
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  hospital.email
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  hospital.phone.includes(search) ||
  hospital.city
    .toLowerCase()
    .includes(search.toLowerCase())
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
      error.response?.data?.message ||
        "Delete Failed"
    );
  }
};

return (
  <>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Hospitals</h2>

      <button
        className="btn btn-primary"
        onClick={() => {
          setEditHospital(null);
          setShowModal(true);
        }}
      >
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

    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search by hospital name, email, phone or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <table className="table table-bordered table-hover">
      <thead className="table-dark">
        <tr>
          <th>Hospital</th>
          <th>Phone</th>
          <th>Email</th>
          <th>City</th>
          <th>Emgergency Beds</th>
          <th>Available Beds</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital) => (
            <tr key={hospital._id}>
              <td>{hospital.hospitalName}</td>
              <td>{hospital.phone}</td>
              <td>{hospital.email}</td>
              <td>{hospital.city}</td>
               <td>
                <span className="badge bg-danger">
                  {hospital.emergencyBeds}
                </span>
              </td>
              <td>
                <span className="badge bg-success">
                  {hospital.availableBeds}
                </span>
              </td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditHospital(hospital);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(hospital._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4">
              No hospitals found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </>
);
}
export default Hospitals;