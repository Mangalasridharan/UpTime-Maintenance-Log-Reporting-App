import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Cpu, MessageSquare, Users, LogOut, Menu, X, User, LayoutDashboard,
  Bell, Trash2, CheckCheck, AlertTriangle, CheckCircle2, Info
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import api from "../api/axios";

const navItems = [
  { path: "/dashboard", label: "Machine Dashboard", icon: Cpu },
  { path: "/dashboard/complaints", label: "Complaint Dashboard", icon: MessageSquare },
  { path: "/dashboard/workers", label: "Worker Dashboard", icon: Users },
  { path: "/dashboard/profile", label: "Profile Details", icon: User },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sidebar State (mobile and hover triggers)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Global Machine Status Statistics State
  const [totalMachines, setTotalMachines] = useState(0);
  const [runningMachines, setRunningMachines] = useState(0);
  const [idleMachines, setIdleMachines] = useState(0);
  const [underMaintenanceMachines, setUnderMaintenanceMachines] = useState(0);
  const statisticsPrevData = useRef(null);

  // WebSocket and REST fetching for global statistics
  useEffect(() => {
    const socket = new SockJS("http://localhost:8000/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("DashboardLayout WS connected");
        client.subscribe("/topic/dashboard", (message) => {
          console.log("DashboardLayout WS message:", message.body);
          try {
            const data = JSON.parse(message.body);
            setTotalMachines(data.totalMachines || 0);
            setRunningMachines(data.runningMachines || 0);
            setIdleMachines(data.idleMachines || 0);
            setUnderMaintenanceMachines(data.underMaintenanceMachines || 0);
          } catch (e) {
            console.error("Error parsing WS statistics:", e);
          }
        });
      }
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await api.get("/v1/machines/dashboard");
        const data = response.data;
        if (JSON.stringify(statisticsPrevData.current) !== JSON.stringify(data)) {
          statisticsPrevData.current = data;
          setTotalMachines(data.totalMachines || 0);
          setRunningMachines(data.runningMachines || 0);
          setIdleMachines(data.idleMachines || 0);
          setUnderMaintenanceMachines(data.underMaintenanceMachines || 0);
        }
      } catch (err) {
        console.error("Failed to load global statistics in layout:", err);
      }
    };
    getStats();
  }, []);

  // Notifications State
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Critical Overheating Warning",
      message: "Machine 'Drill Press-04' temperature exceeded 85°C.",
      time: "5m ago",
      type: "critical",
      read: false,
    },
    {
      id: 2,
      title: "Maintenance Completed",
      message: "Scheduled lubrication complete for 'Conveyor-01'.",
      time: "20m ago",
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "Idle State Alert",
      message: "Machine 'Lathe-02' has been idle for over 45 minutes.",
      time: "1h ago",
      type: "info",
      read: true,
    },
    {
      id: 4,
      title: "New Complaint Filed",
      message: "Worker 'David Vance' filed a complaint for 'Hydraulic Press-01'.",
      time: "2h ago",
      type: "warning",
      read: true,
    }
  ]);

  const username = localStorage.getItem("username") || "Operator";
  const role = localStorage.getItem("role") || "Staff";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Derived Notification calculations
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDeleteNotif = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const isSidebarActive = sidebarOpen || sidebarHovered;

  const renderNotifIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertTriangle size={16} className="notif-type-icon critical" />;
      case "success":
        return <CheckCircle2 size={16} className="notif-type-icon success" />;
      case "warning":
        return <AlertTriangle size={16} className="notif-type-icon warning" />;
      case "info":
      default:
        return <Info size={16} className="notif-type-icon info" />;
    }
  };

  return (
    <div className="app-layout">
      {/* Invisible hover trigger zone on the left edge of the screen */}
      <div 
        className="sidebar-hover-trigger"
        onMouseEnter={() => setSidebarHovered(true)}
      />

      {/* Slide-out Sidebar (Reveals on hover near left edge or on hamburger toggle) */}
      <aside 
        className={`sidebar ${isSidebarActive ? "sidebar-open" : ""}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="sidebar-header">
          <LayoutDashboard size={22} />
          <span className="sidebar-brand">UpTime</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => { 
                  navigate(item.path); 
                  setSidebarOpen(false); 
                  setSidebarHovered(false); 
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div 
            className="sidebar-user" 
            onClick={() => {
              navigate("/dashboard/profile");
              setSidebarOpen(false);
              setSidebarHovered(false);
            }}
            style={{ cursor: "pointer" }}
            title="View Profile Details"
          >
            <div className="user-avatar">
              <User size={16} />
            </div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role">{role}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Dimmed Overlay for mobile sidebar lock */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Top Navbar & Main Content Area */}
      <div className="main-area">
        <header className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} title="Open Navigation Menu">
              <Menu size={20} />
            </button>
            
            <div className="navbar-brand-section">
              <span className="navbar-logo-icon">▲</span>
              <span className="navbar-brand-name">UpTime Console</span>
            </div>
          </div>

          {/* Compact Space-Saving Operational Health Widget inside the Navbar */}
          <div className="navbar-health-widget">
            <div className="navbar-health-bar">
              <div 
                className="health-segment running" 
                style={{ width: `${totalMachines > 0 ? (runningMachines / totalMachines) * 100 : 0}%` }}
                title={`Running: ${runningMachines}`}
              />
              <div 
                className="health-segment idle" 
                style={{ width: `${totalMachines > 0 ? (idleMachines / totalMachines) * 100 : 0}%` }}
                title={`Idle: ${idleMachines}`}
              />
              <div 
                className="health-segment maintenance" 
                style={{ width: `${totalMachines > 0 ? (underMaintenanceMachines / totalMachines) * 100 : 0}%` }}
                title={`Maintenance: ${underMaintenanceMachines}`}
              />
            </div>

            <div className="navbar-health-legend">
              <span className="legend-item" title="Running Machines">
                <span className="legend-dot running"></span>
                <span className="legend-count">{runningMachines}</span>
              </span>
              <span className="legend-item" title="Idle Standby">
                <span className="legend-dot idle"></span>
                <span className="legend-count">{idleMachines}</span>
              </span>
              <span className="legend-item" title="Under Maintenance">
                <span className="legend-dot maintenance"></span>
                <span className="legend-count">{underMaintenanceMachines}</span>
              </span>
              <span className="navbar-health-total">/ {totalMachines}</span>
            </div>
          </div>

          <div className="navbar-actions">
            <ThemeToggle />
            <button 
              className={`notif-toggle-btn ${unreadCount > 0 ? "has-unread" : ""}`} 
              onClick={() => setNotifOpen(true)}
              title={`${unreadCount} unread notifications`}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
          </div>
        </header>

        <div className="content-container">
          <Outlet />
        </div>
      </div>

      {/* Notifications Side Drawer Panel */}
      <div className={`notif-panel ${notifOpen ? "notif-panel-open" : ""}`}>
        <div className="notif-header">
          <div className="notif-title-section">
            <Bell size={16} />
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className="unread-pill">{unreadCount} new</span>}
          </div>
          <button className="notif-close-btn" onClick={() => setNotifOpen(false)} title="Close Panel">
            <X size={18} />
          </button>
        </div>

        <div className="notif-sub-actions">
          {notifications.length > 0 && (
            <>
              <button onClick={handleMarkAllRead} className="btn-notif-action text-btn">
                <CheckCheck size={14} /> Mark all read
              </button>
              <button onClick={handleClearAll} className="btn-notif-action text-btn text-danger">
                <Trash2 size={14} /> Clear all
              </button>
            </>
          )}
        </div>

        <div className="notif-body">
          {notifications.length === 0 ? (
            <div className="notif-empty-state">
              <CheckCircle2 size={40} className="empty-icon" />
              <h4>All caught up!</h4>
              <p>No new system events or machine alerts reported.</p>
            </div>
          ) : (
            <div className="notif-list">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notif-item ${notif.read ? "read" : "unread"}`}
                  onClick={() => handleToggleRead(notif.id)}
                >
                  <div className="notif-item-header">
                    <div className="notif-item-title-block">
                      {renderNotifIcon(notif.type)}
                      <span className="notif-item-title">{notif.title}</span>
                    </div>
                    <span className="notif-item-time">{notif.time}</span>
                  </div>
                  <p className="notif-item-desc">{notif.message}</p>
                  <div className="notif-item-actions">
                    <span className="notif-status-indicator">
                      {notif.read ? "Mark unread" : "Mark read"}
                    </span>
                    <button 
                      className="btn-delete-notif" 
                      onClick={(e) => handleDeleteNotif(notif.id, e)}
                      title="Dismiss notification"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dimmed Overlay for Notification Panel */}
      {notifOpen && <div className="sidebar-overlay" onClick={() => setNotifOpen(false)} />}
    </div>
  );
}

export default DashboardLayout;
