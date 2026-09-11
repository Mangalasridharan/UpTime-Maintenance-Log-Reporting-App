import { useEffect, useState, useMemo, useRef } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  flexRender 
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';
import api from "../api/axios";
import SockJS from "sockjs-client/dist/sockjs";
import {Client} from "@stomp/stompjs";
import { WS_BASE_URL } from "../config/api";

function Machines() {
  const [machines, setMachines] = useState([]);
  const [machineStatus, setMachineStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("machines_view_mode") || "table");

  // Controlled pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: localStorage.getItem("machines_view_mode") === "card" ? 9 : 6,
  });

  // Modal / Detail States
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isComplaintFormOpen, setIsComplaintFormOpen] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const previousMachines = useRef([]);

  // WebSocket subscription for real-time machine list updates
  useEffect(() => {
    const socket = new SockJS(WS_BASE_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected");
        client.subscribe("/topic/machinelist", (message) => {
          console.log("Received WebSocket message:", message.body);
          try {
            const newMachines = JSON.parse(message.body);
            previousMachines.current = newMachines;
            setMachines(newMachines);
            setLoading(false);
            console.log("Machine list updated via WebSocket");
          } catch (e) {
            console.error("Error parsing machine list message:", e);
          }
        });
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  // Initial REST API fetch (fallback / initial load)
  useEffect(() => {
    const getMachineListResponse = async () => {
      try {
        setLoading(true);
        const response = await api.get("/v1/machines");
        const newMachines = response.data || [];
        if (
          JSON.stringify(previousMachines.current) !==
          JSON.stringify(newMachines)
        ) {
          previousMachines.current = newMachines;
          setMachines(newMachines);
          console.log("Machine list updated from REST");
        } else {
          console.log("No machine changes");
        }
      } catch (e) {
        console.error("Error fetching machines list:", e);
      } finally {
        setLoading(false);
      }
    };

    getMachineListResponse();
  }, []);

  // Sync selectedMachine state whenever machines array is updated via WS or REST
  useEffect(() => {
    if (selectedMachine) {
      const updated = machines.find(m => m.id === selectedMachine.id);
      if (updated) {
        setSelectedMachine(updated);
      }
    }
  }, [machines]);

  // Filter logic combining search and status select
  const filteredMachines = useMemo(() => {
    return machines.filter(machine => {
      const matchesStatus = machineStatus === "ALL" || machine.status === machineStatus;
      
      const name = machine.name || "";
      const deptName = machine.department?.name || "";
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deptName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [machines, machineStatus, searchTerm]);

  // Helper to render consistent status badges with dynamic animation highlights
  const renderStatusBadge = (val) => {
    let className = 'status-badge ';
    let label = '';
    let indicator = null;
    
    if (val === 'RUNNING') {
      className += 'status-running';
      label = 'Running';
      indicator = (
        <span className="status-animation-container running-anim" aria-hidden="true">
          <span className="anim-bar"></span>
          <span className="anim-bar"></span>
          <span className="anim-bar"></span>
        </span>
      );
    } else if (val === 'IDLE') {
      className += 'status-idle';
      label = 'Idle';
      indicator = (
        <span className="status-animation-container idle-anim" aria-hidden="true">
          <span className="anim-dot"></span>
          <span className="anim-dot"></span>
          <span className="anim-dot"></span>
        </span>
      );
    } else if (val === 'UNDER_MAINTENANCE') {
      className += 'status-maintenance';
      label = 'Maintenance';
      indicator = (
        <span className="status-animation-container maintenance-anim" aria-hidden="true">
          <span className="anim-circle"></span>
        </span>
      );
    } else {
      className += 'status-unknown';
      label = val;
      indicator = <span className="status-dot"></span>;
    }

    return (
      <span className={className}>
        {indicator}
        {label}
      </span>
    );
  };

  // TanStack Table Column definitions
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Equipment Name',
      size: '50%',
      cell: info => <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{info.getValue()}</span>
    },
    {
      accessorKey: 'status',
      header: 'Operational Status',
      size: '25%',
      cell: info => renderStatusBadge(info.getValue())
    },
    {
      accessorKey: 'department.name',
      header: 'Production Department',
      size: '25%',
      cell: info => <span className="dept-tag">{info.getValue() || 'Unassigned'}</span>
    }
  ], []);

  // Table instance configuration
  const table = useReactTable({
    data: filteredMachines,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("machines_view_mode", mode);
    setPagination(prev => ({
      ...prev,
      pageIndex: 0, // Reset to first page when changing view
      pageSize: mode === "card" ? 9 : 6,
    }));
  };

  const closeModal = () => {
    setSelectedMachine(null);
    setIsComplaintFormOpen(false);
    setComplaintText("");
    setIsSuccess(false);
    setErrorMsg("");
    setSubmitting(false);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMachine) return;
    setErrorMsg("");
    setSubmitting(true);

    try {
      let empId = localStorage.getItem("employeeId");

      if (!empId) {
        const storedEmail = localStorage.getItem("email");
        const storedUsername = localStorage.getItem("username");
        const employeeRes = await api.get("/v1/employee");
        const allEmployees = employeeRes.data || [];
        const matched = allEmployees.find(
          emp => emp.email === storedEmail || emp.username === storedUsername
        );
        if (matched && matched.id) {
          empId = matched.id;
          localStorage.setItem("employeeId", matched.id);
        }
      }

      await api.post("/v1/complaint", {
        description: complaintText,
        machineId: selectedMachine.id,
        employeeId: empId ? Number(empId) : null,
      });

      setSelectedMachine(prev => prev ? { ...prev, status: "IDLE" } : prev);
      setIsSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to submit complaint. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="table-section-header">
        <h2 className="table-section-title">Equipment Machine Registry</h2>
        <p className="table-section-desc">Manage, search, and monitor department-wide telemetry and machine configurations.</p>
      </div>

      {/* Modern Filter bar */}
      <div className="filter-bar">
        <div className="filter-search-container">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search machines or depts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <SlidersHorizontal size={14} style={{ color: 'var(--text-secondary)' }} />
          <select 
            name="status" 
            className="filter-select"
            value={machineStatus} 
            onChange={(e) => setMachineStatus(e.target.value)}
          >
            <option value="ALL">All States</option>
            <option value="RUNNING">Running</option>
            <option value="IDLE">Idle</option>
            <option value="UNDER_MAINTENANCE">Maintenance</option>
          </select>

          <div className="view-toggle-group">
            <button 
              type="button" 
              className={`btn-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('table')}
              aria-label="Table View"
              title="Table View"
            >
              <List size={16} />
            </button>
            <button 
              type="button" 
              className={`btn-view-toggle ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('card')}
              aria-label="Card View"
              title="Card View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Look: Table View vs Card View */}
      {viewMode === "table" ? (
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
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="loading-row">
                    Connecting to machine telemetry registry...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedMachine(row.original)}
                    style={{ cursor: 'pointer' }}
                    title="Open Machine Details"
                  >
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
                  <td colSpan={columns.length} className="no-data-row">
                    No active equipment machines match the current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="machines-grid">
          {loading ? (
            <div className="loading-cards">
              Connecting to machine telemetry registry...
            </div>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => {
              const machine = row.original;
              return (
                <div 
                  key={row.id}
                  className="machine-card" 
                  onClick={() => setSelectedMachine(machine)}
                  title="Open Machine Details"
                >
                  <div className="machine-card-header">
                    <h4 className="machine-card-name">{machine.name}</h4>
                    {renderStatusBadge(machine.status)}
                  </div>
                  
                  <div className="machine-card-body">
                    <div className="machine-card-field">
                      <span className="field-label">Department</span>
                      <span className="dept-tag">{machine.department?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                  
                  <div className="machine-card-footer">
                    <span className="click-details-hint">Click for details →</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-data-cards">
              No active equipment machines match the current criteria.
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredMachines.length > 0 && (
        <div className="pagination-container">
          <span className="pagination-info">
            Showing Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} ({filteredMachines.length} machines total)
          </span>
          <div className="pagination-actions">
            <button
              className="btn-pagination"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              className="btn-pagination"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Machine Details & Complaint Pop-up Modal */}
      {selectedMachine && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Machine Telemetry Details</h3>
              <button className="btn-close" onClick={closeModal} aria-label="Close details">
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Machine Name</span>
                <span className="detail-value">{selectedMachine.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Status</span>
                <span className="detail-value">
                  {renderStatusBadge(selectedMachine.status)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department</span>
                <span className="detail-value">
                  <span className="dept-tag">
                    {selectedMachine.department?.name || 'Unassigned'}
                  </span>
                </span>
              </div>

              <hr className="modal-divider" />

              {isSuccess ? (
                <div className="complaint-success-message">
                  <span>✓</span> Complaint raised successfully for this machine.
                </div>
              ) : isComplaintFormOpen ? (
                <form onSubmit={handleComplaintSubmit} className="complaint-form">
                  {errorMsg && <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>{errorMsg}</div>}
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
                      onClick={() => setIsComplaintFormOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit-complaint" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Complaint"}
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  className="btn-raise-complaint" 
                  onClick={() => setIsComplaintFormOpen(true)}
                >
                  Raise Complaint
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Machines;