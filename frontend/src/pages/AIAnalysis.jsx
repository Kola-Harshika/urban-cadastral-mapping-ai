import { useEffect, useRef, useState } from "react";

import Workflow from "../components/Workflow";
import StatusBadge from "../components/StatusBadge";
import MapPlaceholder from "../components/MapPlaceholder";

import {
  IconEye,
  IconDownload,
  IconCpu,
} from "../components/Icons";

const API_BASE = "http://127.0.0.1:8000";

const PIPELINE = [
  { label: "Input GeoTIFF" },
  { label: "Preprocessing" },
  { label: "U-Net" },
  { label: "Probability Mask" },
  { label: "Binary Mask" },
  { label: "Polygonization" },
  { label: "Road Detection" },
  { label: "Parcel Generation" },
  { label: "Land Use Classification" },
  { label: "Topology Validation" },
  { label: "GeoJSON" },
];

const OUTPUT_FILES = [
  {
    label: "Building Mask",
    file: "building_mask.tif",
    endpoint: "/api/output/mask",
    canView: false,
    type: "generated",
  },
  {
    label: "Building Footprints",
    file: "building_footprints.geojson",
    endpoint: "/api/output/geojson",
    canView: false,
    type: "generated",
  },
  {
    label: "Building Overlay",
    file: "building_overlay.png",
    endpoint: "/api/output/overlay",
    canView: true,
    type: "generated",
  },
  {
    label: "Road Features",
    file: "road_features.geojson",
    endpoint: "/api/output/roads",
    canView: false,
    type: "generated",
  },
  {
    label: "Parcel Boundaries",
    file: "parcels.geojson",
    endpoint: "/api/output/parcels",
    canView: false,
    type: "generated",
  },
  {
    label: "Land Use Classification",
    file: "land_use_classification.geojson",
    endpoint: null,
    canView: false,
    type: "prototype",
  },
  {
    label: "Topology Validation Report",
    file: "topology_validation_report.json",
    endpoint: null,
    canView: false,
    type: "prototype",
  },
];

export default function AIAnalysis() {
  const [status, setStatus] = useState("ready");
  const [progress, setProgress] = useState(0);
  const [threshold, setThreshold] = useState(0.5);
  const [minArea, setMinArea] = useState("20");
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setStatus("ready");
    setProgress(0);
    setResult(null);
    setError("");
    setNote("");
  }

  async function runAnalysis() {
    if (!selectedFile) {
      setNote("Please select a GeoTIFF image first.");
      return;
    }

    setStatus("processing");
    setProgress(5);
    setResult(null);
    setError("");
    setNote("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    timerRef.current = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 90) {
          return previous;
        }

        return previous + 3;
      });
    }, 500);

    const startTime = performance.now();

    try {
      const response = await fetch(
        `${API_BASE}/api/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      clearInterval(timerRef.current);

      const processingTime = (
        (performance.now() - startTime) /
        1000
      ).toFixed(1);

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "AI analysis failed."
        );
      }

      setProgress(100);
      setStatus("completed");

      setResult({
        ...data,
        processingTime,
      });
    } catch (err) {
      clearInterval(timerRef.current);

      setStatus("error");
      setProgress(0);
      setError(
        err.message ||
          "Unable to connect to the AI backend."
      );
    }
  }

  function resetAnalysis() {
    clearInterval(timerRef.current);

    setStatus("ready");
    setProgress(0);
    setResult(null);
    setError("");
    setNote("");
  }

  function getOutputUrl(endpoint) {
    return `${API_BASE}${endpoint}`;
  }

  function handleView(file) {
    if (!result) return;

    if (file.type === "prototype") {
      setNote(
        `"${file.label}" is currently a prototype module and does not have a live backend file.`
      );
      return;
    }

    const url = getOutputUrl(file.endpoint);

    if (file.canView) {
      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      setNote(
        `Opening "${file.label}" in a new tab.`
      );
    } else {
      setNote(
        `"${file.label}" is a GIS output file. Use Download to save it.`
      );
    }
  }

  function handleDownload(file) {
    if (!result) return;

    if (file.type === "prototype") {
      setNote(
        `"${file.label}" is currently a prototype output and is not connected to a downloadable backend file.`
      );
      return;
    }

    const url = getOutputUrl(file.endpoint);

    const link = document.createElement("a");

    link.href = url;
    link.download = file.file;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNote(`Downloading "${file.label}"...`);
  }

  const stepIndex =
    status === "completed"
      ? PIPELINE.length - 1
      : Math.min(
          PIPELINE.length - 1,
          Math.floor(
            (progress / 100) * PIPELINE.length
          )
        );

  const pipelineSteps = PIPELINE.map(
    (step, index) => ({
      ...step,

      state:
        status === "completed" ||
        index < stepIndex
          ? "done"
          : status === "processing" &&
            index === stepIndex
          ? "active"
          : "pending",
    })
  );

  return (
    <div className="page ai-analysis-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header ai-page-header">

        <div>
          <div className="section-kicker">
            AI PROCESSING ENGINE
          </div>

          <h1>AI Cadastral Analysis</h1>

          <p>
            AI-powered extraction and GIS processing pipeline
            for building footprints, roads, candidate parcel
            boundaries, land-use classification and topology
            validation from high-resolution GeoTIFF imagery.
          </p>
        </div>

        <div
          className={`ai-status-pill ai-status-pill--${status}`}
        >
          <span className="ai-status-dot"></span>

          {status === "ready" && "System Ready"}
          {status === "processing" && "AI Processing"}
          {status === "completed" && "Analysis Complete"}
          {status === "error" && "Processing Error"}
        </div>
      </div>

      {/* =====================================================
          PIPELINE
      ===================================================== */}

      <div className="card ai-pipeline-card">

        <div className="card-head">

          <div>
            <div className="section-kicker">
              PROCESSING WORKFLOW
            </div>

            <h2>Analysis Pipeline</h2>

            <p className="card-subtext">
              Follow the complete imagery-to-GIS processing
              sequence.
            </p>
          </div>

          <div className="ai-model-chip">
            <span className="ai-chip-icon">
              <IconCpu size={16} />
            </span>

            U-Net + GIS
          </div>

        </div>

        <Workflow steps={pipelineSteps} />

        {status === "processing" && (
          <div className="ai-progress-wrapper">

            <div className="ai-progress-header">
              <span>Processing imagery...</span>

              <strong>
                {Math.min(progress, 100)}%
              </strong>
            </div>

            <div className="progress-track ai-progress-track">
              <div
                className="progress-fill ai-progress-fill"
                style={{
                  width: `${Math.min(
                    progress,
                    100
                  )}%`,
                }}
              />
            </div>

          </div>
        )}
      </div>

      {/* =====================================================
          INPUT + CONFIGURATION
      ===================================================== */}

      <div className="two-col two-col--analysis ai-control-grid">

        {/* INPUT IMAGERY */}

        <div className="card ai-input-card">

          <div className="card-head">

            <div>
              <div className="section-kicker">
                SOURCE
              </div>

              <h2>Input Imagery</h2>
            </div>

            <StatusBadge tone="neutral">
              GeoTIFF
            </StatusBadge>

          </div>

          <label className="field ai-file-field">

            <span className="field-label">
              Select RGB GeoTIFF
            </span>

            <input
              type="file"
              accept=".tif,.tiff"
              onChange={handleFileChange}
              disabled={status === "processing"}
            />

          </label>

          {selectedFile && (
            <div className="ai-selected-file">

              <div className="ai-selected-file-icon">
                ✓
              </div>

              <div>
                <span>Selected dataset</span>

                <strong>
                  {selectedFile.name}
                </strong>
              </div>

            </div>
          )}

          {!selectedFile && (
            <div className="ai-input-hint">
              <span>ⓘ</span>

              <p>
                Upload a high-resolution RGB GeoTIFF
                to activate the AI analysis pipeline.
              </p>
            </div>
          )}

          <div className="ai-map-preview">

            <MapPlaceholder
              variant="preview"
              layers={{
                imagery: true,
                buildings:
                  status === "completed",
                parcels:
                  status === "completed",
                roads:
                  status === "completed",
                landUse:
                  status === "completed",
              }}
            />

          </div>

        </div>

        {/* CONFIGURATION */}

        <div className="card ai-config-card">

          <div className="card-head">

            <div>
              <div className="section-kicker">
                MODEL SETTINGS
              </div>

              <h2>Analysis Configuration</h2>
            </div>

            <div className="config-ai-icon">
              <IconCpu size={19} />
            </div>

          </div>

          <dl className="info-list ai-config-list">

            <div>
              <dt>Model</dt>
              <dd>
                <span className="config-value-highlight">
                  U-Net
                </span>
              </dd>
            </div>

            <div>
              <dt>Input</dt>
              <dd>RGB GeoTIFF</dd>
            </div>

            <div>
              <dt>Primary AI Output</dt>
              <dd>Building Footprints</dd>
            </div>

            <div>
              <dt>GIS Processing</dt>
              <dd>
                Roads + Parcels + Land Use + Topology
              </dd>
            </div>

          </dl>

          <div className="config-divider"></div>

          <label className="field">

            <div className="range-label-row">
              <span className="field-label">
                Confidence Threshold
              </span>

              <span className="range-value">
                {threshold.toFixed(2)}
              </span>
            </div>

            <input
              className="ai-range"
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) =>
                setThreshold(
                  parseFloat(e.target.value)
                )
              }
              disabled={status === "processing"}
            />

            <div className="range-scale">
              <span>0.10</span>
              <span>More detections</span>
              <span>0.90</span>
            </div>

          </label>

          <label className="field">

            <span className="field-label">
              Minimum Polygon Area (m²)
            </span>

            <select
              value={minArea}
              onChange={(e) =>
                setMinArea(e.target.value)
              }
              disabled={status === "processing"}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

          </label>

          <div className="field-row ai-action-row">

            {status !== "processing" ? (
              <button
                className="btn btn--primary ai-run-btn"
                onClick={runAnalysis}
              >
                <IconCpu size={17} />
                Run AI Analysis
              </button>
            ) : (
              <button
                className="btn btn--disabled ai-run-btn"
                disabled
              >
                <span className="ai-spinner"></span>
                Processing…
              </button>
            )}

            {(status === "completed" ||
              status === "error") && (
              <button
                className="btn btn--ghost"
                onClick={resetAnalysis}
              >
                Reset
              </button>
            )}

          </div>

          {error && (
            <div className="ai-error-box">
              <strong>Error</strong>
              <span>{error}</span>
            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          RESULTS
      ===================================================== */}

      <div className="card ai-results-card">

        <div className="card-head">

          <div>
            <div className="section-kicker">
              MODEL OUTPUT
            </div>

            <h2>Analysis Results</h2>

            <p className="card-subtext">
              Results from the connected extraction pipeline
              and prototype GIS modules.
            </p>
          </div>

          {status === "completed" && (
            <StatusBadge tone="success">
              Results Available
            </StatusBadge>
          )}

        </div>

        <div className="stat-grid stat-grid--4 ai-result-grid">

          {/* BUILDINGS */}

          <div className="result-tile ai-result-tile ai-result-tile--burgundy">

            <div className="ai-result-top">
              <span className="result-tile-label">
                Buildings Detected
              </span>

              <span className="ai-result-symbol">
                B
              </span>
            </div>

            <span className="result-tile-value">
              {result?.building_count ?? "--"}
            </span>

            <span className="ai-result-description">
              Extracted footprints
            </span>

          </div>

          {/* CONFIDENCE */}

          <div className="result-tile ai-result-tile ai-result-tile--orchid">

            <div className="ai-result-top">
              <span className="result-tile-label">
                Average Confidence
              </span>

              <span className="ai-result-symbol">
                %
              </span>
            </div>

            <span className="result-tile-value">
              {result?.average_confidence != null
                ? result.average_confidence.toFixed(2)
                : "--"}
            </span>

            <span className="ai-result-description">
              Model confidence score
            </span>

          </div>

          {/* ROADS */}

          <div className="result-tile ai-result-tile ai-result-tile--peach">

            <div className="ai-result-top">
              <span className="result-tile-label">
                Roads Detected
              </span>

              <span className="ai-result-symbol">
                R
              </span>
            </div>

            <span className="result-tile-value">
              {result?.road_count ?? "--"}
            </span>

            <span className="ai-result-description">
              Road network features
            </span>

          </div>

          {/* PARCELS */}

          <div className="result-tile ai-result-tile ai-result-tile--gold">

            <div className="ai-result-top">
              <span className="result-tile-label">
                Parcels Detected
              </span>

              <span className="ai-result-symbol">
                P
              </span>
            </div>

            <span className="result-tile-value">
              {result?.parcel_count ?? "--"}
            </span>

            <span className="ai-result-description">
              Candidate boundaries
            </span>

          </div>

        </div>

        {/* SECONDARY RESULTS */}

        <div className="stat-grid ai-secondary-result-grid">

          <div className="result-tile">
            <span className="result-tile-label">
              Land Use Classification
            </span>

            <span className="result-tile-value">
              {status === "completed"
                ? "Prototype"
                : "--"}
            </span>

            <span className="ai-result-description">
              Classification module
            </span>
          </div>

          <div className="result-tile">
            <span className="result-tile-label">
              Topology Validation
            </span>

            <span className="result-tile-value">
              {status === "completed"
                ? "Prototype"
                : "--"}
            </span>

            <span className="ai-result-description">
              Geometry validation
            </span>
          </div>

          <div className="result-tile">
            <span className="result-tile-label">
              GIS Output
            </span>

            <span className="result-tile-value">
              {status === "completed"
                ? "GeoJSON"
                : "--"}
            </span>

            <span className="ai-result-description">
              GIS-ready vector data
            </span>
          </div>

          <div className="result-tile">
            <span className="result-tile-label">
              Processing Time
            </span>

            <span className="result-tile-value">
              {result?.processingTime
                ? `${result.processingTime}s`
                : "--"}
            </span>

            <span className="ai-result-description">
              End-to-end execution
            </span>
          </div>

        </div>

        {status === "completed" && (
          <div className="ai-result-note">
            <span className="ai-result-note-icon">
              ✓
            </span>

            <p>
              Building extraction, road detection and candidate
              parcel generation are connected to the current
              processing pipeline. Land-use classification and
              topology validation are presented as prototype
              modules.
            </p>
          </div>
        )}

      </div>

      {/* =====================================================
          AI PREDICTION PREVIEW
      ===================================================== */}

      {status === "completed" && result && (
        <div className="card ai-prediction-card">

          <div className="card-head">

            <div>
              <div className="section-kicker">
                VISUAL OUTPUT
              </div>

              <h2>AI Prediction Preview</h2>

              <p className="card-subtext">
                Building footprint segmentation result.
              </p>
            </div>

            <StatusBadge tone="success">
              U-Net
            </StatusBadge>

          </div>

          <div className="ai-prediction-frame">

            <img
              src={`${API_BASE}/api/output/overlay`}
              alt="AI building footprint prediction overlay"
            />

            <div className="prediction-overlay-label">
              <span className="prediction-live-dot"></span>
              AI Segmentation Output
            </div>

          </div>

          <div className="ai-prediction-caption">
            <span>U-NET</span>

            <p>
              The overlay shows the building regions detected
              by the current U-Net segmentation model.
            </p>
          </div>

        </div>
      )}

      {/* =====================================================
          OUTPUT FILES
      ===================================================== */}

      <div className="card ai-output-card">

        <div className="card-head">

          <div>
            <div className="section-kicker">
              GENERATED DATA
            </div>

            <h2>Output Files</h2>

            <p className="card-subtext">
              GIS-ready outputs and prototype processing
              results.
            </p>
          </div>

          {status !== "completed" && (
            <StatusBadge tone="neutral">
              Awaiting run
            </StatusBadge>
          )}

        </div>

        <ul className="file-list ai-file-list">

          {OUTPUT_FILES.map((file) => (
            <li
              key={file.file}
              className="file-list-item ai-file-item"
            >

              <div className="ai-file-info">

                <div className="ai-file-type-icon">
                  {file.type === "prototype"
                    ? "P"
                    : "GIS"}
                </div>

                <div>
                  <div className="file-list-name">
                    {file.label}
                  </div>

                  <div className="file-list-path">
                    {file.file}
                  </div>
                </div>

              </div>

              <div className="field-row">

                {file.type === "prototype" ? (
                  <StatusBadge tone="warning">
                    Prototype
                  </StatusBadge>
                ) : (
                  <>
                    <button
                      className="btn btn--ghost btn--sm"
                      disabled={
                        status !== "completed" ||
                        !result
                      }
                      onClick={() =>
                        handleView(file)
                      }
                    >
                      <IconEye size={14} />
                      View
                    </button>

                    <button
                      className="btn btn--ghost btn--sm"
                      disabled={
                        status !== "completed" ||
                        !result
                      }
                      onClick={() =>
                        handleDownload(file)
                      }
                    >
                      <IconDownload size={14} />
                      Download
                    </button>
                  </>
                )}

              </div>

            </li>
          ))}

        </ul>

        {note && (
          <div className="ai-output-note">
            <span>ⓘ</span>
            {note}
          </div>
        )}

      </div>

    </div>
  );
}