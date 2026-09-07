import { useRef, useState } from "react";

import { IconUpload } from "../components/Icons";
import StatusBadge from "../components/StatusBadge";
import MapPlaceholder from "../components/MapPlaceholder";

export default function DroneData() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [cadastralData, setCadastralData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const f = fileList && fileList[0];

    if (!f) return;

    const isImage =
      f.type.startsWith("image/") ||
      /\.(tif|tiff)$/i.test(f.name);

    if (!isImage) {
      alert("Please upload a GeoTIFF, JPG, PNG or WEBP image.");
      return;
    }

    // Remove previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    let newPreviewUrl = null;

    // Browser-supported image preview
    if (
      f.type.startsWith("image/") &&
      !/\.(tif|tiff)$/i.test(f.name)
    ) {
      newPreviewUrl = URL.createObjectURL(f);
      setPreviewUrl(newPreviewUrl);
    } else {
      setPreviewUrl(null);
    }

    // Demo image metadata
    setFile({
      name: f.name,
      width: 8192,
      height: 6144,
      crs: "WGS 84 / UTM zone 44N",
      resolution: "5.2 cm/px",
      bands: "4 (R, G, B, NIR)",
    });

    // Demo cadastral record
    setCadastralData({
      plotNumber: "MR-1024",
      ownerName: "Demo Property Owner",
      plotArea: "2,450 m²",
      landUse: "Institutional",
      building: "Detected",
      roadAccess: "Available",
      parcelBoundary: "Detected",
      gisStatus: "Validated",
    });
  }

  return (
    <div className="page drone-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header drone-page-header">
        <div>
          <div className="section-kicker">
            GEOSPATIAL INPUT
          </div>

          <h1>Drone Data</h1>

          <p>
            Upload high-resolution imagery or a map screenshot
            for cadastral feature analysis.
          </p>
        </div>

        <div className="drone-header-badge">
          <span className="drone-header-dot"></span>
          Ready for Analysis
        </div>
      </div>

      {/* =====================================================
          UPLOAD SECTION
      ===================================================== */}

      <div className="card upload-card">

        <div className="card-head upload-card-head">
          <div>
            <h2>Imagery Input</h2>

            <p className="card-subtext">
              Add a georeferenced image or map screenshot
              to begin the cadastral workflow.
            </p>
          </div>

          <div className="upload-card-icon">
            <IconUpload size={21} />
          </div>
        </div>

        <div
          className={
            "upload-zone drone-upload-zone" +
            (dragOver ? " upload-zone--drag" : "")
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <div className="upload-icon-wrapper">
            <IconUpload size={30} />
          </div>

          <h3>
            Upload Imagery / Map Screenshot
          </h3>

          <p>
            Drag and drop a GeoTIFF, satellite image or
            Google Maps screenshot here.
          </p>

          <p className="upload-zone-formats">
            Supported: .tif · .tiff · .jpg · .jpeg · .png · .webp
          </p>

          <button
            className="btn btn--primary upload-browse-btn"
            onClick={() => inputRef.current?.click()}
          >
            <IconUpload size={16} />
            Browse Files
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".tif,.tiff,.jpg,.jpeg,.png,.webp,image/*"
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <div className="upload-note">
          <span>ⓘ</span>
          <span>
            For best results, use high-resolution georeferenced
            drone imagery.
          </span>
        </div>
      </div>

      {/* =====================================================
          IMAGE INFORMATION + PREVIEW
      ===================================================== */}

      <div className="two-col drone-main-grid">

        {/* IMAGE INFORMATION */}

        <div className="card drone-info-card">

          <div className="card-head">
            <div>
              <div className="section-kicker">
                SOURCE DATA
              </div>

              <h2>Image Information</h2>
            </div>

            {!file && (
              <StatusBadge tone="neutral">
                No file selected
              </StatusBadge>
            )}

            {file && (
              <StatusBadge tone="success">
                Image Loaded
              </StatusBadge>
            )}
          </div>

          {file ? (
            <>
              <div className="file-loaded-banner">
                <div className="file-loaded-icon">
                  ✓
                </div>

                <div>
                  <strong>{file.name}</strong>

                  <span>
                    Dataset successfully loaded
                  </span>
                </div>
              </div>

              <dl className="info-list drone-info-list">

                <div>
                  <dt>File name</dt>
                  <dd>{file.name}</dd>
                </div>

                <div>
                  <dt>Image dimensions</dt>
                  <dd>
                    {file.width}px × {file.height}px
                  </dd>
                </div>

                <div>
                  <dt>Coordinate Reference System</dt>
                  <dd>{file.crs}</dd>
                </div>

                <div>
                  <dt>Ground resolution</dt>
                  <dd>{file.resolution}</dd>
                </div>

                <div>
                  <dt>Spectral bands</dt>
                  <dd>{file.bands}</dd>
                </div>

              </dl>
            </>
          ) : (
            <div className="drone-empty-state">

              <div className="drone-empty-icon">
                <IconUpload size={24} />
              </div>

              <h3>No imagery loaded</h3>

              <p>
                Upload an image or screenshot to begin
                cadastral analysis.
              </p>

            </div>
          )}
        </div>

        {/* DATASET PREVIEW */}

        <div className="card drone-preview-card">

          <div className="card-head">

            <div>
              <div className="section-kicker">
                VISUAL PREVIEW
              </div>

              <h2>Dataset Preview</h2>
            </div>

            <StatusBadge tone="neutral">
              {file ? "Image Preview" : "Demo Visualization"}
            </StatusBadge>

          </div>

          <div className="preview-frame">

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded map"
                className="uploaded-preview-image"
              />
            ) : (
              <MapPlaceholder
                variant="preview"
                layers={{
                  imagery: true,
                  buildings: false,
                  parcels: false,
                  roads: false,
                  landUse: false,
                }}
              />
            )}

          </div>

          <div className="preview-caption">

            <span className="preview-caption-dot"></span>

            <p>
              {file
                ? "Uploaded imagery ready for cadastral feature analysis."
                : "Rendered locally for demonstration — no external map service is required."}
            </p>

          </div>
        </div>
      </div>

      {/* =====================================================
          CADASTRAL INFORMATION
      ===================================================== */}

      {cadastralData && (
        <div className="card cadastral-card">

          <div className="card-head">

            <div>
              <div className="section-kicker">
                EXTRACTED FEATURES
              </div>

              <h2>Cadastral Information</h2>

              <p className="card-subtext">
                Cadastral features identified from the
                uploaded imagery.
              </p>
            </div>

            <StatusBadge tone="neutral">
              DEMO RECORD
            </StatusBadge>

          </div>

          {/* TOP SUMMARY */}

          <div className="cadastral-summary">

            <div className="cadastral-summary-item">
              <span className="summary-label">
                Parcel
              </span>

              <strong>
                {cadastralData.plotNumber}
              </strong>
            </div>

            <div className="cadastral-summary-item">
              <span className="summary-label">
                Area
              </span>

              <strong>
                {cadastralData.plotArea}
              </strong>
            </div>

            <div className="cadastral-summary-item">
              <span className="summary-label">
                Land Use
              </span>

              <strong>
                {cadastralData.landUse}
              </strong>
            </div>

            <div className="cadastral-summary-item">
              <span className="summary-label">
                GIS Status
              </span>

              <strong className="summary-success">
                {cadastralData.gisStatus}
              </strong>
            </div>

          </div>

          {/* DETAILS */}

          <div className="two-col cadastral-details-grid">

            <div>
              <div className="cadastral-column-title">
                PROPERTY DETAILS
              </div>

              <dl className="info-list">

                <div>
                  <dt>Plot / Parcel Number</dt>
                  <dd>
                    {cadastralData.plotNumber}
                  </dd>
                </div>

                <div>
                  <dt>Land Owner</dt>
                  <dd>
                    {cadastralData.ownerName}
                  </dd>
                </div>

                <div>
                  <dt>Plot Area</dt>
                  <dd>
                    {cadastralData.plotArea}
                  </dd>
                </div>

                <div>
                  <dt>Land Use</dt>
                  <dd>
                    {cadastralData.landUse}
                  </dd>
                </div>

              </dl>
            </div>

            <div>
              <div className="cadastral-column-title">
                GIS FEATURES
              </div>

              <dl className="info-list">

                <div>
                  <dt>Building Footprint</dt>

                  <dd>
                    <span className="inline-status inline-status--success">
                      ● {cadastralData.building}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt>Road Access</dt>

                  <dd>
                    <span className="inline-status inline-status--success">
                      ● {cadastralData.roadAccess}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt>Parcel Boundary</dt>

                  <dd>
                    <span className="inline-status inline-status--success">
                      ● {cadastralData.parcelBoundary}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt>GIS Status</dt>

                  <dd>
                    <span className="inline-status inline-status--success">
                      ● {cadastralData.gisStatus}
                    </span>
                  </dd>
                </div>

              </dl>
            </div>

          </div>

          {/* DEMO NOTICE */}

          <div className="demo-record-notice">

            <div className="demo-record-icon">
              i
            </div>

            <div>
              <strong>Prototype demonstration record</strong>

              <p>
                The owner name, plot number and plot area shown
                above are illustrative records for prototype
                demonstration and are not official land records.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}