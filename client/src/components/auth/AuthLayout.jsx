import "./AuthLayout.css";
import ambulance from "../../assets/auth/ambulance.svg";
function AuthLayout({ children }) {
  return (
    <div className="container-fluid auth-container">
      <div className="row min-vh-100">

        {/* Left Section */}
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
          <div className="left-panel px-5">

            <h1 className="fw-bold display-4 mb-3">
                     Smart Emergency
           </h1>

            <h2 className="fw-light mb-4">
               Response System
            </h2>

          <p className="fs-5 text-white-50">
            Every second counts. Connect patients,
             ambulances and hospitals in real time.
         </p>

            <div className="feature-box">
    <i className="bi bi-geo-alt-fill"></i>
    <span>Nearest Ambulance Dispatch</span>
</div>

<div className="feature-box">
    <i className="bi bi-broadcast"></i>
    <span>Live GPS Tracking</span>
</div>

<div className="feature-box">
    <i className="bi bi-hospital-fill"></i>
    <span>Hospital Pre-Alert</span>
</div>

<div className="feature-box">
    <i className="bi bi-sign-turn-right-fill"></i>
    <span>Green Corridor (Future)</span>
</div>
             <div className="text-center mt-5">
  <img
    src={ambulance}
    alt="Ambulance"
    className="ambulance-img"
  />
</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-6 right-panel">

          <div className="card auth-card">

            <div className="card-body p-5">

              {children}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AuthLayout;