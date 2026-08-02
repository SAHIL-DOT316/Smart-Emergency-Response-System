import DashboardCard from "../../components/admin/DashboardCard";

function DashboardHome() {
  return (
    <>
      <h2 className="fw-bold mb-4">
        Dashboard Overview
      </h2>

      <div className="row">

        <DashboardCard
          title="Drivers"
          value="0"
          icon="bi bi-person-badge"
          bgColor="primary"
        />

        <DashboardCard
          title="Hospitals"
          value="0"
          icon="bi bi-hospital"
          bgColor="success"
        />

        <DashboardCard
          title="Patients"
          value="0"
          icon="bi bi-people"
          bgColor="warning"
        />

        <DashboardCard
          title="Ambulances"
          value="0"
          icon="bi bi-truck"
          bgColor="danger"
        />

      </div>
    </>
  );
}

export default DashboardHome;