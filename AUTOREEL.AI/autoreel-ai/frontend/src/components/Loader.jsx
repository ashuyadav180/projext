const Loader = ({ step = "Processing...", progress = 30 }) => {
  return (
    <div style={{ marginTop: "25px", textAlign: "center" }}>
      <div className="spinner" />
      <p style={{ marginTop: "10px", opacity: 0.8 }}>{step}</p>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Loader;
