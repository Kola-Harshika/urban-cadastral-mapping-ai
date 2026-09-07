import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import {
  IconCheckSquare,
  IconCpu,
  IconFileText,
  IconMap,
} from "../components/Icons";

const WORKFLOW = [
  "Input Drone Imagery",
  "Preprocessing",
  "Building Extraction",
  "Road Detection",
  "Parcel Generation",
  "Land Use Classification",
  "Topology Validation",
  "GeoJSON Output",
];

export default function Dashboard() {
  return (
    <div className="page dashboard-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="page-header dashboard-page-header">
        <div>
          <div className="prototype-badge">
            AI • GIS • CADASTRAL
          </div>

          <h1 className="page-title">
            Urban Cadastral Mapping
          </h1>

          <p className="page-description">
            AI-powered urban parcel mapping and cadastral feature
            extraction using high-resolution geospatial imagery.
          </p>
        </div>

        <div className="page-actions">
          <StatusBadge tone="success">
            System Active
          </StatusBadge>
        </div>
      </div>


      {/* =====================================================
          PROJECT STATISTICS
          ===================================================== */}

      <div className="stat-grid stat-grid--4 dashboard-stat-grid">

        <div className="result-tile dashboard-stat-card dashboard-stat-card--burgundy">
          <div className="result-tile-icon result-tile-icon--burgundy">
            <IconFileText size={18} />
          </div>

          <span className="result-tile-label">
            Dataset Images
          </span>

          <span className="result-tile-value">
            1,012
          </span>

          <span className="card-subtext">
            High-resolution imagery
          </span>
        </div>


        <div className="result-tile dashboard-stat-card dashboard-stat-card--orchid">
          <div className="result-tile-icon result-tile-icon--orchid">
            <IconCpu size={18} />
          </div>

          <span className="result-tile-label">
            AI Model
          </span>

          <span className="result-tile-value">
            U-Net
          </span>

          <span className="card-subtext">
            Building segmentation
          </span>
        </div>


        <div className="result-tile dashboard-stat-card dashboard-stat-card--peach">
          <div className="result-tile-icon result-tile-icon--peach">
            <IconCpu size={18} />
          </div>

          <span className="result-tile-label">
            Processing
          </span>

          <span className="result-tile-value">
            Active
          </span>

          <span className="card-subtext">
            Analysis pipeline
          </span>
        </div>


        <div className="result-tile dashboard-stat-card dashboard-stat-card--gold">
          <div className="result-tile-icon result-tile-icon--gold">
            <IconMap size={18} />
          </div>

          <span className="result-tile-label">
            GIS Output
          </span>

          <span className="result-tile-value">
            GeoJSON
          </span>

          <span className="card-subtext">
            GIS-ready vector data
          </span>
        </div>

      </div>


      {/* =====================================================
          COMPLETE PROCESSING WORKFLOW
          ===================================================== */}

      <div className="card workflow-card dashboard-workflow-card">

        <div className="card-head">
          <div>
            <div className="section-kicker">
              PROCESSING PIPELINE
            </div>

            <h2>
              Complete Processing Workflow
            </h2>

            <p className="card-subtext">
              Automated cadastral feature extraction pipeline.
            </p>
          </div>

          <StatusBadge tone="success">
            8 Stages
          </StatusBadge>
        </div>


        <div className="dashboard-workflow-flow">

          {WORKFLOW.map((step, index) => (
            <div
              className="dashboard-workflow-group"
              key={step}
            >

              <div className="dashboard-workflow-item">

                <span className="dashboard-workflow-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="dashboard-workflow-label">
                  {step}
                </span>

              </div>

              {index < WORKFLOW.length - 1 && (
                <span className="dashboard-workflow-arrow">
                  →
                </span>
              )}

            </div>
          ))}

        </div>

      </div>


      {/* =====================================================
          AI ANALYSIS + WEB GIS
          ===================================================== */}

      <div className="two-col dashboard-feature-grid">


        {/* AI ANALYSIS */}

        <div className="card feature-card feature-card--burgundy">

          <div className="feature-card-glow"></div>

          <div className="card-head">
            <div>

              <div className="section-kicker">
                ARTIFICIAL INTELLIGENCE
              </div>

              <h2>
                AI Cadastral Analysis
              </h2>

              <p className="card-subtext">
                Run the imagery analysis pipeline.
              </p>

            </div>

            <div className="feature-icon feature-icon--burgundy">
              <IconCpu size={21} />
            </div>
          </div>


          <p className="feature-description">
            Upload a high-resolution GeoTIFF image to perform
            building footprint extraction, road detection and
            candidate parcel generation.
          </p>


          <div className="dashboard-feature-points">

            <div className="dashboard-feature-point">
              <span className="dashboard-check dashboard-check--burgundy">
                ✓
              </span>

              <span>
                Building extraction
              </span>
            </div>

            <div className="dashboard-feature-point">
              <span className="dashboard-check dashboard-check--burgundy">
                ✓
              </span>

              <span>
                Road detection
              </span>
            </div>

            <div className="dashboard-feature-point">
              <span className="dashboard-check dashboard-check--burgundy">
                ✓
              </span>

              <span>
                Parcel generation
              </span>
            </div>

          </div>


          <Link
            to="/ai-analysis"
            className="btn btn--primary"
          >
            Open AI Analysis
            <span>→</span>
          </Link>

        </div>


        {/* WEB GIS */}

        <div className="card feature-card feature-card--orchid">

          <div className="feature-card-glow"></div>

          <div className="card-head">
            <div>

              <div className="section-kicker">
                GEOSPATIAL VISUALIZATION
              </div>

              <h2>
                Web GIS Map
              </h2>

              <p className="card-subtext">
                Visualize cadastral layers and GIS outputs.
              </p>

            </div>

            <div className="feature-icon feature-icon--orchid">
              <IconMap size={21} />
            </div>
          </div>


          <p className="feature-description">
            View imagery together with building footprints,
            roads, candidate parcels and prototype land-use
            layers.
          </p>


          <div className="dashboard-feature-points">

            <div className="dashboard-feature-point">
              <span className="dashboard-check dashboard-check--orchid">
                ✓
              </span>

              <span>
                Building footprints
              </span>
            </div>

            <div className="dashboard-feature-point">
              <span className="dashboard-check dashboard-check--orchid">
                ✓
              </span>

              <span>
                Parcel boundaries
              </span>
            </div>

            <div className="dashboard-feature-point">
              <span className="dashboard-check dashboard-check--orchid">
                ✓
              </span>

              <span>
                Land-use layers
              </span>
            </div>

          </div>


          <Link
            to="/web-gis"
            className="btn btn--ghost"
          >
            Open Web GIS
            <span>→</span>
          </Link>

        </div>

      </div>


      {/* =====================================================
          VALIDATION + REPORTS
          ===================================================== */}

      <div className="two-col dashboard-feature-grid">


        {/* VALIDATION */}

        <div className="card feature-card feature-card--peach">

          <div className="card-head">
            <div>

              <div className="section-kicker">
                QUALITY CONTROL
              </div>

              <h2>
                Topology &amp; Geometry Validation
              </h2>

              <p className="card-subtext">
                Validate GIS feature geometry and topology.
              </p>

            </div>

            <div className="feature-icon feature-icon--peach">
              <IconCheckSquare size={21} />
            </div>
          </div>


          <p className="feature-description">
            Prototype checks include overlaps, gaps, duplicate
            geometries and boundary consistency.
          </p>


          <div className="dashboard-validation-grid">

            <div className="dashboard-validation-item">
              <span className="dashboard-validation-number">
                01
              </span>

              <span>
                Overlap Check
              </span>
            </div>

            <div className="dashboard-validation-item">
              <span className="dashboard-validation-number">
                02
              </span>

              <span>
                Gap Detection
              </span>
            </div>

            <div className="dashboard-validation-item">
              <span className="dashboard-validation-number">
                03
              </span>

              <span>
                Geometry Check
              </span>
            </div>

            <div className="dashboard-validation-item">
              <span className="dashboard-validation-number">
                04
              </span>

              <span>
                Boundary Check
              </span>
            </div>

          </div>


          <Link
            to="/validation"
            className="btn btn--ghost"
          >
            Open Validation
            <span>→</span>
          </Link>

        </div>


        {/* REPORTS */}

        <div className="card feature-card feature-card--gold">

          <div className="card-head">
            <div>

              <div className="section-kicker">
                OUTPUT &amp; REPORTING
              </div>

              <h2>
                Reports &amp; Export
              </h2>

              <p className="card-subtext">
                Generate and export project results.
              </p>

            </div>

            <div className="feature-icon feature-icon--gold">
              <IconFileText size={21} />
            </div>
          </div>


          <p className="feature-description">
            Access analysis summaries and GIS-ready outputs
            generated by the cadastral mapping pipeline.
          </p>


          <div className="dashboard-export-grid">

            <div className="dashboard-export-item">
              <strong>GeoJSON</strong>
              <span>GIS Data</span>
            </div>

            <div className="dashboard-export-item">
              <strong>Summary</strong>
              <span>Analysis</span>
            </div>

            <div className="dashboard-export-item">
              <strong>Report</strong>
              <span>Project</span>
            </div>

          </div>


          <Link
            to="/reports"
            className="btn btn--ghost"
          >
            Open Reports
            <span>→</span>
          </Link>

        </div>

      </div>

    </div>
  );
}