import React, { useState } from "react";
import {
  IconMap,
  IconCpu,
  IconCheckSquare,
} from "../components/Icons";

export default function Land_Use() {
  const [status, setStatus] = useState("ready");
  const [classified, setClassified] = useState(false);

  const classifyLandUse = () => {
    setStatus("processing");

    setTimeout(() => {
      setClassified(true);
      setStatus("completed");
    }, 1500);
  };

  const landTypes = [
    {
      name: "Residential",
      percentage: 38,
      short: "RES",
      className: "residential",
    },
    {
      name: "Commercial",
      percentage: 17,
      short: "COM",
      className: "commercial",
    },
    {
      name: "Vegetation",
      percentage: 24,
      short: "VEG",
      className: "vegetation",
    },
    {
      name: "Transportation",
      percentage: 13,
      short: "TRN",
      className: "transportation",
    },
    {
      name: "Other",
      percentage: 8,
      short: "OTH",
      className: "other",
    },
  ];

  return (
    <div className="page landuse-page">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="page-header landuse-page-header">
        <div>
          <div className="section-kicker">
            <span className="kicker-dot" />
            AI LAND INTELLIGENCE
          </div>

          <h1 className="page-title">
            Land Use Classification
          </h1>

          <p className="page-description">
            AI-assisted classification of urban land-use
            categories from high-resolution aerial imagery.
          </p>
        </div>

        <div className="landuse-header-status">
          <span className="prototype-badge">
            Prototype
          </span>

          <span
            className={`status-badge ${
              status === "completed"
                ? "status-success"
                : status === "processing"
                ? "status-processing"
                : "status-ready"
            }`}
          >
            <span className="status-dot" />

            {status === "completed"
              ? "Analysis Complete"
              : status === "processing"
              ? "Processing"
              : "Ready to Analyze"}
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN ANALYSIS GRID
      ===================================================== */}
      <div className="landuse-grid">

        {/* =================================================
            LEFT — CONTROL PANEL
        ================================================= */}
        <div className="card landuse-control-card">

          <div className="card-header landuse-card-header">

            <div className="landuse-title-row">

              <div className="feature-icon orchid">
                <IconCpu size={20} />
              </div>

              <div>
                <h2 className="card-title">
                  Land Use Analysis
                </h2>

                <p className="card-subtitle">
                  Identify major land-use categories in
                  the analyzed urban area.
                </p>
              </div>

            </div>

          </div>

          <div className="card-body">

            {/* Workflow */}
            <div className="landuse-workflow">

              {/* STEP 1 */}
              <div className="landuse-step completed">

                <div className="landuse-number">
                  <IconCheckSquare size={15} />
                </div>

                <div className="landuse-step-content">
                  <strong>
                    Input Imagery
                  </strong>

                  <span>
                    High-resolution GeoTIFF
                  </span>
                </div>

              </div>

              <div className="landuse-line" />

              {/* STEP 2 */}
              <div
                className={`landuse-step ${
                  classified ? "completed" : ""
                }`}
              >

                <div className="landuse-number">
                  {classified ? (
                    <IconCheckSquare size={15} />
                  ) : (
                    "2"
                  )}
                </div>

                <div className="landuse-step-content">
                  <strong>
                    Feature Analysis
                  </strong>

                  <span>
                    Spatial feature extraction
                  </span>
                </div>

              </div>

              <div className="landuse-line" />

              {/* STEP 3 */}
              <div
                className={`landuse-step ${
                  status === "completed"
                    ? "completed"
                    : status === "processing"
                    ? "active"
                    : ""
                }`}
              >

                <div className="landuse-number">

                  {status === "completed" ? (
                    <IconCheckSquare size={15} />
                  ) : (
                    "3"
                  )}

                </div>

                <div className="landuse-step-content">

                  <strong>
                    Land Use Classification
                  </strong>

                  <span>
                    Category assignment
                  </span>

                </div>

              </div>

            </div>

            {/* Analysis summary */}
            <div className="landuse-analysis-summary">

              <div className="landuse-summary-icon">
                <IconMap size={18} />
              </div>

              <div>
                <span>
                  Analysis Area
                </span>

                <strong>
                  Urban Parcel Region
                </strong>
              </div>

            </div>

            {/* Action button */}
            <button
              className="primary-button landuse-classify-btn"
              onClick={classifyLandUse}
              disabled={status === "processing"}
            >

              {status === "processing" ? (
                <>
                  <span className="button-spinner" />
                  Classifying Land Use...
                </>
              ) : status === "completed" ? (
                <>
                  <IconCpu size={17} />
                  Re-run Classification
                </>
              ) : (
                <>
                  <IconCpu size={17} />
                  Classify Land Use
                </>
              )}

            </button>

            <p className="landuse-action-note">
              Classification uses spatial and spectral
              characteristics to estimate urban land-use
              distribution.
            </p>

          </div>
        </div>

        {/* =================================================
            RIGHT — MAP
        ================================================= */}
        <div className="card landuse-map-card">

          <div className="card-header landuse-map-header">

            <div>

              <div className="section-kicker small">
                <span className="kicker-dot" />
                SPATIAL PREVIEW
              </div>

              <h2 className="card-title">
                Land Use Map
              </h2>

              <p className="card-subtitle">
                Spatial classification preview
              </p>

            </div>

            <span
              className={`status-badge ${
                status === "completed"
                  ? "status-success"
                  : status === "processing"
                  ? "status-processing"
                  : "status-ready"
              }`}
            >

              <span className="status-dot" />

              {status === "completed"
                ? "Completed"
                : status === "processing"
                ? "Analyzing"
                : "Ready"}

            </span>

          </div>

          <div className="card-body">

            <div className="landuse-map">

              {/* Map grid */}
              <div className="landuse-map-grid" />

              {/* Residential */}
              <div className="land-zone residential">
                <span>
                  Residential
                </span>
              </div>

              {/* Commercial */}
              <div className="land-zone commercial">
                <span>
                  Commercial
                </span>
              </div>

              {/* Vegetation */}
              <div className="land-zone vegetation">
                <span>
                  Vegetation
                </span>
              </div>

              {/* Transportation */}
              <div className="land-zone transportation">
                <span>
                  Transportation
                </span>
              </div>

              {/* Other */}
              <div className="land-zone other">
                <span>
                  Other
                </span>
              </div>

              {/* Processing overlay */}
              {status === "processing" && (
                <div className="landuse-overlay">

                  <div className="landuse-processing-ring">
                    <div className="spinner" />
                  </div>

                  <strong>
                    Analyzing land-use features
                  </strong>

                  <span>
                    Extracting spatial characteristics...
                  </span>

                </div>
              )}

              {/* Ready message */}
              {status === "ready" && (
                <div className="landuse-message">

                  <div className="landuse-message-icon">
                    <IconMap size={20} />
                  </div>

                  <strong>
                    Classification Preview
                  </strong>

                  <span>
                    Click <b>Classify Land Use</b> to
                    generate the classification.
                  </span>

                </div>
              )}

              {/* Completed message */}
              {status === "completed" && (
                <div className="landuse-complete-overlay">

                  <div className="landuse-complete-icon">
                    <IconCheckSquare size={17} />
                  </div>

                  <span>
                    Classification generated
                  </span>

                </div>
              )}

            </div>

            {/* Map legend */}
            <div className="landuse-legend">

              <div className="legend-title">
                Land-use categories
              </div>

              <div className="legend-items">

                {landTypes.map((type) => (
                  <div
                    className="legend-item"
                    key={type.name}
                  >

                    <span
                      className={`legend-color ${type.className}`}
                    />

                    <span>
                      {type.name}
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          CLASSIFICATION RESULTS
      ===================================================== */}
      <div className="card landuse-results">

        <div className="card-header">

          <div>

            <div className="section-kicker small">
              <span className="kicker-dot" />
              CLASSIFICATION OUTPUT
            </div>

            <h2 className="card-title">
              Classification Results
            </h2>

            <p className="card-subtitle">
              Estimated distribution of land-use categories
              across the analyzed region.
            </p>

          </div>

          {classified && (
            <div className="landuse-result-summary">

              <span>
                Overall coverage
              </span>

              <strong>
                100%
              </strong>

            </div>
          )}

        </div>

        <div className="card-body">

          <div className="landuse-stat-grid">

            {landTypes.map((type) => (
              <div
                className={`landuse-stat ${type.className}`}
                key={type.name}
              >

                <div
                  className={`landuse-stat-icon ${type.className}`}
                >
                  <span>
                    {type.short}
                  </span>
                </div>

                <div className="landuse-stat-content">

                  <span className="landuse-stat-label">
                    {type.name}
                  </span>

                  <strong className="landuse-stat-value">
                    {classified
                      ? `${type.percentage}%`
                      : "--"}
                  </strong>

                </div>

                {classified && (
                  <div className="landuse-stat-bar">

                    <div
                      className={`landuse-stat-bar-fill ${type.className}`}
                      style={{
                        width: `${type.percentage}%`,
                      }}
                    />

                  </div>
                )}

              </div>
            ))}

          </div>

        </div>
      </div>

      {/* =====================================================
          CLASSIFICATION INSIGHTS
      ===================================================== */}
      <div className="card landuse-info-card">

        <div className="card-header">

          <div>

            <div className="section-kicker small">
              <span className="kicker-dot" />
              AI INTERPRETATION
            </div>

            <h2 className="card-title">
              Classification Insights
            </h2>

            <p className="card-subtitle">
              How spatial features contribute to land-use
              identification.
            </p>

          </div>

        </div>

        <div className="card-body">

          <div className="landuse-info-grid">

            {/* Built-up Areas */}
            <div className="landuse-info-item">

              <div className="landuse-info-icon burgundy">
                <span>
                  BU
                </span>
              </div>

              <div>

                <h3>
                  Built-up Areas
                </h3>

                <p>
                  Building footprints and developed
                  structures act as spatial indicators for
                  residential and commercial zones.
                </p>

              </div>

            </div>

            {/* Vegetation */}
            <div className="landuse-info-item">

              <div className="landuse-info-icon orchid">
                <span>
                  VG
                </span>
              </div>

              <div>

                <h3>
                  Vegetation
                </h3>

                <p>
                  Vegetated regions are identified using
                  spectral and spatial characteristics
                  visible in the imagery.
                </p>

              </div>

            </div>

            {/* Transportation */}
            <div className="landuse-info-item">

              <div className="landuse-info-icon peach">
                <span>
                  TR
                </span>
              </div>

              <div>

                <h3>
                  Transportation
                </h3>

                <p>
                  Road networks and access corridors
                  support transportation land-use
                  identification.
                </p>

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}