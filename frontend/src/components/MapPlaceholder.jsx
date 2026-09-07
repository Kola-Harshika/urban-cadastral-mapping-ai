import { useMemo, useState } from "react";

// Static/mock aerial-cadastral scene rendered with SVG.
// The popup UI is also rendered inside the SVG so it stays attached
// to the selected feature while zooming.

const BUILDINGS = [
  { id: "BLD-0142", x: 120, y: 90, w: 46, h: 34, area: "182 m²", confidence: "0.94" },
  { id: "BLD-0143", x: 178, y: 92, w: 30, h: 30, area: "121 m²", confidence: "0.88" },
  { id: "BLD-0144", x: 250, y: 120, w: 54, h: 40, area: "246 m²", confidence: "0.91" },
  { id: "BLD-0145", x: 340, y: 110, w: 38, h: 46, area: "197 m²", confidence: "0.79" },
  { id: "BLD-0146", x: 420, y: 150, w: 60, h: 34, area: "231 m²", confidence: "0.86" },
  { id: "BLD-0147", x: 130, y: 200, w: 42, h: 42, area: "204 m²", confidence: "0.92" },
  { id: "BLD-0148", x: 210, y: 220, w: 34, h: 28, area: "108 m²", confidence: "0.83" },
  { id: "BLD-0149", x: 300, y: 240, w: 48, h: 36, area: "195 m²", confidence: "0.9" },
  { id: "BLD-0150", x: 470, y: 230, w: 40, h: 40, area: "179 m²", confidence: "0.77" },
  { id: "BLD-0151", x: 540, y: 200, w: 56, h: 30, area: "188 m²", confidence: "0.85" },
  { id: "BLD-0152", x: 150, y: 300, w: 44, h: 34, area: "168 m²", confidence: "0.89" },
  { id: "BLD-0153", x: 260, y: 320, w: 38, h: 38, area: "160 m²", confidence: "0.8" },
];

const PARCELS = [
  "M 90 70 L 240 70 L 240 260 L 90 260 Z",
  "M 240 70 L 400 70 L 400 200 L 240 200 Z",
  "M 400 70 L 620 70 L 620 260 L 400 260 Z",
  "M 90 260 L 400 260 L 400 380 L 90 380 Z",
  "M 400 260 L 620 260 L 620 380 L 400 380 Z",
];

const PARCEL_INFO = [
  {
    id: "P-1024",
    owner: "Demo Property Owner",
    area: "2,450 m²",
    landUse: "Residential",
    building: "Detected",
    road: "Available",
    boundary: "Detected",
    gis: "Validated",
    x: 165,
    y: 165,
  },
  {
    id: "P-1025",
    owner: "Demo Land Owner",
    area: "1,875 m²",
    landUse: "Commercial",
    building: "Detected",
    road: "Available",
    boundary: "Detected",
    gis: "Validated",
    x: 320,
    y: 135,
  },
  {
    id: "P-1031",
    owner: "Sample Property Holder",
    area: "3,120 m²",
    landUse: "Institutional",
    building: "Detected",
    road: "Available",
    boundary: "Detected",
    gis: "Validated",
    x: 510,
    y: 165,
  },
  {
    id: "P-1032",
    owner: "Demo Parcel Record",
    area: "2,760 m²",
    landUse: "Residential",
    building: "Detected",
    road: "Available",
    boundary: "Detected",
    gis: "Validated",
    x: 245,
    y: 320,
  },
  {
    id: "P-1033",
    owner: "Sample Land Record",
    area: "2,980 m²",
    landUse: "Mixed",
    building: "Detected",
    road: "Available",
    boundary: "Detected",
    gis: "Validated",
    x: 510,
    y: 320,
  },
];

const ROADS = [
  "M 0 70 H 700",
  "M 0 260 H 700",
  "M 0 380 H 700",
  "M 240 0 V 420",
  "M 400 0 V 420",
  "M 620 0 V 420",
];

const ROAD_INFO = [
  { id: "ROAD-01", name: "Primary Access Road", type: "Road", x: 350, y: 60 },
  { id: "ROAD-02", name: "Parcel Access Corridor", type: "Road", x: 350, y: 250 },
  { id: "ROAD-03", name: "Boundary Road", type: "Road", x: 350, y: 370 },
];

export default function MapPlaceholder({
  variant = "full",
  layers,
  onSelectBuilding,
  selectedId,
  zoom = 1,
  onZoomChange,
}) {
  const showImagery = layers ? layers.imagery : true;
  const showBuildings = layers ? layers.buildings : true;
  const showParcels = layers ? layers.parcels : false;
  const showRoads = layers ? layers.roads : false;
  const showLandUse = layers ? layers.landUse : false;

  const [internalZoom, setInternalZoom] = useState(1);

  // Popup state
  const [popup, setPopup] = useState(null);

  const currentZoom = onZoomChange ? zoom : internalZoom;

  const ticksX = useMemo(
    () => [0, 100, 200, 300, 400, 500, 600, 700],
    []
  );

  const ticksY = useMemo(
    () => [0, 70, 140, 210, 280, 350, 420],
    []
  );

  const updateZoom = (newZoom) => {
    const clampedZoom = Math.min(3, Math.max(0.75, newZoom));

    if (onZoomChange) {
      onZoomChange(clampedZoom);
    } else {
      setInternalZoom(clampedZoom);
    }
  };

  const zoomIn = () => {
    updateZoom(currentZoom + 0.25);
  };

  const zoomOut = () => {
    updateZoom(currentZoom - 0.25);
  };

  const resetZoom = () => {
    updateZoom(1);
  };

  // -----------------------------
  // BUILDING CLICK
  // -----------------------------
  const handleBuildingClick = (building) => {
    setPopup({
      type: "building",
      data: building,
      x: building.x + building.w / 2,
      y: building.y,
    });

    if (onSelectBuilding) {
      onSelectBuilding(building);
    }
  };

  // -----------------------------
  // PARCEL CLICK
  // -----------------------------
  const handleParcelClick = (parcel, index) => {
    setPopup({
      type: "parcel",
      data: parcel,
      x: parcel.x,
      y: parcel.y,
    });
  };

  // -----------------------------
  // ROAD CLICK
  // -----------------------------
  const handleRoadClick = (road, index) => {
    const info =
      ROAD_INFO[index % ROAD_INFO.length];

    setPopup({
      type: "road",
      data: info,
      x: info.x,
      y: info.y,
    });
  };

  return (
    <div className={`gis-map gis-map--${variant}`}>
      <svg
        viewBox="0 0 700 420"
        className="gis-map-svg"
        preserveAspectRatio="xMidYMid slice"
        onClick={() => {
          if (popup) setPopup(null);
        }}
      >
        <g
          transform={`translate(${350 - 350 * currentZoom} ${
            210 - 210 * currentZoom
          }) scale(${currentZoom})`}
        >
          {/* -------------------------------- */}
          {/* IMAGERY */}
          {/* -------------------------------- */}
          {showImagery && (
            <>
              <rect
                x="0"
                y="0"
                width="700"
                height="420"
                fill="url(#imageryFill)"
              />

              {ticksX.map((x) => (
                <line
                  key={`gx-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="420"
                  className="gis-grid-line"
                />
              ))}

              {ticksY.map((y) => (
                <line
                  key={`gy-${y}`}
                  x1="0"
                  y1={y}
                  x2="700"
                  y2={y}
                  className="gis-grid-line"
                />
              ))}
            </>
          )}

          {/* -------------------------------- */}
          {/* LAND USE */}
          {/* -------------------------------- */}
          {showLandUse && (
            <>
              <rect
                x="0"
                y="0"
                width="240"
                height="260"
                className="gis-landuse gis-landuse--residential"
              />

              <rect
                x="400"
                y="0"
                width="220"
                height="260"
                className="gis-landuse gis-landuse--commercial"
              />

              <rect
                x="0"
                y="260"
                width="700"
                height="160"
                className="gis-landuse gis-landuse--mixed"
              />
            </>
          )}

          {/* -------------------------------- */}
          {/* ROADS */}
          {/* -------------------------------- */}
          {showRoads &&
            ROADS.map((d, i) => (
              <path
                key={i}
                d={d}
                className="gis-road"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoadClick(d, i);
                }}
                style={{ cursor: "pointer" }}
              />
            ))}

          {/* -------------------------------- */}
          {/* PARCELS */}
          {/* -------------------------------- */}
          {showParcels &&
            PARCELS.map((d, i) => {
              const parcel = PARCEL_INFO[i];

              return (
                <path
                  key={i}
                  d={d}
                  className={
                    "gis-parcel" +
                    (popup?.type === "parcel" &&
                    popup?.data?.id === parcel?.id
                      ? " gis-parcel--selected"
                      : "")
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleParcelClick(parcel, i);
                  }}
                  style={{ cursor: "pointer" }}
                />
              );
            })}

          {/* -------------------------------- */}
          {/* BUILDINGS */}
          {/* -------------------------------- */}
          {showBuildings &&
            BUILDINGS.map((b) => (
              <rect
                key={b.id}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="1.5"
                className={
                  "gis-building" +
                  (selectedId === b.id
                    ? " gis-building--selected"
                    : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuildingClick(b);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <title>{b.id}</title>
              </rect>
            ))}

          {/* ================================= */}
          {/* FLOATING GIS POPUP */}
          {/* ================================= */}
          {popup && (
            <g
              transform={`translate(${popup.x} ${popup.y})`}
              onClick={(e) => e.stopPropagation()}
              className="gis-floating-popup"
            >
              {/* ============================= */}
              {/* BUILDING POPUP */}
              {/* ============================= */}
              {popup.type === "building" && (
                <g>
                  {/* Pointer */}
                  <path
                    d="M -9 18 L 0 30 L 9 18"
                    fill="#635bff"
                    opacity="0.95"
                  />

                  {/* Shadow */}
                  <ellipse
                    cx="0"
                    cy="17"
                    rx="73"
                    ry="10"
                    fill="#111827"
                    opacity="0.18"
                  />

                  {/* Main cylinder */}
                  <rect
                    x="-73"
                    y="-70"
                    width="146"
                    height="88"
                    rx="18"
                    fill="#635bff"
                    opacity="0.96"
                  />

                  {/* Top cylinder */}
                  <ellipse
                    cx="0"
                    cy="-70"
                    rx="73"
                    ry="18"
                    fill="#8179ff"
                  />

                  {/* Bottom cylinder */}
                  <ellipse
                    cx="0"
                    cy="18"
                    rx="73"
                    ry="14"
                    fill="#4b45c7"
                  />

                  {/* Header */}
                  <text
                    x="-56"
                    y="-73"
                    fill="white"
                    fontSize="11"
                    fontWeight="700"
                  >
                    🏢 BUILDING
                  </text>

                  {/* Close */}
                  <text
                    x="53"
                    y="-72"
                    fill="white"
                    fontSize="17"
                    fontWeight="700"
                    style={{ cursor: "pointer" }}
                    onClick={() => setPopup(null)}
                  >
                    ×
                  </text>

                  {/* ID */}
                  <text
                    x="-56"
                    y="-48"
                    fill="white"
                    fontSize="15"
                    fontWeight="700"
                  >
                    {popup.data.id}
                  </text>

                  {/* Information */}
                  <text
                    x="-56"
                    y="-28"
                    fill="white"
                    fontSize="10"
                  >
                    Area: {popup.data.area}
                  </text>

                  <text
                    x="-56"
                    y="-12"
                    fill="white"
                    fontSize="10"
                  >
                    AI Confidence:{" "}
                    {Math.round(
                      Number(popup.data.confidence) * 100
                    )}
                    %
                  </text>

                  <text
                    x="5"
                    y="-12"
                    fill="#d7ffd9"
                    fontSize="9"
                    fontWeight="700"
                  >
                    AI ✓
                  </text>
                </g>
              )}

              {/* ============================= */}
              {/* PARCEL POPUP */}
              {/* ============================= */}
              {popup.type === "parcel" && (
                <g>
                  {/* Pointer */}
                  <path
                    d="M -10 18 L 0 31 L 10 18"
                    fill="#159570"
                  />

                  {/* Shadow */}
                  <ellipse
                    cx="0"
                    cy="17"
                    rx="94"
                    ry="10"
                    fill="#111827"
                    opacity="0.18"
                  />

                  {/* Main cylinder */}
                  <rect
                    x="-94"
                    y="-105"
                    width="188"
                    height="123"
                    rx="20"
                    fill="#159570"
                    opacity="0.97"
                  />

                  {/* Top cylinder */}
                  <ellipse
                    cx="0"
                    cy="-105"
                    rx="94"
                    ry="20"
                    fill="#27b78f"
                  />

                  {/* Bottom cylinder */}
                  <ellipse
                    cx="0"
                    cy="18"
                    rx="94"
                    ry="15"
                    fill="#087653"
                  />

                  <text
                    x="-76"
                    y="-108"
                    fill="white"
                    fontSize="11"
                    fontWeight="700"
                  >
                    🗺 PARCEL
                  </text>

                  <text
                    x="70"
                    y="-107"
                    fill="white"
                    fontSize="17"
                    fontWeight="700"
                    style={{ cursor: "pointer" }}
                    onClick={() => setPopup(null)}
                  >
                    ×
                  </text>

                  <text
                    x="-76"
                    y="-84"
                    fill="white"
                    fontSize="15"
                    fontWeight="700"
                  >
                    {popup.data.id}
                  </text>

                  <text
                    x="-76"
                    y="-64"
                    fill="white"
                    fontSize="9"
                  >
                    Owner: {popup.data.owner}
                  </text>

                  <text
                    x="-76"
                    y="-47"
                    fill="white"
                    fontSize="9"
                  >
                    Area: {popup.data.area}
                  </text>

                  <text
                    x="-76"
                    y="-30"
                    fill="white"
                    fontSize="9"
                  >
                    Land Use: {popup.data.landUse}
                  </text>

                  <text
                    x="-76"
                    y="-13"
                    fill="#d7ffd9"
                    fontSize="9"
                    fontWeight="700"
                  >
                    GIS Validated ✓
                  </text>
                </g>
              )}

              {/* ============================= */}
              {/* ROAD POPUP */}
              {/* ============================= */}
              {popup.type === "road" && (
                <g>
                  {/* Pointer */}
                  <path
                    d="M -9 18 L 0 30 L 9 18"
                    fill="#e58a00"
                  />

                  {/* Shadow */}
                  <ellipse
                    cx="0"
                    cy="17"
                    rx="80"
                    ry="9"
                    fill="#111827"
                    opacity="0.18"
                  />

                  {/* Main cylinder */}
                  <rect
                    x="-80"
                    y="-70"
                    width="160"
                    height="88"
                    rx="18"
                    fill="#e58a00"
                  />

                  {/* Top */}
                  <ellipse
                    cx="0"
                    cy="-70"
                    rx="80"
                    ry="18"
                    fill="#ffad32"
                  />

                  {/* Bottom */}
                  <ellipse
                    cx="0"
                    cy="18"
                    rx="80"
                    ry="14"
                    fill="#b96700"
                  />

                  <text
                    x="-62"
                    y="-73"
                    fill="white"
                    fontSize="11"
                    fontWeight="700"
                  >
                    🚧 ROAD
                  </text>

                  <text
                    x="57"
                    y="-72"
                    fill="white"
                    fontSize="17"
                    fontWeight="700"
                    style={{ cursor: "pointer" }}
                    onClick={() => setPopup(null)}
                  >
                    ×
                  </text>

                  <text
                    x="-62"
                    y="-48"
                    fill="white"
                    fontSize="14"
                    fontWeight="700"
                  >
                    {popup.data.id}
                  </text>

                  <text
                    x="-62"
                    y="-29"
                    fill="white"
                    fontSize="9"
                  >
                    {popup.data.name}
                  </text>

                  <text
                    x="-62"
                    y="-12"
                    fill="#fff2d5"
                    fontSize="9"
                    fontWeight="700"
                  >
                    Prototype Extraction
                  </text>
                </g>
              )}
            </g>
          )}
        </g>

        {/* SVG definitions */}
        <defs>
          <pattern
            id="imageryFill"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="14"
              height="14"
              fill="#dfe6ec"
            />

            <rect
              width="14"
              height="14"
              fill="#e7edf2"
              opacity="0.5"
            />
          </pattern>
        </defs>
      </svg>

      {/* -------------------------------- */}
      {/* COORDINATES */}
      {/* -------------------------------- */}
      {variant === "full" && (
        <>
          <div className="gis-map-coords">
            <span>17.4239&deg; N</span>
            <span>78.4738&deg; E</span>
            <span>EPSG:32644</span>
          </div>

          {/* -------------------------------- */}
          {/* MAP ZOOM CONTROLS */}
          {/* -------------------------------- */}
          <div className="gis-map-zoom-controls">
            <button
              type="button"
              onClick={zoomIn}
              title="Zoom in"
              aria-label="Zoom in"
            >
              +
            </button>

            <button
              type="button"
              onClick={zoomOut}
              title="Zoom out"
              aria-label="Zoom out"
            >
              −
            </button>

            <button
              type="button"
              onClick={resetZoom}
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              ⌂
            </button>
          </div>
        </>
      )}
    </div>
  );
}