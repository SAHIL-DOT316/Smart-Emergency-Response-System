import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PatientNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        {/* Logo */}

        <Link
          to="/patient"
          className="navbar-brand fw-bold d-flex align-items-center"
        >
          <span className="me-2"></span>
          Smart Emergency
        </Link>

        {/* Mobile button */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#patientNavbar"
          aria-controls="patientNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}

        <div
          className="collapse navbar-collapse"
          id="patientNavbar"
        >

          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <Link
                to="/patient"
                className="nav-link"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/patient/requests"
                className="nav-link"
              >
                My Requests
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/patient/profile"
                className="nav-link"
              >
                Profile
              </Link>
            </li>

            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">

              <button
                className="btn btn-danger btn-sm px-3"
                onClick={handleLogout}
              >
                Logout
              </button>

            </li>

          </ul>

        </div>

      </div>
    </nav>
  );
}

export default PatientNavbar;