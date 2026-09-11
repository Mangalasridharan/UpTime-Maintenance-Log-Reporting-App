import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  Wrench,
  HardHat,
  Award,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Activity,
  Layers,
  Clock
} from "lucide-react";
import ThemeToggle from "../component/ThemeToggle";
import "./demo.css";

export default function DemoPage() {
  const navigate = useNavigate();

  const handleLaunchDemo = (role = "HOD", email = "demo.hod@uptime.com") => {
    // Store demo persona choice for convenient prefill on login
    sessionStorage.setItem("demoRole", role);
    sessionStorage.setItem("demoEmail", email);
    navigate(`/login?demo=true&role=${role}`);
  };

  return (
    <div className="demo-page-root">
      {/* Header */}
      <header className="demo-header">
        <div className="demo-header-inner">
          <Link to="/" className="demo-brand">
            <div className="brand-icon-box">
              <Cpu size={22} className="brand-logo-icon" />
            </div>
            <div className="brand-text-group">
              <span className="brand-name">UPTIME</span>
              <span className="brand-tag">DEMO SANDBOX</span>
            </div>
          </Link>

          <div className="demo-header-actions">
            <Link to="/" className="btn-back-home">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Demo Content */}
      <main className="demo-main">
        <div className="demo-container">
          {/* Hero Banner */}
          <div className="demo-hero">
            <div className="demo-badge">
              <Sparkles size={15} />
              <span>Interactive Plant Environment</span>
            </div>
            <h1 className="demo-title">
              Experience Uptime in Action
            </h1>
            <p className="demo-subtitle">
              Test drive the platform with simulated factory telemetry, active breakdown complaints,
              and intelligent technician dispatch. Select an operational role or launch the demo console below.
            </p>

            <div className="demo-quick-action">
              <button
                onClick={() => handleLaunchDemo("HOD", "demo.hod@uptime.com")}
                className="btn-launch-primary"
              >
                <span>Launch Demo Console (Go to Login)</span>
                <ArrowRight size={18} />
              </button>
              <span className="demo-quick-hint">
                Instant access · Pre-populated with 48 factory machines & live telemetry
              </span>
            </div>
          </div>

          {/* Role Persona Selection */}
          <div className="demo-personas-section">
            <div className="personas-header">
              <h3>Choose a Persona to Explore</h3>
              <p>Each role gives you a tailored view of the factory maintenance workflow.</p>
            </div>

            <div className="personas-grid">
              {/* Persona 1: Maintenance Head */}
              <div className="persona-card">
                <div className="persona-top">
                  <div className="persona-icon-box head">
                    <Award size={24} />
                  </div>
                  <span className="persona-tag">Plant Governance</span>
                </div>
                <h4 className="persona-title">Maintenance Head</h4>
                <p className="persona-desc">
                  Oversee all 12 factory departments. Monitor overall plant availability, equipment downtime rankings, and global technician workload.
                </p>
                <div className="persona-features">
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Cross-department telemetry stream</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Critical breakdown escalation matrix</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Monthly MTTR & reliability benchmarks</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchDemo("HEAD", "head@uptime.com")}
                  className="btn-try-persona"
                >
                  <span>Try Demo as Maintenance Head</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Persona 2: Department HOD */}
              <div className="persona-card featured">
                <div className="featured-ribbon">Recommended</div>
                <div className="persona-top">
                  <div className="persona-icon-box hod">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="persona-tag">Operations Lead</span>
                </div>
                <h4 className="persona-title">Department HOD</h4>
                <p className="persona-desc">
                  Manage department-level machinery and work orders. Utilize smart worker recommendations and verify repairs before machines resume operation.
                </p>
                <div className="persona-features">
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Smart technician assignment engine</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Digital repair verification sign-off</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Routine shift reading oversight</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchDemo("HOD", "hod@uptime.com")}
                  className="btn-try-persona primary"
                >
                  <span>Try Demo as Department HOD</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Persona 3: Maintenance Worker */}
              <div className="persona-card">
                <div className="persona-top">
                  <div className="persona-icon-box worker">
                    <Wrench size={24} />
                  </div>
                  <span className="persona-tag">Field Specialist</span>
                </div>
                <h4 className="persona-title">Maintenance Worker</h4>
                <p className="persona-desc">
                  Receive assigned repair tasks on your mobile or terminal. Log parts used, update repair progress, and view your monthly performance grade.
                </p>
                <div className="persona-features">
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Real-time assigned work queue</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Machine breakdown history lookup</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Tier scoring & attendance metrics</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchDemo("SHIFT_WORKER", "worker@uptime.com")}
                  className="btn-try-persona"
                >
                  <span>Try Demo as Maintenance Worker</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Persona 4: Machine Operator */}
              <div className="persona-card">
                <div className="persona-top">
                  <div className="persona-icon-box operator">
                    <HardHat size={24} />
                  </div>
                  <span className="persona-tag">Shop Floor</span>
                </div>
                <h4 className="persona-title">Machine Operator</h4>
                <p className="persona-desc">
                  Track assigned production equipment. Submit morning, afternoon, and evening routine meter photos and raise instant breakdown complaints.
                </p>
                <div className="persona-features">
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Shift reading slot photo upload</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Rapid anomaly & breakdown ticket</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Live machine running/idle status</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchDemo("OPERATOR", "operator@uptime.com")}
                  className="btn-try-persona"
                >
                  <span>Try Demo as Machine Operator</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sandbox Info Callout */}
          <div className="demo-info-card">
            <div className="info-icon-wrapper">
              <Activity size={28} className="text-emerald" />
            </div>
            <div className="info-text">
              <h4>Interactive Factory Simulation</h4>
              <p>
                The Uptime demo environment is pre-configured with real-world textile and industrial machinery
                across 12 departments (Boiler, CBR, CDR, CPB, CWR, Fabric Batching, Finishing, Softflow, etc.).
                Clicking any demo action will guide you to the login screen where you can proceed directly into the dashboard.
              </p>
            </div>
            <div className="info-action">
              <button
                onClick={() => handleLaunchDemo("HOD", "demo.hod@uptime.com")}
                className="btn-info-action"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
