function Contact() {
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
        Contact Us
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
        Have questions about SatQuery AI?
      </p>

      <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
        Email: support@satqueryai.com
      </p>
    </div>
  );
}

export default Contact;