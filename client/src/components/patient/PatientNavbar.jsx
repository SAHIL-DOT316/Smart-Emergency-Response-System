import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./patientNavbar.css";

function PatientNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="patient-navbar">

      <div className="patient-navbar-container">

        {/* LOGO */}

        <Link
          to="/patient"
          className="patient-navbar-brand"
          onClick={closeMenu}
        >
          <div className="patient-logo-icon">
            🚑
          </div>

          <div className="patient-brand-text">
            <strong>Smart Emergency</strong>
            <span>Emergency Response System</span>
          </div>
        </Link>


        {/* MOBILE MENU BUTTON */}

        <button
          className="patient-navbar-toggler"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>


        {/* NAVIGATION */}

        <div
          className={`patient-navbar-menu ${
            menuOpen ? "show-menu" : ""
          }`}
        >

          <Link
            to="/patient"
            className="patient-nav-link"
            onClick={closeMenu}
          >
            <span>🏠</span>
            Home
          </Link>


          <Link
            to="/patient/requests"
            className="patient-nav-link"
            onClick={closeMenu}
          >
            <span>📋</span>
            My Requests
          </Link>


          <Link
            to="/patient/profile"
            className="patient-nav-link"
            onClick={closeMenu}
          >
            <span>👤</span>
            Profile
          </Link>


          <button
            className="patient-logout-btn"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}

export default PatientNavbar;