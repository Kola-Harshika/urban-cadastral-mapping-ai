import React, { useRef, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { IconMap, IconUpload, IconCheckSquare } from "../components/Icons";

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

export default function ParcelMapping() {
  const [status, setStatus] = useState("ready");
  const [parcelCount, setParcelCount] = useState(null);
  const [file, setFile] = useState(null);
  const [cadastralRecord, setCadastralRecord] = useState(null);
  const inputRef = useRef(null);

  function handleImageUpload(fileList) {
    const selectedFile = fileList && fileList[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/tiff",
    ];

    const isGeoTiff = /\.(tif|tiff)$/i.test(selectedFile.name);

    if (!allowedTypes.includes(selectedFile.type) && !isGeoTiff) {
      alert("Please upload a JPG, PNG, WEBP or GeoTIFF image.");
      return;
    }

    setFile(selectedFile);

    const randomIndex = Math.floor(
      Math.random() * DEMO_CADASTRAL_RECORDS.length
    );

    setCadastralRecord(DEMO_CADASTRAL_RECORDS[randomIndex]);

    setParcelCount(null);
    setStatus("ready");
  }

  const generateParcels = async () => {
    setStatus("processing");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setParcelCount(18);

      if (!cadastralRecord) {
        setCadastralRecord(DEMO_CADASTRAL_RECORDS[0]);
      }

      setStatus("completed");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const statusTone =
    status === "completed"
      ? "success"
      : status === "processing"
      ? "info"
      : status === "error"
      ? "danger"
      : "neutral";

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <div className="page-header parcel-page-header">
        <div>
          <div className="section-kicker">
            <span>CADASTRAL INTELLIGENCE</span>
            <span className="kicker-dot" />
            <span>GIS PROCESSING</span>
          </div>

          <h1>Parcel Mapping</h1>

          <p>
            AI-assisted urban parcel boundary extraction and cadastral
            mapping from high-resolution geospatial imagery.
          </p>
        </div>

        <StatusBadge tone="info">
          Prototype Module
        </StatusBadge>
      </div>

      {/* UPLOAD SECTION */}
      <div className="card parcel-upload-card">

        <div className="card-head">
          <div className="feature-heading">
            <div className="feature-icon feature-icon--peach">
              <IconUpload size={20} />
            </div>

            <div>
              <h2>Upload Map / Satellite Image</h2>
              <p className="card-subtext">
                Provide imagery to generate a prototype cadastral layer.
              </p>
            </div>
          </div>

          {file && (
            <StatusBadge tone="success">
              Image Loaded
            </StatusBadge>
          )}
        </div>

        <div
          className="parcel-upload-zone"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,image/*"
            hidden
            onChange={(e) => handleImageUpload(e.target.files)}
          />

          <div className="parcel-upload-icon">
            <IconUpload size={28} />
          </div>

          <h3>
            {file
              ? "Choose another image"
              : "Drop your imagery here"}
          </h3>

          <p>
            Upload a Google Maps / satellite screenshot,
            aerial image or GeoTIFF.
          </p>

          <span className="parcel-upload-formats">
            JPG · PNG · WEBP · TIFF
          </span>

          <button
            type="button"
            className="btn btn--primary"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {file ? "Choose Another Image" : "Browse Image"}
          </button>

          {file && (
            <div className="parcel-upload-success">
              <span>✓</span>
              <strong>{file.name}</strong>
              <span>uploaded successfully</span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="parcel-modern-grid">

        {/* CONTROL PANEL */}
        <div className="card parcel-control-card">

          <div className="card-head">
            <div className="feature-heading">
              <div className="feature-icon feature-icon--orchid">
                <IconMap size={20} />
              </div>

              <div>
                <h2>Parcel Boundary Extraction</h2>
                <p className="card-subtext">
                  Generate parcel boundaries from extracted urban features.
                </p>
              </div>
            </div>

            <StatusBadge tone={statusTone}>
              {status === "completed"
                ? "Completed"
                : status === "processing"
                ? "Processing"
                : status === "error"
                ? "Error"
                : "Ready"}
            </StatusBadge>
          </div>

          {/* WORKFLOW */}
          <div className="parcel-workflow">

            <div className="parcel-workflow-step parcel-workflow-step--done">
              <div className="parcel-step-number">01</div>

              <div>
                <strong>Input Imagery</strong>
                <span>High-resolution imagery</span>
              </div>

              <span className="parcel-step-check">✓</span>
            </div>

            <div className="parcel-workflow-line" />

            <div className="parcel-workflow-step parcel-workflow-step--done">
              <div className="parcel-step-number">02</div>

              <div>
                <strong>Building Extraction</strong>
                <span>U-Net segmentation</span>
              </div>

              <span className="parcel-step-check">✓</span>
            </div>

            <div className="parcel-workflow-line" />

            <div className="parcel-workflow-step parcel-workflow-step--done">
              <div className="parcel-step-number">03</div>

              <div>
                <strong>Road Detection</strong>
                <span>Road feature extraction</span>
              </div>

              <span className="parcel-step-check">✓</span>
            </div>

            <div className="parcel-workflow-line" />

            <div
              className={`parcel-workflow-step ${
                status === "completed"
                  ? "parcel-workflow-step--done"
                  : status === "processing"
                  ? "parcel-workflow-step--active"
                  : ""
              }`}
            >
              <div className="parcel-step-number">04</div>

              <div>
                <strong>Parcel Generation</strong>
                <span>Boundary estimation</span>
              </div>

              {status === "completed" && (
                <span className="parcel-step-check">✓</span>
              )}
            </div>
          </div>

          {/* ACTION */}
          <div className="parcel-action-area">

            <button
              className="btn btn--primary parcel-generate-btn"
              onClick={generateParcels}
              disabled={status === "processing"}
            >
              {status === "processing"
                ? "Generating Parcels..."
                : status === "completed"
                ? "Regenerate Parcel Boundaries"
                : "Generate Parcel Boundaries"}
            </button>

            <p className="card-subtext">
              {file
                ? "Imagery is available for parcel boundary generation."
                : "Upload imagery before generating parcel boundaries."}
            </p>
          </div>

          {status === "error" && (
            <div className="parcel-error">
              Unable to generate parcel boundaries. Please try again.
            </div>
          )}
        </div>

        {/* MAP PREVIEW */}
        <div className="card parcel-map-card">

          <div className="card-head">
            <div>
              <div className="section-kicker">
                GIS VISUALIZATION
              </div>

              <h2>Parcel Map Preview</h2>

              <p className="card-subtext">
                GIS-style visualization of detected parcels,
                buildings and road corridors.
              </p>
            </div>

            <StatusBadge tone={statusTone}>
              {status === "completed"
                ? "Validated"
                : status === "processing"
                ? "Processing"
                : "Ready"}
            </StatusBadge>
          </div>

          {/* MAP */}
          <div className="parcel-map-modern">

            <div className="map-grid-modern" />

            {/* Roads */}
            <div className="modern-road modern-road-1" />
            <div className="modern-road modern-road-2" />
            <div className="modern-road modern-road-3" />

            {/* Buildings */}
            <div className="modern-building modern-building-1" />
            <div className="modern-building modern-building-2" />
            <div className="modern-building modern-building-3" />
            <div className="modern-building modern-building-4" />
            <div className="modern-building modern-building-5" />
            <div className="modern-building modern-building-6" />

            {/* Parcels */}
            <div className="modern-parcel modern-parcel-1">
              <span>P-001</span>
            </div>

            <div className="modern-parcel modern-parcel-2">
              <span>P-002</span>
            </div>

            <div className="modern-parcel modern-parcel-3">
              <span>P-003</span>
            </div>

            <div className="modern-parcel modern-parcel-4">
              <span>P-004</span>
            </div>

            <div className="modern-parcel modern-parcel-5">
              <span>P-005</span>
            </div>

            <div className="modern-parcel modern-parcel-6">
              <span>P-006</span>
            </div>

            {/* Processing */}
            {status === "processing" && (
              <div className="parcel-map-overlay">
                <div className="parcel-spinner" />

                <strong>
                  Generating parcel boundaries
                </strong>

                <span>
                  Analysing buildings and road corridors...
                </span>
              </div>
            )}

            {/* Ready */}
            {status === "ready" && (
              <div className="parcel-map-message">
                <div className="parcel-map-message-icon">
                  <IconMap size={22} />
                </div>

                <strong>
                  {file
                    ? "Ready to generate parcel layer"
                    : "Waiting for imagery"}
                </strong>

                <span>
                  {file
                    ? "Click Generate Parcel Boundaries to continue."
                    : "Upload an image to begin parcel mapping."}
                </span>
              </div>
            )}
          </div>

          {/* MAP LEGEND */}
          <div className="parcel-map-legend">
            <span>
              <i className="legend-building" />
              Buildings
            </span>

            <span>
              <i className="legend-road" />
              Roads
            </span>

            <span>
              <i className="legend-parcel" />
              Parcel Boundaries
            </span>
          </div>

          {/* RESULTS */}
          <div className="parcel-result-grid">

            <div className="parcel-result-stat">
              <span>Parcels Detected</span>
              <strong>{parcelCount ?? "--"}</strong>
            </div>

            <div className="parcel-result-stat">
              <span>Boundary Status</span>
              <strong>
                {status === "completed"
                  ? "Validated"
                  : "--"}
              </strong>
            </div>

            <div className="parcel-result-stat">
              <span>GIS Output</span>
              <strong>
                {status === "completed"
                  ? "GeoJSON"
                  : "--"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* CADASTRAL INFORMATION */}
      {cadastralRecord && (
        <div className="card cadastral-modern-card">

          <div className="card-head">
            <div className="feature-heading">
              <div className="feature-icon feature-icon--gold">
                <IconCheckSquare size={20} />
              </div>

              <div>
                <h2>Cadastral Information</h2>

                <p className="card-subtext">
                  Attributes associated with the selected
                  prototype parcel.
                </p>
              </div>
            </div>

            <StatusBadge tone="warning">
              DEMO RECORD
            </StatusBadge>
          </div>

          <div className="cadastral-grid">

            <div className="cadastral-item">
              <span>Plot / Parcel Number</span>
              <strong>{cadastralRecord.plotNumber}</strong>
            </div>

            <div className="cadastral-item">
              <span>Land Owner</span>
              <strong>{cadastralRecord.ownerName}</strong>
            </div>

            <div className="cadastral-item">
              <span>Plot Area</span>
              <strong>{cadastralRecord.plotArea}</strong>
            </div>

            <div className="cadastral-item">
              <span>Land Use</span>
              <strong>{cadastralRecord.landUse}</strong>
            </div>

            <div className="cadastral-item">
              <span>Building Footprint</span>
              <strong>{cadastralRecord.building}</strong>
            </div>

            <div className="cadastral-item">
              <span>Road Access</span>
              <strong>{cadastralRecord.roadAccess}</strong>
            </div>

            <div className="cadastral-item">
              <span>Parcel Boundary</span>
              <strong>{cadastralRecord.parcelBoundary}</strong>
            </div>

            <div className="cadastral-item">
              <span>GIS Status</span>
              <strong>{cadastralRecord.gisStatus}</strong>
            </div>
          </div>

          <div className="demo-record-notice">
            <strong>Prototype Notice</strong>

            <span>
              The cadastral attributes displayed above are dummy
              values used for prototype demonstration. They are not
              official land ownership or cadastral records.
            </span>
          </div>
        </div>
      )}

      {/* INFORMATION */}
      <div className="parcel-info-grid">

        <div className="card parcel-info-card">
          <div className="info-card-icon info-card-icon--peach">
            <span>⌂</span>
          </div>

          <h3>Building Footprints</h3>

          <p>
            Extracted building footprints provide spatial evidence
            for generating and refining urban parcel boundaries.
          </p>
        </div>

        <div className="card parcel-info-card">
          <div className="info-card-icon info-card-icon--orchid">
            <span>↗</span>
          </div>

          <h3>Road & Access Corridors</h3>

          <p>
            Detected roads help identify access corridors and
            spatial boundaries between neighbouring urban parcels.
          </p>
        </div>

        <div className="card parcel-info-card">
          <div className="info-card-icon info-card-icon--gold">
            <span>◇</span>
          </div>

          <h3>Cadastral Information</h3>

          <p>
            Parcel polygons can be associated with plot numbers,
            area, land use and other cadastral attributes.
          </p>
        </div>
      </div>
    </div>
  );
}