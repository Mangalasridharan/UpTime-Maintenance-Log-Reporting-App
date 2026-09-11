import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, AlertCircle, X } from 'lucide-react';
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import api from "../api/axios";
import { WS_BASE_URL } from "../config/api";

function ComplaintDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const navigate = useNavigate();
  const previousComplaints = useRef([]);

  // WebSocket subscription
  useEffect(() => {
    const socket = new SockJS(WS_BASE_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to complaint dashboard");
        client.subscribe("/topic/complaints", (message) => {
          console.log("Received complaints:", message.body);
          try {
            const newComplaints = JSON.parse(message.body);
            previousComplaints.current = newComplaints;
            setComplaints(newComplaints);
            setLoading(false);
            console.log("Complaint list updated via WebSocket");
          } catch (e) {
            console.error("Error parsing complaint message:", e);
          }
        });
      }
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  // REST fallback for initial load
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/v1/complaint");
        const data = response.data || [];
        if (JSON.stringify(previousComplaints.current) !== JSON.stringify(data)) {
          previousComplaints.current = data;
          setComplaints(data);
          console.log("Complaint list updated from REST");
        }
      } catch (e) {
        console.warn("REST complaint fetch failed, relying on WebSocket:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Keep the selected complaint reference fresh when websocket updates the main complaints list
  useEffect(() => {
    if (selectedComplaint) {
      const updated = complaints.find(c => c.id === selectedComplaint.id);
      if (updated) {
        setSelectedComplaint(updated);
      }
    }
  }, [complaints]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (val) => {
    const map = {
      OPEN: { cls: "cs-open", label: "Open" },
      ASSIGNED: { cls: "cs-assigned", label: "Assigned" },
      IN_PROGRESS: { cls: "cs-inprogress", label: "In Progress" },
      COMPLETED: { cls: "cs-completed", label: "Completed" },
      VERIFIED: { cls: "cs-verified", label: "Verified" },
    };
    const entry = map[val] || { cls: "cs-unknown", label: val };
    return (
      <span className={`complaint-status-badge ${entry.cls}`}>
        {entry.label}
      </span>
    );
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const desc = c.description || "";
      const machine = c.machine?.name || "";
      const reporter = c.reportedBy?.username || "";
      const assignee = c.assignedTo?.username || "";
      const status = c.status || "";
      return desc.toLowerCase().includes(term)
        || machine.toLowerCase().includes(term)
        || reporter.toLowerCase().includes(term)
        || assignee.toLowerCase().includes(term)
        || status.toLowerCase().includes(term);
    });
  }, [complaints, searchTerm]);

  const columns = useMemo(() => [
    {
      accessorKey: 'machine.name',
      header: 'Machine',
      size: '16%',
      cell: info => <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{info.getValue() || "—"}</span>
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: '26%',
      cell: info => {
        const val = info.getValue() || "";
        return <span style={{ color: 'var(--text-secondary)' }}>{val.length > 60 ? val.slice(0, 60) + "…" : val}</span>;
      }
    },
    {
      accessorKey: 'reportedBy.username',
      header: 'Reported By',
      size: '13%',
      cell: info => <span className="dept-tag">{info.getValue() || "—"}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: '14%',
      cell: info => renderStatusBadge(info.getValue())
    },
    {
      accessorKey: 'reportedAt',
      header: 'Date Reported',
      size: '16%',
      cell: info => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatDate(info.getValue())}</span>
    },
    {
      id: 'assignedTo',
      header: 'Assigned To',
      size: '15%',
      cell: ({ row }) => {
        const emp = row.original.assignedTo;
        return emp?.username
          ? <span className="dept-tag">{emp.username}</span>
          : <span style={{ color: '#a1a1aa', fontStyle: 'italic' }}>Unassigned</span>;
      }
    }
  ], []);

  const table = useReactTable({
    data: filteredComplaints,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } }
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-title-area">
        <h1>Complaint Dashboard</h1>
        <p>Track and manage maintenance complaints and service requests.</p>
      </div>

      <div className="filter-bar">
        <div className="filter-search-container">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="complaints-table-container">
        <table className="complaints-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} style={{ width: header.column.columnDef.size }}>
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
                  Connecting to complaint telemetry...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id}
                  onClick={() => setSelectedComplaint(row.original)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view details"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ width: cell.column.columnDef.size }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data-row" style={{ padding: '3rem 1rem !important' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={24} style={{ color: '#a1a1aa' }} />
                    <span>No complaints match the current criteria.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredComplaints.length > 0 && (
        <div className="pagination-container">
          <span className="pagination-info">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} ({filteredComplaints.length} total)
          </span>
          <div className="pagination-actions">
            <button className="btn-pagination" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft size={14} /> Prev
            </button>
            <button className="btn-pagination" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Centered Modal Overlay for Complaint Details */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>Complaint Details</h3>
              <button className="btn-close" onClick={() => setSelectedComplaint(null)} aria-label="Close details">
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Machine Name</span>
                <span className="detail-value">{selectedComplaint.machine?.name || "—"}</span>
              </div>
              
              <div className="detail-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span className="detail-label">Nature of Description</span>
                <div style={{
                  width: '100%',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-muted)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}>
                  {selectedComplaint.description}
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Current Status</span>
                <span className="detail-value">
                  {renderStatusBadge(selectedComplaint.status)}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Reported By</span>
                <span className="detail-value">
                  {selectedComplaint.reportedBy?.username || "—"} <span className="text-dim">({selectedComplaint.reportedBy?.employeeRole?.replace('_', ' ')})</span>
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Date Reported</span>
                <span className="detail-value">{formatDate(selectedComplaint.reportedAt)}</span>
              </div>

              {selectedComplaint.assignedTo && (
                <div className="detail-row">
                  <span className="detail-label">Assigned Worker</span>
                  <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>{selectedComplaint.assignedTo.username}</strong>
                    {selectedComplaint.assignedTo.specialization && (
                      <span className={`spec-badge ${selectedComplaint.assignedTo.specialization.toLowerCase()}`}>
                        {selectedComplaint.assignedTo.specialization}
                      </span>
                    )}
                  </span>
                </div>
              )}

              <hr className="modal-divider" />

              {selectedComplaint.status === "OPEN" && (
                <button 
                  className="btn-assign-worker-trigger"
                  onClick={() => {
                    navigate(`/dashboard/complaints/${selectedComplaint.id}/assign`);
                    setSelectedComplaint(null);
                  }}
                >
                  Assign Worker
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintDashboard;
