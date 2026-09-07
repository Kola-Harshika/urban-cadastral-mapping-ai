import { useState } from "react";
import { IconEye, IconDownload, IconFileText, IconCheckSquare } from "../components/Icons";
import StatusBadge from "../components/StatusBadge";

const EXPORTS = [
  {
    name: "Building Footprints",
    format: "GeoJSON",
    description: "Extracted building polygons and cadastral geometry.",
    accent: "burgundy",
  },
  {
    name: "Building Mask",
    format: "GeoTIFF",
    description: "AI-generated raster segmentation mask.",
    accent: "orchid",
  },
  {
    name: "Analysis Overlay",
    format: "PNG",
    description: "Visual overlay of detected features and analysis results.",
    accent: "peach",
  },
  {
    name: "Cadastral Report",
    format: "PDF",
    description: "Consolidated cadastral analysis and validation report.",
    accent: "gold",
  },
];

export default function Reports() {
  const [note, setNote] = useState("");

  return (
    <div className="page reports-page">

      {/* HEADER */}
      <div className="page-header reports-header">
        <div>
          <div className="reports-eyebrow">
            <span className="reports-eyebrow-dot" />
            DOCUMENTATION &amp; OUTPUT CENTER
          </div>

          <h1 className="page-title">
            Reports &amp; <span>Export</span>
          </h1>

          <p className="page-description">
            Access AI-generated cadastral outputs, analysis reports, and
            geospatial export formats from completed processing runs.
          </p>
        </div>

        <div className="reports-header-status">
          <StatusBadge tone="neutral">Prototype Mode</StatusBadge>
          <span className="reports-status-dot" />
          Outputs Ready for Integration
        </div>
      </div>

      {/* EXPORT SECTION */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <div>
            <div className="reports-section-kicker">OUTPUT FILES</div>
            <h2>Analysis Exports</h2>
            <p>
              Select an output to preview or export the generated cadastral
              intelligence.
            </p>
          </div>

          <div className="reports-file-count">
            <strong>{EXPORTS.length}</strong>
            <span>Formats</span>
          </div>
        </div>

        <div className="reports-export-grid">
          {EXPORTS.map((item) => (
            <div
              key={item.name}
              className={`reports-export-card reports-export-${item.accent}`}
            >
              <div className="reports-export-top">
                <div className="reports-export-icon">
                  <IconFileText size={20} />
                </div>

                <span className="reports-format-badge">
                  {item.format}
                </span>
              </div>

              <div className="reports-export-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>

              <div className="reports-export-footer">
                <button
                  className="reports-action reports-action-view"
                  onClick={() =>
                    setNote(
                      `Viewing "${item.name}" is a UI prototype control — connect the backend to preview real output.`
                    )
                  }
                >
                  <IconEye size={15} />
                  View
                </button>

                <button
                  className="reports-action reports-action-export"
                  onClick={() =>
                    setNote(
                      `Exporting "${item.name}" (${item.format}) is a UI prototype control — not connected to a backend yet.`
                    )
                  }
                >
                  <IconDownload size={15} />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>

        {note && (
          <div className="reports-inline-note">
            <span className="reports-note-icon">i</span>
            <span>{note}</span>
          </div>
        )}
      </section>

      {/* ANALYSIS SUMMARY */}
      <section className="reports-summary-card">
        <div className="reports-summary-header">
          <div className="reports-summary-title-wrap">
            <div className="reports-summary-icon">
              <IconCheckSquare size={20} />
            </div>

            <div>
              <div className="reports-section-kicker">
                PROCESSING INFORMATION
              </div>
              <h2>Analysis Summary</h2>
              <p>Current cadastral analysis session details.</p>
            </div>
          </div>

          <StatusBadge tone="neutral">Demo Values</StatusBadge>
        </div>

        <div className="reports-summary-grid">

          <div className="reports-summary-item">
            <span className="reports-summary-label">Input Dataset</span>
            <strong>Not yet selected</strong>
          </div>

          <div className="reports-summary-item">
            <span className="reports-summary-label">Model</span>
            <strong>U-Net</strong>
            <small>Building segmentation</small>
          </div>

          <div className="reports-summary-item">
            <span className="reports-summary-label">Buildings Detected</span>
            <strong className="reports-muted-value">--</strong>
          </div>

          <div className="reports-summary-item">
            <span className="reports-summary-label">Processing Status</span>
            <StatusBadge tone="neutral">Not connected</StatusBadge>
          </div>

          <div className="reports-summary-item reports-summary-wide">
            <span className="reports-summary-label">
              Output Coordinate System
            </span>
            <strong>EPSG:32644</strong>
            <small>WGS 84 / UTM zone 44N</small>
          </div>

        </div>
      </section>

      {/* REPORT PIPELINE */}
      <section className="reports-pipeline-card">
        <div className="reports-pipeline-left">
          <div className="reports-pipeline-icon">
            <IconFileText size={22} />
          </div>

          <div>
            <div className="reports-section-kicker">WORKFLOW</div>
            <h2>From AI Analysis to Deliverable</h2>
            <p>
              Processed imagery flows through segmentation, polygonization,
              parcel generation, validation, and final report generation.
            </p>
          </div>
        </div>

        <div className="reports-pipeline-steps">
          <div className="reports-pipeline-step">
            <span>01</span>
            <strong>AI Analysis</strong>
          </div>

          <div className="reports-pipeline-line" />

          <div className="reports-pipeline-step">
            <span>02</span>
            <strong>Parcel Mapping</strong>
          </div>

          <div className="reports-pipeline-line" />

          <div className="reports-pipeline-step">
            <span>03</span>
            <strong>Validation</strong>
          </div>

          <div className="reports-pipeline-line" />

          <div className="reports-pipeline-step reports-pipeline-active">
            <span>04</span>
            <strong>Export</strong>
          </div>
        </div>
      </section>

      {/* PROTOTYPE NOTICE */}
      <div className="reports-demo-notice">
        <div className="reports-demo-icon">✦</div>

        <div>
          <strong>Prototype Integration Notice</strong>
          <p>
            The export controls are currently presentation-ready UI elements.
            Connect them to the backend analysis outputs to enable real-time
            file preview and downloads.
          </p>
        </div>

        <span className="reports-demo-badge">BACKEND PENDING</span>
      </div>

    </div>
  );
}