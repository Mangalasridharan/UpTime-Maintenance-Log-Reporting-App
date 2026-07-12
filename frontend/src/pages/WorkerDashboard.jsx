import { useEffect, useState, useMemo } from "react";
import { Users, Search, SlidersHorizontal, UserCheck, Wrench, AlertTriangle, Shield, Award } from "lucide-react";
import api from "../api/axios";

function WorkerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchWorkforceData = async () => {
      try {
        setLoading(true);
        const [empRes, compRes] = await Promise.all([
          api.get("/v1/employee"),
          api.get("/v1/complaint")
        ]);
        setEmployees(empRes.data || []);
        setComplaints(compRes.data || []);
      } catch (err) {
        console.error("Error fetching workforce dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkforceData();
  }, []);

  // Compute active worker dispatches mapping
  const busyWorkerMap = useMemo(() => {
    const map = new Map();
    complaints.forEach(c => {
      if ((c.status === "ASSIGNED" || c.status === "IN_PROGRESS") && c.assignedTo?.id) {
        map.set(c.assignedTo.id, {
          complaintId: c.id,
          machineName: c.machine?.name || "Equipment",
          description: c.description
        });
      }
    });
    return map;
  }, [complaints]);

  // Filter employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const isBusy = busyWorkerMap.has(emp.id);
      const isWorker = emp.employeeRole === "SHIFT_WORKER" || emp.employeeRole === "GENERAL_WORKER";
      
      const matchesSearch = 
        emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.specialization && emp.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.department?.name && emp.department.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === "ALL" || emp.employeeRole === roleFilter;
      
      let matchesStatus = true;
      if (statusFilter === "AVAILABLE") {
        matchesStatus = isWorker && !isBusy;
      } else if (statusFilter === "BUSY") {
        matchesStatus = isWorker && isBusy;
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchTerm, roleFilter, statusFilter, busyWorkerMap]);

  // Compute workforce statistics
  const metrics = useMemo(() => {
    let totalWorkers = 0;
    let available = 0;
    let busy = 0;
    let electrical = 0;
    let mechanical = 0;

    employees.forEach(emp => {
      const isWorker = emp.employeeRole === "SHIFT_WORKER" || emp.employeeRole === "GENERAL_WORKER";
      if (isWorker) {
        totalWorkers++;
        if (busyWorkerMap.has(emp.id)) {
          busy++;
        } else {
          available++;
        }
      }
      if (emp.specialization === "ELECTRICAL") electrical++;
      if (emp.specialization === "MECHANICAL") mechanical++;
    });

    return { totalWorkers, totalAll: employees.length, available, busy, electrical, mechanical };
  }, [employees, busyWorkerMap]);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: "center", marginTop: "5rem" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading workforce directories and active task dispatches...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Title Area */}
      <div className="dashboard-title-area" style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 4px 0", fontSize: "1.5rem" }}>Workforce Registry</h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Monitor active technician assignments, specializations, and real-time availability.
        </p>
      </div>

      {/* Workforce Statistics Grid */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card stat-total">
          <div className="stat-card-icon">
            <Users size={16} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Active Personnel</span>
            <h3 className="stat-card-value">{metrics.totalAll}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid #10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <UserCheck size={16} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Available Staff</span>
            <h3 className="stat-card-value">{metrics.available}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid #f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <Wrench size={16} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Busy on Dispatch</span>
            <h3 className="stat-card-value">{metrics.busy}</h3>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid #aa3bff' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(170, 59, 255, 0.08)', color: '#aa3bff' }}>
            <Award size={16} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Electrical Spec.</span>
            <h3 className="stat-card-value">{metrics.electrical}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-search-container">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search technicians, spec, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <SlidersHorizontal size={14} style={{ color: "var(--text-secondary)" }} />
          
          {/* Availability Status Filter */}
          <select
            name="status"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filter by Availability"
          >
            <option value="ALL">All States</option>
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
          </select>

          {/* Role Filter */}
          <select
            name="role"
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            title="Filter by Role"
          >
            <option value="ALL">All Roles</option>
            <option value="SHIFT_WORKER">Shift Workers</option>
            <option value="GENERAL_WORKER">General Workers</option>
            <option value="HOD">HODs</option>
            <option value="HEAD">Heads</option>
          </select>
        </div>
      </div>

      {/* Workforce Card Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="worker-select-grid" style={{ marginBottom: "2rem" }}>
          {filteredEmployees.map(worker => {
            const isBusy = busyWorkerMap.has(worker.id);
            const task = busyWorkerMap.get(worker.id);
            const isWorker = worker.employeeRole === "SHIFT_WORKER" || worker.employeeRole === "GENERAL_WORKER";

            return (
              <div 
                key={worker.id}
                className="worker-select-card"
                style={{ cursor: 'default', minHeight: '160px' }}
              >
                <div className="worker-select-card-header">
                  <div className="user-avatar" style={{ margin: 0, width: '38px', height: '38px' }}>
                    {worker.username.slice(0, 2).toUpperCase()}
                  </div>
                  
                  {/* Availability Badge */}
                  {isWorker ? (
                    isBusy ? (
                      <span className="status-badge status-idle">
                        <span className="status-dot"></span>Busy
                      </span>
                    ) : (
                      <span className="status-badge status-running">
                        <span className="status-dot"></span>Available
                      </span>
                    )
                  ) : (
                    <span className="status-badge status-unknown">
                      Management
                    </span>
                  )}
                </div>

                <div className="worker-select-card-body" style={{ marginTop: '0.5rem', gap: '0.35rem' }}>
                  <h4 className="worker-name">{worker.username}</h4>
                  <span className="worker-role-tag" style={{ fontSize: '0.65rem' }}>
                    {worker.employeeRole?.replace('_', ' ')}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', marginTop: '0.25rem' }}>
                    <Shield size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="dept-tag" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                      {worker.department?.name || 'Unassigned'}
                    </span>
                  </div>

                  {worker.specialization && (
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <Award size={12} style={{ color: 'var(--text-muted)' }} />
                      <span className={`spec-badge ${worker.specialization.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                        {worker.specialization}
                      </span>
                    </div>
                  )}
                </div>

                {/* Active Task Footer Indicator */}
                {isWorker && (
                  <div style={{
                    marginTop: '0.85rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.725rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    {isBusy ? (
                      <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Wrench size={12} />
                        Assigned: <strong>{task.machineName}</strong>
                      </span>
                    ) : (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <UserCheck size={12} />
                        Ready for dispatch
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-data-cards" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
          <AlertTriangle size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
          <p>No workforce nodes match the current criteria.</p>
        </div>
      )}
    </div>
  );
}

export default WorkerDashboard;
