import { useState } from "react";


function Analysis_page() {

  const [analysisType, setAnalysisType] = useState("single");

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const handleTypeChange = (type) => {
    setAnalysisType(type);

    // Clear previous files when changing analysis
    setImage1(null);
    setImage2(null);
  };

  return (
    <div className="analysis-page">

      <main className="analysis-main">

        <div className="analysis-container">

          {/* HEADER */}

          <div className="analysis-header">

            <h1>New Analysis</h1>

            <p>
              Select analysis type, upload images and ask your question.
            </p>

          </div>


          {/* ================= STEP 1 ================= */}

          <section className="analysis-section">

            <h2>
              <span>1.</span> Select Analysis Type
            </h2>


            <div className="analysis-types">


              {/* SINGLE IMAGE */}

              <div
                className={`analysis-type ${
                  analysisType === "single" ? "selected" : ""
                }`}
                onClick={() => handleTypeChange("single")}
              >

                <div className="radio">
                  {analysisType === "single" && <div></div>}
                </div>

                <div className="type-icon image-icon">
                  ◈
                </div>

                <h3>Single Image</h3>

                <p>
                  Analyze a single
                  <br />
                  satellite image.
                </p>

              </div>


              {/* CHANGE DETECTION */}

              <div
                className={`analysis-type ${
                  analysisType === "change" ? "selected" : ""
                }`}
                onClick={() => handleTypeChange("change")}
              >

                <div className="radio">
                  {analysisType === "change" && <div></div>}
                </div>

                <div className="type-icon">
                  ▣
                </div>

                <h3>Change Detection</h3>

                <p>
                  Compare two images
                  <br />
                  from different time.
                </p>

              </div>


              {/* OPTICAL + SAR */}

              <div
                className={`analysis-type ${
                  analysisType === "sar" ? "selected" : ""
                }`}
                onClick={() => handleTypeChange("sar")}
              >

                <div className="radio">
                  {analysisType === "sar" && <div></div>}
                </div>

                <div className="type-icon">
                  ◉
                </div>

                <h3>Optical + SAR</h3>

                <p>
                  Analyze optical and
                  <br />
                  SAR image pair.
                </p>

              </div>

            </div>

          </section>


          {/* ================= STEP 2 ================= */}

          <section className="analysis-section">

            <h2>
              <span>2.</span>

              {analysisType === "single" && " Upload Image"}

              {analysisType === "change" && " Upload Images"}

              {analysisType === "sar" && " Upload Optical + SAR Images"}

            </h2>


            {analysisType === "single" && (

              <div className="upload-area">

                <div className="upload-icon">
                  ☁
                </div>

                <h3>
                  Drag & drop an image here
                </h3>

                <p>or</p>

                <label className="choose-button">

                  Choose File

                  <input
                    type="file"
                    accept="image/*,.tif,.tiff"
                    hidden
                    onChange={(e) =>
                      setImage1(e.target.files[0])
                    }
                  />

                </label>

                {image1 && (
                  <div className="selected-file">
                    ✓ {image1.name}
                  </div>
                )}

                <small>
                  Supported formats: GeoTIFF, TIFF, PNG, JPG
                  <br />
                  (Max size: 200MB)
                </small>

              </div>

            )}


            {/* =================================
                CHANGE DETECTION
            ================================= */}

            {analysisType === "change" && (

              <div className="multiple-upload">

                {/* BEFORE IMAGE */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    ☁
                  </div>

                  <h3>Before Image</h3>

                  <p>
                    Upload the earlier
                    <br />
                    satellite image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*,.tif,.tiff"
                      hidden
                      onChange={(e) =>
                        setImage1(e.target.files[0])
                      }
                    />

                  </label>

                  {image1 && (
                    <div className="selected-file">
                      ✓ {image1.name}
                    </div>
                  )}

                </div>


                {/* AFTER IMAGE */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    ☁
                  </div>

                  <h3>After Image</h3>

                  <p>
                    Upload the later
                    <br />
                    satellite image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*,.tif,.tiff"
                      hidden
                      onChange={(e) =>
                        setImage2(e.target.files[0])
                      }
                    />

                  </label>

                  {image2 && (
                    <div className="selected-file">
                      ✓ {image2.name}
                    </div>
                  )}

                </div>

              </div>

            )}


            {/* =================================
                OPTICAL + SAR
            ================================= */}

            {analysisType === "sar" && (

              <div className="multiple-upload">

                {/* OPTICAL */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    🌍
                  </div>

                  <h3>Optical Image</h3>

                  <p>
                    Upload optical
                    <br />
                    satellite image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*,.tif,.tiff"
                      hidden
                      onChange={(e) =>
                        setImage1(e.target.files[0])
                      }
                    />

                  </label>

                  {image1 && (
                    <div className="selected-file">
                      ✓ {image1.name}
                    </div>
                  )}

                </div>


                {/* SAR */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    📡
                  </div>

                  <h3>SAR Image</h3>

                  <p>
                    Upload SAR
                    <br />
                    satellite image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*,.tif,.tiff"
                      hidden
                      onChange={(e) =>
                        setImage2(e.target.files[0])
                      }
                    />

                  </label>

                  {image2 && (
                    <div className="selected-file">
                      ✓ {image2.name}
                    </div>
                  )}

                </div>

              </div>

            )}

          </section>


          {/* ================= STEP 3 ================= */}

          <section className="analysis-section question-section">

            <h2>
              <span>3.</span> Ask Your Question
            </h2>

            <div className="question-box">

              <textarea
                placeholder={
                  analysisType === "single"
                    ? "e.g., What buildings are present in this area?"
                    : analysisType === "change"
                    ? "e.g., What changes occurred between the two images?"
                    : "e.g., What information can be identified from the optical and SAR images?"
                }
                maxLength={500}
              />

              <div className="character-count">
                0 / 500
              </div>

            </div>

          </section>


          {/* ================= ADVANCED ================= */}

          <div className="advanced-options">

            <span className="settings-icon">
              ⚙
            </span>

            <span>
              Advanced Options
            </span>

            <span className="arrow">
              ˅
            </span>

          </div>


          {/* ================= ANALYZE ================= */}

          <a
            href="/results"
            className="analyze-button"
          >

            <span>➤</span>

            Analyze Image

          </a>

        </div>

      </main>

    </div>
  );
}

export default Analysis_page;