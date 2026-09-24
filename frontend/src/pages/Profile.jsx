import { useEffect, useState } from 'react';
import { User, Mail, Shield, Building, Award, Calendar, CheckSquare, Clock } from 'lucide-react';
import api from '../api/axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    activeTasks: 0,
    resolvedTasks: 0,
    departmentMachinesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setLoading(true);
        const storedEmail = localStorage.getItem("email");
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        // Fetch all employees and complaints
        const [employeeRes, complaintRes, machineRes] = await Promise.all([
          api.get("/v1/employee"),
          api.get("/v1/complaint"),
          api.get("/v1/machines"),
        ]);

        const allEmployees = employeeRes.data || [];
        const allComplaints = complaintRes.data || [];
        const allMachines = machineRes.data || [];

        // Try to match the employee record by email or username
        let matchedEmployee = allEmployees.find(
          emp => emp.email === storedEmail || emp.username === storedUsername
        );

        if (!matchedEmployee) {
          // Fallback structure if employee is not found in database registry
          matchedEmployee = {
            id: "N/A",
            username: storedUsername || "Operator",
            email: storedEmail || "name@company.com",
            employeeRole: storedRole || "STAFF",
            department: { name: "Unassigned" },
            specialization: null,
            createdAt: new Date().toISOString(),
          };
        }

        setProfile(matchedEmployee);

        // Calculate stats for this employee
        const employeeComplaints = allComplaints.filter(
          c => c.assignedTo?.id === matchedEmployee.id
        );

        const active = employeeComplaints.filter(
          c => c.status === "ASSIGNED" || c.status === "IN_PROGRESS"
        ).length;

        const resolved = employeeComplaints.filter(
          c => c.status === "COMPLETED" || c.status === "VERIFIED"
        ).length;

        // Calculate count of machines in this employee's department
        const deptId = matchedEmployee.department?.id;
        const deptMachines = deptId
          ? allMachines.filter(m => m.department?.id === deptId).length
          : 0;

        setStats({
          activeTasks: active,
          resolvedTasks: resolved,
          departmentMachinesCount: deptMachines,
        });

      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Establishing connection to secure profile registry...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="dashboard-title-area" style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Profile Details</h1>
      </div>

      {profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Header Card */}
          <div className="profile-header-card">
            <div className="profile-avatar-large">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="profile-header-info">
              <h2>{profile.username}</h2>
              <span className="profile-badge-role">
                {profile.employeeRole?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="profile-stats-grid">
            <div className="profile-stat-item">
              <div className="stat-icon-wrapper active">
                <Clock size={18} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Active Dispatches</span>
                <span className="stat-num">{stats.activeTasks}</span>
              </div>
            </div>
            <div className="profile-stat-item">
              <div className="stat-icon-wrapper resolved">
                <CheckSquare size={18} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Resolved Tickets</span>
                <span className="stat-num">{stats.resolvedTasks}</span>
              </div>
            </div>
            <div className="profile-stat-item">
              <div className="stat-icon-wrapper machines">
                <Building size={18} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Dept. Machines</span>
                <span className="stat-num">{stats.departmentMachinesCount}</span>
              </div>
            </div>
          </div>

          {/* Registry Details Card */}
          <div className="profile-details-card">
            <h3>Registry Node Details</h3>
            
            <div className="profile-detail-row">
              <div className="profile-detail-label">
                <User size={16} />
                <span>Operator Username</span>
              </div>
              <div className="profile-detail-value">{profile.username}</div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-label">
                <Mail size={16} />
                <span>Email Address</span>
              </div>
              <div className="profile-detail-value">{profile.email}</div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-label">
                <Shield size={16} />
                <span>Security Clearance</span>
              </div>
              <div className="profile-detail-value">{profile.employeeRole?.replace('_', ' ')}</div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-label">
                <Building size={16} />
                <span>Production Department</span>
              </div>
              <div className="profile-detail-value">
                <span className="dept-tag">{profile.department?.name || 'Unassigned'}</span>
              </div>
            </div>

            {profile.specialization && (
              <div className="profile-detail-row">
                <div className="profile-detail-label">
                  <Award size={16} />
                  <span>Technical Specialization</span>
                </div>
                <div className="profile-detail-value">
                  <span className={`spec-badge ${profile.specialization.toLowerCase()}`}>
                    {profile.specialization}
                  </span>
                </div>
              </div>
            )}

            <div className="profile-detail-row">
              <div className="profile-detail-label">
                <Calendar size={16} />
                <span>Node Registration Date</span>
              </div>
              <div className="profile-detail-value">{formatDate(profile.createdAt)}</div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-label">
                <Clock size={16} />
                <span>System Database Node ID</span>
              </div>
              <div className="profile-detail-value monospaced-text">#{profile.id}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
