import { useState, useEffect } from "react";

function TelemetryPanel() {
  const [time, setTime] = useState("");
  const [pulseActive, setPulseActive] = useState(true);
  const [stats, setStats] = useState({
    vibration: "1.04 mm/s",
    temp: "42.3 °C",
    load: "64.2%",
  });

  // Digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate changing minor stats for visual dynamism
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        vibration: (1.0 + Math.random() * 0.1).toFixed(2) + " mm/s",
        temp: (41.5 + Math.random() * 1.5).toFixed(1) + " °C",
        load: (60 + Math.random() * 10).toFixed(1) + "%",
      });
      setPulseActive((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="auth-telemetry">
      {/* Decorative Corner Crosshairs */}
      <div className="cad-corner top-left">+</div>
      <div className="cad-corner top-right">+</div>
      <div className="cad-corner bottom-left">+</div>
      <div className="cad-corner bottom-right">+</div>

      {/* Grid Header */}
      <div className="telemetry-header">
        <div className="telemetry-title-block">
          <span className="telemetry-tag">[ CONSOLE_INIT ]</span>
          <h2>UPTIME SYSTEM</h2>
        </div>
        <div className="system-status-indicator">
          <span className="pulse-dot"></span>
          <span className="status-label">SYS_ONLINE</span>
        </div>
      </div>

      <div className="telemetry-divider"></div>

      {/* Concentric SVG Mechanical Rings */}
      <div className="telemetry-visual-container">
        <svg viewBox="0 0 200 200" className="telemetry-rings">
          {/* Static Outermost grid */}
          <circle cx="100" cy="100" r="95" className="ring-grid" />
          
          {/* Slow Outer Ring */}
          <circle
            cx="100"
            cy="100"
            r="85"
            className="ring-outer"
            strokeDasharray="400 100 50 50"
          />

          {/* Fast Inner Ring */}
          <circle
            cx="100"
            cy="100"
            r="70"
            className="ring-inner"
            strokeDasharray="180 60 40 40"
          />

          {/* Center Target */}
          <circle cx="100" cy="100" r="45" className="ring-center" />
          <circle cx="100" cy="100" r="5" className="ring-core" />
          
          {/* Tickmarks */}
          <line x1="100" y1="5" x2="100" y2="15" className="ring-tick" />
          <line x1="100" y1="185" x2="100" y2="195" className="ring-tick" />
          <line x1="5" y1="100" x2="15" y2="100" className="ring-tick" />
          <line x1="185" y1="100" x2="195" y2="100" className="ring-tick" />
        </svg>

        <div className="telemetry-overlay-data">
          <span className="overlay-clock">{time || "00:00:00"}</span>
          <span className="overlay-subtext">UTC // FR-01</span>
        </div>
      </div>

      {/* Animated Oscilloscope / Plant Signal */}
      <div className="oscilloscope-container">
        <div className="oscilloscope-header">
          <span className="monospaced-tag">VIB.MONITOR // REALTIME</span>
          <span className="vibration-value">{stats.vibration}</span>
        </div>
        <div className="oscilloscope-screen">
          <svg viewBox="0 0 300 40" className="oscilloscope-svg">
            <path
              d="M0,20 Q15,20 30,20 T60,20 T90,20 T120,5 T130,35 T140,0 T150,40 T160,15 T170,20 T200,20 T230,20 T260,20 T300,20"
              className="oscilloscope-wave"
            />
            {/* Background Grid */}
            <line x1="0" y1="20" x2="300" y2="20" className="grid-line-h" />
            <line x1="75" y1="0" x2="75" y2="40" className="grid-line-v" />
            <line x1="150" y1="0" x2="150" y2="40" className="grid-line-v" />
            <line x1="225" y1="0" x2="225" y2="40" className="grid-line-v" />
          </svg>
        </div>
      </div>

      {/* Grid of System Telemetry */}
      <div className="telemetry-grid">
        <div className="telemetry-card">
          <div className="card-label">CORE TEMPERATURE</div>
          <div className="card-value monospaced">{stats.temp}</div>
          <div className="card-footer">THERMAL_SENS_04: OK</div>
        </div>
        <div className="telemetry-card">
          <div className="card-label">CPU WORKLOAD</div>
          <div className="card-value monospaced">{stats.load}</div>
          <div className="card-footer">MEM_ALLOC: 4.2GB</div>
        </div>
      </div>

      {/* Scrolling Diagnostic Log Messages */}
      <div className="telemetry-logs-wrapper">
        <div className="logs-header">
          <span className="monospaced-tag">DIAGNOSTIC LOGS</span>
          <span className="log-badge-active">POLLING</span>
        </div>
        <div className="telemetry-log-lines monospaced">
          <div className="log-line">
            <span className="log-time">[00:01]</span>
            <span className="log-status ok">[ OK ]</span>
            <span className="log-text">TCP ESTABLISHED // PORT :5000</span>
          </div>
          <div className="log-line">
            <span className="log-time">[00:02]</span>
            <span className="log-status ok">[ OK ]</span>
            <span className="log-text">API SHIELD CONTROLLER ACTIVE</span>
          </div>
          <div className="log-line">
            <span className="log-time">[00:03]</span>
            <span className="log-status warn">[ WARN ]</span>
            <span className="log-text">UNAUTH ENDPOINT ACCESS ATTEMPT</span>
          </div>
          <div className="log-line pulsing">
            <span className="log-time">[00:04]</span>
            <span className="log-status info">[ WAIT ]</span>
            <span className="log-text">AWAITING SYSTEM ACCESS KEY ENTRY...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelemetryPanel;
