import Machines from "./Machines.jsx";
import "./dashboard.css";

function MachineDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-title-area" style={{ marginBottom: "0.75rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Machine Dashboard</h1>
      </div>

      <Machines />
    </div>
  );
}

export default MachineDashboard;
