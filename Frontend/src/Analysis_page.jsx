import { useState } from "react";

function Analysis_page() {

  // =========================
  // STATES
  // =========================

  const [analysisType, setAnalysisType] = useState("single");

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");


  // =========================
  // CHANGE ANALYSIS TYPE
  // =========================

  const handleTypeChange = (type) => {

    setAnalysisType(type);

    setImage1(null);
    setImage2(null);

    setQuestion("");

    setResult(null);
    setError("");
  };


  // =========================
  // IMAGE 1
  // =========================

  const handleImage1 = (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImage1(file);

    setResult(null);
    setError("");
  };


  // =========================
  // IMAGE 2
  // =========================

  const handleImage2 = (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImage2(file);

    setResult(null);
    setError("");
  };


  // =========================
  // SEND TO BACKEND
  // =========================

  const handleAnalyze = async () => {

    // Check image
    if (!image1) {

      alert("Please select an image.");

      return;
    }


    // Check question
    if (!question.trim()) {

      alert("Please enter your question.");

      return;
    }


    setLoading(true);

    setResult(null);
    setError("");


    try {

      // =================================
      // FORM DATA
      // =================================

      const data = new FormData();

      data.append("image", image1);

      data.append(
        "text_user",
        question
      );


      // =================================
      // POST REQUEST
      // =================================

      const response = await fetch(
        "http://localhost:8000/descriptive/caption",
        {
          method: "POST",
          body: data
        }
      );


      // =================================
      // CHECK RESPONSE
      // =================================

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Backend error:",
          errorText
        );

        throw new Error(
          `Backend returned ${response.status}`
        );
      }


      // =================================
      // GET JSON RESPONSE
      // =================================

      const responseData =
        await response.json();


      console.log(
        "Backend response:",
        responseData
      );


      // =================================
      // STORE RESULT
      // =================================

      setResult(responseData);

    }

    catch (err) {

      console.error(
        "Request failed:",
        err
      );

      setError(
        "Unable to connect to the backend. Make sure the backend is running on localhost:8000."
      );

    }

    finally {

      setLoading(false);

    }

  };


  // =========================
  // QUESTION PLACEHOLDER
  // =========================

  const getPlaceholder = () => {

    if (analysisType === "single") {

      return "e.g., What buildings are present in this area?";

    }

    if (analysisType === "change") {

      return "e.g., What changes occurred between the two images?";

    }

    if (analysisType === "sar") {

      return "e.g., What information can be identified from the optical and SAR images?";

    }

    return "Ask a question about the satellite image...";
  };


  // =========================
  // PAGE
  // =========================

  return (

    <div className="analysis-page">

      <main className="analysis-main">

        <div className="analysis-container">


          {/* =========================================
              HEADER
          ========================================= */}

          <div className="analysis-header">

            <h1>
              New Analysis
            </h1>

            <p>
              Upload satellite imagery and ask
              questions about the image.
            </p>

          </div>


          {/* =========================================
              STEP 1
          ========================================= */}

          <section className="analysis-section">

            <h2>
              <span>1.</span>
              Select Analysis Type
            </h2>


            <div className="analysis-types">


              {/* SINGLE IMAGE */}

              <div
                className={
                  `analysis-type ${
                    analysisType === "single"
                      ? "selected"
                      : ""
                  }`
                }
                onClick={() =>
                  handleTypeChange("single")
                }
              >

                <div className="radio">

                  {analysisType === "single" && (
                    <div></div>
                  )}

                </div>

                <div className="type-icon">
                  🖼️
                </div>

                <h3>
                  Single Image
                </h3>

                <p>
                  Analyze a single satellite
                  image.
                </p>

              </div>



              {/* CHANGE DETECTION */}

              <div
                className={
                  `analysis-type ${
                    analysisType === "change"
                      ? "selected"
                      : ""
                  }`
                }
                onClick={() =>
                  handleTypeChange("change")
                }
              >

                <div className="radio">

                  {analysisType === "change" && (
                    <div></div>
                  )}

                </div>

                <div className="type-icon">
                  🔄
                </div>

                <h3>
                  Change Detection
                </h3>

                <p>
                  Compare two satellite
                  images.
                </p>

              </div>



              {/* OPTICAL + SAR */}

              <div
                className={
                  `analysis-type ${
                    analysisType === "sar"
                      ? "selected"
                      : ""
                  }`
                }
                onClick={() =>
                  handleTypeChange("sar")
                }
              >

                <div className="radio">

                  {analysisType === "sar" && (
                    <div></div>
                  )}

                </div>

                <div className="type-icon">
                  📡
                </div>

                <h3>
                  Optical + SAR
                </h3>

                <p>
                  Combine optical and SAR
                  imagery.
                </p>

              </div>

            </div>

          </section>



          {/* =========================================
              STEP 2
          ========================================= */}

          <section className="analysis-section">

            <h2>
              <span>2.</span>
              Upload Images
            </h2>


            {/* =====================================
                SINGLE IMAGE
            ===================================== */}

            {analysisType === "single" && (

              <div className="upload-area">

                <div className="upload-icon">
                  ↑
                </div>

                <h3>
                  Drag & drop your satellite image
                </h3>

                <p>
                  or
                </p>

                <label className="choose-button">

                  Choose File

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage1}
                    hidden
                  />

                </label>


                {image1 && (

                  <div className="selected-file">

                    Selected image:

                    <strong>
                      {" "}
                      {image1.name}
                    </strong>

                  </div>

                )}


                <small>
                  PNG, JPG, JPEG, TIFF
                </small>

              </div>

            )}



            {/* =====================================
                CHANGE DETECTION
            ===================================== */}

            {analysisType === "change" && (

              <div className="multiple-upload">


                {/* BEFORE */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    ↑
                  </div>

                  <h3>
                    Before Image
                  </h3>

                  <p>
                    Earlier satellite image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage1}
                      hidden
                    />

                  </label>


                  {image1 && (

                    <div className="selected-file">

                      {image1.name}

                    </div>

                  )}

                </div>



                {/* AFTER */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    ↑
                  </div>

                  <h3>
                    After Image
                  </h3>

                  <p>
                    Newer satellite image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage2}
                      hidden
                    />

                  </label>


                  {image2 && (

                    <div className="selected-file">

                      {image2.name}

                    </div>

                  )}

                </div>

              </div>

            )}



            {/* =====================================
                OPTICAL + SAR
            ===================================== */}

            {analysisType === "sar" && (

              <div className="multiple-upload">


                {/* OPTICAL */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    🛰️
                  </div>

                  <h3>
                    Optical Image
                  </h3>

                  <p>
                    Upload optical image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage1}
                      hidden
                    />

                  </label>


                  {image1 && (

                    <div className="selected-file">

                      {image1.name}

                    </div>

                  )}

                </div>



                {/* SAR */}

                <div className="upload-box-small">

                  <div className="upload-icon">
                    📡
                  </div>

                  <h3>
                    SAR Image
                  </h3>

                  <p>
                    Upload SAR image
                  </p>

                  <label className="choose-button">

                    Choose File

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage2}
                      hidden
                    />

                  </label>


                  {image2 && (

                    <div className="selected-file">

                      {image2.name}

                    </div>

                  )}

                </div>

              </div>

            )}

          </section>



          {/* =========================================
              STEP 3
          ========================================= */}

          <section className="analysis-section">

            <h2>
              <span>3.</span>
              Ask Your Question
            </h2>


            <div className="question-box">

              <textarea
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                placeholder={getPlaceholder()}
                maxLength={500}
              />


              <div className="character-count">

                {question.length} / 500

              </div>

            </div>

          </section>



          {/* =========================================
              ANALYZE BUTTON
          ========================================= */}

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >

            {loading ? (

              <>
                ⏳ Analyzing...
              </>

            ) : (

              <>
                ➤ Analyze Image
              </>

            )}

          </button>



          {/* =========================================
              ERROR
          ========================================= */}

          {error && (

            <div className="error-message">

              ❌ {error}

            </div>

          )}



          {/* =========================================
              BACKEND RESULT
          ========================================= */}

          {result && (

            <section className="result-section">

              <h2>
                Analysis Result
              </h2>


              <div className="result-card">

                <pre>
                  {JSON.stringify(
                    result,
                    null,
                    2
                  )}
                </pre>

              </div>

            </section>

          )}

        </div>

      </main>

    </div>

  );
}

export default Analysis_page;