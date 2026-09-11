import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../components/admin/DashboardCard";
import { getDashboardStats } from "../../services/adminService";
import "./DashboardHome.css";
function DashboardHome() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    drivers: 0,
    hospitals: 0,
    patients: 0,
    ambulances: 0,
    emergencies: 0,
    pendingEmergencies: 0,
    activeEmergencies: 0,
    completedEmergencies: 0,
    cancelledEmergencies: 0,
  });

  const [emergencyActivity, setEmergencyActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardStats();

        if (response.success) {
          setStats(response.stats);

          setEmergencyActivity(response.emergencyActivity || []);
        } else {
          setError(response.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Dashboard API Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // --------------------------------------------------
  // Prepare last 7 days graph data
  // --------------------------------------------------

  const getLastSevenDays = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const dateString = `${year}-${month}-${day}`;

      const found = emergencyActivity.find(
        (item) => item._id === dateString
      );

      days.push({
        date: dateString,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        count: found ? found.count : 0,
      });
    }

    return days;
  };

  const chartData = getLastSevenDays();

  const maxCount = Math.max(
    ...chartData.map((item) => item.count),
    1
  );

  // --------------------------------------------------
  // Create SVG points dynamically
  // --------------------------------------------------

  const chartWidth = 700;
  const chartHeight = 260;

  const horizontalPadding = 20;

  const getX = (index) => {
    if (chartData.length === 1) {
      return chartWidth / 2;
    }

    return (
      horizontalPadding +
      (index * (chartWidth - horizontalPadding * 2)) /
        (chartData.length - 1)
    );
  };

  const getY = (count) => {
    const topPadding = 25;
    const bottomPadding = 20;

    const usableHeight =
      chartHeight - topPadding - bottomPadding;

    return (
      chartHeight -
      bottomPadding -
      (count / maxCount) * usableHeight
    );
  };

  const chartPoints = chartData
    .map((item, index) => {
      return `${getX(index)},${getY(item.count)}`;
    })
    .join(" ");

  const areaPath = `
    M ${getX(0)} ${getY(chartData[0].count)}
    ${chartData
      .slice(1)
      .map(
        (item, index) =>
          `L ${getX(index + 1)} ${getY(item.count)}`
      )
      .join(" ")}
    L ${getX(chartData.length - 1)} ${chartHeight}
    L ${getX(0)} ${chartHeight}
    Z
  `;

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header mb-4">
        <div>
          <h2 className="dashboard-title">
            Dashboard Overview
          </h2>

          <p className="dashboard-subtitle">
            Monitor your emergency response system at a glance
          </p>
        </div>

        <div className="dashboard-date">
          <i className="bi bi-calendar3"></i>
          <span>Admin Dashboard</span>
        </div>
      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="alert alert-danger mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}


      {/* ================= MAIN STATS ================= */}

      <div className="row g-4 mb-4">

        {/* Drivers */}

        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard
            title="Drivers"
            value={loading ? "..." : stats.drivers}
            icon="bi bi-person-badge"
            bgColor="primary"
          />
        </div>


        {/* Hospitals */}

        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard
            title="Hospitals"
            value={loading ? "..." : stats.hospitals}
            icon="bi bi-hospital"
            bgColor="success"
          />
        </div>


        {/* Patients */}

        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard
            title="Patients"
            value={loading ? "..." : stats.patients}
            icon="bi bi-people"
            bgColor="warning"
          />
        </div>


        {/* Ambulances */}

        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard
            title="Ambulances"
            value={loading ? "..." : stats.ambulances}
            icon="bi bi-truck"
            bgColor="danger"
          />
        </div>

      </div>


      {/* ================= EMERGENCY STATS ================= */}

      <div className="row g-4 mb-4">

        {/* Total Emergencies */}

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-mini-card">
            <div className="mini-card-icon primary">
              <i className="bi bi-activity"></i>
            </div>

            <div>
              <span>Total Emergencies</span>

              <strong>
                {loading ? "..." : stats.emergencies}
              </strong>
            </div>
          </div>
        </div>


        {/* Pending */}

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-mini-card">
            <div className="mini-card-icon warning">
              <i className="bi bi-hourglass-split"></i>
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {loading
                  ? "..."
                  : stats.pendingEmergencies}
              </strong>
            </div>
          </div>
        </div>


        {/* Active */}

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-mini-card">
            <div className="mini-card-icon danger">
              <i className="bi bi-heart-pulse"></i>
            </div>

            <div>
              <span>Active</span>

              <strong>
                {loading
                  ? "..."
                  : stats.activeEmergencies}
              </strong>
            </div>
          </div>
        </div>


        {/* Completed */}

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-mini-card">
            <div className="mini-card-icon success">
              <i className="bi bi-check-circle"></i>
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {loading
                  ? "..."
                  : stats.completedEmergencies}
              </strong>
            </div>
          </div>
        </div>

      </div>


      {/* ================= GRAPH + QUICK ACTIONS ================= */}

      <div className="row g-4">

        {/* ================= EMERGENCY ACTIVITY ================= */}

        <div className="col-12 col-xl-8">

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h5>Emergency Activity</h5>

                <p>
                  Emergency requests during the last 7 days
                </p>
              </div>

              <span className="panel-badge">
                <i className="bi bi-activity"></i>
                This Week
              </span>

            </div>


            {/* Chart */}

            <div className="activity-chart">

              {/* Y Axis */}

              <div className="chart-y-axis">

                <span>{maxCount}</span>

                <span>
                  {Math.round(maxCount * 0.75)}
                </span>

                <span>
                  {Math.round(maxCount * 0.5)}
                </span>

                <span>
                  {Math.round(maxCount * 0.25)}
                </span>

                <span>0</span>

              </div>


              {/* Chart Area */}

              <div className="chart-area">

                <div className="chart-grid">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>


                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                  className="chart-svg"
                >

                  <defs>

                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="rgba(13,110,253,0.28)"
                      />

                      <stop
                        offset="100%"
                        stopColor="rgba(13,110,253,0)"
                      />

                    </linearGradient>

                  </defs>


                  {/* Area */}

                  <path
                    d={areaPath}
                    fill="url(#chartGradient)"
                  />


                  {/* Line */}

                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />


                  {/* Points */}

                  {chartData.map((item, index) => (

                    <circle
                      key={item.date}
                      cx={getX(index)}
                      cy={getY(item.count)}
                      r="5"
                    />

                  ))}

                </svg>


                {/* X Axis */}

                <div className="chart-x-axis">

                  {chartData.map((item) => (
                    <span key={item.date}>
                      {item.label}
                    </span>
                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= QUICK ACTIONS ================= */}

        <div className="col-12 col-xl-4">

          <div className="dashboard-panel quick-actions-panel">

            <div className="panel-header">

              <div>

                <h5>Quick Actions</h5>

                <p>
                  Manage system resources
                </p>

              </div>

            </div>


            <div className="quick-actions">

              {/* Drivers */}

              <button
                onClick={() =>
                  navigate("/admin/drivers")
                }
                className="quick-action"
              >

                <div className="quick-action-icon primary">

                  <i className="bi bi-person-badge"></i>

                </div>

                <div>

                  <strong>
                    Manage Drivers
                  </strong>

                  <small>
                    Add, edit or remove drivers
                  </small>

                </div>

                <i className="bi bi-chevron-right"></i>

              </button>


              {/* Hospitals */}

              <button
                onClick={() =>
                  navigate("/admin/hospitals")
                }
                className="quick-action"
              >

                <div className="quick-action-icon success">

                  <i className="bi bi-hospital"></i>

                </div>

                <div>

                  <strong>
                    Manage Hospitals
                  </strong>

                  <small>
                    Manage hospital accounts
                  </small>

                </div>

                <i className="bi bi-chevron-right"></i>

              </button>


              {/* Patients */}

              <button
                onClick={() =>
                  navigate("/admin/patients")
                }
                className="quick-action"
              >

                <div className="quick-action-icon warning">

                  <i className="bi bi-people"></i>

                </div>

                <div>

                  <strong>
                    View Patients
                  </strong>

                  <small>
                    Monitor registered patients
                  </small>

                </div>

                <i className="bi bi-chevron-right"></i>

              </button>


              {/* Emergencies */}

              <button
                onClick={() =>
                  navigate("/admin/emergencies")
                }
                className="quick-action"
              >

                <div className="quick-action-icon danger">

                  <i className="bi bi-heart-pulse"></i>

                </div>

                <div>

                  <strong>
                    Emergencies
                  </strong>

                  <small>
                    Monitor emergency requests
                  </small>

                </div>

                <i className="bi bi-chevron-right"></i>

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ================= SYSTEM STATUS ================= */}

      <div className="dashboard-system-status mt-4">

        <div className="system-status-left">

          <div className="system-status-icon">

            <i className="bi bi-shield-check"></i>

          </div>

          <div>

            <strong>
              System Status
            </strong>

            <span>
              All emergency services are operational
            </span>

          </div>

        </div>


        <div className="system-online">

          <span></span>

          All Systems Operational

        </div>

      </div>

    </div>
  );
}

export default DashboardHome;