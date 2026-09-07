import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import {
  IconCheckSquare,
  IconMap,
  IconCpu,
} from "../components/Icons";

const INITIAL_ROWS = [
  {
    id: 1,
    feature: "BLD-0142",
    aiResult: "Building, 0.94",
    groundTruth: "—",
    verification: "pending",
  },
  {
    id: 2,
    feature: "BLD-0143",
    aiResult: "Building, 0.88",
    groundTruth: "—",
    verification: "pending",
  },
  {
    id: 3,
    feature: "BLD-0146",
    aiResult: "Building, 0.86",
    groundTruth: "—",
    verification: "pending",
  },
  {
    id: 4,
    feature: "BLD-0150",
    aiResult: "Building, 0.77",
    groundTruth: "—",
    verification: "pending",
  },
];

const verificationTone = {
  pending: "neutral",
  verified: "success",
  rejected: "error",
};

const verificationLabel = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

export default function GroundTruth() {
  const [rows, setRows] = useState(INITIAL_ROWS);

  function setVerification(id, verification) {
    setRows((rs) =>
      rs.map((r) =>
        r.id === id ? { ...r, verification } : r
      )
    );
  }

  const verified = rows.filter(
    (r) => r.verification === "verified"
  ).length;

  const rejected = rows.filter(
    (r) => r.verification === "rejected"
  ).length;

  const pending = rows.length - verified - rejected;

  return (
    <div className="page groundtruth-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-header groundtruth-page-header">
        <div>
          <div className="section-kicker">
            <span className="kicker-dot" />
            FIELD DATA &amp; QUALITY ASSURANCE
          </div>

          <h1 className="page-title">
            Ground Truth &amp; Field Verification
          </h1>

          <p className="page-description">
            Compare AI-extracted building footprints against
            field-verified survey data to evaluate accuracy
            and improve cadastral mapping reliability.
          </p>
        </div>

        <div className="groundtruth-header-status">
          <span className="prototype-badge">
            Prototype
          </span>

          <StatusBadge tone="neutral">
            Survey Pending
          </StatusBadge>
        </div>
      </div>

      {/* =====================================================
          SURVEY + VERIFICATION OVERVIEW
          ===================================================== */}

      <div className="groundtruth-overview">

        {/* SURVEY STATUS */}

        <div className="card groundtruth-survey-card">
          <div className="groundtruth-survey-glow" />

          <div className="groundtruth-survey-content">

            <div className="groundtruth-icon-wrap">
              <IconMap size={21} />
            </div>

            <div>
              <div className="section-kicker small">
                <span className="kicker-dot" />
                SURVEY STATUS
              </div>

              <h2>
                Field Survey Data
              </h2>

              <p>
                No field survey has been imported for this
                demo dataset yet.
              </p>
            </div>

          </div>

          <div className="groundtruth-survey-footer">
            <StatusBadge tone="neutral">
              Pending
            </StatusBadge>

            <span>
              GNSS / CORS integration planned
            </span>
          </div>
        </div>

        {/* VERIFICATION SUMMARY */}

        <div className="card groundtruth-stat-card">

          <div className="card-header">
            <div>
              <div className="section-kicker small">
                <span className="kicker-dot" />
                VERIFICATION OVERVIEW
              </div>

              <h2 className="card-title">
                Verification Statistics
              </h2>
            </div>

            <div className="groundtruth-mini-icon">
              <IconCheckSquare size={18} />
            </div>
          </div>

          <div className="groundtruth-stat-grid">

            <div className="groundtruth-stat">
              <span>Total Features</span>
              <strong>{rows.length}</strong>
              <small>AI features</small>
            </div>

            <div className="groundtruth-stat verified">
              <span>Verified</span>
              <strong>{verified}</strong>
              <small>Confirmed</small>
            </div>

            <div className="groundtruth-stat pending">
              <span>Pending</span>
              <strong>{pending}</strong>
              <small>Needs review</small>
            </div>

            <div className="groundtruth-stat rejected">
              <span>Rejected</span>
              <strong>{rejected}</strong>
              <small>Needs correction</small>
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================
          VERIFICATION ENGINE
          ===================================================== */}

      <div className="card groundtruth-verification-card">

        <div className="card-header groundtruth-card-header">

          <div className="groundtruth-title-row">

            <div className="feature-icon orchid">
              <IconCpu size={20} />
            </div>

            <div>
              <div className="section-kicker small">
                <span className="kicker-dot" />
                HUMAN-IN-THE-LOOP REVIEW
              </div>

              <h2 className="card-title">
                Feature Verification
              </h2>

              <p className="card-subtitle">
                Review AI predictions against field
                observations and confirm cadastral features.
              </p>
            </div>

          </div>

          <div className="groundtruth-progress-summary">
            <span>Verification Progress</span>

            <strong>
              {verified + rejected}/{rows.length}
            </strong>
          </div>

        </div>

        {/* PROGRESS */}

        <div className="groundtruth-progress">

          <div className="groundtruth-progress-track">
            <div
              className="groundtruth-progress-fill"
              style={{
                width: `${
                  rows.length
                    ? ((verified + rejected) /
                        rows.length) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>

          <div className="groundtruth-progress-labels">
            <span>
              {verified} verified
            </span>

            <span>
              {pending} pending
            </span>

            <span>
              {rejected} rejected
            </span>
          </div>

        </div>

        {/* TABLE */}

        <div className="groundtruth-table-wrap">

          <DataTable
            columns={[
              {
                key: "feature",
                label: "Feature",
              },

              {
                key: "aiResult",
                label: "AI Result",
              },

              {
                key: "groundTruth",
                label: "Ground Truth",
              },

              {
                key: "verification",
                label: "Verification",

                render: (row) => (
                  <StatusBadge
                    tone={
                      verificationTone[
                        row.verification
                      ]
                    }
                  >
                    {
                      verificationLabel[
                        row.verification
                      ]
                    }
                  </StatusBadge>
                ),
              },

              {
                key: "action",
                label: "Action",

                render: (row) => (
                  <div className="groundtruth-actions">

                    <button
                      className={`groundtruth-action verify ${
                        row.verification ===
                        "verified"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setVerification(
                          row.id,
                          "verified"
                        )
                      }
                    >
                      <IconCheckSquare size={13} />
                      Verify
                    </button>

                    <button
                      className={`groundtruth-action reject ${
                        row.verification ===
                        "rejected"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setVerification(
                          row.id,
                          "rejected"
                        )
                      }
                    >
                      <span>×</span>
                      Reject
                    </button>

                    <button
                      className={`groundtruth-action review ${
                        row.verification ===
                        "pending"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setVerification(
                          row.id,
                          "pending"
                        )
                      }
                    >
                      Review
                    </button>

                  </div>
                ),
              },
            ]}
            rows={rows}
          />

        </div>

      </div>

      {/* =====================================================
          GNSS / CORS
          ===================================================== */}

      <div className="card groundtruth-gnss-card">

        <div className="card-header">

          <div className="groundtruth-gnss-title">

            <div className="groundtruth-gnss-icon">
              <IconMap size={18} />
            </div>

            <div>
              <div className="section-kicker small">
                <span className="kicker-dot" />
                SURVEY INTEGRATION
              </div>

              <h2 className="card-title">
                GNSS / CORS Survey Data
              </h2>

              <p className="card-subtitle">
                Connect high-accuracy field survey
                observations with AI-generated cadastral
                features.
              </p>
            </div>

          </div>

          <StatusBadge tone="warning">
            Integration Planned
          </StatusBadge>

        </div>

        <div className="groundtruth-integration-body">

          <div className="groundtruth-integration-item">
            <span className="integration-number">
              01
            </span>

            <div>
              <strong>GNSS Coordinates</strong>
              <span>
                Import precise field coordinates for
                selected features.
              </span>
            </div>
          </div>

          <div className="groundtruth-integration-item">
            <span className="integration-number">
              02
            </span>

            <div>
              <strong>CORS Correction</strong>
              <span>
                Support high-accuracy positioning using
                correction services.
              </span>
            </div>
          </div>

          <div className="groundtruth-integration-item">
            <span className="integration-number">
              03
            </span>

            <div>
              <strong>AI Comparison</strong>
              <span>
                Compare survey observations with
                automatically extracted features.
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* =====================================================
          DEMO NOTICE
          ===================================================== */}

      <div className="groundtruth-demo-note">

        <div className="groundtruth-demo-icon">
          <span>i</span>
        </div>

        <div>
          <strong>
            Prototype Ground-Truth Data
          </strong>

          <p>
            The survey coordinates and verification
            records shown here are illustrative demo data.
            Production deployment would connect actual
            GNSS / CORS observations and field-survey
            datasets.
          </p>
        </div>

      </div>

    </div>
  );
}