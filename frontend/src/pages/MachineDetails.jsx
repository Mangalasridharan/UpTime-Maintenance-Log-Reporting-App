import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { 
  ArrowLeft, 
  X, 
  Upload, 
  CheckCircle2, 
  Circle, 
  Flag, 
  BarChart2, 
  Eye, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import api from "../api/axios";
import { API_BASE_URL } from "../config/api";
import "./dashboard.css";

const SLOTS = [
  { key: 'MORNING', label: 'Morning', time: '06:00 - 14:00' },
  { key: 'AFTERNOON', label: 'Afternoon', time: '14:00 - 22:00' },
  { key: 'EVENING', label: 'Evening', time: '22:00 - 06:00' },
];

function MachineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [machine, setMachine] = useState(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [logsBySlot, setLogsBySlot] = useState({});
  const [loading, setLoading] = useState(true);

  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingSlot, setUploadingSlot] = useState(null);

  // Photo preview modal state
  const [previewModal, setPreviewModal] = useState({ isOpen: false, url: null, title: '' });

  // Pagination state: strictly 10 maintenance records per page
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fileInputRef = useRef({});

  const today = new Date().toISOString().slice(0, 10);

  const resolvePhotoUrl = useCallback((photoPath) => {
    if (!photoPath) return null;
    const origin = new URL(API_BASE_URL).origin;
    return `${origin}${photoPath}`;
  }, []);

  const fetchMachine = useCallback(async () => {
    try {
      const historyRes = await api.get(`/v1/machines/${id}/history`);
      const history = historyRes.data || {};
      setMachine(history.machine || null);
      setMaintenanceLogs(history.maintenanceLogs || []);
    } catch (e) {
      console.error("Error fetching machine details:", e);
      setErrorMsg(e.response?.data?.message || "Failed to load machine details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchDailyLogs = useCallback(async () => {
    try {
      const res = await api.get(`/v1/machines/${id}/daily-logs?logDate=${today}`);
      const logs = res.data || [];
      const bySlot = {};
      logs.forEach(log => { bySlot[log.timeOfDay] = log; });
      setLogsBySlot(bySlot);
    } catch (e) {
      console.error("Error fetching daily logs:", e);
    }
  }, [id, today]);

  useEffect(() => {
    queueMicrotask(() => fetchMachine());
    queueMicrotask(() => fetchDailyLogs());
  }, [fetchMachine, fetchDailyLogs]);

  const resolveEmployeeId = async () => {
    let empId = localStorage.getItem("employeeId");
    if (empId) return Number(empId);

    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("username");
    const employeeRes = await api.get("/v1/employee");
    const allEmployees = employeeRes.data || [];
    const matched = allEmployees.find(
      emp => emp.email === storedEmail || emp.username === storedUsername
    );
    if (matched && matched.id) {
      localStorage.setItem("employeeId", matched.id);
      return matched.id;
    }
    return null;
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!machine) return;
    setErrorMsg("");
    setSubmitting(true);
    try {
      const employeeId = await resolveEmployeeId();
      if (!employeeId) {
        setErrorMsg("Could not identify the logged-in employee. Please re-login.");
        setSubmitting(false);
        return;
      }
      await api.post("/v1/complaint", {
        description: complaintText,
        machineId: machine.id,
        employeeId,
      });
      setMachine(prev => prev ? { ...prev, status: "IDLE" } : prev);
      setSuccessMsg("Complaint raised successfully for this machine.");
      setComplaintText("");
      setShowComplaintForm(false);
      fetchMachine();
      fetchDailyLogs();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setErrorMsg(err.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerFilePicker = (slot) => {
    fileInputRef.current[slot]?.click();
  };

  const handlePhotoSelected = async (slotKey, e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !machine) return;

    // Immediately show the selected photo in the preview modal window
    const previewUrl = URL.createObjectURL(file);
    const slotObj = SLOTS.find(s => s.key === slotKey);
    setPreviewModal({
      isOpen: true,
      url: previewUrl,
      title: `${slotObj?.label || slotKey} Shift Photo Inspection`
    });

    setUploadingSlot(slotKey);
    setErrorMsg("");
    try {
      const employeeId = await resolveEmployeeId();
      if (!employeeId) {
        setErrorMsg("Could not identify the logged-in employee. Please re-login.");
        setUploadingSlot(null);
        return;
      }
      const formData = new FormData();
      formData.append("employeeId", employeeId);
      formData.append("logDate", today);
      formData.append("timeOfDay", slotKey);
      formData.append("photo", file);

      await api.post(`/v1/machines/${machine.id}/daily-logs/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg(`Photo for ${slotObj?.label || slotKey} shift uploaded successfully.`);
      setTimeout(() => setSuccessMsg(""), 3500);
      await fetchDailyLogs();
    } catch (err) {
      console.error("Error uploading daily log:", err);
      setErrorMsg(err.response?.data?.message || "Failed to upload photo log.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const renderStatusBadge = (val) => {
    const map = {
      RUNNING: { cls: 'status-running', label: 'Running' },
      IDLE: { cls: 'status-idle', label: 'Idle' },
      UNDER_MAINTENANCE: { cls: 'status-maintenance', label: 'Maintenance' },
    };
    const entry = map[val] || { cls: 'status-unknown', label: val || 'Unknown' };
    return <span className={`status-badge ${entry.cls}`}>{entry.label}</span>;
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Deterministic live countdown calculation for machine running time
  const initialSeconds = useMemo(() => {
    const base = 6 * 3600 + 45 * 60; // 6h 45m base
    const offset = ((Number(id) || 1) * 317) % 3600;
    return base - offset;
  }, [id]);

  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    setSecondsRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (machine?.status !== 'RUNNING') return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [machine?.status]);

  const formatCountdown = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getWorkType = (m, logs) => {
    if (m?.workType) return m.workType;
    if (logs && logs.length > 0 && logs[0].workType) {
      return logs[0].workType;
    }
    return 'PREVENTIVE';
  };

  // TanStack Table columns for Maintenance Logs
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Log #',
      size: '10%',
      cell: info => <span className="monospaced-text">#ML-{info.getValue()}</span>
    },
    {
      accessorKey: 'workType',
      header: 'Work Type',
      size: '14%',
      cell: info => <span className="work-type-chip">{info.getValue() || 'PREVENTIVE'}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: '13%',
      cell: info => {
        const val = info.getValue() || 'PENDING';
        return <span className={`complaint-status-chip ${String(val).toLowerCase()}`}>{val}</span>;
      }
    },
    {
      accessorKey: 'reportedAt',
      header: 'Reported At',
      size: '18%',
      cell: info => <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{formatDate(info.getValue())}</span>
    },
    {
      accessorKey: 'downtimeHours',
      header: 'Downtime',
      size: '12%',
      cell: info => {
        const val = info.getValue();
        return val != null ? <span style={{ fontWeight: 600 }}>{val} hrs</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>;
      }
    },
    {
      accessorKey: 'assignedTo.username',
      header: 'Technician',
      size: '15%',
      cell: info => info.getValue() || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
    },
    {
      accessorKey: 'complaint.description',
      header: 'Reason / Scope',
      size: '18%',
      cell: info => {
        const desc = info.getValue();
        return (
          <span 
            title={desc || 'Routine Maintenance'}
            style={{ 
              display: 'inline-block', 
              maxWidth: '220px', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              color: 'var(--text-secondary)'
            }}
          >
            {desc || 'Routine Maintenance'}
          </span>
        );
      }
    }
  ], []);

  // Table instance with 10 records per page pagination
  const table = useReactTable({
    data: maintenanceLogs,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading && !machine) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading machine telemetry...</p>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Machine not found</h2>
        <button className="btn-back" onClick={() => navigate("/dashboard")}>Back to Machines</button>
      </div>
    );
  }

  return (
    <div className="machine-detail-container">
      {/* Header Bar: Back Button, Machine Title (no subtitle), View Analytics Button, and Red Raise Complaint Button */}
      <div className="machine-header-bar">
        <div className="machine-header-left">
          <button className="btn-back" onClick={() => navigate("/dashboard")} aria-label="Go back">
            <ArrowLeft size={16} />
          </button>
          <div className="dashboard-title-area" style={{ marginBottom: 0 }}>
            <h1 className="machine-header-title">{machine.name}</h1>
          </div>
        </div>

        <div className="machine-header-actions">
          <button 
            type="button" 
            className="btn-view-analytics"
          >
            <BarChart2 size={15} /> View Analytics
          </button>

          <button 
            type="button"
            className="btn-raise-complaint-danger" 
            onClick={() => setShowComplaintForm(true)}
          >
            <Flag size={14} /> Raise Complaint
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="complaint-success-message" style={{ marginBottom: '1rem' }}>
          <span>✓</span> {successMsg}
        </div>
      )}

      {/* Overview Grid: Daily Shift Inspection Checklist (Left) & Machine Telemetry Summary (Right) */}
      <div className="machine-overview-grid">
        {/* Left: Daily Shift Inspection Checklist */}
        <div className="daily-logs-checklist-card">
          <div className="checklist-header">
            <h3 className="checklist-title">Daily Shift Inspection</h3>
            <span className="checklist-header-date">{today}</span>
          </div>

          <div className="checklist-items">
            {SLOTS.map(slot => {
              const log = logsBySlot[slot.key];
              const done = Boolean(log?.photoPath);
              const isUploading = uploadingSlot === slot.key;
              const photoUrl = resolvePhotoUrl(log?.photoPath);

              return (
                <div key={slot.key} className={`checklist-row ${done ? 'is-done' : ''}`}>
                  <div className="checklist-row-left">
                    {done ? (
                      <CheckCircle2 size={20} className="checklist-icon done" />
                    ) : (
                      <Circle size={20} className="checklist-icon pending" />
                    )}
                    <div className="checklist-info">
                      <span className="checklist-slot-title">{slot.label} Shift</span>
                      <span className="checklist-slot-status">
                        {done ? "Photo verified & recorded" : `Pending inspection (${slot.time})`}
                      </span>
                    </div>
                  </div>

                  <div className="checklist-row-actions">
                    {done ? (
                      <>
                        <button
                          type="button"
                          className="btn-checklist-preview"
                          onClick={() => setPreviewModal({
                            isOpen: true,
                            url: photoUrl,
                            title: `${slot.label} Shift Photo — ${machine.name}`
                          })}
                        >
                          <Eye size={13} /> View Photo
                        </button>
                        <button
                          type="button"
                          className="btn-checklist-replace"
                          onClick={() => triggerFilePicker(slot.key)}
                          disabled={isUploading}
                          title="Replace photo"
                        >
                          <Upload size={12} /> {isUploading ? "Uploading..." : "Replace"}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn-checklist-upload"
                        onClick={() => triggerFilePicker(slot.key)}
                        disabled={isUploading}
                      >
                        <Upload size={13} /> {isUploading ? "Uploading..." : "Upload Photo"}
                      </button>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={(el) => { fileInputRef.current[slot.key] = el; }}
                      onChange={(e) => handlePhotoSelected(slot.key, e)}
                      disabled={isUploading}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Machine Summary Card with 5 fields */}
        <div className="machine-summary-card">
          <div className="machine-summary-card-header">
            <h3>Machine Telemetry</h3>
          </div>

          <div className="detail-row">
            <span className="detail-label">Current Status</span>
            <span className="detail-value">{renderStatusBadge(machine.status)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Department</span>
            <span className="detail-value">
              <span className="dept-tag">{machine.department?.name || 'Unassigned'}</span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Operator</span>
            <span className="detail-value">
              {machine.operator?.username || "Unassigned"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Running Time</span>
            <span className="detail-value">
              {machine.status === 'RUNNING' ? (
                <span className="live-countdown-badge">
                  <span className="countdown-pulse-dot" />
                  <span className="monospaced-text">{formatCountdown(secondsRemaining)}</span>
                </span>
              ) : machine.status === 'IDLE' ? (
                <span className="monospaced-text text-dim">00:00:00 (Idle)</span>
              ) : (
                <span className="monospaced-text text-dim">00:00:00 (Maintenance)</span>
              )}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Work Type</span>
            <span className="detail-value">
              <span className="work-type-chip">{getWorkType(machine, maintenanceLogs)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Maintenance Logs Table (Full Width, 10 records per page) */}
      <section className="table-section">
        <div className="table-section-header">
          <h2 className="table-section-title">Maintenance Records</h2>
        </div>

        <div className="complaints-table-container">
          <table className="complaints-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id}
                      style={{ width: header.column.columnDef.size }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id}
                        style={{ width: cell.column.columnDef.size }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="no-data-row" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No maintenance records found for this equipment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls - 10 records per page */}
        {maintenanceLogs.length > 0 && (
          <div className="pagination-container">
            <span className="pagination-info">
              Showing Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} ({maintenanceLogs.length} maintenance records total)
            </span>
            <div className="pagination-actions">
              <button
                className="btn-pagination"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                className="btn-pagination"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Photo Preview Modal Window */}
      {previewModal.isOpen && (
        <div className="modal-overlay" onClick={() => setPreviewModal({ isOpen: false, url: null, title: '' })}>
          <div className="preview-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{previewModal.title}</h3>
              </div>
              <button 
                className="btn-close" 
                onClick={() => setPreviewModal({ isOpen: false, url: null, title: '' })} 
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>
            <div className="preview-modal-body">
              <img 
                src={previewModal.url} 
                alt="Shift Inspection Log Preview" 
                className="preview-modal-image" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Raise complaint modal */}
      {showComplaintForm && (
        <div className="modal-overlay" onClick={() => setShowComplaintForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Raise Complaint — {machine.name}</h3>
              <button className="btn-close" onClick={() => setShowComplaintForm(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {errorMsg && <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>{errorMsg}</div>}
              <form onSubmit={handleComplaintSubmit} className="complaint-form">
                <label htmlFor="complaint-desc">COMPLAINT STATEMENT</label>
                <textarea
                  id="complaint-desc"
                  placeholder="Provide details about the malfunction or service request..."
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  required
                  disabled={submitting}
                />
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowComplaintForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-complaint" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MachineDetails;