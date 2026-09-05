import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./FRAMap.css";

function FRAMap({
  data,
  anomalyData = [],
  selectedState = "All States",
  selectedClaimType = "All Claim Types",
  selectedStatus = "All Status",
}) {
  const features = data?.features || [];

  // =========================================
  // FILTER DATA
  // =========================================

  const filteredFeatures = features.filter((feature) => {
    if (!feature.geometry || feature.geometry.type !== "Point") {
      return false;
    }

    const properties = feature.properties || {};

    const state =
      properties.state ||
      properties.State ||
      properties.STATE ||
      "";

    const claimType =
      properties.claim_type ||
      properties.claimType ||
      properties.claimTypeName ||
      "";

    const status =
      properties.status ||
      properties.Status ||
      "";

    // State filter
    const stateMatch =
      selectedState === "All States" ||
      state === selectedState;

    /*
      Claim type/status are applied only when
      backend actually provides those fields.

      This prevents the current GeoJSON data
      from disappearing when these filters are selected.
    */

    const claimTypeMatch =
      selectedClaimType === "All Claim Types" ||
      !claimType ||
      claimType === selectedClaimType;

    const statusMatch =
      selectedStatus === "All Status" ||
      !status ||
      status === selectedStatus;

    return (
      stateMatch &&
      claimTypeMatch &&
      statusMatch
    );
  });

  return (
    <div className="fra-map">

      <MapContainer
        center={[22.5, 79]}
        zoom={5}
        scrollWheelZoom={true}
        className="leaflet-map"
      >

        {/* =================================
            MAP TILES
        ================================= */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* =================================
            DISTRICT MARKERS
        ================================= */}

        {filteredFeatures.map((feature, index) => {

          const [longitude, latitude] =
            feature.geometry.coordinates;

          const properties =
            feature.properties || {};

          // =================================
          // DISTRICT INFORMATION
          // =================================

          const district =
            properties.district ||
            properties.District ||
            properties.name ||
            properties.NAME ||
            "Unknown District";

          const state =
            properties.state ||
            properties.State ||
            properties.STATE ||
            "Unknown State";

          const claims =
            properties.claims ??
            properties.total_claims ??
            properties.Total_Claims ??
            "N/A";

          const approved =
            properties.approved ??
            properties.approved_claims ??
            properties.Approved ??
            "N/A";

          const pending =
            properties.pending ??
            properties.pending_claims ??
            properties.Pending ??
            "N/A";

          // =================================
          // FIND ANOMALIES FOR THIS DISTRICT
          // =================================

          const districtAnomalies = anomalyData.filter(
            (claim) =>
              String(claim.district || "").toLowerCase() ===
                String(district).toLowerCase() &&
              String(claim.state || "").toLowerCase() ===
                String(state).toLowerCase()
          );

          const allAnomalies =
            districtAnomalies.flatMap(
              (claim) =>
                Array.isArray(claim.anomalies)
                  ? claim.anomalies
                  : []
            );

          const anomalies = allAnomalies.length;

          // =================================
          // DETERMINE RISK
          // =================================

          const backendRisk =
            properties.risk ||
            properties.Risk ||
            properties.risk_level ||
            "";

          const hasHigh = allAnomalies.some(
            (anomaly) =>
              String(anomaly.severity || "")
                .toLowerCase() === "high"
          );

          const hasMedium = allAnomalies.some(
            (anomaly) =>
              String(anomaly.severity || "")
                .toLowerCase() === "medium"
          );

          let risk = "Low";

          if (
            String(backendRisk).toLowerCase() === "high" ||
            hasHigh
          ) {
            risk = "High";
          } else if (
            String(backendRisk).toLowerCase() === "medium" ||
            hasMedium
          ) {
            risk = "Medium";
          } else if (anomalies >= 1) {
            risk = "Medium";
          }

          // =================================
          // MARKER COLOR
          // =================================

          let markerColor = "#2F6B55";

          if (risk === "High") {
            markerColor = "#C65E44";
          } else if (risk === "Medium") {
            markerColor = "#E5B94E";
          }

          // =================================
          // MARKER SIZE
          // =================================

          const markerRadius =
            risk === "High"
              ? 14
              : risk === "Medium"
              ? 12
              : 9;

          return (
            <CircleMarker
              key={`${district}-${state}-${index}`}
              center={[latitude, longitude]}
              radius={markerRadius}
              pathOptions={{
                color: "#FFFFFF",
                weight: 2,
                fillColor: markerColor,
                fillOpacity: 0.9,
              }}
            >

              {/* =================================
                  DISTRICT POPUP
              ================================= */}

              <Popup>

                <div className="district-popup">

                  <div className="popup-header">

                    <span>
                      FRA DISTRICT
                    </span>

                    <strong>
                      {risk.toUpperCase()} RISK
                    </strong>

                  </div>

                  <h3>
                    {district}
                  </h3>

                  <p className="popup-state">
                    {state}
                  </p>

                  <div className="popup-stats">

                    <div>
                      <span>
                        Total Claims
                      </span>

                      <b>
                        {claims}
                      </b>
                    </div>

                    <div>
                      <span>
                        Approved
                      </span>

                      <b>
                        {approved}
                      </b>
                    </div>

                    <div>
                      <span>
                        Pending
                      </span>

                      <b>
                        {pending}
                      </b>
                    </div>

                    <div>
                      <span>
                        AI Anomalies
                      </span>

                      <b>
                        {anomalies}
                      </b>
                    </div>

                  </div>

                  <div
                    className={`risk-badge ${risk.toLowerCase()}`}
                  >
                    {risk} Risk
                  </div>

                  {anomalies > 0 && (
                    <p className="popup-alert">
                      ⚠ {anomalies} AI-detected issue
                      {anomalies > 1 ? "s" : ""} require
                      attention.
                    </p>
                  )}

                </div>

              </Popup>

            </CircleMarker>
          );
        })}

      </MapContainer>

      {/* =================================
          MAP STATUS
      ================================= */}

      <div className="map-status">

        {filteredFeatures.length > 0
          ? `${filteredFeatures.length} geographic records loaded`
          : "No geographic records found"}

      </div>

      {/* =================================
          MAP LEGEND
      ================================= */}

      <div className="map-legend">

        <div className="legend-title">
          FRA Monitoring
        </div>

        <div className="legend-item">

          <span className="legend-circle high"></span>

          High Risk

        </div>

        <div className="legend-item">

          <span className="legend-circle medium"></span>

          Medium Risk

        </div>

        <div className="legend-item">

          <span className="legend-circle low"></span>

          Low Risk

        </div>

      </div>

    </div>
  );
}

export default FRAMap;