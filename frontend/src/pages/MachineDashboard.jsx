import Machines from "./Machines.jsx";
import "./dashboard.css";

function MachineDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-title-area" style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 4px 0", fontSize: "1.5rem" }}>Equipment Telemetry</h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Real-time industrial machine state monitoring and telemetry logs.
        </p>
      </div>

      <section className="table-section">
        <Machines />
      </section>
    </div>
  );
}

export default MachineDashboard;
