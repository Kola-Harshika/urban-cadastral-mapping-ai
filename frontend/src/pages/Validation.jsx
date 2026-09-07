import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import {
  IconCheckSquare,
  IconCpu,
  IconMap,
} from "../components/Icons";

const SAMPLE_ROWS = [
  {
    id: "GEO-001",
    feature: "BLD-0145",
    issue: "Overlaps adjacent footprint",
    severity: "error",
    status: "Open",
  },
  {
    id: "GEO-002",
    feature: "BLD-0150",
    issue: "Boundary self-intersects",
    severity: "error",
    status: "Open",
  },
  {
    id: "GEO-003",
    feature: "PAR-0108",
    issue: "Sliver gap with parcel edge",
    severity: "warning",
    status: "Open",
  },
  {
    id: "GEO-004",
    feature: "BLD-0151",
    issue: "Duplicate footprint candidate",
    severity: "warning",
    status: "Open",
  },
];

const severityTone = {
  error: "error",
  warning: "warning",
};

const CHECKS = [
  {
    title: "Overlap Detection",
    short: "01",
    description:
      "Identifies building or parcel geometries that overlap neighboring features.",
    icon: "OV",
    className: "validation-burgundy",
  },
  {
    title: "Geometry Validation",
    short: "02",
    description:
      "Detects invalid polygon geometries such as self-intersections and malformed boundaries.",
    icon: "GV",
    className: "validation-orchid",
  },
  {
    title: "Gap Detection",
    short: "03",
    description:
      "Highlights possible gaps or sliver regions between extracted spatial features.",
    icon: "GD",
    className: "validation-peach",
  },
  {
    title: "Duplicate Detection",
    short: "04",
    description:
      "Identifies duplicate or highly similar feature geometries.",
    icon: "DD",
    className: "validation-blush",
  },
];

export default function Validation() {
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);

  function runValidation() {
    setRunning(true);

    setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 1400);
  }

  return (
    <div className="page validation-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-header validation-page-header">
        <div>
          <div className="section-kicker">
            <span className="kicker-dot" />
            GIS QUALITY CONTROL
          </div>

          <h1 className="page-title">
            Topology &amp; Geometry Validation
          </h1>

          <p className="page-description">
            Validate extracted building footprints, parcel
            boundaries and road geometries by detecting
            overlaps, gaps, duplicate features,
            self-intersections and other spatial
            inconsistencies.
          </p>
        </div>

        <div className="validation-header-status">
          <span className="prototype-badge">
            Prototype
          </span>

          <span
            className={`status-badge ${
              running
                ? "status-processing"
                : ran
                ? "status-success"
                : "status-ready"
            }`}
          >
            <span className="status-dot" />

            {running
              ? "Validation Running"
              : ran
              ? "Validation Complete"
              : "Ready to Validate"}
          </span>
        </div>
      </div>

      {/* =====================================================
          RESULT SUMMARY
          ===================================================== */}

      <div className="validation-summary-grid">

        <div className="validation-summary-card">
          <div className="validation-summary-icon burgundy">
            <IconMap size={19} />
          </div>

          <div>
            <span>Total Features</span>
            <strong>{ran ? "37" : "--"}</strong>
            <small>
              Extracted spatial features
            </small>
          </div>
        </div>

        <div className="validation-summary-card">
          <div className="validation-summary-icon success">
            <IconCheckSquare size={19} />
          </div>

          <div>
            <span>Valid Features</span>
            <strong>{ran ? "33" : "--"}</strong>
            <small>
              Passed topology checks
            </small>
          </div>
        </div>

        <div className="validation-summary-card">
          <div className="validation-summary-icon warning">
            <span>!</span>
          </div>

          <div>
            <span>Warnings</span>
            <strong>{ran ? "2" : "--"}</strong>
            <small>
              Require review
            </small>
          </div>
        </div>

        <div className="validation-summary-card">
          <div className="validation-summary-icon error">
            <span>×</span>
          </div>

          <div>
            <span>Errors</span>
            <strong>{ran ? "2" : "--"}</strong>
            <small>
              Critical geometry issues
            </small>
          </div>
        </div>

      </div>

      {/* =====================================================
          VALIDATION ENGINE
          ===================================================== */}

      <div className="card validation-engine-card">

        <div className="card-header validation-card-header">
          <div className="validation-title-row">

            <div className="feature-icon orchid">
              <IconCpu size={20} />
            </div>

            <div>
              <div className="section-kicker small">
                <span className="kicker-dot" />
                AUTOMATED QUALITY CHECK
              </div>

              <h2 className="card-title">
                Topology Validation Engine
              </h2>

              <p className="card-subtitle">
                Check spatial relationships and geometric
                consistency of extracted cadastral features.
              </p>
            </div>

          </div>

          <button
            className="primary-button validation-run-btn"
            onClick={runValidation}
            disabled={running}
          >
            {running ? (
              <>
                <span className="button-spinner" />
                Running Validation...
              </>
            ) : ran ? (
              <>
                <IconCpu size={17} />
                Re-run Validation
              </>
            ) : (
              <>
                <IconCpu size={17} />
                Run Validation
              </>
            )}
          </button>
        </div>

        {/* CHECK STATUS */}

        <div className="validation-check-grid">

          <div
            className={`validation-check ${
              ran ? "completed" : ""
            }`}
          >
            <div className="validation-check-number">
              {ran ? (
                <IconCheckSquare size={15} />
              ) : (
                "01"
              )}
            </div>

            <div>
              <strong>Overlap Detection</strong>
              <span>
                {ran
                  ? "Check completed"
                  : "Ready for analysis"}
              </span>
            </div>
          </div>

          <div
            className={`validation-check ${
              ran ? "completed" : ""
            }`}
          >
            <div className="validation-check-number">
              {ran ? (
                <IconCheckSquare size={15} />
              ) : (
                "02"
              )}
            </div>

            <div>
              <strong>Boundary Validation</strong>
              <span>
                {ran
                  ? "Check completed"
                  : "Ready for analysis"}
              </span>
            </div>
          </div>

          <div
            className={`validation-check ${
              ran ? "completed" : ""
            }`}
          >
            <div className="validation-check-number">
              {ran ? (
                <IconCheckSquare size={15} />
              ) : (
                "03"
              )}
            </div>

            <div>
              <strong>Gap Detection</strong>
              <span>
                {ran
                  ? "Check completed"
                  : "Ready for analysis"}
              </span>
            </div>
          </div>

          <div
            className={`validation-check ${
              ran ? "completed" : ""
            }`}
          >
            <div className="validation-check-number">
              {ran ? (
                <IconCheckSquare size={15} />
              ) : (
                "04"
              )}
            </div>

            <div>
              <strong>Duplicate Detection</strong>
              <span>
                {ran
                  ? "Check completed"
                  : "Ready for analysis"}
              </span>
            </div>
          </div>

        </div>

        {running && (
          <div className="validation-progress">
            <div className="validation-progress-top">
              <span>
                Analyzing spatial relationships
              </span>

              <span>
                Processing...
              </span>
            </div>

            <div className="validation-progress-track">
              <div className="validation-progress-fill" />
            </div>
          </div>
        )}

      </div>

      {/* =====================================================
          RESULTS
          ===================================================== */}

      <div className="card validation-results-card">

        <div className="card-header">
          <div>
            <div className="section-kicker small">
              <span className="kicker-dot" />
              QUALITY REPORT
            </div>

            <h2 className="card-title">
              Validation Results
            </h2>

            <p className="card-subtitle">
              Detected topology and geometry
              inconsistencies requiring attention.
            </p>
          </div>

          {ran && (
            <div className="validation-result-badge">
              <IconCheckSquare size={15} />
              33 of 37 features valid
            </div>
          )}
        </div>

        <div className="validation-table-wrap">
          <DataTable
            columns={[
              {
                key: "feature",
                label: "Feature ID",
              },

              {
                key: "issue",
                label: "Issue",
              },

              {
                key: "severity",
                label: "Severity",

                render: (row) => (
                  <StatusBadge
                    tone={severityTone[row.severity]}
                  >
                    {row.severity === "error"
                      ? "Error"
                      : "Warning"}
                  </StatusBadge>
                ),
              },

              {
                key: "status",
                label: "Status",
              },
            ]}
            rows={ran ? SAMPLE_ROWS : []}
            emptyLabel="Run validation to view detected topology issues."
          />
        </div>

      </div>

      {/* =====================================================
          VALIDATION CHECKS
          ===================================================== */}

      <div className="card validation-information-card">

        <div className="card-header">
          <div>
            <div className="section-kicker small">
              <span className="kicker-dot" />
              VALIDATION RULES
            </div>

            <h2 className="card-title">
              Validation Checks
            </h2>

            <p className="card-subtitle">
              The topology module supports quality control
              before cadastral data is exported to GIS
              formats.
            </p>
          </div>
        </div>

        <div className="validation-info-grid">

          {CHECKS.map((check) => (
            <div
              className={`validation-info-item ${check.className}`}
              key={check.title}
            >
              <div className="validation-info-icon">
                <span>{check.icon}</span>
              </div>

              <div>
                <div className="validation-info-number">
                  CHECK {check.short}
                </div>

                <h3>{check.title}</h3>

                <p>{check.description}</p>
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* =====================================================
          DEMO NOTICE
          ===================================================== */}

      <div className="validation-demo-note">

        <div className="validation-demo-icon">
          <span>i</span>
        </div>

        <div>
          <strong>
            Prototype Validation Data
          </strong>

          <p>
            Validation results shown in this prototype
            are illustrative. Production deployment would
            perform these checks against actual extracted
            GIS geometries and cadastral datasets.
          </p>
        </div>

      </div>

    </div>
  );
}