import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import api from "../api/axios";

function AssignWorker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all complaints and all employees in parallel
        const [complaintRes, employeeRes] = await Promise.all([
          api.get("/v1/complaint"),
          api.get("/v1/employee")
        ]);

        const complaints = complaintRes.data || [];
        const activeComplaint = complaints.find(c => String(c.id) === String(id));
        
        if (!activeComplaint) {
          console.warn("Complaint not found");
          navigate("/dashboard/complaints");
          return;
        }
        
        if (activeComplaint.status !== "OPEN") {
          console.warn("Complaint is already assigned or resolved");
          navigate("/dashboard/complaints");
          return;
        }

        setComplaint(activeComplaint);

        const allEmployees = employeeRes.data || [];

        // Determine who is busy (currently assigned to OPEN, ASSIGNED, or IN_PROGRESS complaints)
        const busyWorkerIds = new Set(
          complaints
            .filter(c => c.status === "ASSIGNED" || c.status === "IN_PROGRESS")
            .map(c => c.assignedTo?.id)
            .filter(Boolean)
        );

        // Filter for available SHIFT_WORKER and GENERAL_WORKER
        const freeWorkers = allEmployees.filter(emp => {
          const isWorker = emp.employeeRole === "SHIFT_WORKER" || emp.employeeRole === "GENERAL_WORKER";
          const isFree = !busyWorkerIds.has(emp.id);
          return isWorker && isFree;
        });

        setWorkers(freeWorkers);
      } catch (e) {
        console.error("Error loading assignment screen data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleConfirm = async () => {
    if (!selectedWorkerId || !complaint) return;
    try {
      setSubmitting(true);
      await api.patch(`/v1/complaint/${complaint.id}/assign?id=${selectedWorkerId}`);
      navigate("/dashboard/complaints");
    } catch (e) {
      console.error("Failed to assign worker:", e);
      alert("Error confirming worker assignment: " + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="assign-worker-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading free workforce telemetry...</p>
      </div>
    );
  }

  return (
    <div className="assign-worker-container">
      <div className="assign-header-bar">
        <button className="btn-back" onClick={() => navigate("/dashboard/complaints")} aria-label="Go back">
          <ArrowLeft size={16} />
        </button>
        <div className="dashboard-title-area" style={{ marginBottom: 0 }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Assign Technician Dispatch</h1>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Select a qualified technician to assign to the active complaint.</p>
        </div>
      </div>

      {complaint && (
        <div className="assign-complaint-summary">
          <h3>MALFUNCTION DESCRIPTION</h3>
          <p><strong>Machine:</strong> {complaint.machine?.name || "—"}</p>
          <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
            {complaint.description}
          </p>
        </div>
      )}

      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Available Technical Staff ({workers.length})
      </h2>

      {workers.length > 0 ? (
        <div className="worker-select-grid">
          {workers.map(worker => {
            const isSelected = selectedWorkerId === worker.id;
            return (
              <div 
                key={worker.id}
                className={`worker-select-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedWorkerId(worker.id)}
              >
                <div className="worker-select-card-header">
                  <div className="user-avatar" style={{ margin: 0, width: '36px', height: '36px' }}>
                    {worker.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className={`selection-checkmark ${isSelected ? 'selected' : ''}`}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
                
                <div className="worker-select-card-body">
                  <h4 className="worker-name">{worker.username}</h4>
                  <span className="worker-role-tag">{worker.employeeRole?.replace('_', ' ')}</span>
                  {worker.specialization && (
                    <span className={`spec-badge ${worker.specialization.toLowerCase()}`}>
                      {worker.specialization}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-workers-warning" style={{ margin: '2rem 0', padding: '2rem', fontSize: '0.9rem' }}>
          No free technicians are currently available in the directory. Please resolve active tickets to release personnel.
        </div>
      )}

      {/* Sticky footer for confirming assignment */}
      <div className="confirm-assignment-footer">
        <button 
          className="btn-confirm-assignment"
          onClick={handleConfirm}
          disabled={!selectedWorkerId || submitting}
        >
          {submitting ? "Confirming Assignment..." : "Confirm Assignment"}
        </button>
      </div>
    </div>
  );
}

export default AssignWorker;
