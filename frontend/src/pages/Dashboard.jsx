import Machines from "./Machines.jsx";
import "./dashboard.css";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Operator";
  const role = localStorage.getItem("role") || "Staff";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header-bar">
        <div className="dashboard-title-area">
          <h1>UpTime Telemetry Console</h1>
          <p>Real-time industrial machine state and telemetry logs.</p>
        </div>

        <div className="dashboard-user-badge">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">{username}</span>
            <span className="user-role">{role}</span>
          </div>
          <button 
            className="btn-logout" 
            onClick={handleLogout} 
            title="Disconnect Operator Session"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <section className="table-section">
        <Machines />
      </section>
    </div>
  );
}

export default Dashboard;