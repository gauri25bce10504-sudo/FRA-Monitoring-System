import React, { useEffect, useState } from "react";
import "./App.css";

import AnomalyPanel from "./components/AnomalyPanel";
import FRAMap from "./components/FRAMap";

const API_URL = "http://172.25.187.32:8000";


const updates = [
  {
    title: "New FRA data uploaded for Maharashtra",
    time: "2 hours ago",
  },
  {
    title: "Anomaly report generated for Odisha",
    time: "5 hours ago",
  },
  {
    title: "District verification completed – Mandla",
    time: "1 day ago",
  },
  {
    title: "System maintenance scheduled",
    time: "2 days ago",
  },
];

const resources = [
  {
    icon: "🏛",
    title: "Ministry of Tribal Affairs",
    description: "Government of India",
    url: "https://tribal.nic.in/",
  },
  {
    icon: "📜",
    title: "Forest Rights Act & Rules",
    description: "Official Act, Rules and Guidelines",
    url: "https://tribal.nic.in/fra.aspx",
  },
  {
    icon: "🛰",
    title: "Bhuvan – ISRO",
    description: "Geospatial data and mapping",
    url: "https://bhuvan-app1.nrsc.gov.in/",
  },
  {
    icon: "📊",
    title: "Open Government Data",
    description: "Government data portal",
    url: "https://www.data.gov.in/",
  },
];

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [states, setStates] = useState([]);
  const [mapData, setMapData] = useState([]);

const [anomalyData, setAnomalyData] = useState([]);
const [summaryData, setSummaryData] = useState(null);

  const [selectedState, setSelectedState] = useState("All States");
  const [selectedClaimType, setSelectedClaimType] = useState("All Claim Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  
  const dashboardTotals = Array.isArray(dashboardData)
  ? dashboardData.reduce(
      (total, state) => ({
        total_claims:
          total.total_claims + (state.total_claims || 0),

        approved:
          total.approved + (state.approved || 0),

        pending:
          total.pending + (state.pending || 0),

        anomalies:
          total.anomalies + (state.anomalies || 0),
      }),
      {
        total_claims: 0,
        approved: 0,
        pending: 0,
        anomalies: 0,
      }
    )
  : {
      total_claims: 0,
      approved: 0,
      pending: 0,
      anomalies: 0,
    };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [
  dashboardResponse,
  statesResponse,
  mapResponse,
  anomalyResponse,
  summaryResponse
] = await Promise.all([
  fetch(`${API_URL}/dashboard`),
  fetch(`${API_URL}/states`),
  fetch(`${API_URL}/geojson`),
  fetch(`${API_URL}/detect-anomalies`),
  fetch(`${API_URL}/summary`)
]);

        if (
  !dashboardResponse.ok ||
  !statesResponse.ok ||
  !mapResponse.ok ||
  !anomalyResponse.ok ||
  !summaryResponse.ok
) {
  throw new Error("Backend API request failed");
}

        const dashboard = await dashboardResponse.json();
        const statesData = await statesResponse.json();
        const map = await mapResponse.json();

        const anomalies = await anomalyResponse.json();
        console.log("RAW ANOMALY DATA:", anomalies);
const summary = await summaryResponse.json();

console.log("Anomalies:", anomalies);
console.log("Summary:", summary);

setAnomalyData(
  Array.isArray(anomalies)
    ? anomalies
    : anomalies.anomalies || anomalies.data || []
);

setSummaryData(summary);

        console.log("Dashboard:", dashboard);
        console.log("States:", statesData);
        console.log("Map:", map);

        setDashboardData(dashboard);

        setStates(
          Array.isArray(statesData)
            ? statesData
            : statesData.states || []
        );

        setMapData(map);
        setAnomalyData(
  Array.isArray(anomalies)
    ? anomalies
    : anomalies.anomalies || anomalies.data || []
);
console.log("AI Anomalies:", anomalies);

      } catch (err) {
        console.error("API Error:", err);

        setError(
          "Unable to connect to the monitoring server."
        );

      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // FILTER MAP BY STATE
  const filteredMapData = {
    ...mapData,
    features:
      selectedState === "All States"
        ? (mapData?.features || [])
        : (mapData?.features || []).filter((feature) => {
            const state =
              feature.properties?.state ||
              feature.properties?.State ||
              "";

            return state === selectedState;
          }),
  };

  return (
       


    <div className="app">

      {/* ================================
          DECORATIVE FLOATING ELEMENTS
      ================================= */}

      <div className="floating-elements">
        <span className="floating-leaf leaf-one">🍃</span>
        <span className="floating-leaf leaf-two">🍃</span>
        <span className="floating-leaf leaf-three">🍃</span>
        <span className="floating-leaf leaf-four">🍃</span>
        <span className="floating-leaf leaf-five">🍃</span>

        <span className="star star-one">✦</span>
        <span className="star star-two">✦</span>
        <span className="star star-three">✦</span>
        <span className="star star-four">✦</span>
      </div>

      {/* ================================
          GOVERNMENT HEADER
      ================================= */}

      <header className="top-header">

        <div className="government-brand">

          <div className="ashoka">☸</div>

          <div className="government-text">
            <strong>MINISTRY OF TRIBAL AFFAIRS</strong>
            <span>Government of India</span>
          </div>

          <div className="vertical-line"></div>

          <div className="fra-brand-icon">🌿</div>

          <div className="fra-brand-text">
            <h2>Forest Rights Act</h2>
            <span>Monitoring System</span>
            <small>
              People · Forests · Rights · Sustainable Tomorrow
            </small>
          </div>

        </div>

        <nav className="main-navigation">
          <a href="#dashboard">Home</a>
          <a href="#about">About FRA</a>

          <a
            href="https://tribal.nic.in/fra.aspx"
            target="_blank"
            rel="noreferrer"
          >
            Resources
          </a>

          <a
            href="https://tribal.nic.in/"
            target="_blank"
            rel="noreferrer"
          >
            Official Links
          </a>
        </nav>

        <div className="header-right">

          <div className="header-search">
            <span>⌕</span>

            <input
  type="text"
  placeholder="Search state, district or claim..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      document
        .getElementById("map-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }}
/>

            <button
  onClick={() => {
    document
      .getElementById("map-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  →
</button>
          </div>

          <div className="notification">
            🔔
            <i></i>
          </div>

          <div className="administrator">
            <div className="admin-avatar">AD</div>

            <div className="admin-details">
              <strong>Administrator</strong>
              <span>State Monitoring Unit</span>
            </div>

            <span className="dropdown-arrow">▾</span>
          </div>

        </div>

      </header>

      {/* ================================
          MAIN
      ================================= */}

      <main className="dashboard" id="dashboard">

        {/* ================================
            HERO
        ================================= */}

        <section className="hero">

          {/* REAL FOREST IMAGE */}
          <img
            className="hero-image"
            src="/forest-bg.jpg"
            alt="Forest landscape"
          />

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <div className="live-status">
              <span></span>
              LIVE MONITORING
            </div>

            <h1>
              FOREST RIGHTS ACT <em>2026</em>
            </h1>

            <h2>
              Securing Rights. Strengthening Communities.
              <br />
              Conserving Forests.
            </h2>

            <p>
              A data-driven platform to monitor implementation
              of the Forest Rights Act across India, enabling
              transparency, accountability and inclusive
              forest governance.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById("map-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Map →
              </button>

              <button
                className="outline-button"
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn More
              </button>

            </div>

          </div>

          <div className="hero-quote">
            <span>Our Forests</span>
            <span>Our People</span>
            <span>Our Future</span>
            <b>♡</b>
          </div>

        </section>

        {/* ================================
            STATISTICS
        ================================= */}

        <section className="statistics">

          <div className="stat-card">
            <div className="stat-symbol blue">▤</div>

            <div>
              <span>Total Claims</span>
              <strong>{dashboardTotals.total_claims}</strong>
              <small className="positive">
                ↑ 8.4% from last period
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-symbol green">✓</div>

            <div>
              <span>Approved Claims</span>
            <strong>{dashboardTotals.approved}</strong>
              <small className="positive">
                ↑ 74.2% approval rate
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-symbol yellow">◷</div>

            <div>
              <span>Pending Claims</span>
            <strong>{dashboardTotals.pending}</strong>
              <small>Requires monitoring</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-symbol red">!</div>

            <div>
              <span>AI Anomalies</span>
            <strong>{dashboardTotals.anomalies}</strong>
              <small className="danger">
                ↑ 42 high-priority cases
              </small>
            </div>
          </div>

        </section>

        {/* ================================
            MAP + AI
        ================================= */}

        <section
          className="content-grid"
          id="map-section"
        >

          {/* MAP */}

          <div className="white-card map-card">

            <div className="card-heading">

              <div>
                <h2>Claim Distribution Map</h2>

                <p>
                  Interactive district-level view of FRA
                  claims across India
                </p>
              </div>

              <div className="map-filters">

                <select
  value={selectedState}
  onChange={(e) => setSelectedState(e.target.value)}
>
  <option value="All States">All States</option>

  {states.map((state) => (
    <option
      key={state.id}
      value={state.name}
    >
      {state.name}
    </option>
  ))}
</select>

                <select
  value={selectedClaimType}
  onChange={(e) => setSelectedClaimType(e.target.value)}
>
  <option value="All Claim Types">All Claim Types</option>
  <option value="Individual">Individual</option>
  <option value="Community">Community</option>
</select>

<select
  value={selectedStatus}
  onChange={(e) => setSelectedStatus(e.target.value)}
>
  <option value="All Status">All Status</option>
  <option value="Approved">Approved</option>
  <option value="Pending">Pending</option>
  <option value="Anomaly">Anomaly</option>
</select>

              </div>

            </div>

           <FRAMap
  data={filteredMapData}
  anomalyData={anomalyData}
  selectedState={selectedState}
  selectedClaimType={selectedClaimType}
  selectedStatus={selectedStatus}
/>

<AnomalyPanel data={anomalyData} />
          </div>

          

        </section>
        
        <section className="ai-summary white-card">
  <div className="card-heading">
    <div>
      <span className="section-eyebrow">AI DECISION SUPPORT</span>
      <h2>Monitoring Summary</h2>
      <p>
        System-generated overview of current FRA implementation status
      </p>
    </div>
  </div>

  {summaryData && (
    <div className="summary-grid">
      <div className="summary-item">
        <span>Total Claims</span>
        <strong>{summaryData.total_claims}</strong>
      </div>

      <div className="summary-item">
        <span>Approved</span>
        <strong>{summaryData.approved}</strong>
      </div>

      <div className="summary-item">
        <span>Pending</span>
        <strong>{summaryData.pending}</strong>
      </div>

      <div className="summary-item">
        <span>Rejected</span>
        <strong>{summaryData.rejected}</strong>
      </div>

      <div className="summary-item warning">
        <span>Total Anomalies</span>
        <strong>{summaryData.total_anomalies}</strong>
      </div>

      <div className="summary-item danger">
        <span>High Severity</span>
        <strong>{summaryData.high_severity_anomalies}</strong>
      </div>
    </div>
  )}
</section>

        {/* ================================
            LOWER SECTION
        ================================= */}

        <section className="lower-grid">

          {/* STATE PROGRESS */}

          <div className="white-card">

            <div className="card-heading">

              <div>
                <h2>State-wise Progress</h2>
                <p>Approval progress across states</p>
              </div>

              <button className="view-all">
                View All →
              </button>

            </div>

            <div className="state-progress">

              {states.map((state) => (
                <div
                  className="progress-row"
                  key={state.name}
                >

                  <div className="progress-label">
                    <span>{state.name}</span>
                    <strong>{state.value}%</strong>
                  </div>

                  <div className="progress-background">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${state.value}%`,
                      }}
                    ></div>
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* RECENT UPDATES */}

          <div className="white-card">

            <div className="card-heading">

              <div>
                <h2>Recent Updates</h2>
                <p>Latest monitoring activity</p>
              </div>

              <button className="view-all">
                View All →
              </button>

            </div>

            <div className="updates-list">

              {updates.map((update, index) => (
                <div
                  className="update-item"
                  key={index}
                >

                  <div className="update-icon">
                    ◷
                  </div>

                  <div>
                    <strong>{update.title}</strong>
                    <span>{update.time}</span>
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* OFFICIAL RESOURCES */}

          <div className="white-card resources-card">

            <div className="card-heading">
              <div>
                <h2>Official Resources</h2>
                <p>Government portals and resources</p>
              </div>
            </div>

            <div className="resources-list">

              {resources.map((resource) => (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="resource-item"
                  key={resource.title}
                >

                  <div className="resource-icon">
                    {resource.icon}
                  </div>

                  <div>
                    <strong>{resource.title}</strong>
                    <span>{resource.description}</span>
                  </div>

                  <b>↗</b>

                </a>
              ))}

            </div>

          </div>

        </section>

        {/* ================================
            ABOUT FRA
        ================================= */}

        <section
          className="about-fra"
          id="about"
        >

          <div className="about-image">

            <img
              src="/fra-community.jpg"
              alt="Forest community"
            />

          </div>

          <div className="about-content">

            <span className="section-tag">
              ABOUT THE FOREST RIGHTS ACT
            </span>

            <h2>
              Recognising the rights of
              <em> forest communities.</em>
            </h2>

            <p>
              The Forest Rights Act, 2006 recognises the
              rights of forest-dwelling tribal communities
              and other traditional forest dwellers to
              forest resources on which they depend for
              livelihood, habitation and socio-cultural
              needs.
            </p>

            <p>
              This monitoring platform brings claims,
              approvals, district-level progress and
              potential anomalies together to support
              transparent and evidence-based decision
              making.
            </p>

            <a
              href="https://tribal.nic.in/fra.aspx"
              target="_blank"
              rel="noreferrer"
              className="learn-link"
            >
              Read the official FRA information →
            </a>

          </div>

        </section>

      </main>

      {/* ================================
          FOOTER
      ================================= */}

      <footer className="footer">

        <div className="footer-image-wrapper">

          <img
            src="/forest-footer.jpg"
            alt="Forest landscape"
            className="footer-image"
          />

          <div className="footer-image-overlay"></div>

        </div>

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="footer-leaf">
              🌿
            </div>

            <div>
              <h3>
                FOREST RIGHTS ACT <em>2026</em>
              </h3>

              <p>
                Inclusive forest governance for a
                sustainable India.
              </p>
            </div>

          </div>

          <div className="footer-links">

            <a href="#about">
              About FRA
            </a>

            <a
              href="https://tribal.nic.in/fra.aspx"
              target="_blank"
              rel="noreferrer"
            >
              FRA Rules & Guidelines
            </a>

            <a
              href="https://bhuvan-app1.nrsc.gov.in/"
              target="_blank"
              rel="noreferrer"
            >
              Bhuvan
            </a>

            <a
              href="https://www.data.gov.in/"
              target="_blank"
              rel="noreferrer"
            >
              Data.gov.in
            </a>

          </div>

          <div className="footer-government">

            <strong>
              Government of India
            </strong>

            <span>
              Ministry of Tribal Affairs
            </span>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 FRA Monitoring System · Hackathon Prototype
          </span>

          <span>
            People · Forests · Rights
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;