import React, { useState } from "react";
import "./AnomalyPanel.css";

function AnomalyPanel({ data = [] }) {
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  const anomalyList = Array.isArray(data)
    ? data.flatMap((claim) => {
        if (!Array.isArray(claim.anomalies)) return [];

        return claim.anomalies.map((anomaly) => ({
          claim_id: claim.claim_id,
          state: claim.state,
          district: claim.district,
          type: anomaly.type,
          severity: anomaly.severity,
          reason: anomaly.reason,
        }));
      })
    : [];

  const getSeverityClass = (severity) => {
    const value = String(severity || "").toLowerCase();

    if (value === "high") return "high";
    if (value === "medium") return "medium";
    return "low";
  };

  return (
    <>
      <div className="anomaly-panel white-card">
        <div className="anomaly-header">
          <div>
            <span className="section-eyebrow">
              AI MONITORING
            </span>

            <h2>Detected Anomalies</h2>

            <p>
              AI-identified cases requiring official attention
            </p>
          </div>

          <div className="anomaly-count">
            {anomalyList.length}
          </div>
        </div>

        <div className="anomaly-list">
          {anomalyList.length === 0 ? (
            <div className="no-anomalies">
              <span>✓</span>
              <p>No anomalies detected</p>
            </div>
          ) : (
            anomalyList.map((anomaly, index) => (
              <div
                className={`anomaly-item ${getSeverityClass(
                  anomaly.severity
                )}`}
                key={`${anomaly.claim_id}-${index}`}
              >
                <div className="anomaly-top">
                  <span
                    className={`severity-badge ${getSeverityClass(
                      anomaly.severity
                    )}`}
                  >
                    {anomaly.severity}
                  </span>

                  <span className="claim-id">
                    {anomaly.claim_id}
                  </span>
                </div>

                <h3>{anomaly.type}</h3>

                <p className="anomaly-location">
                  {anomaly.district}, {anomaly.state}
                </p>

                <p className="anomaly-reason">
                  {anomaly.reason}
                </p>

                <button
                  className="view-details"
                  onClick={() =>
                    setSelectedAnomaly(anomaly)
                  }
                >
                  View Details →
                </button>
              </div>
            ))
          )}
        </div>

        {anomalyList.length > 0 && (
          <button className="view-all-anomalies">
            View All Anomalies →
          </button>
        )}
      </div>

      {/* CLAIM DETAILS MODAL */}

      {selectedAnomaly && (
        <div
          className="anomaly-modal-overlay"
          onClick={() => setSelectedAnomaly(null)}
        >
          <div
            className="anomaly-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="section-eyebrow">
                  AI CASE REVIEW
                </span>

                <h2>Claim Details</h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedAnomaly(null)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-claim-id">
              {selectedAnomaly.claim_id}
            </div>

            <div className="claim-details-grid">
              <div className="detail-box">
                <span>District</span>
                <strong>
                  {selectedAnomaly.district}
                </strong>
              </div>

              <div className="detail-box">
                <span>State</span>
                <strong>
                  {selectedAnomaly.state}
                </strong>
              </div>

              <div className="detail-box">
                <span>Detected Issue</span>
                <strong>
                  {selectedAnomaly.type}
                </strong>
              </div>

              <div className="detail-box">
                <span>Severity</span>

                <strong
                  className={`modal-severity ${getSeverityClass(
                    selectedAnomaly.severity
                  )}`}
                >
                  {selectedAnomaly.severity}
                </strong>
              </div>
            </div>

            <div className="ai-reason-box">
              <span>AI Detection Reason</span>

              <p>{selectedAnomaly.reason}</p>
            </div>

            <div className="recommended-action">
              <div className="action-icon">AI</div>

              <div>
                <span>AI Recommended Action</span>

                <p>
                  Prioritize this case for official
                  verification and review.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="modal-secondary-btn"
                onClick={() =>
                  setSelectedAnomaly(null)
                }
              >
                Close
              </button>

              <button
                className="modal-primary-btn"
                onClick={() => {
                  alert(
                    `Claim ${selectedAnomaly.claim_id} marked for review.`
                  );
                  setSelectedAnomaly(null);
                }}
              >
                Mark for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnomalyPanel;