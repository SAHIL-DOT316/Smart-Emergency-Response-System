import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";
function PatientDashboard() {
  const { patient, logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
 logout();

toast.success("Logged out successfully");

navigate("/login");
};

  return (
    
    <div className="container mt-5">
      <h2>Patient Dashboard</h2>

      <h4>Welcome, {patient?.fullName}</h4>

      <p>Email: {patient?.email}</p>

      <p>Phone: {patient?.phone}</p>
      <button
  className="btn btn-danger"
  onClick={handleLogout}
>
  Logout
</button>
    </div>
  );
}

export default PatientDashboard;