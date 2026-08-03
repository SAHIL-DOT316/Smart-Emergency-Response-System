import { useEffect, useState } from "react";
import { getAllDrivers } from "../../services/driverService";
import AddDriverModal from "../../components/admin/AddDriverModal";
import { deleteDriver } from "../../services/driverService";
import { toast } from "react-toastify";
function Drivers() {
  const [search, setSearch] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await getAllDrivers();
      setDrivers(response.drivers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
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

  if (loading) {
    return <h4>Loading Drivers...</h4>;
  }
  
  const filteredDrivers = drivers.filter((driver) =>
  driver.fullName.toLowerCase().includes(search.toLowerCase()) ||
  driver.email.toLowerCase().includes(search.toLowerCase()) ||
  driver.phone.includes(search) ||
  driver.ambulanceNumber.toLowerCase().includes(search.toLowerCase())
);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Drivers</h2>

    <button
  className="btn btn-primary"
  onClick={() => {
    setEditDriver(null);
    setShowModal(true);
  }}
>
  Add Driver
</button>
 <AddDriverModal
  show={showModal}
  onClose={() => {
    setShowModal(false);
    setEditDriver(null);
  }}
  onSuccess={fetchDrivers}
  editDriver={editDriver}
/>

      </div>
     
<div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search by name, email, phone or ambulance number..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      <table className="table table-bordered table-hover">

        <thead className="table-dark">

          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Ambulance</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

       <tbody>
  {filteredDrivers.length > 0 ? (
    filteredDrivers.map((driver) => (
      <tr key={driver._id}>
        <td>{driver.fullName}</td>
        <td>{driver.phone}</td>
        <td>{driver.email}</td>
        <td>{driver.ambulanceNumber}</td>

        <td>
          <span
            className={`badge ${
              driver.status === "available"
                ? "bg-success"
                : driver.status === "busy"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {driver.status}
          </span>
        </td>

        <td>
                <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => {
                setEditDriver(driver);
                setShowModal(true);
                 }}
                >
                Edit
              </button>

                <button
                 className="btn btn-danger btn-sm"
                 onClick={() => handleDelete(driver._id)}
               >
                Delete
             </button>
              </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4">
        No drivers found.
      </td>
    </tr>
  )}
</tbody>

      </table>
    </>
  );
}

export default Drivers;