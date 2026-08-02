import { useEffect, useState } from "react";
import { getAllDrivers } from "../../services/driverService";
import AddDriverModal from "../../components/admin/AddDriverModal";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  if (loading) {
    return <h4>Loading Drivers...</h4>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Drivers</h2>

      <button
    className="btn btn-primary"
    onClick={() => setShowModal(true)}
>
    Add Driver
</button>
 <AddDriverModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={fetchDrivers}
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

          {drivers.map((driver) => (

            <tr key={driver._id}>

              <td>{driver.fullName}</td>

              <td>{driver.phone}</td>

              <td>{driver.email}</td>

              <td>{driver.ambulanceNumber}</td>

              <td>
                <span className="badge bg-secondary">
                  {driver.status}
                </span>
              </td>

              <td>
                <button className="btn btn-warning btn-sm me-2">
                  Edit
                </button>

                <button className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </>
  );
}

export default Drivers;