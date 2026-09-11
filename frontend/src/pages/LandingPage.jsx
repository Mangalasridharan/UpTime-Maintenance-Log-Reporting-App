import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Camera,
  Calendar,
  Users,
  BarChart3,
  Bell,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Activity,
  Layers,
  TrendingUp,
  Clock,
  Play,
  Check,
  Zap,
  Award,
  Sliders,
  FileSpreadsheet,
  FileText,
  CornerDownRight,
  HelpCircle,
  HardHat,
  ChevronDown
} from "lucide-react";
import ThemeToggle from "../component/ThemeToggle";
import "./landing.css";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="landing-root">
      {/* =========================================================================
          TOP NAVIGATION BAR
      ========================================================================= */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-brand">
            <div className="brand-icon-box">
              <Cpu size={22} className="brand-logo-icon" />
            </div>
            <div className="brand-text-group">
              <span className="brand-name">UPTIME</span>
              <span className="brand-tag">INDUSTRIAL OS</span>
            </div>
          </Link>

          <nav className="landing-nav">
            <a href="#workflow" className="nav-link">Workflow</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#assignment" className="nav-link">Smart Assignment</a>
            <a href="#machines" className="nav-link">Equipment Health</a>
            <a href="#workforce" className="nav-link">Workforce</a>
            <a href="#hierarchy" className="nav-link">Hierarchy</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <Link to="/demo" className="btn-nav-demo">
              <Sparkles size={15} />
              <span>Try Demo</span>
            </Link>
            <Link to="/login" className="btn-nav-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn-nav-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="landing-main">
        {/* =========================================================================
            HERO SECTION
        ========================================================================= */}
        <section className="hero-section">
          <div className="hero-glow-bg" />
          <div className="landing-container hero-container">
            <div className="hero-pill-wrapper">
              <span className="hero-badge">
                <span className="badge-pulse-dot" />
                Next-Gen Industrial Maintenance Platform
              </span>
            </div>

            <h1 className="hero-title">
              Keep every machine running.
              <span className="hero-title-highlight"> Know every maintenance activity.</span>
            </h1>

            <p className="hero-description">
              Uptime is a centralized maintenance management platform that helps factories
              track machine health, manage maintenance work, monitor workforce activity, and turn
              maintenance data into actionable insights.
            </p>

            <div className="hero-cta-group">
              <Link to="/demo" className="btn-hero-demo">
                <Sparkles size={18} />
                <span>Try Demo</span>
              </Link>
              <Link to="/register" className="btn-hero-primary">
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="btn-hero-secondary">
                <BarChart3 size={18} />
                <span>View Dashboard</span>
              </Link>
            </div>

            {/* LIVE TELEMETRY HUD PREVIEW */}
            <div className="hero-hud-card">
              <div className="hud-card-header">
                <div className="hud-live-indicator">
                  <span className="live-dot" />
                  <span className="live-label">LIVE PLANT TELEMETRY · 12 DEPARTMENTS CONNECTED</span>
                </div>
                <div className="hud-status-counts">
                  <span className="chip chip-running">
                    <span className="chip-dot" /> 42 Running
                  </span>
                  <span className="chip chip-idle">
                    <span className="chip-dot" /> 5 Idle
                  </span>
                  <span className="chip chip-maintenance">
                    <span className="chip-dot" /> 3 Under Maintenance
                  </span>
                </div>
              </div>

              <div className="hud-stats-grid">
                <div className="hud-stat-item">
                  <span className="stat-label">Plant Availability</span>
                  <div className="stat-val-group">
                    <span className="stat-value text-emerald">99.4%</span>
                    <span className="stat-sub">+0.8% this month</span>
                  </div>
                </div>
                <div className="hud-stat-item">
                  <span className="stat-label">Mean Time to Repair</span>
                  <div className="stat-val-group">
                    <span className="stat-value">28 mins</span>
                    <span className="stat-sub text-emerald">-14% vs avg</span>
                  </div>
                </div>
                <div className="hud-stat-item">
                  <span className="stat-label">Routine Readings</span>
                  <div className="stat-val-group">
                    <span className="stat-value text-cyan">98.5%</span>
                    <span className="stat-sub">Shift compliance</span>
                  </div>
                </div>
                <div className="hud-stat-item">
                  <span className="stat-label">Active Work Orders</span>
                  <div className="stat-val-group">
                    <span className="stat-value text-amber">4 In Progress</span>
                    <span className="stat-sub">1 Pending Sign-off</span>
                  </div>
                </div>
              </div>

              <div className="hud-machine-feed">
                <div className="feed-item">
                  <div className="feed-col-main">
                    <span className="machine-code">BLR-01</span>
                    <span className="machine-name">Boiler High-Pressure Unit</span>
                    <span className="feed-dept">Boiler Dept</span>
                  </div>
                  <div className="feed-col-metric">
                    <span className="metric-tag">Temp: 184°C</span>
                    <span className="metric-tag">Pressure: 14.8 Bar</span>
                  </div>
                  <div className="feed-col-status">
                    <span className="badge-status status-running">Running</span>
                  </div>
                </div>

                <div className="feed-item">
                  <div className="feed-col-main">
                    <span className="machine-code">STN-03</span>
                    <span className="machine-name">Fabric Dry Stenter Line</span>
                    <span className="feed-dept">Finishing-Dry</span>
                  </div>
                  <div className="feed-col-metric">
                    <span className="metric-tag">Chamber 4 Standby</span>
                    <span className="metric-tag">Awaiting Batch</span>
                  </div>
                  <div className="feed-col-status">
                    <span className="badge-status status-idle">Idle</span>
                  </div>
                </div>

                <div className="feed-item highlight-maintenance">
                  <div className="feed-col-main">
                    <span className="machine-code">SFT-02</span>
                    <span className="machine-name">Softflow Jet Dyeing Vessel</span>
                    <span className="feed-dept">Softflow Dept</span>
                  </div>
                  <div className="feed-col-metric">
                    <span className="metric-tag warning">Preventive Bearing Inspection</span>
                    <span className="metric-tag">Tech: Vijay K. (Tier A)</span>
                  </div>
                  <div className="feed-col-status">
                    <span className="badge-status status-maintenance">Under Maintenance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: BUILT FOR THE PEOPLE WHO KEEP THE FACTORY RUNNING
        ========================================================================= */}
        <section id="workflow" className="landing-section workflow-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">UNIFIED INDUSTRIAL WORKFLOW</span>
              <h2 className="section-heading">
                Built for the people who keep the factory running
              </h2>
              <p className="section-subheading">
                From machine operators reporting problems to maintenance teams fixing them,
                Uptime connects the entire maintenance workflow in one place.
              </p>
            </div>

            {/* FLOW PIPELINE CARDS */}
            <div className="workflow-flow-wrapper">
              <div className="workflow-step-card">
                <div className="step-badge-num">1</div>
                <div className="step-icon-circle op-color">
                  <HardHat size={24} />
                </div>
                <h3 className="step-title">Machine Operator</h3>
                <div className="step-action-tag">Report / Monitor</div>
                <p className="step-desc">
                  Monitors equipment real-time, uploads daily shift readings, and raises instant complaint tickets when anomalies appear.
                </p>
              </div>

              <div className="workflow-arrow-connector">
                <ArrowRight size={22} className="flow-arrow-icon" />
              </div>

              <div className="workflow-step-card">
                <div className="step-badge-num">2</div>
                <div className="step-icon-circle tech-color">
                  <Wrench size={24} />
                </div>
                <h3 className="step-title">Maintenance Team</h3>
                <div className="step-action-tag">Repair & Maintain</div>
                <p className="step-desc">
                  Receives auto-recommended tasks matched by specialization, executes repairs, updates progress, and submits resolution logs.
                </p>
              </div>

              <div className="workflow-arrow-connector">
                <ArrowRight size={22} className="flow-arrow-icon" />
              </div>

              <div className="workflow-step-card">
                <div className="step-badge-num">3</div>
                <div className="step-icon-circle hod-color">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="step-title">HOD / Head</h3>
                <div className="step-action-tag">Verify</div>
                <p className="step-desc">
                  Inspects maintenance quality, confirms safety standards, and provides official digital sign-off.
                </p>
              </div>

              <div className="workflow-arrow-connector">
                <ArrowRight size={22} className="flow-arrow-icon" />
              </div>

              <div className="workflow-step-card highlight-step">
                <div className="step-badge-num">4</div>
                <div className="step-icon-circle green-color">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="step-title">Machine Back to Work</h3>
                <div className="step-action-tag success">Operational State</div>
                <p className="step-desc">
                  Equipment automatically flips to 'Running' with full audit history and zero scattered paperwork.
                </p>
              </div>
            </div>

            {/* PROBLEM VS SOLUTION CALLOUT */}
            <div className="lifecycle-banner">
              <div className="lifecycle-item old-way">
                <div className="lifecycle-indicator-cross">✕</div>
                <div>
                  <h4 className="lifecycle-title">No scattered registers.</h4>
                  <p className="lifecycle-text">
                    Eliminate illegible logbooks, lost paper complaint sheets, and disconnected spreadsheets across shifts.
                  </p>
                </div>
              </div>

              <div className="lifecycle-divider" />

              <div className="lifecycle-item old-way">
                <div className="lifecycle-indicator-cross">✕</div>
                <div>
                  <h4 className="lifecycle-title">No disconnected maintenance records.</h4>
                  <p className="lifecycle-text">
                    Stop losing technician repair records and breakdown root causes across disparate factory departments.
                  </p>
                </div>
              </div>

              <div className="lifecycle-divider" />

              <div className="lifecycle-item new-way">
                <div className="lifecycle-indicator-check">✓</div>
                <div>
                  <h4 className="lifecycle-title">One system for the complete maintenance lifecycle.</h4>
                  <p className="lifecycle-text">
                    Centralized source of truth connecting operators, technicians, and engineering management seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: EVERYTHING HAPPENING ON THE FACTORY FLOOR. IN ONE PLACE.
        ========================================================================= */}
        <section id="features" className="landing-section features-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">COMPREHENSIVE CAPABILITIES</span>
              <h2 className="section-heading">
                Everything happening on the factory floor. In one place.
              </h2>
              <p className="section-subheading">
                Four purpose-built modules engineered specifically to eliminate downtime and keep factory assets at peak performance.
              </p>
            </div>

            <div className="features-grid">
              {/* Feature 1: Maintenance Management */}
              <div className="feature-card">
                <div className="feature-icon-box">
                  <Wrench size={26} className="feature-icon" />
                </div>
                <div className="feature-card-header">
                  <span className="feature-badge">Lifecycle Control</span>
                  <h3 className="feature-title">🛠️ Maintenance Management</h3>
                </div>
                <p className="feature-desc">
                  Manage every maintenance activity across machines and departments. Track work from assignment to completion and verification.
                </p>

                <div className="pill-tags-cluster">
                  <span className="feature-tag">Routine</span>
                  <span className="feature-tag">Preventive</span>
                  <span className="feature-tag">Predictive</span>
                  <span className="feature-tag">Breakdown</span>
                  <span className="feature-tag">Implementation</span>
                </div>

                <div className="feature-micro-ui">
                  <div className="micro-row">
                    <span className="micro-key">Status Tracking</span>
                    <span className="micro-val">Assigned → In Progress → Verified</span>
                  </div>
                  <div className="micro-progress">
                    <div className="micro-progress-bar" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>

              {/* Feature 2: Operator Complaints */}
              <div className="feature-card">
                <div className="feature-icon-box alert-icon-box">
                  <AlertTriangle size={26} className="feature-icon alert-color" />
                </div>
                <div className="feature-card-header">
                  <span className="feature-badge alert-badge">Rapid Incident Triage</span>
                  <h3 className="feature-title">🚨 Operator Complaints</h3>
                </div>
                <p className="feature-desc">
                  When something doesn't look right, operators can raise a complaint directly against the machine.
                  Whether it's a sudden breakdown or an early warning sign, the maintenance team gets the information they need to act.
                </p>

                <div className="complaint-pipeline-chips">
                  <span className="pipe-chip">Observe</span>
                  <span className="pipe-arrow">→</span>
                  <span className="pipe-chip">Report</span>
                  <span className="pipe-arrow">→</span>
                  <span className="pipe-chip">Assign</span>
                  <span className="pipe-arrow">→</span>
                  <span className="pipe-chip">Repair</span>
                  <span className="pipe-arrow">→</span>
                  <span className="pipe-chip verified-chip">Verify</span>
                </div>

                <div className="feature-micro-ui">
                  <div className="micro-row">
                    <span className="micro-key">Complaint Severity</span>
                    <span className="badge-severity-critical">Critical / Breakdown</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Routine Machine Readings */}
              <div className="feature-card">
                <div className="feature-icon-box cyan-icon-box">
                  <Camera size={26} className="feature-icon cyan-color" />
                </div>
                <div className="feature-card-header">
                  <span className="feature-badge cyan-badge">Condition Monitoring</span>
                  <h3 className="feature-title">📸 Routine Machine Readings</h3>
                </div>
                <p className="feature-desc">
                  Keep routine machine monitoring consistent. Operators receive scheduled reading slots
                  throughout the day and upload photos of machine readings before the deadline.
                </p>

                <div className="reading-slots-row">
                  <div className="slot-badge morning">
                    <span className="slot-time">08:00</span>
                    <span className="slot-name">Morning</span>
                  </div>
                  <div className="slot-badge afternoon">
                    <span className="slot-time">14:00</span>
                    <span className="slot-name">Afternoon</span>
                  </div>
                  <div className="slot-badge evening">
                    <span className="slot-time">20:00</span>
                    <span className="slot-name">Evening</span>
                  </div>
                </div>

                <div className="feature-micro-ui">
                  <div className="micro-row">
                    <span className="micro-key">Reading Deadlines</span>
                    <span className="text-emerald">Automatic Reminders Active</span>
                  </div>
                </div>
              </div>

              {/* Feature 4: Preventive Maintenance */}
              <div className="feature-card">
                <div className="feature-icon-box purple-icon-box">
                  <Calendar size={26} className="feature-icon purple-color" />
                </div>
                <div className="feature-card-header">
                  <span className="feature-badge purple-badge">Zero Breakdown Strategy</span>
                  <h3 className="feature-title">🔧 Preventive Maintenance</h3>
                </div>
                <p className="feature-desc">
                  Don't wait for machines to fail. Each machine can have its own preventive maintenance interval.
                  When maintenance becomes due, Uptime identifies the task and recommends an appropriate maintenance worker based on specialization, performance, and workload.
                </p>

                <div className="quote-banner">
                  Plan ahead. Maintain consistently. Reduce unexpected downtime.
                </div>

                <div className="feature-micro-ui">
                  <div className="micro-row">
                    <span className="micro-key">Worker Recommendation</span>
                    <span className="text-cyan">Auto-Match AI Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: SMARTER MAINTENANCE ASSIGNMENT
        ========================================================================= */}
        <section id="assignment" className="landing-section assignment-section">
          <div className="landing-container">
            <div className="split-layout">
              <div className="split-text-col">
                <span className="section-eyebrow">INTELLIGENT DISPATCH</span>
                <h2 className="section-heading">
                  Smarter maintenance assignment
                </h2>
                <h3 className="section-lead-title">
                  The right worker for the right machine.
                </h3>
                <p className="section-paragraph">
                  Uptime uses previous performance grades and worker attributes to assist HODs and
                  Maintenance Heads in assigning maintenance work.
                </p>

                <div className="recommendation-criteria-list">
                  <div className="criteria-card">
                    <div className="criteria-bullet">1</div>
                    <div>
                      <strong>Performance:</strong> Historical repair speed and first-time fix accuracy.
                    </div>
                  </div>
                  <div className="criteria-card">
                    <div className="criteria-bullet">2</div>
                    <div>
                      <strong>Specialization:</strong> Electrical, Mechanical, Hydraulic, or Steam certification.
                    </div>
                  </div>
                  <div className="criteria-card">
                    <div className="criteria-bullet">3</div>
                    <div>
                      <strong>Department:</strong> Proximity, active shift status, and familiarity with asset.
                    </div>
                  </div>
                  <div className="criteria-card">
                    <div className="criteria-bullet">4</div>
                    <div>
                      <strong>Current Workload:</strong> Active tickets in queue to prevent technician burnout.
                    </div>
                  </div>
                </div>

                <div className="philosophy-card">
                  <div className="philosophy-icon">⚖️</div>
                  <div>
                    <div className="philosophy-text">The system recommends.</div>
                    <div className="philosophy-bold">The HOD or Maintenance Head decides.</div>
                  </div>
                </div>
              </div>

              <div className="split-visual-col">
                <div className="tier-showcase-card">
                  <div className="tier-card-header">
                    <h4>Worker Performance Tiers</h4>
                    <span className="badge-neutral">Monthly Calibration</span>
                  </div>
                  <p className="tier-desc">Workers are grouped into performance tiers based on effective execution hours:</p>

                  <table className="tier-table">
                    <thead>
                      <tr>
                        <th>Grade</th>
                        <th>Tier</th>
                        <th>Recommended Work Allocation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="tier-row-top">
                        <td>
                          <span className="grade-badge grade-a">A–B</span>
                        </td>
                        <td>
                          <span className="tier-name top-tier">Top</span>
                        </td>
                        <td>Complex machinery, critical breakdowns, high-pressure equipment</td>
                      </tr>
                      <tr className="tier-row-med">
                        <td>
                          <span className="grade-badge grade-c">C</span>
                        </td>
                        <td>
                          <span className="tier-name med-tier">Medium</span>
                        </td>
                        <td>Routine PMs, standard mechanical adjustments, sensor replacements</td>
                      </tr>
                      <tr className="tier-row-low">
                        <td>
                          <span className="grade-badge grade-de">D–E</span>
                        </td>
                        <td>
                          <span className="tier-name low-tier">Low</span>
                        </td>
                        <td>Assisted tasks, general inspections, skill-upgradation assignments</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* MINI ASSIGNMENT INTERACTIVE CARD MOCK */}
                  <div className="assignment-demo-box">
                    <div className="demo-box-top">
                      <span className="demo-task-name">Task: Stenter Drive Motor Overhaul</span>
                      <span className="badge-critical">Critical</span>
                    </div>
                    <div className="recommendation-pill-row">
                      <span className="rec-badge">Best Match: S. Kumar (Grade A · Electrical)</span>
                      <span className="rec-match-rate">98% Fit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: FROM COMPLAINT TO VERIFIED MAINTENANCE
        ========================================================================= */}
        <section className="landing-section workflow-stages-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">CLOSED-LOOP DISPATCH</span>
              <h2 className="section-heading">
                From complaint to verified maintenance
              </h2>
              <p className="section-subheading">
                Every maintenance activity follows a clear, verifiable workflow. No shortcuts.
              </p>
            </div>

            <div className="stages-timeline">
              <div className="stage-node">
                <div className="stage-num-badge">01</div>
                <h4 className="stage-title">Reported</h4>
                <p className="stage-details">
                  Operator spots abnormal vibration or error code, raising ticket with photo evidence.
                </p>
              </div>
              <div className="stage-connector-line" />

              <div className="stage-node">
                <div className="stage-num-badge">02</div>
                <h4 className="stage-title">Assigned</h4>
                <p className="stage-details">
                  HOD assigns best technician considering tier rating, workload, and expertise.
                </p>
              </div>
              <div className="stage-connector-line" />

              <div className="stage-node">
                <div className="stage-num-badge">03</div>
                <h4 className="stage-title">In Progress</h4>
                <p className="stage-details">
                  Technician receives job ticket on device, retrieves spares, and commences repair.
                </p>
              </div>
              <div className="stage-connector-line" />

              <div className="stage-node">
                <div className="stage-num-badge">04</div>
                <h4 className="stage-title">Completed</h4>
                <p className="stage-details">
                  Maintenance workers complete the physical work and log parts & root cause.
                </p>
              </div>
              <div className="stage-connector-line" />

              <div className="stage-node stage-node-verify">
                <div className="stage-num-badge verify-num">05</div>
                <h4 className="stage-title">Verified</h4>
                <p className="stage-details">
                  HODs and Maintenance Heads verify quality before machine is certified to run.
                </p>
              </div>
            </div>

            <div className="verification-rule-banner">
              <div className="rule-badge-box">
                <ShieldCheck size={28} className="text-emerald" />
              </div>
              <div className="rule-content">
                <h4 className="rule-title">Maintenance workers complete the work. HODs and Maintenance Heads verify it.</h4>
                <p className="rule-subtitle">
                  Only after verification does the machine return to its normal operational state.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: KNOW THE STATE OF EVERY MACHINE & MACHINE HISTORY
        ========================================================================= */}
        <section id="machines" className="landing-section machines-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">EQUIPMENT TELEMETRY & AUDIT</span>
              <h2 className="section-heading">
                Know the state of every machine
              </h2>
              <div className="machine-state-chips-row">
                <span className="state-chip state-running">
                  <span className="state-dot running-dot" /> Running
                </span>
                <span className="state-chip state-idle">
                  <span className="state-dot idle-dot" /> Idle
                </span>
                <span className="state-chip state-maintenance">
                  <span className="state-dot maint-dot" /> Under Maintenance
                </span>
              </div>
              <p className="section-subheading">
                Get a real-time view of what's happening across your machines.
                One machine. One timeline. Complete visibility.
              </p>
            </div>

            {/* WHAT YOU SEE GRID */}
            <div className="visibility-features-grid">
              <div className="visibility-card">
                <div className="visibility-icon-pill">
                  <Activity size={20} />
                </div>
                <h4>Current machine status</h4>
                <p>Instant visual cues across 12 departments whether equipment is producing or halted.</p>
              </div>

              <div className="visibility-card">
                <div className="visibility-icon-pill">
                  <Wrench size={20} />
                </div>
                <h4>Active maintenance</h4>
                <p>Real-time telemetry on ongoing routine, preventive, and emergency work orders.</p>
              </div>

              <div className="visibility-card">
                <div className="visibility-icon-pill">
                  <Users size={20} />
                </div>
                <h4>Assigned workers</h4>
                <p>Know exactly which technician is accountable for each machine on the shop floor.</p>
              </div>

              <div className="visibility-card">
                <div className="visibility-icon-pill">
                  <Clock size={20} />
                </div>
                <h4>Maintenance history</h4>
                <p>Complete historical log of every intervention, replaced component, and technician note.</p>
              </div>

              <div className="visibility-card">
                <div className="visibility-icon-pill">
                  <AlertTriangle size={20} />
                </div>
                <h4>Breakdown frequency</h4>
                <p>Spot repeat failure loops and identify lemons before catastrophic failure.</p>
              </div>

              <div className="visibility-card">
                <div className="visibility-icon-pill">
                  <TrendingUp size={20} />
                </div>
                <h4>Downtime tracking</h4>
                <p>Accurate hourly logs of unutilized machine hours and financial impact.</p>
              </div>

              <div className="visibility-card span-full">
                <div className="visibility-icon-pill">
                  <Calendar size={20} />
                </div>
                <h4>Preventive maintenance schedule</h4>
                <p>Upcoming intervals, oil change cycles, calibration dates, and safety audits at a glance.</p>
              </div>
            </div>

            {/* EVERY MACHINE HAS A HISTORY */}
            <div className="machine-history-card">
              <div className="history-header">
                <div>
                  <span className="history-eyebrow">RELIABILITY ENGINEERING</span>
                  <h3 className="history-title">Every machine has a history</h3>
                  <p className="history-sub">
                    Understand your machines beyond their current status.
                    Each machine gets its own maintenance history, allowing teams to identify patterns over time.
                  </p>
                </div>
                <div className="history-badge">
                  <span>Asset ID: BLR-01</span>
                </div>
              </div>

              <div className="history-metrics-grid">
                <div className="history-metric-box">
                  <span className="metric-box-title">Maintenance frequency</span>
                  <span className="metric-box-sub">How often the machine requires maintenance.</span>
                  <div className="metric-stat">3.2 / month</div>
                </div>

                <div className="history-metric-box">
                  <span className="metric-box-title">Breakdown frequency</span>
                  <span className="metric-box-sub">How frequently failures occur.</span>
                  <div className="metric-stat text-emerald">0.4 / quarter</div>
                </div>

                <div className="history-metric-box">
                  <span className="metric-box-title">Downtime</span>
                  <span className="metric-box-sub">How long the machine remains unavailable.</span>
                  <div className="metric-stat text-cyan">1.8 hrs avg</div>
                </div>

                <div className="history-metric-box">
                  <span className="metric-box-title">Maintenance activity</span>
                  <span className="metric-box-sub">Routine, preventive, predictive, breakdown and implementation work.</span>
                  <div className="activity-breakdown-bar">
                    <span className="bar-part routine" title="Routine 50%" style={{ width: "50%" }} />
                    <span className="bar-part prev" title="Preventive 30%" style={{ width: "30%" }} />
                    <span className="bar-part brk" title="Breakdown 10%" style={{ width: "10%" }} />
                    <span className="bar-part imp" title="Impl 10%" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>

              <div className="history-footer-quote">
                Turn maintenance records into a clearer picture of machine reliability.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: MEASURE THE WORKFORCE. IMPROVE THE OPERATION.
        ========================================================================= */}
        <section id="workforce" className="landing-section workforce-section">
          <div className="landing-container">
            <div className="split-layout">
              <div className="split-text-col">
                <span className="section-eyebrow">WORKFORCE PRODUCTIVITY</span>
                <h2 className="section-heading">
                  Measure the workforce. Improve the operation.
                </h2>
                <p className="section-paragraph">
                  Uptime tracks worker attendance and working hours to calculate monthly performance.
                </p>

                {/* FORMULA DISPLAY */}
                <div className="formula-box">
                  <div className="formula-title">Monthly Performance Formula</div>
                  <div className="formula-math">
                    <div className="math-fraction">
                      <span className="fraction-num">Effective Hours</span>
                      <span className="fraction-line" />
                      <span className="fraction-den">Expected Hours</span>
                    </div>
                    <span className="math-operator">×</span>
                    <span className="math-constant">100</span>
                  </div>
                </div>

                <p className="section-paragraph">
                  Performance is translated into a simple A–E grade. Performance data can then support better preventive maintenance assignments.
                </p>

                <div className="attendance-loop-pill">
                  <span>Attendance</span>
                  <ArrowRight size={16} />
                  <span>Performance</span>
                  <ArrowRight size={16} />
                  <strong>Better Assignment</strong>
                </div>
              </div>

              <div className="split-visual-col">
                <div className="performance-grades-card">
                  <div className="grades-card-header">
                    <h4>Performance Grading System</h4>
                    <span className="badge-neutral">Standardized Matrix</span>
                  </div>

                  <div className="grade-tier-rows">
                    <div className="grade-item grade-item-a">
                      <div className="grade-letter">A</div>
                      <div className="grade-bracket">≥ 95%</div>
                      <div className="grade-tag">Exceptional Attendance & Speed</div>
                    </div>

                    <div className="grade-item grade-item-b">
                      <div className="grade-letter">B</div>
                      <div className="grade-bracket">85–94%</div>
                      <div className="grade-tag">Consistent High Performer</div>
                    </div>

                    <div className="grade-item grade-item-c">
                      <div className="grade-letter">C</div>
                      <div className="grade-bracket">75–84%</div>
                      <div className="grade-tag">Standard Operational Capacity</div>
                    </div>

                    <div className="grade-item grade-item-d">
                      <div className="grade-letter">D</div>
                      <div className="grade-bracket">60–74%</div>
                      <div className="grade-tag">Underperforming / Supervision Req.</div>
                    </div>

                    <div className="grade-item grade-item-e">
                      <div className="grade-letter">E</div>
                      <div className="grade-bracket">&lt; 60%</div>
                      <div className="grade-tag">Critical Intervention / Retraining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: STAY INFORMED WITHOUT CONSTANTLY CHECKING
        ========================================================================= */}
        <section className="landing-section notifications-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">SMART ALERT ENGINE</span>
              <h2 className="section-heading">
                Stay informed without constantly checking
              </h2>
              <p className="section-subheading">
                Important maintenance events come to you.
                So instead of constantly checking the system:
                <strong> Uptime tells you when something needs attention.</strong>
              </p>
            </div>

            <div className="notif-feed-showcase">
              <div className="notif-card-item">
                <div className="notif-icon-circle blue">
                  <Clock size={20} />
                </div>
                <div className="notif-text-area">
                  <div className="notif-item-header">
                    <span className="notif-item-title">Routine reading deadlines</span>
                    <span className="notif-time">10m ago</span>
                  </div>
                  <p className="notif-item-msg">Morning reading window for Boiler Department closes in 20 minutes.</p>
                </div>
              </div>

              <div className="notif-card-item">
                <div className="notif-icon-circle amber">
                  <AlertTriangle size={20} />
                </div>
                <div className="notif-text-area">
                  <div className="notif-item-header">
                    <span className="notif-item-title">Missed readings</span>
                    <span className="notif-time">25m ago</span>
                  </div>
                  <p className="notif-item-msg">Afternoon pressure reading overdue for Fabric Batching Machine #06.</p>
                </div>
              </div>

              <div className="notif-card-item">
                <div className="notif-icon-circle red">
                  <AlertTriangle size={20} />
                </div>
                <div className="notif-text-area">
                  <div className="notif-item-header">
                    <span className="notif-item-title">New machine complaints</span>
                    <span className="notif-time">1h ago</span>
                  </div>
                  <p className="notif-item-msg">Operator Arvind reported abnormal thermal spike in Finishing-Wet Stenter.</p>
                </div>
              </div>

              <div className="notif-card-item">
                <div className="notif-icon-circle cyan">
                  <Wrench size={20} />
                </div>
                <div className="notif-text-area">
                  <div className="notif-item-header">
                    <span className="notif-item-title">Maintenance assignments</span>
                    <span className="notif-time">2h ago</span>
                  </div>
                  <p className="notif-item-msg">HOD assigned Rajesh K. to replace hydraulic oil seals on Softflow Jet #03.</p>
                </div>
              </div>

              <div className="notif-card-item">
                <div className="notif-icon-circle green">
                  <CheckCircle2 size={20} />
                </div>
                <div className="notif-text-area">
                  <div className="notif-item-header">
                    <span className="notif-item-title">Maintenance completion</span>
                    <span className="notif-time">3h ago</span>
                  </div>
                  <p className="notif-item-msg">Compressor belt replacement completed on CDR unit. Log sheet uploaded.</p>
                </div>
              </div>

              <div className="notif-card-item">
                <div className="notif-icon-circle purple">
                  <ShieldCheck size={20} />
                </div>
                <div className="notif-text-area">
                  <div className="notif-item-header">
                    <span className="notif-item-title">Verification requests</span>
                    <span className="notif-time">4h ago</span>
                  </div>
                  <p className="notif-item-msg">HOD verification pending for CPB Machine #02 to return to production.</p>
                </div>
              </div>

              <div className="notif-card-item span-two">
                <div className="notif-icon-circle blue">
                  <Calendar size={20} />
                </div>
                <div className="notif-text-area">
                  <div className="notif-item-header">
                    <span className="notif-item-title">Preventive maintenance due</span>
                    <span className="notif-time">Tomorrow 09:00</span>
                  </div>
                  <p className="notif-item-msg">30-day lubrication and alignment inspection scheduled for Inspection Line #04.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: BUILT AROUND YOUR MAINTENANCE HIERARCHY
        ========================================================================= */}
        <section id="hierarchy" className="landing-section hierarchy-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">ROLE-BASED GOVERNANCE</span>
              <h2 className="section-heading">
                Built around your maintenance hierarchy
              </h2>
              <p className="section-subheading">
                Everyone sees what they need.
              </p>
            </div>

            <div className="roles-grid">
              <div className="role-card">
                <div className="role-icon-box head-role">
                  <Award size={26} />
                </div>
                <h3 className="role-title">Maintenance Head</h3>
                <p className="role-description">
                  Complete visibility across departments, machines, workers and maintenance activities.
                </p>
                <ul className="role-bullets">
                  <li>Global plant telemetry & uptime analytics</li>
                  <li>Cross-department workforce capacity & grades</li>
                  <li>Critical breakdown escalation & resolution logs</li>
                </ul>
              </div>

              <div className="role-card">
                <div className="role-icon-box hod-role">
                  <ShieldCheck size={26} />
                </div>
                <h3 className="role-title">Department HOD</h3>
                <p className="role-description">
                  Manage department-level maintenance, assignments, machines and performance.
                </p>
                <ul className="role-bullets">
                  <li>Intelligent technician assignment recommendations</li>
                  <li>Review & formal verification of completed repairs</li>
                  <li>Routine readings compliance monitoring</li>
                </ul>
              </div>

              <div className="role-card">
                <div className="role-icon-box worker-role">
                  <Wrench size={26} />
                </div>
                <h3 className="role-title">Maintenance Workers</h3>
                <p className="role-description">
                  View assigned work, perform maintenance and update task progress.
                </p>
                <ul className="role-bullets">
                  <li>Real-time task dispatch with equipment histories</li>
                  <li>Interactive repair status updates (Assigned → Complete)</li>
                  <li>Personal performance grade & attendance tracking</li>
                </ul>
              </div>

              <div className="role-card">
                <div className="role-icon-box operator-role">
                  <HardHat size={26} />
                </div>
                <h3 className="role-title">Machine Operators</h3>
                <p className="role-description">
                  Monitor assigned machines, submit routine readings and raise machine complaints.
                </p>
                <ul className="role-bullets">
                  <li>Photo uploads for scheduled reading slots</li>
                  <li>Instant breakdown & anomaly complaint logging</li>
                  <li>Clear visual machine status indicators</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: TURN MAINTENANCE DATA INTO DECISIONS
        ========================================================================= */}
        <section className="landing-section decisions-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">ACTIONABLE DECISION INTELLIGENCE</span>
              <h2 className="section-heading">
                Turn maintenance data into decisions
              </h2>
              <p className="section-subheading">
                Know where your attention is needed.
                Uptime brings together operational and historical data to answer questions like:
              </p>
            </div>

            <div className="decisions-grid">
              <div className="decision-card">
                <div className="decision-q-icon">❓</div>
                <h4 className="decision-q">Which machines break down most frequently?</h4>
                <p className="decision-a">
                  Instantly identify high-frequency fault machinery and analyze repetitive component failure patterns.
                </p>
              </div>

              <div className="decision-card">
                <div className="decision-q-icon">❓</div>
                <h4 className="decision-q">Which machines have the highest downtime?</h4>
                <p className="decision-a">
                  Rank equipment by total lost production hours to prioritize capital upgrades and overhaul schedules.
                </p>
              </div>

              <div className="decision-card">
                <div className="decision-q-icon">❓</div>
                <h4 className="decision-q">Which department has the highest maintenance workload?</h4>
                <p className="decision-a">
                  Compare maintenance intensity across Boiler, Finishing, Softflow, and Dyeing departments.
                </p>
              </div>

              <div className="decision-card">
                <div className="decision-q-icon">❓</div>
                <h4 className="decision-q">Which workers are currently handling maintenance tasks?</h4>
                <p className="decision-a">
                  Live technician dispatch board showing ongoing work orders, pending sign-offs, and idle manpower.
                </p>
              </div>

              <div className="decision-card">
                <div className="decision-q-icon">❓</div>
                <h4 className="decision-q">Which preventive maintenance activities are due?</h4>
                <p className="decision-a">
                  Proactive countdown of upcoming routine inspections and service intervals before machines trigger breakdowns.
                </p>
              </div>

              <div className="decision-card">
                <div className="decision-q-icon">❓</div>
                <h4 className="decision-q">How is workforce performance changing?</h4>
                <p className="decision-a">
                  Track monthly shift worker effective hours, A–E grade evolutions, and training requirements over time.
                </p>
              </div>
            </div>

            <div className="decisions-banner">
              Better visibility leads to better maintenance decisions.
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: DESIGNED FOR THE FACTORY FLOOR (HIERARCHY DIAGRAM)
        ========================================================================= */}
        <section className="landing-section plant-diagram-section">
          <div className="landing-container">
            <div className="section-header-center">
              <span className="section-eyebrow">INDUSTRIAL ARCHITECTURE</span>
              <h2 className="section-heading">Designed for the factory floor</h2>
              <p className="section-subheading">One platform. Multiple responsibilities.</p>
            </div>

            <div className="diagram-container">
              {/* Top: Maintenance Head */}
              <div className="diag-node diag-head">
                <div className="diag-role-tag">Plant Governance</div>
                <div className="diag-title">Maintenance Head</div>
              </div>

              <div className="diag-arrow-down">
                <div className="diag-line" />
                <ChevronDown size={20} className="diag-icon" />
              </div>

              {/* Mid: HOD */}
              <div className="diag-node diag-hod">
                <div className="diag-role-tag">Department Management</div>
                <div className="diag-title">HOD</div>
              </div>

              <div className="diag-arrow-down">
                <div className="diag-line" />
                <ChevronDown size={20} className="diag-icon" />
              </div>

              {/* Floor Level: Workers, Operators, Machines */}
              <div className="diag-floor-row">
                <div className="diag-floor-card">
                  <Wrench size={22} className="text-cyan" />
                  <span>Workers</span>
                </div>
                <div className="diag-floor-card">
                  <HardHat size={22} className="text-amber" />
                  <span>Operators</span>
                </div>
                <div className="diag-floor-card">
                  <Cpu size={22} className="text-emerald" />
                  <span>Machines</span>
                </div>
              </div>

              <div className="diag-arrow-down">
                <div className="diag-line" />
                <ChevronDown size={20} className="diag-icon" />
              </div>

              {/* Central Core: UPTIME */}
              <div className="diag-node diag-core">
                <div className="core-badge">CENTRAL ENGINE</div>
                <div className="core-brand">UPTIME</div>
              </div>

              <div className="diag-summary-chips">
                <span>Centralized maintenance data.</span>
                <span className="dot-sep">•</span>
                <span>Clear responsibilities.</span>
                <span className="dot-sep">•</span>
                <span>Connected workflows.</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: BUILT TO REDUCE DOWNTIME (FINAL CTA)
        ========================================================================= */}
        <section className="landing-section cta-section">
          <div className="landing-container">
            <div className="cta-card">
              <span className="cta-eyebrow">GET STARTED WITH UPTIME</span>
              <h2 className="cta-heading">Built to reduce downtime</h2>

              <div className="cta-mantra">
                <span>See it.</span>
                <span className="mantra-arrow">→</span>
                <span>Report it.</span>
                <span className="mantra-arrow">→</span>
                <span>Fix it.</span>
                <span className="mantra-arrow">→</span>
                <span className="mantra-verified">Verify it.</span>
              </div>

              <p className="cta-desc">
                Uptime brings machine operators, maintenance workers, HODs and Maintenance Heads
                together around one goal:
                <br />
                <strong>Keep machines productive and maintenance under control.</strong>
              </p>

              <div className="cta-btn-row">
                <Link to="/login" className="btn-cta-primary">
                  <span>Start using Uptime</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/demo" className="btn-cta-demo">
                  <Sparkles size={18} />
                  <span>Try Demo</span>
                </Link>
                <Link to="/dashboard" className="btn-cta-ghost">
                  <BarChart3 size={18} />
                  <span>View Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          FOOTER
      ========================================================================= */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <Link to="/" className="landing-brand">
                <div className="brand-icon-box">
                  <Cpu size={20} className="brand-logo-icon" />
                </div>
                <div className="brand-text-group">
                  <span className="brand-name">UPTIME</span>
                </div>
              </Link>
              <p className="footer-tagline">
                Maintenance management for modern industrial operations.
              </p>
              <div className="footer-status-pill">
                <span className="pulse-green-dot" />
                All 12 Factory Nodes Connected
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Maintenance</a></li>
                <li><a href="#machines">Machines</a></li>
                <li><a href="#features">Complaints</a></li>
                <li><a href="#features">Preventive Maintenance</a></li>
                <li><a href="#workforce">Workforce</a></li>
                <li><a href="#assignment">Analytics</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#features">Documentation</a></li>
                <li><a href="#hierarchy">System Design</a></li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Demo Sandbox</h4>
              <ul className="footer-links">
                <li><Link to="/demo">Try Demo Page</Link></li>
                <li><Link to="/login">Employee Console Login</Link></li>
                <li><Link to="/register">Register New Account</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">
              © 2026 Uptime. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <span>Industrial Telemetry</span>
              <span>·</span>
              <span>Privacy & Audit</span>
              <span>·</span>
              <span>ISO 55000 Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
