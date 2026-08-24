import { useEffect } from "react";

function HomePage() {
  useEffect(() => {
    document.body.classList.add("home-full");

    return () => {
      document.body.classList.remove("home-full");
    };
  }, []);

  return (
    <div className="home-page">


      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <h1>
            SatQuery <span>AI</span>
          </h1>

          <h2>
            Interactive Vision-Language Assistant
            <br />
            for Satellite Image Understanding
          </h2>

          <p>
            Ask questions. Get answers. Visual evidence. All in one place.
            <br />
            Powered by advanced AI models for Earth Observation.
          </p>

          <a href="/analysis" className="cta-button">
            <span>🚀</span>
            Start New Analysis
          </a>

        </div>

      </section>


      {/* FEATURES */}
      <section className="features-section">

        <h2>What You Can Do</h2>

        <div className="features">

          <div className="feature-card">
            <div className="feature-icon purple">▣</div>
            <h3>VQA</h3>
            <p>
              Ask natural language
              <br />
              questions about
              <br />
              satellite images.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">◇</div>
            <h3>Object Detection</h3>
            <p>
              Detect and locate
              <br />
              objects with
              <br />
              bounding boxes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">◆</div>
            <h3>Segmentation</h3>
            <p>
              Get pixel-wise
              <br />
              segmentation
              <br />
              masks.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon yellow">↔</div>
            <h3>Change Detection</h3>
            <p>
              Identify changes
              <br />
              between two
              <br />
              time periods.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon red">◉</div>
            <h3>Optical-SAR Analysis</h3>
            <p>
              Fuse optical and
              <br />
              SAR data for
              <br />
              deeper insights.
            </p>
          </div>

        </div>

      </section>


      {/* STATISTICS */}
      <section className="stats">

        <div className="stat">
          <strong>5+</strong>
          <span>AI Models</span>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <strong>3</strong>
          <span>Analysis Modes</span>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <strong>100%</strong>
          <span>Transparent AI</span>
        </div>

      </section>


      {/* FOOTER */}
      <footer>

        <span>© 2025 SatQuery AI. All rights reserved.</span>

        <div className="footer-icons">
          <a href="#">◉</a>
          <a href="#">✉</a>
        </div>

      </footer>

    </div>
  );
}

export default HomePage;