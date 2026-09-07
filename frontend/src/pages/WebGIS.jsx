import { useState } from "react";
import MapPlaceholder from "../components/MapPlaceholder";
import StatusBadge from "../components/StatusBadge";
import {
  IconPlus,
  IconMinus,
  IconMaximize,
  IconLayers,
  IconRuler,
  IconCursor,
  IconMap,
  IconCheckSquare,
  IconCpu,
} from "../components/Icons";

/* =========================================================
   MAP TOOLS
   ========================================================= */

const TOOLS = [
  { id: "zoom-in", icon: IconPlus, label: "Zoom in" },
  { id: "zoom-out", icon: IconMinus, label: "Zoom out" },
  { id: "fit", icon: IconMaximize, label: "Fit view" },
  { id: "layers", icon: IconLayers, label: "Layers" },
  { id: "measure", icon: IconRuler, label: "Measure" },
  { id: "select", icon: IconCursor, label: "Select" },
];

/* =========================================================
   LAYER INFORMATION
   ========================================================= */

const LAYER_INFO = [
  {
    key: "imagery",
    label: "Source Imagery",
    status: "Available",
    short: "IMG",
  },
  {
    key: "buildings",
    label: "Building Footprints",
    status: "AI Extracted",
    short: "BLD",
  },
  {
    key: "roads",
    label: "Road Features",
    status: "Prototype",
    short: "RD",
  },
  {
    key: "parcels",
    label: "Parcel Boundaries",
    status: "Prototype",
    short: "PAR",
  },
  {
    key: "landUse",
    label: "Land Use",
    status: "Prototype",
    short: "LU",
  },
];

/* =========================================================
   DEMO CADASTRAL RECORDS
   ========================================================= */

const DEMO_CADASTRAL_RECORDS = [
  {
    plotNumber: "P-1024",
    ownerName: "Demo Property Owner",
    plotArea: "2,450 m²",
    landUse: "Residential",
    building: "Detected",
    roadAccess: "Available",
    parcelBoundary: "Detected",
    gisStatus: "Validated",
  },
  {
    plotNumber: "P-1025",
    ownerName: "Demo Land Owner",
    plotArea: "1,875 m²",
    landUse: "Commercial",
    building: "Detected",
    roadAccess: "Available",
    parcelBoundary: "Detected",
    gisStatus: "Validated",
  },
  {
    plotNumber: "P-1031",
    ownerName: "Sample Property Holder",
    plotArea: "3,120 m²",
    landUse: "Institutional",
    building: "Detected",
    roadAccess: "Available",
    parcelBoundary: "Detected",
    gisStatus: "Validated",
  },
];

/* =========================================================
   PREVIOUS SURVEY
   ========================================================= */

const PREVIOUS_SURVEY = {
  surveyYear: "2025",

  buildings: [
    { id: "BLD-0142", area: 182 },
    { id: "BLD-0143", area: 121 },
    { id: "BLD-0144", area: 246 },
    { id: "BLD-0145", area: 197 },
    { id: "BLD-0146", area: 231 },
    { id: "BLD-0147", area: 204 },
    { id: "BLD-0148", area: 108 },
    { id: "BLD-0149", area: 195 },
    { id: "BLD-0150", area: 179 },
    { id: "BLD-0151", area: 188 },
    { id: "BLD-0152", area: 168 },
  ],

  parcels: [
    {
      id: "P-1024",
      landUse: "Residential",
      area: 2450,
    },
    {
      id: "P-1025",
      landUse: "Residential",
      area: 1875,
    },
    {
      id: "P-1031",
      landUse: "Institutional",
      area: 3120,
    },
  ],
};

/* =========================================================
   CURRENT SURVEY
   ========================================================= */

const CURRENT_SURVEY = {
  surveyYear: "2026",

  buildings: [
    { id: "BLD-0142", area: 196 },
    { id: "BLD-0143", area: 121 },
    { id: "BLD-0144", area: 246 },
    { id: "BLD-0145", area: 197 },
    { id: "BLD-0146", area: 231 },
    { id: "BLD-0147", area: 204 },
    { id: "BLD-0148", area: 108 },
    { id: "BLD-0149", area: 195 },
    { id: "BLD-0150", area: 179 },
    { id: "BLD-0151", area: 188 },
    { id: "BLD-0152", area: 168 },
    { id: "BLD-0153", area: 160 },
    { id: "BLD-0154", area: 214 },
  ],

  parcels: [
    {
      id: "P-1024",
      landUse: "Residential",
      area: 2450,
    },
    {
      id: "P-1025",
      landUse: "Commercial",
      area: 1875,
    },
    {
      id: "P-1031",
      landUse: "Institutional",
      area: 3120,
    },
  ],
};

/* =========================================================
   AUTOMATIC SURVEY COMPARISON
   ========================================================= */

function compareSurveys(previous, current) {
  const results = [];

  current.buildings.forEach((currentBuilding) => {
    const previousBuilding = previous.buildings.find(
      (building) => building.id === currentBuilding.id
    );

    if (!previousBuilding) {
      results.push({
        type: "new",
        category: "Building",
        id: currentBuilding.id,
        title: "New building detected",
        previous: "—",
        current: `${currentBuilding.area} m²`,
        detail: `Present area: ${currentBuilding.area} m²`,
      });

      return;
    }

    const areaDifference =
      currentBuilding.area - previousBuilding.area;

    if (Math.abs(areaDifference) >= 5) {
      results.push({
        type: "modified",
        category: "Building",
        id: currentBuilding.id,
        title: "Building area changed",
        previous: `${previousBuilding.area} m²`,
        current: `${currentBuilding.area} m²`,
        detail: `${previousBuilding.area} m² → ${currentBuilding.area} m²`,
        change:
          areaDifference > 0
            ? `+${areaDifference} m²`
            : `${areaDifference} m²`,
      });

      return;
    }

    results.push({
      type: "unchanged",
      category: "Building",
      id: currentBuilding.id,
      title: "No significant change",
      previous: `${previousBuilding.area} m²`,
      current: `${currentBuilding.area} m²`,
      detail: `${currentBuilding.area} m²`,
    });
  });

  previous.buildings.forEach((previousBuilding) => {
    const currentBuilding = current.buildings.find(
      (building) => building.id === previousBuilding.id
    );

    if (!currentBuilding) {
      results.push({
        type: "discrepancy",
        category: "Building",
        id: previousBuilding.id,
        title: "Previous building not detected",
        previous: `${previousBuilding.area} m²`,
        current: "Not detected",
        detail: `Previous area: ${previousBuilding.area} m²`,
      });
    }
  });

  current.parcels.forEach((currentParcel) => {
    const previousParcel = previous.parcels.find(
      (parcel) => parcel.id === currentParcel.id
    );

    if (!previousParcel) {
      results.push({
        type: "new",
        category: "Parcel",
        id: currentParcel.id,
        title: "New parcel detected",
        previous: "—",
        current: `${currentParcel.area} m²`,
        detail: `${currentParcel.area} m² • ${currentParcel.landUse}`,
      });

      return;
    }

    if (previousParcel.landUse !== currentParcel.landUse) {
      results.push({
        type: "discrepancy",
        category: "Parcel",
        id: currentParcel.id,
        title: "Land-use change detected",
        previous: previousParcel.landUse,
        current: currentParcel.landUse,
        detail: `${previousParcel.landUse} → ${currentParcel.landUse}`,
      });

      return;
    }

    const areaDifference =
      currentParcel.area - previousParcel.area;

    if (Math.abs(areaDifference) >= 20) {
      results.push({
        type: "modified",
        category: "Parcel",
        id: currentParcel.id,
        title: "Parcel area changed",
        previous: `${previousParcel.area} m²`,
        current: `${currentParcel.area} m²`,
        detail: `${previousParcel.area} m² → ${currentParcel.area} m²`,
        change:
          areaDifference > 0
            ? `+${areaDifference} m²`
            : `${areaDifference} m²`,
      });

      return;
    }

    results.push({
      type: "unchanged",
      category: "Parcel",
      id: currentParcel.id,
      title: "No significant change",
      previous: `${previousParcel.area} m²`,
      current: `${currentParcel.area} m²`,
      detail: `${currentParcel.area} m²`,
    });
  });

  return results;
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function InfoRow({ label, value }) {
  return (
    <div className="webgis-info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  accent,
}) {
  return (
    <div className={`webgis-stat-card ${accent}`}>
      <div className="webgis-stat-top">
        <div className="webgis-stat-icon">
          {icon}
        </div>

        <span className="webgis-stat-label">
          {title}
        </span>
      </div>

      <strong className="webgis-stat-value">
        {value}
      </strong>

      <span className="webgis-stat-description">
        {description}
      </span>
    </div>
  );
}

/* =========================================================
   MAIN WEB GIS
   ========================================================= */

export default function WebGIS() {
  const [activeTool, setActiveTool] =
    useState("select");

  const [zoom, setZoom] = useState(1);

  const [layers, setLayers] = useState({
    imagery: true,
    buildings: true,
    roads: true,
    parcels: true,
    landUse: false,
  });

  const [selected, setSelected] =
    useState(null);

  const [selectedParcel, setSelectedParcel] =
    useState(DEMO_CADASTRAL_RECORDS[0]);

  const [comparisonResults, setComparisonResults] =
    useState(null);

  const [comparisonRunning, setComparisonRunning] =
    useState(false);

  function toggleLayer(key) {
    setLayers((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function handleToolClick(id) {
    if (id === "zoom-in") {
      setZoom((current) =>
        Math.min(current + 0.25, 3)
      );
      return;
    }

    if (id === "zoom-out") {
      setZoom((current) =>
        Math.max(current - 0.25, 0.75)
      );
      return;
    }

    if (id === "fit") {
      setZoom(1);
      return;
    }

    setActiveTool(id);
  }

  function selectParcel(record) {
    setSelectedParcel(record);
  }

  function runSurveyComparison() {
    setComparisonRunning(true);
    setComparisonResults(null);

    setTimeout(() => {
      const results = compareSurveys(
        PREVIOUS_SURVEY,
        CURRENT_SURVEY
      );

      setComparisonResults(results);
      setComparisonRunning(false);
    }, 1200);
  }

  const comparisonSummary =
    comparisonResults
      ? {
          unchanged:
            comparisonResults.filter(
              (item) =>
                item.type === "unchanged"
            ).length,

          newFeatures:
            comparisonResults.filter(
              (item) => item.type === "new"
            ).length,

          modified:
            comparisonResults.filter(
              (item) =>
                item.type === "modified"
            ).length,

          discrepancies:
            comparisonResults.filter(
              (item) =>
                item.type === "discrepancy"
            ).length,
        }
      : null;

  return (
    <div className="page page--map webgis-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="page-header webgis-page-header">
        <div>
          <div className="section-kicker">
            <span className="kicker-dot" />
            SPATIAL INTELLIGENCE
          </div>

          <h1 className="page-title">
            Web GIS Map
          </h1>

          <p className="page-description">
            Interactive visualization of source imagery
            and AI-assisted cadastral features including
            buildings, roads, parcels and land-use data.
          </p>
        </div>

        <div className="webgis-header-status">
          <span className="prototype-badge">
            Prototype
          </span>

          <span className="status-badge status-success">
            <span className="status-dot" />
            GIS System Active
          </span>
        </div>
      </div>

      {/* =================================================
          MAIN GIS LAYOUT
          ================================================= */}

      <div className="webgis-layout">

        {/* =================================================
            MAIN COLUMN
            ================================================= */}

        <main className="webgis-main">

          {/* MAP */}
          <section className="card webgis-map-card">

            <div className="webgis-map-header">
              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  LIVE SPATIAL VIEW
                </div>

                <h2>
                  Urban Cadastral Map
                </h2>

                <p>
                  AI-extracted geospatial features
                  over source imagery.
                </p>
              </div>

              <div className="webgis-map-header-meta">
                <span>
                  Zoom {zoom.toFixed(2)}×
                </span>

                <span className="webgis-coordinate">
                  CRS: Source
                </span>
              </div>
            </div>

            <div className="webgis-canvas">

              <MapPlaceholder
                layers={layers}
                zoom={zoom}
                onZoomChange={setZoom}
                onSelectBuilding={(feature) =>
                  setSelected(feature)
                }
                selectedId={selected?.id}
              />

              <div className="gis-toolbar">
                {TOOLS.map(
                  ({
                    id,
                    icon: Icon,
                    label,
                  }) => (
                    <button
                      key={id}
                      className={
                        "gis-toolbar-btn" +
                        (activeTool === id
                          ? " gis-toolbar-btn--active"
                          : "")
                      }
                      onClick={() =>
                        handleToolClick(id)
                      }
                      aria-label={label}
                      title={label}
                    >
                      <Icon size={16} />
                    </button>
                  )
                )}
              </div>

              <div className="webgis-map-chip">
                <span className="webgis-live-dot" />
                AI CADASTRAL LAYERS
              </div>

              <div className="gis-map-status">
                <span>
                  {Object.values(layers).filter(Boolean).length}{" "}
                  layers active
                </span>

                <span>•</span>

                <span>
                  Urban Survey 2026
                </span>
              </div>
            </div>

            <div className="webgis-map-footer">
              <div>
                <IconMap size={15} />
                <span>
                  Spatial visualization workspace
                </span>
              </div>

              <span>
                Select a building footprint for
                feature inspection
              </span>
            </div>
          </section>

          {/* =================================================
              STATISTICS
              ================================================= */}

          <div className="webgis-stat-grid">

            <StatCard
              title="BUILDINGS EXTRACTED"
              value="12"
              description="AI-assisted footprints"
              icon="BLD"
              accent="burgundy"
            />

            <StatCard
              title="ROADS DETECTED"
              value="422"
              description="Prototype extraction"
              icon="RD"
              accent="peach"
            />

            <StatCard
              title="PARCELS GENERATED"
              value="18"
              description="Candidate boundaries"
              icon="PAR"
              accent="orchid"
            />

            <StatCard
              title="DISCREPANCIES"
              value={
                comparisonSummary
                  ? comparisonSummary.discrepancies
                  : "—"
              }
              description="Previous vs present survey"
              icon="Δ"
              accent="gold"
            />

          </div>

          {/* =================================================
              SURVEY CHANGE REPORT
              ================================================= */}

          <section className="card webgis-section-card">

            <div className="card-header">
              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  CHANGE DETECTION
                </div>

                <h2 className="card-title">
                  Survey Change & Discrepancy Report
                </h2>

                <p className="card-subtitle">
                  Automatically detected changes between
                  historical and current survey data.
                </p>
              </div>

              <StatusBadge tone="warning">
                Prototype
              </StatusBadge>
            </div>

            {!comparisonResults &&
              !comparisonRunning && (
                <div className="webgis-empty-report">
                  <div className="webgis-empty-icon">
                    <IconCpu size={21} />
                  </div>

                  <strong>
                    No comparison generated yet
                  </strong>

                  <span>
                    Run the automatic survey comparison
                    from the analysis panel.
                  </span>
                </div>
              )}

            {comparisonRunning && (
              <div className="webgis-comparison-loading">
                <div className="button-spinner" />

                <div>
                  <strong>
                    Analyzing survey changes...
                  </strong>

                  <span>
                    Comparing previous and current
                    cadastral features.
                  </span>
                </div>
              </div>
            )}

            {comparisonResults && (
              <div className="webgis-table-wrap">
                <table className="webgis-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Type</th>
                      <th>Previous</th>
                      <th>Present</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {comparisonResults
                      .filter(
                        (item) =>
                          item.type !== "unchanged"
                      )
                      .map((item, index) => {

                        const statusText =
                          item.type === "new"
                            ? "New Feature"
                            : item.type ===
                              "modified"
                            ? "Modified"
                            : "Discrepancy";

                        return (
                          <tr
                            key={`${item.id}-${index}`}
                          >
                            <td>
                              <strong>
                                {item.id}
                              </strong>

                              <span>
                                {item.title}
                              </span>
                            </td>

                            <td>
                              {item.category}
                            </td>

                            <td className="muted">
                              {item.previous}
                            </td>

                            <td>
                              {item.current}
                            </td>

                            <td>
                              <span
                                className={`webgis-change-badge ${item.type}`}
                              >
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}

          </section>

          {/* =================================================
              GIS VALIDATION
              ================================================= */}

          <section className="card webgis-section-card">

            <div className="card-header">
              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  SPATIAL QUALITY CONTROL
                </div>

                <h2 className="card-title">
                  GIS Validation Summary
                </h2>

                <p className="card-subtitle">
                  Spatial consistency checks for extracted
                  cadastral features.
                </p>
              </div>

              <StatusBadge tone="warning">
                Prototype
              </StatusBadge>
            </div>

            <div className="webgis-validation-grid">

              <div className="webgis-validation-item success">
                <div className="webgis-validation-icon">
                  <IconCheckSquare size={17} />
                </div>

                <div>
                  <strong>
                    Building Topology
                  </strong>

                  <span>
                    Prototype check completed
                  </span>
                </div>
              </div>

              <div className="webgis-validation-item warning">
                <div className="webgis-validation-icon">
                  !
                </div>

                <div>
                  <strong>
                    Parcel Overlap
                  </strong>

                  <span>
                    Requires verification
                  </span>
                </div>
              </div>

              <div className="webgis-validation-item success">
                <div className="webgis-validation-icon">
                  <IconCheckSquare size={17} />
                </div>

                <div>
                  <strong>
                    Road Connectivity
                  </strong>

                  <span>
                    Prototype check completed
                  </span>
                </div>
              </div>

              <div className="webgis-validation-item warning">
                <div className="webgis-validation-icon">
                  !
                </div>

                <div>
                  <strong>
                    Land-use Consistency
                  </strong>

                  <span>
                    Review detected changes
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* =================================================
              DEMO NOTICE
              ================================================= */}

          <div className="webgis-demo-notice">
            <div className="webgis-demo-icon">
              DEMO
            </div>

            <div>
              <strong>
                Demo Cadastral & Historical Survey Data
              </strong>

              <p>
                Owner names, plot numbers, areas and
                historical survey values shown in this
                prototype are illustrative and are not
                official land records.
              </p>
            </div>
          </div>

        </main>

        {/* =================================================
            SIDEBAR
            ================================================= */}

        <aside className="webgis-side">

          {/* =================================================
              MAP LAYERS
              ================================================= */}

          <section className="card webgis-side-card">

            <div className="card-header">
              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  DATA LAYERS
                </div>

                <h2 className="card-title">
                  Map Layers
                </h2>

                <p className="card-subtitle">
                  Toggle extracted GIS layers.
                </p>
              </div>

              <div className="webgis-layer-count">
                {
                  Object.values(layers).filter(
                    Boolean
                  ).length
                }
                /5
              </div>
            </div>

            <div className="webgis-layer-list">
              {LAYER_INFO.map((layer) => (
                <label
                  key={layer.key}
                  className={`webgis-layer ${
                    layers[layer.key]
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="webgis-layer-left">

                    <input
                      type="checkbox"
                      checked={
                        layers[layer.key]
                      }
                      onChange={() =>
                        toggleLayer(
                          layer.key
                        )
                      }
                    />

                    <span className="webgis-layer-check">
                      {layers[layer.key]
                        ? "✓"
                        : ""}
                    </span>

                    <div className="webgis-layer-symbol">
                      {layer.short}
                    </div>

                    <div className="webgis-layer-name">
                      <strong>
                        {layer.label}
                      </strong>

                      <span>
                        {layer.status}
                      </span>
                    </div>

                  </div>

                  <span
                    className={`webgis-layer-dot ${
                      layer.status ===
                        "Available" ||
                      layer.status ===
                        "AI Extracted"
                        ? "ready"
                        : "prototype"
                    }`}
                  />
                </label>
              ))}
            </div>

          </section>

          {/* =================================================
              SURVEY COMPARISON
              ================================================= */}

          <section className="card webgis-side-card">

            <div className="card-header">

              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  TEMPORAL ANALYSIS
                </div>

                <h2 className="card-title">
                  Survey Change Analysis
                </h2>

                <p className="card-subtitle">
                  Compare historical and current
                  survey information.
                </p>
              </div>

              <StatusBadge tone="warning">
                Prototype
              </StatusBadge>

            </div>

            <div className="webgis-year-compare">

              <div className="webgis-year-box previous">
                <span>PREVIOUS</span>
                <strong>
                  {PREVIOUS_SURVEY.surveyYear}
                </strong>
                <small>
                  Stored Survey
                </small>
              </div>

              <div className="webgis-year-arrow">
                →
              </div>

              <div className="webgis-year-box current">
                <span>PRESENT</span>
                <strong>
                  {CURRENT_SURVEY.surveyYear}
                </strong>
                <small>
                  Current Survey
                </small>
              </div>

            </div>

            <button
              type="button"
              className="primary-button webgis-compare-button"
              onClick={runSurveyComparison}
              disabled={comparisonRunning}
            >
              {comparisonRunning ? (
                <>
                  <span className="button-spinner" />
                  Analyzing Changes...
                </>
              ) : (
                <>
                  <IconCpu size={16} />
                  Run Automatic Comparison
                </>
              )}
            </button>

            {comparisonResults && (
              <div className="webgis-comparison-results">

                <div className="webgis-summary-grid">

                  <div className="webgis-summary-box unchanged">
                    <strong>
                      {comparisonSummary.unchanged}
                    </strong>
                    <span>No Change</span>
                  </div>

                  <div className="webgis-summary-box new">
                    <strong>
                      {comparisonSummary.newFeatures}
                    </strong>
                    <span>New</span>
                  </div>

                  <div className="webgis-summary-box modified">
                    <strong>
                      {comparisonSummary.modified}
                    </strong>
                    <span>Modified</span>
                  </div>

                  <div className="webgis-summary-box discrepancy">
                    <strong>
                      {comparisonSummary.discrepancies}
                    </strong>
                    <span>Discrepancy</span>
                  </div>

                </div>

                <div className="webgis-important-title">
                  Important Changes
                </div>

                <div>
                  {comparisonResults
                    .filter(
                      (item) =>
                        item.type !==
                        "unchanged"
                    )
                    .slice(0, 4)
                    .map(
                      (item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className={`webgis-change-item ${item.type}`}
                        >
                          <div className="webgis-change-icon">
                            {item.type === "new"
                              ? "+"
                              : item.type ===
                                "modified"
                              ? "~"
                              : "!"}
                          </div>

                          <div>
                            <strong>
                              {item.id}
                            </strong>

                            <span>
                              {item.title}
                            </span>

                            <small>
                              {item.detail}
                            </small>
                          </div>
                        </div>
                      )
                    )}
                </div>

              </div>
            )}

            {!comparisonResults &&
              !comparisonRunning && (
                <div className="webgis-side-note">
                  Previous survey data is preloaded.
                  Run the comparison to automatically
                  identify changes and discrepancies.
                </div>
              )}

          </section>

          {/* =================================================
              CADASTRAL INFORMATION
              ================================================= */}

          <section className="card webgis-side-card">

            <div className="card-header">

              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  PROPERTY DATA
                </div>

                <h2 className="card-title">
                  Cadastral Information
                </h2>

                <p className="card-subtitle">
                  Selected parcel attributes.
                </p>
              </div>

              <StatusBadge tone="warning">
                Demo
              </StatusBadge>

            </div>

            {layers.parcels &&
            selectedParcel ? (
              <dl className="webgis-info-list">

                <InfoRow
                  label="Plot / Parcel Number"
                  value={
                    selectedParcel.plotNumber
                  }
                />

                <InfoRow
                  label="Land Owner"
                  value={
                    selectedParcel.ownerName
                  }
                />

                <InfoRow
                  label="Plot Area"
                  value={
                    selectedParcel.plotArea
                  }
                />

                <InfoRow
                  label="Land Use"
                  value={
                    selectedParcel.landUse
                  }
                />

                <InfoRow
                  label="Building Footprint"
                  value={
                    selectedParcel.building
                  }
                />

                <InfoRow
                  label="Road Access"
                  value={
                    selectedParcel.roadAccess
                  }
                />

                <InfoRow
                  label="Parcel Boundary"
                  value={
                    selectedParcel.parcelBoundary
                  }
                />

                <InfoRow
                  label="GIS Status"
                  value={
                    selectedParcel.gisStatus
                  }
                />

              </dl>
            ) : (
              <p className="empty-note">
                Enable the Parcel Boundaries
                layer to view cadastral information.
              </p>
            )}

          </section>

          {/* =================================================
              PARCEL RECORDS
              ================================================= */}

          <section className="card webgis-side-card">

            <div className="card-header">

              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  CADASTRAL DATABASE
                </div>

                <h2 className="card-title">
                  Parcel Records
                </h2>

                <p className="card-subtitle">
                  Demo cadastral records.
                </p>
              </div>

            </div>

            <div className="webgis-parcel-list">

              {DEMO_CADASTRAL_RECORDS.map(
                (record) => {
                  const isSelected =
                    selectedParcel.plotNumber ===
                    record.plotNumber;

                  return (
                    <button
                      key={record.plotNumber}
                      className={`webgis-parcel-record ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectParcel(record)
                      }
                    >
                      <div className="webgis-parcel-number">
                        {record.plotNumber}
                      </div>

                      <div className="webgis-parcel-details">
                        <strong>
                          {record.landUse}
                        </strong>

                        <span>
                          {record.plotArea}
                        </span>
                      </div>

                      <span className="webgis-parcel-arrow">
                        →
                      </span>
                    </button>
                  );
                }
              )}

            </div>

          </section>

          {/* =================================================
              SELECTED FEATURE
              ================================================= */}

          <section className="card webgis-side-card">

            <div className="card-header">

              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  FEATURE INSPECTOR
                </div>

                <h2 className="card-title">
                  Selected Feature
                </h2>

                <p className="card-subtitle">
                  AI-extracted feature information.
                </p>
              </div>

            </div>

            {selected ? (
              <dl className="webgis-info-list">

                <InfoRow
                  label="Feature Type"
                  value="Building Footprint"
                />

                <InfoRow
                  label="Feature ID"
                  value={
                    selected.id ||
                    "BLD-001"
                  }
                />

                <InfoRow
                  label="Area"
                  value={
                    selected.area ||
                    "N/A"
                  }
                />

                <InfoRow
                  label="Confidence"
                  value={
                    selected.confidence ||
                    "N/A"
                  }
                />

                <InfoRow
                  label="Source"
                  value="AI Extraction"
                />

                <div className="webgis-feature-status">
                  <dt>Status</dt>
                  <dd>
                    <StatusBadge tone="warning">
                      Pending Verification
                    </StatusBadge>
                  </dd>
                </div>

              </dl>
            ) : (
              <div className="webgis-feature-empty">
                <div className="webgis-feature-empty-icon">
                  <IconCursor size={18} />
                </div>

                <strong>
                  No feature selected
                </strong>

                <span>
                  Select a building footprint on the
                  map to inspect its attributes.
                </span>
              </div>
            )}

          </section>

          {/* =================================================
              GIS DATA SUMMARY
              ================================================= */}

          <section className="card webgis-side-card">

            <div className="card-header">

              <div>
                <div className="section-kicker small">
                  <span className="kicker-dot" />
                  DATASET OVERVIEW
                </div>

                <h2 className="card-title">
                  GIS Data Summary
                </h2>

                <p className="card-subtitle">
                  Current prototype layers.
                </p>
              </div>

            </div>

            <dl className="webgis-info-list">

              <InfoRow
                label="Buildings"
                value="GeoJSON"
              />

              <InfoRow
                label="Roads"
                value="GeoJSON"
              />

              <InfoRow
                label="Parcels"
                value="GeoJSON"
              />

              <InfoRow
                label="Land Use"
                value="Prototype"
              />

              <InfoRow
                label="Cadastral Records"
                value="Demo Data"
              />

              <InfoRow
                label="Historical Survey"
                value="Preloaded Demo"
              />

              <InfoRow
                label="Coordinate System"
                value="Source CRS"
              />

              <div className="webgis-feature-status">
                <dt>Validation</dt>
                <dd>
                  <StatusBadge tone="warning">
                    Prototype
                  </StatusBadge>
                </dd>
              </div>

            </dl>

          </section>

        </aside>
      </div>
    </div>
  );
}