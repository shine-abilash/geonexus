import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Report() {

  const { analysisId } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchReport = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          `http://127.0.0.1:5000/api/report/${analysisId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json();

        setReport(data);

      } catch (err) {

        console.error(err);

        setError("Unable to load the report.");

      } finally {

        setLoading(false);

      }
    };

    fetchReport();

  }, [analysisId]);


  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="report-loading">
        <div className="loader"></div>
        <h2>Generating Report...</h2>
        <p>Please wait while the analysis results are loaded.</p>
      </div>
    );
  }


  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="report-error">

        <h2>Report Error</h2>

        <p>{error}</p>

      </div>
    );
  }


  /* ================= REPORT ================= */

  return (

    <div className="report-page">

      <div className="report-container">

        {/* HEADER */}

        <div className="report-header">

          <div>

            <h1>
              Analysis Report
            </h1>

            <p>
              Satellite image analysis results
            </p>

          </div>

          <button
            className="download-btn"
            onClick={() => window.print()}
          >
            Download Report
          </button>

        </div>


        {/* ANALYSIS INFORMATION */}

        <div className="report-info">

          <div>
            <span>Analysis ID</span>
            <strong>
              {report?.analysis_id || analysisId}
            </strong>
          </div>

          <div>
            <span>Analysis Type</span>
            <strong>
              {report?.analysis_type || "Satellite Analysis"}
            </strong>
          </div>

          <div>
            <span>Status</span>
            <strong className="completed">
              {report?.status || "Completed"}
            </strong>
          </div>

          <div>
            <span>Date</span>
            <strong>
              {report?.created_at || "-"}
            </strong>
          </div>

        </div>


        {/* IMAGE */}

        {report?.image_url && (

          <section className="report-section">

            <h2>Input Image</h2>

            <img
              src={report.image_url}
              alt="Satellite analysis"
              className="report-image"
            />

          </section>

        )}


        {/* QUESTION */}

        <section className="report-section">

          <h2>Question</h2>

          <div className="question-result">

            {report?.question || "No question provided"}

          </div>

        </section>


        {/* AI ANSWER */}

        <section className="report-section">

          <h2>AI Analysis</h2>

          <div className="ai-answer">

            {report?.answer || "No analysis result available."}

          </div>

        </section>


        {/* CONFIDENCE */}

        {report?.confidence !== undefined && (

          <section className="report-section">

            <h2>Confidence Score</h2>

            <div className="confidence-container">

              <div className="confidence-value">
                {report.confidence}%
              </div>

              <div className="confidence-bar">

                <div
                  className="confidence-progress"
                  style={{
                    width: `${report.confidence}%`
                  }}
                ></div>

              </div>

            </div>

          </section>

        )}


        {/* DETECTIONS */}

        {report?.detections && (

          <section className="report-section">

            <h2>Detected Objects</h2>

            <div className="detections">

              {report.detections.map((item, index) => (

                <div
                  className="detection-card"
                  key={index}
                >

                  <strong>
                    {item.label}
                  </strong>

                  <span>
                    {item.count}
                  </span>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* MODEL */}

        <section className="report-section">

          <h2>Model Information</h2>

          <div className="model-info">

            <div>
              <span>Model</span>
              <strong>
                {report?.model || "AI Model"}
              </strong>
            </div>

            <div>
              <span>Task</span>
              <strong>
                {report?.task || "Image Analysis"}
              </strong>
            </div>

          </div>

        </section>


        {/* FOOTER */}

        <div className="report-footer">

          <button
            className="back-btn"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>

          <button
            className="download-btn"
            onClick={() => window.print()}
          >
            Download Report
          </button>

        </div>

      </div>

    </div>

  );
}

export default Report;