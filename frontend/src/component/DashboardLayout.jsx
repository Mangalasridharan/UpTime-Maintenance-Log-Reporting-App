import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Cpu, MessageSquare, Users, LogOut, Menu, X, User,
  Bell, Trash2, CheckCheck, AlertTriangle, CheckCircle2, Info,
  Maximize2, Minimize2, Search, Inbox, PanelLeftClose
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import api from "../api/axios";
import { API_BASE_URL, WS_BASE_URL } from "../config/api";
import uptimeLogo from "../assets/uptime.png";

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
  const [isHoverDisabled, setIsHoverDisabled] = useState(false);

  const handleMinimizeNavbar = (e) => {
    if (e) e.stopPropagation();
    setSidebarOpen(false);
    setSidebarHovered(false);
    setIsHoverDisabled(true);
  };

  const handleMouseLeaveSidebar = () => {
    setSidebarHovered(false);
    setIsHoverDisabled(false);
  };

  const handleMouseEnterSidebar = () => {
    if (!isHoverDisabled) {
      setSidebarHovered(true);
    }
  };

  // Global Machine Status Statistics State
  const [totalMachines, setTotalMachines] = useState(0);
  const [runningMachines, setRunningMachines] = useState(0);
  const [idleMachines, setIdleMachines] = useState(0);
  const [underMaintenanceMachines, setUnderMaintenanceMachines] = useState(0);
  const statisticsPrevData = useRef(null);

  // Notification Panel States (Preserved enlarged size + Fullscreen mode + Unread/Read Split)
  const [notifOpen, setNotifOpen] = useState(false);
  const [isNotifFullScreen, setIsNotifFullScreen] = useState(false);
  const [notifSearch, setNotifSearch] = useState("");

  const [notifications, setNotifications] = useState([]);

  // Browser-level push notifications (Notification API)
  const showBrowserPush = (notif) => {
    if (notif && notif.notificationType === "PUSH" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(notif.title || "UpTime", {
          body: notif.message || "",
          icon: "/favicon.ico",
        });
      }
    }
  };

  // Browsers only allow the permission prompt from a user gesture (e.g. a click).
  const requestPushPermission = () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handleBellClick = () => {
    setNotifOpen(true);
    requestPushPermission();
  };

  // WebSocket and REST fetching for global statistics & notifications
  useEffect(() => {
    const socket = new SockJS(WS_BASE_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("DashboardLayout WS connected");
        
        // Subscribe to machine statistics
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

        // Subscribe to real-time notification events from backend (/topic/notifications)
        client.subscribe("/topic/notifications", (message) => {
          console.log("DashboardLayout Notification WS received:", message.body);
          try {
            const data = JSON.parse(message.body);
            // Payload structure: { id, title, message, notificationType, recipientId, read, createdAt }

            const curId = String(
              localStorage.getItem("employeeId") ||
              localStorage.getItem("userId") ||
              localStorage.getItem("id") || ""
            );

            const recipientId = data.recipientId ? String(data.recipientId) : "";
            if (curId && recipientId && recipientId !== curId) return;

            let type = data.type || "info";
            if (!data.type) {
              const fullText = `${data.title || ''} ${data.message || ''}`.toLowerCase();
              if (fullText.includes("critical") || fullText.includes("overheating") || fullText.includes("error") || fullText.includes("fail") || fullText.includes("breakdown")) {
                type = "critical";
              } else if (fullText.includes("warning") || fullText.includes("alert") || fullText.includes("idle") || fullText.includes("complaint")) {
                type = "warning";
              } else if (fullText.includes("success") || fullText.includes("completed") || fullText.includes("resolved") || fullText.includes("fixed")) {
                type = "success";
              }
            }

            const newNotif = {
              id: data.id || Date.now() + Math.random(),
              title: data.title || "Notification",
              message: data.message || "",
              recipient: data.recipient || null,
              notificationType: data.notificationType || "IN_APP",
              time: data.createdAt
                ? new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: type,
              read: data.read || false,
            };

            setNotifications((prev) => [newNotif, ...prev]);
            showBrowserPush(newNotif);
          } catch (e) {
            console.error("Error parsing WS notification:", e);
          }
        });
      }
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  // SSE push notification stream (Server-Sent Events)
  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId") ||
                       localStorage.getItem("userId") ||
                       localStorage.getItem("id");
    if (!employeeId) return;

    const evtSource = new EventSource(`${API_BASE_URL}/v1/notifications/stream/${employeeId}`);

    evtSource.addEventListener("notification", (e) => {
      console.log("SSE push notification received:", e.data);
      try {
        const data = JSON.parse(e.data);
        showBrowserPush({
          title: data.title || "Push Notification",
          message: data.message || "",
          notificationType: "PUSH",
        });
      } catch (err) {
        console.error("Error parsing SSE push notification:", err);
      }
    });

    evtSource.onerror = () => {
      // EventSource reconnects automatically; log quietly.
      console.warn("SSE push stream disconnected, reconnecting...");
    };

    return () => evtSource.close();
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

  const username = localStorage.getItem("username") || "Operator";
  const role = localStorage.getItem("role") || "Staff";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Filtered notifications
  const filteredNotifs = notifications.filter(n => {
    if (!notifSearch) return true;
    const query = notifSearch.toLowerCase();
    return (
      (n.title && n.title.toLowerCase().includes(query)) ||
      (n.message && n.message.toLowerCase().includes(query))
    );
  });

  const unreadNotifications = filteredNotifs.filter(n => !n.read);
  const readNotifications = filteredNotifs.filter(n => n.read);
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

  const isSidebarActive = !isHoverDisabled && (sidebarOpen || sidebarHovered);

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

  const renderNotifCard = (notif) => (
    <div 
      key={notif.id} 
      className={`notif-item ${notif.read ? "read" : "unread"}`}
      onClick={() => handleToggleRead(notif.id)}
    >
      <div className="notif-item-header">
        <div className="notif-item-title-block">
          {renderNotifIcon(notif.type)}
          <span className="notif-item-title">{notif.title}</span>
          {notif.notificationType === "PUSH" && (
            <span className="notif-type-badge push">PUSH</span>
          )}
        </div>
        <span className="notif-item-time">{notif.time}</span>
      </div>
      <p className="notif-item-desc">{notif.message}</p>
      {notif.recipient && (
        <div className="notif-item-recipient">
          Recipient: {typeof notif.recipient === 'object'
            ? (notif.recipient.name || notif.recipient.username || notif.recipient.email || "Employee")
            : notif.recipient}
        </div>
      )}
      <div className="notif-item-actions">
        <span className="notif-status-indicator">
          {notif.read ? "Mark as unread" : "Mark as read"}
        </span>
        <button 
          className="btn-delete-notif" 
          onClick={(e) => handleDeleteNotif(notif.id, e)}
          title="Dismiss notification"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      {/* Invisible hover trigger zone on the left edge of the screen */}
      <div 
        className="sidebar-hover-trigger"
        onMouseEnter={() => {
          if (!isHoverDisabled) setSidebarHovered(true);
        }}
      />

      {/* Slide-out Sidebar (Restored original design) */}
      <aside 
        className={`sidebar ${isSidebarActive ? "sidebar-open" : ""}`}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand-group">
            <img src={uptimeLogo} alt="UpTime" className="sidebar-brand-logo" />
            <span className="sidebar-brand">UpTime</span>
          </div>
          <button 
            type="button"
            className="sidebar-minimize-btn" 
            onClick={handleMinimizeNavbar} 
            title="Minimise Navbar"
            aria-label="Minimise Navbar"
          >
            <PanelLeftClose size={18} />
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
                  handleMinimizeNavbar();
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
              handleMinimizeNavbar();
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
      {sidebarOpen && <div className="sidebar-overlay" onClick={handleMinimizeNavbar} />}

      {/* Top Navbar & Main Content Area (Restored original design) */}
      <div className="main-area">
        <header className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="hamburger-btn" 
              onClick={() => {
                setIsHoverDisabled(false);
                setSidebarOpen(true);
              }} 
              title="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            
            <div className="navbar-brand-section">
              <img src={uptimeLogo} alt="UpTime" className="navbar-brand-logo" />
              <span className="navbar-brand-name">UpTime Console</span>
            </div>
          </div>

          {/* Operational Health Widget inside Navbar */}
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
              onClick={handleBellClick}
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

      {/* Preserved Enlarged Notification Panel & Full Screen Toggle */}
      <div className={`notif-panel ${notifOpen ? "notif-panel-open" : ""} ${isNotifFullScreen ? "notif-panel-fullscreen" : ""}`}>
        <div className="notif-header">
          <div className="notif-title-section">
            <Bell size={18} />
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className="unread-pill">{unreadCount} Unread</span>}
          </div>

          <div className="notif-header-controls">
            <button 
              className="notif-fullscreen-btn" 
              onClick={() => setIsNotifFullScreen(!isNotifFullScreen)} 
              title={isNotifFullScreen ? "Exit Fullscreen" : "Maximize Panel to Fullscreen"}
            >
              {isNotifFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button 
              className="notif-close-btn" 
              onClick={() => { setNotifOpen(false); setIsNotifFullScreen(false); }} 
              title="Close Panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="notif-sub-actions">
          <div className="notif-search-wrapper">
            <Search size={14} className="notif-search-icon" />
            <input 
              type="text" 
              placeholder="Filter notifications..." 
              value={notifSearch}
              onChange={(e) => setNotifSearch(e.target.value)}
            />
          </div>

          {notifications.length > 0 && (
            <div className="notif-bulk-btns">
              <button onClick={handleMarkAllRead} className="btn-notif-action text-btn">
                <CheckCheck size={14} /> Mark all read
              </button>
              <button onClick={handleClearAll} className="btn-notif-action text-btn text-danger">
                <Trash2 size={14} /> Clear all
              </button>
            </div>
          )}
        </div>

        <div className="notif-body">
          {/* UPPER SECTION: UNREAD MESSAGES */}
          <div className="notif-section-group unread-group">
            <div className="notif-section-header unread-header">
              <div className="section-header-left">
                <span className="pulse-indicator-dot" />
                <h4>UNREAD MESSAGES</h4>
              </div>
              <span className="notif-badge-pill unread-badge">{unreadNotifications.length}</span>
            </div>

            {unreadNotifications.length === 0 ? (
              <div className="notif-section-empty">
                <CheckCircle2 size={22} className="empty-check-icon" />
                <span>All caught up! No unread notifications.</span>
              </div>
            ) : (
              <div className={`notif-list ${isNotifFullScreen ? 'fullscreen-grid' : ''}`}>
                {unreadNotifications.map(renderNotifCard)}
              </div>
            )}
          </div>

          <div className="notif-section-divider" />

          {/* LOWER SECTION: READ MESSAGES */}
          <div className="notif-section-group read-group">
            <div className="notif-section-header read-header">
              <div className="section-header-left">
                <Inbox size={15} className="read-section-icon" />
                <h4>READ MESSAGES</h4>
              </div>
              <span className="notif-badge-pill read-badge">{readNotifications.length}</span>
            </div>

            {readNotifications.length === 0 ? (
              <div className="notif-section-empty">
                <span>No read message history.</span>
              </div>
            ) : (
              <div className={`notif-list ${isNotifFullScreen ? 'fullscreen-grid' : ''}`}>
                {readNotifications.map(renderNotifCard)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dimmed Overlay for Normal Drawer Mode */}
      {notifOpen && !isNotifFullScreen && (
        <div className="sidebar-overlay" onClick={() => setNotifOpen(false)} />
      )}
    </div>
  );
}

export default DashboardLayout;
