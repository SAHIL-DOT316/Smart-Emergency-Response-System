import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./AdminLayout.css";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out Successfully");
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <i className="bi bi-heart-pulse-fill"></i>
          <span>Smart EMS</span>
        </div>

        <nav>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <i className="bi bi-speedometer2"></i>
            Dashboard
          </NavLink>
           <NavLink
            to="/admin/emergency-requests"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <i className="bi bi-truck-front-fill"></i>
           Emergency Requests
          </NavLink>
          <NavLink
            to="/admin/drivers"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <i className="bi bi-truck"></i>
            Drivers
          </NavLink>

          <NavLink
            to="/admin/hospitals"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <i className="bi bi-hospital"></i>
            Hospitals
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <i className="bi bi-person-circle"></i>
            Profile
          </NavLink>

          <button
            className="menu logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>

        </nav>

      </aside>

      {/* Main */}

      <div className="main-content">

        {/* Navbar */}

        <header className="topbar">

          <h4>Admin Dashboard</h4>

          <div className="admin-info">

            <i className="bi bi-person-circle"></i>

            <span>
              {user?.fullName}
            </span>

          </div>

        </header>

        {/* Page */}

        <main className="page-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;