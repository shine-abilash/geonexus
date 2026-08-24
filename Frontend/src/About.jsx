function About() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "60px",
        background: "#f4f6f8",
        color: "#111827",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
        About SatQuery AI
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
        SatQuery AI is an interactive Vision-Language Assistant
        for understanding satellite images.
      </p>

      <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
        It allows users to upload satellite images, ask questions,
        perform object detection, segmentation, change detection,
        and Optical + SAR analysis.
      </p>
    </div>
  );
}

export default About;